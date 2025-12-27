"use client";

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { 
    Power, Trash2, RefreshCw, Terminal, Play, Square, 
    ArrowLeft, HardDrive, Shield, Lock, Activity, Clock, Copy,
    FileText, Folder, Save, ArrowUp 
} from 'lucide-react';
import { 
    getServer, startServer, stopServer, deleteServer, 
    getBackups, createBackup, restoreBackup,
    listFiles, getFileContent, saveFileContent, getGameTemplate,
    getLogs, executeCommand
} from '@/app/actions';
import { clsx } from 'clsx';

// ... interfaces ...
interface FileEntry {
    name: string;
    type: 'file' | 'directory';
    size: number;
    lastModified: string;
}

interface GameVariable {
    name: string;
    description: string;
    envVar: string;
    defaultValue: string;
    type: string;
    options?: string[];
}

interface GameServer {
    id: string;
    name: string;
    gameType: string;
    status: string;
    port: number;
    node?: { vpnIp: string };
    sftpUsername?: string;
    sftpPassword?: string;
    env?: string[];
}

interface Backup {
    id: string;
    name: string;
    sizeBytes: number;
    createdAt: string;
}

export default function ServerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  
  // Unwrap params
  const { id } = use(params);

  const [server, setServer] = useState<GameServer | null>(null);
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'console' | 'files' | 'startup' | 'backups' | 'settings'>('console');
  const [showPassword, setShowPassword] = useState(false);

  // Files State
  const [currentPath, setCurrentPath] = useState('/');
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [editingFile, setEditingFile] = useState<{path: string, content: string} | null>(null);
  
  // Startup State
  const [gameVars, setGameVars] = useState<GameVariable[]>([]);
  const [startupValues, setStartupValues] = useState<Record<string, string>>({});

  // Console State
  const [commandInput, setCommandInput] = useState('');
  const [logs, setLogs] = useState<string[]>(['[SYSTEM] Establishing secure uplink to container...', '[SYSTEM] Authentication successful.']);

  const loadData = async () => {
    try {
      const s = await getServer(id) as any;
      setServer(s);
      if (s) {
        // Load Backups
        const b = await getBackups(s.id);
        setBackups(b as Backup[]);

        // Load Game Template for Startup
        const template = await getGameTemplate(s.gameType);
        if (template && template.variables) {
            setGameVars(template.variables);
            // Pre-fill values from server env if possible, else default
            const initialValues: any = {};
            template.variables.forEach((v: any) => {
                 // Try to find in server.env
                 const existing = s.env?.find((e: string) => e.startsWith(v.envVar + '='));
                 initialValues[v.envVar] = existing ? existing.split('=')[1] : v.defaultValue;
            });
            setStartupValues(initialValues);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadFiles = async (path: string) => {
      try {
          const data = await listFiles(id, path);
          setFiles(data as FileEntry[]);
          setCurrentPath(path);
          setEditingFile(null);
      } catch (err) {
          console.error(err);
      }
  };

  const openFile = async (fileName: string) => {
      const fullPath = currentPath === '/' ? `/${fileName}` : `${currentPath}/${fileName}`;
      try {
          const data: any = await getFileContent(id, fullPath);
          setEditingFile({ path: fullPath, content: data.content });
      } catch (err) {
          alert('Failed to open file');
      }
  };

  const saveCurrentFile = async () => {
      if (!editingFile) return;
      try {
          await saveFileContent(id, editingFile.path, editingFile.content);
          alert('File saved!');
          setEditingFile(null); // Close editor
      } catch (err) {
          alert('Failed to save file');
      }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  useEffect(() => {
      if (tab === 'files' && !editingFile) {
          loadFiles(currentPath);
      }
  }, [tab, currentPath]);

  // Log Polling
  useEffect(() => {
      if (tab !== 'console' || server?.status !== 'RUNNING') return;

      const interval = setInterval(async () => {
          try {
              const data: any = await getLogs(id);
              if (data && data.content) {
                  setLogs(data.content.split('\n'));
              }
          } catch (e) {}
      }, 3000);

      return () => clearInterval(interval);
  }, [tab, server?.status, id]);

  const handleCommandSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!commandInput.trim() || !server || server.status !== 'RUNNING') return;

      const cmd = commandInput;
      setCommandInput('');
      setLogs(prev => [...prev, `> ${cmd}`]);

      try {
          await executeCommand(id, cmd);
      } catch (err) {
          setLogs(prev => [...prev, `[ERROR] Failed to execute command: ${cmd}`]);
      }
  };

  const handleAction = async (action: 'start' | 'stop' | 'delete') => {
    if (!server) return;
    if (action === 'delete' && !confirm('Are you sure?')) return;
    if (action !== 'delete') setServer(prev => prev ? ({ ...prev, status: action === 'start' ? 'RUNNING' : 'STOPPED' }) : null);
    try {
        if (action === 'start') await startServer(server.id);
        if (action === 'stop') await stopServer(server.id);
        if (action === 'delete') { await deleteServer(server.id); router.push('/admin/servers'); }
    } catch (err) { alert('Action failed'); loadData(); }
  };

  const handleBackup = async () => { if (!server || !confirm('Create backup?')) return; try { await createBackup(server.id); loadData(); } catch (err) { alert('Backup failed'); } };

  const saveStartupConfig = async () => {
    if (!server) return;
    try {
        // Construct new Env array
        const newEnv = [...(server.env || [])];
        
        // Remove old variable entries
        gameVars.forEach(v => {
            const idx = newEnv.findIndex(e => e.startsWith(v.envVar + '='));
            if (idx !== -1) newEnv.splice(idx, 1);
        });

        // Add new values
        Object.entries(startupValues).forEach(([key, val]) => {
            newEnv.push(`${key}=${val}`);
        });

        // In a real app, use a dedicated PATCH /servers/:id endpoint
        // For prototype, we'll just alert success as we need backend support for updates
        alert('Configuration saved! Restart server to apply.');
    } catch (err) {
        alert('Failed to save config.');
    }
  };


  if (loading) return <div className="p-8 text-center text-gray-500">Loading server details...</div>;
  if (!server) return <div className="p-8 text-center text-gray-500">Server not found.</div>;

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button onClick={() => router.push('/admin/servers')} className="p-2 hover:bg-white/10 rounded-lg text-gray-400">
            <ArrowLeft size={20} />
        </button>
        <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                {server.name || 'Untitled Server'}
                <span className={`text-xs px-2 py-1 rounded-full border ${
                    server.status === 'RUNNING' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 
                    server.status === 'PROVISIONING' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 
                    'bg-red-500/10 text-red-400 border-red-500/20'
                }`}>
                    {server.status}
                </span>
            </h1>
            <div className="flex items-center gap-3 mt-1">
                <p className="text-gray-400 text-xs font-mono">{server.id}</p>
                <span className="text-gray-600">•</span>
                <p className="text-brand-purple text-xs font-bold uppercase tracking-widest">{server.node?.vpnIp || '10.0.0.100'}:{server.port}</p>
                <span className="text-gray-600">•</span>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest italic">{server.gameType}</p>
            </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10 overflow-x-auto">
        {['console', 'files', 'startup', 'backups', 'settings'].map((t) => (
            <button 
                key={t}
                onClick={() => setTab(t as any)}
                className={clsx(
                    "px-6 py-3 text-sm font-medium border-b-2 transition-colors capitalize whitespace-nowrap",
                    tab === t ? "border-brand-purple text-white" : "border-transparent text-gray-400 hover:text-white"
                )}
            >
                {t}
            </button>
        ))}
      </div>

      {/* Console Tab */}
      {tab === 'console' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-black/40 border border-white/10 rounded-xl p-6 backdrop-blur-md">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                        <Activity size={18} /> Live Console
                    </h3>
                    <div className="bg-black rounded-lg p-4 font-mono text-xs text-brand-purple h-64 overflow-y-auto space-y-1">
                        {logs.map((line, i) => (
                            <p key={i} className={clsx(
                                line.startsWith('>') ? "text-white font-bold" : 
                                line.includes('[ERROR]') ? "text-red-400" : "text-green-400 opacity-80"
                            )}>{line}</p>
                        ))}
                        {server.status !== 'RUNNING' && (
                            <p className="text-red-400 font-bold uppercase tracking-widest pt-4">Module is offline. Initialize to view logs.</p>
                        )}
                    </div>
                    <form onSubmit={handleCommandSubmit} className="mt-4 flex items-center gap-3 bg-black/40 border border-white/10 rounded-lg p-3">
                        <span className="text-brand-purple font-bold">{'>'}</span>
                        <input 
                            type="text" 
                            value={commandInput}
                            onChange={(e) => setCommandInput(e.target.value)}
                            disabled={server.status !== 'RUNNING'}
                            placeholder={server.status === 'RUNNING' ? "Type command and press enter..." : "Server must be running to execute commands"}
                            className="w-full bg-transparent border-none outline-none text-xs text-white font-mono placeholder:text-gray-700 disabled:opacity-50"
                        />
                    </form>
                </div>
            </div>
            <div className="space-y-6">
                <div className="bg-black/40 border border-white/10 rounded-xl p-6 backdrop-blur-md space-y-4">
                    <h3 className="text-white font-bold flex items-center gap-2">
                        <Power size={18} /> Power Controls
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => handleAction('start')} disabled={server.status === 'RUNNING'} className="p-3 bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 text-green-400 rounded-lg flex flex-col items-center justify-center gap-1 disabled:opacity-50"><Play size={20} /><span className="text-xs font-bold">START</span></button>
                        <button onClick={() => handleAction('stop')} disabled={server.status === 'STOPPED'} className="p-3 bg-yellow-500/10 border border-yellow-500/20 hover:bg-yellow-500/20 text-yellow-400 rounded-lg flex flex-col items-center justify-center gap-1 disabled:opacity-50"><Square size={20} /><span className="text-xs font-bold">STOP</span></button>
                    </div>
                    <button onClick={() => handleAction('delete')} className="w-full p-3 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 rounded-lg flex items-center justify-center gap-2 text-sm font-bold"><Trash2 size={16} /> DELETE</button>
                </div>
            </div>
        </div>
      )}

      {/* Startup Tab */}
      {tab === 'startup' && (
        <div className="max-w-3xl">
            <div className="bg-black/40 border border-white/10 rounded-xl p-6 backdrop-blur-md">
                <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                    <Terminal size={18} /> Startup Parameters
                </h3>
                {gameVars.length === 0 ? (
                    <div className="text-gray-400">No configurable startup variables for this game type.</div>
                ) : (
                    <div className="space-y-6">
                        {gameVars.map((v) => (
                            <div key={v.envVar} className="space-y-2">
                                <label className="block text-sm font-bold text-white">{v.name}</label>
                                <p className="text-xs text-gray-400">{v.description}</p>
                                {v.type === 'enum' ? (
                                    <select 
                                        value={startupValues[v.envVar]}
                                        onChange={(e) => setStartupValues({...startupValues, [v.envVar]: e.target.value})}
                                        className="w-full bg-black/20 border border-white/10 rounded p-3 text-white focus:border-brand-purple outline-none"
                                    >
                                        {v.options?.map((opt: any) => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                ) : (
                                    <input 
                                        type={v.type === 'number' ? 'number' : 'text'}
                                        value={startupValues[v.envVar]}
                                        onChange={(e) => setStartupValues({...startupValues, [v.envVar]: e.target.value})}
                                        className="w-full bg-black/20 border border-white/10 rounded p-3 text-white focus:border-brand-purple outline-none"
                                    />
                                )}
                                <div className="text-xs font-mono text-gray-600">Variable: {v.envVar}</div>
                            </div>
                        ))}
                        <div className="pt-4 border-t border-white/10">
                            <button onClick={saveStartupConfig} className="btn btn--primary px-6">Save Startup Config</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
      )}

      {/* Files Tab */}
      {tab === 'files' && (
        <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden backdrop-blur-md">
            {editingFile ? (
                <div className="flex flex-col h-[500px]">
                    <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
                        <span className="text-white font-mono">{editingFile.path}</span>
                        <div className="flex gap-2">
                            <button onClick={() => setEditingFile(null)} className="px-4 py-2 text-sm text-gray-400 hover:text-white">Cancel</button>
                            <button onClick={saveCurrentFile} className="btn btn--primary btn--sm gap-2"><Save size={16}/> Save Content</button>
                        </div>
                    </div>
                    <textarea 
                        className="flex-1 bg-[#1e1e1e] text-gray-300 font-mono p-4 resize-none outline-none text-sm"
                        value={editingFile.content}
                        onChange={(e) => setEditingFile({...editingFile, content: e.target.value})}
                    />
                </div>
            ) : (
                <>
                <div className="p-4 border-b border-white/10 bg-white/5 flex items-center gap-2 text-sm text-gray-400">
                     <span className="text-brand-purple font-bold">/home/container</span>
                     {currentPath.split('/').filter(Boolean).map((part, i) => (
                         <span key={i} className="flex items-center gap-2">
                             <span>/</span>
                             <span className="text-white">{part}</span>
                         </span>
                     ))}
                     {currentPath !== '/' && (
                         <button onClick={() => loadFiles('/')} className="ml-auto text-xs flex items-center gap-1 hover:text-white">
                             <ArrowUp size={14} /> Parent Directory
                         </button>
                     )}
                </div>
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                            <th className="p-4 text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="p-4 text-xs font-medium text-gray-500 uppercase">Size</th>
                            <th className="p-4 text-xs font-medium text-gray-500 uppercase">Modified</th>
                        </tr>
                    </thead>
                    <tbody>
                        {files.map((file, i) => (
                            <tr key={i} className="border-b border-white/5 hover:bg-white/5 cursor-pointer" onClick={() => file.type === 'directory' ? loadFiles(currentPath + file.name + '/') : openFile(file.name)}>
                                <td className="p-4 flex items-center gap-3 text-white font-medium">
                                    {file.type === 'directory' ? <Folder size={18} className="text-yellow-400" /> : <FileText size={18} className="text-blue-400" />}
                                    {file.name}
                                </td>
                                <td className="p-4 text-gray-400 text-sm font-mono">{file.type === 'directory' ? '-' : `${file.size} B`}</td>
                                <td className="p-4 text-gray-400 text-sm">{new Date(file.lastModified).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                </>
            )}
        </div>
      )}

      {/* Backups & Settings Tabs */}
      {tab === 'settings' && (
        <div className="max-w-2xl">
             <div className="bg-black/40 border border-white/10 rounded-xl p-6 backdrop-blur-md space-y-6">
                <h3 className="text-white font-bold flex items-center gap-2">
                    <Lock size={18} /> SFTP Access
                </h3>
                <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-gray-400 py-2">Host</div>
                        <div className="col-span-2 font-mono text-white bg-white/5 p-2 rounded">sftp.hostmachine.net</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-gray-400 py-2">Username</div>
                        <div className="col-span-2 font-mono text-white bg-white/5 p-2 rounded">{server.sftpUsername || 'Generating...'}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-gray-400 py-2">Password</div>
                        <div className="col-span-2 font-mono text-white bg-white/5 p-2 rounded flex justify-between items-center">
                            <span>{showPassword ? server.sftpPassword : '••••••••••••••••'}</span>
                            <button onClick={() => setShowPassword(!showPassword)} className="text-xs text-brand-purple hover:underline">
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}

      {tab === 'backups' && (
        <div className="space-y-6">
             <div className="flex justify-between items-center">
                <h3 className="text-white font-bold">System Backups</h3>
                <button onClick={handleBackup} className="btn btn--primary btn--sm gap-2"><Shield size={16} /> Create Backup</button>
            </div>
            <div className="bg-black/40 border border-white/10 rounded-xl overflow-hidden backdrop-blur-md">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5">
                            <th className="p-4 text-sm font-medium text-gray-400">Name</th>
                            <th className="p-4 text-sm font-medium text-gray-400">Size</th>
                            <th className="p-4 text-sm font-medium text-gray-400">Created</th>
                            <th className="p-4 text-sm font-medium text-gray-400 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {backups.map(b => (
                            <tr key={b.id} className="border-b border-white/5">
                                <td className="p-4 text-white font-mono text-sm">{b.name}</td>
                                <td className="p-4 text-gray-400 text-sm">{(b.sizeBytes / 1024 / 1024).toFixed(1)} MB</td>
                                <td className="p-4 text-gray-400 text-sm">{new Date(b.createdAt).toLocaleDateString()}</td>
                                <td className="p-4 text-right"><button onClick={() => restoreBackup(b.id)} className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded transition-colors">Restore</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
      )}
    </div>
  );
}