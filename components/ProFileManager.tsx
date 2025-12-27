"use client";

import { useEffect, useState } from 'react';
import { listFiles, getFileContent, saveFileContent } from '@/app/actions';
import { 
    FileText, Folder, Save, ArrowUp, RefreshCw, 
    Trash2, ChevronRight, FileCode, HardDrive
} from 'lucide-react';
import { clsx } from 'clsx';
import Editor from '@monaco-editor/react';

interface FileEntry {
    name: string;
    type: 'file' | 'directory';
    size: number;
    lastModified: string;
}

export default function ProFileManager({ serverId }: { serverId: string }) {
    const [path, setPath] = useState('/');
    const [files, setFiles] = useState<FileEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingFile, setEditingFile] = useState<{name: string, content: string} | null>(null);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadFiles(path);
    }, [serverId, path]);

    const loadFiles = async (p: string) => {
        setLoading(true);
        try {
            const data = await listFiles(serverId, p);
            setFiles((data as FileEntry[]) || []);
            setPath(p);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenFile = async (file: FileEntry) => {
        const fullPath = path === '/' ? `/${file.name}` : `${path}${file.name}`;
        try {
            const data: any = await getFileContent(serverId, fullPath);
            setEditingFile({ name: file.name, content: data.content || '' });
        } catch (err) {
            alert('Failed to read file.');
        }
    };

    const handleSaveFile = async () => {
        if (!editingFile) return;
        setSaving(true);
        const fullPath = path === '/' ? `/${editingFile.name}` : `${path}${editingFile.name}`;
        try {
            await saveFileContent(serverId, fullPath, editingFile.content);
            setEditingFile(null);
            loadFiles(path);
        } catch (err) {
            alert('Failed to save file.');
        } finally {
            setSaving(false);
        }
    };

    const getLanguage = (filename: string) => {
        const ext = filename.split('.').pop()?.toLowerCase();
        switch(ext) {
            case 'json': return 'json';
            case 'xml': return 'xml';
            case 'ini': return 'ini';
            case 'sh': return 'shell';
            case 'properties': return 'ini';
            case 'txt': return 'plaintext';
            default: return 'plaintext';
        }
    };

    if (editingFile) {
        return (
            <div className="flex flex-col h-[600px] bg-[#0A0A1A]">
                <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <FileCode size={18} className="text-brand-blue" />
                        <span className="text-xs font-black uppercase text-white">{editingFile.name}</span>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setEditingFile(null)} className="px-4 py-2 text-[10px] font-black uppercase text-gray-500 hover:text-white">Cancel</button>
                        <button 
                            onClick={handleSaveFile} 
                            disabled={saving}
                            className="btn-primary !h-9 !px-6 text-[10px] flex items-center gap-2"
                        >
                            {saving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                            Save Module
                        </button>
                    </div>
                </div>
                <div className="flex-1 border-t border-white/5">
                    <Editor
                        height="100%"
                        defaultLanguage={getLanguage(editingFile.name)}
                        theme="vs-dark"
                        value={editingFile.content}
                        onChange={(val) => setEditingFile({ ...editingFile, content: val || '' })}
                        options={{
                            minimap: { enabled: false },
                            fontSize: 12,
                            fontFamily: 'JetBrains Mono, monospace',
                            padding: { top: 20 }
                        }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[600px]">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 p-4 border-b border-white/5 bg-white/[0.02] text-[10px] font-black uppercase tracking-widest text-gray-500">
                <HardDrive size={14} />
                <button onClick={() => setPath('/')} className="hover:text-white transition-colors">ROOT</button>
                {path.split('/').filter(Boolean).map((part, i) => (
                    <div key={i} className="flex items-center gap-2">
                        <ChevronRight size={12} />
                        <span className="text-brand-purple">{part}</span>
                    </div>
                ))}
                {loading && <RefreshCw size={12} className="animate-spin ml-auto text-brand-blue" />}
            </div>

            <div className="flex-1 overflow-y-auto">
                <table className="w-full text-left text-xs">
                    <thead>
                        <tr className="text-gray-600 font-black uppercase tracking-widest border-b border-white/5">
                            <th className="p-4 pl-6">Name</th>
                            <th className="p-4">Size</th>
                            <th className="p-4 pr-6 text-right">Modified</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {path !== '/' && (
                            <tr 
                                onClick={() => {
                                    const parts = path.split('/').filter(Boolean);
                                    parts.pop();
                                    setPath('/' + parts.join('/') + (parts.length ? '/' : ''));
                                }}
                                className="hover:bg-white/5 cursor-pointer transition-colors"
                            >
                                <td className="p-4 pl-6 flex items-center gap-3 text-gray-500">
                                    <ArrowUp size={14} />
                                    <span className="font-bold">..</span>
                                </td>
                                <td colSpan={2}></td>
                            </tr>
                        )}
                        {files.map((file, i) => (
                            <tr 
                                key={i} 
                                onClick={() => file.type === 'directory' ? setPath(path + file.name + '/') : handleOpenFile(file)}
                                className="hover:bg-white/5 cursor-pointer transition-colors group"
                            >
                                <td className="p-4 pl-6">
                                    <div className="flex items-center gap-3 text-white font-bold">
                                        {file.type === 'directory' ? (
                                            <Folder size={16} className="text-brand-blue" />
                                        ) : (
                                            <FileText size={16} className="text-gray-500 group-hover:text-brand-purple" />
                                        )}
                                        {file.name}
                                    </div>
                                </td>
                                <td className="p-4 font-mono text-[10px] text-gray-500">
                                    {file.type === 'directory' ? '-' : `${(file.size / 1024).toFixed(1)} KB`}
                                </td>
                                <td className="p-4 pr-6 text-right font-mono text-[10px] text-gray-600">
                                    {file.lastModified}
                                </td>
                            </tr>
                        ))}
                        {!loading && files.length === 0 && (
                            <tr><td colSpan={3} className="p-20 text-center text-gray-600 font-bold uppercase italic">No items found in this directory.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
