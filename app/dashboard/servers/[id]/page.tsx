"use client";

import { useEffect, useState, useRef } from 'react';
import * as React from 'react';
import {
    Terminal, Settings, HardDrive, Shield, Activity,
    Play, Square, RefreshCw, Trash2, Cpu, Database,
    Globe, Lock, Info, Check, AlertCircle, Clock, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { getServer, startServer, stopServer, restartServer, deleteServer, getLogs, executeCommand } from '@/app/actions';
import ConfigEditor from '@/components/ConfigEditor';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LiveConsole from '@/components/LiveConsole';
import ProFileManager from '@/components/ProFileManager';
import PlayerList from '@/components/PlayerList';
import UsageAnalytics from '@/components/UsageAnalytics';
import ModBrowser from '@/components/ModBrowser';

export default function ServerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();
  const [server, setServer] = useState<any>(null);
  const [liveStats, setLiveStats] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'console' | 'files' | 'config' | 'metrics' | 'players' | 'world' | 'mods'>('console');
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const s = await getServer(id);
        setServer(s);
      } catch (e) {}
    };
    fetchData();
    const interval = setInterval(fetchData, 10000); // Status polling
    return () => clearInterval(interval);
  }, [id]);

  // Handle real-time stats from WebSocket
  const handleLiveStats = React.useCallback((stats: any) => {
      setLiveStats(stats);
      // If we are receiving stats, the server is definitely LIVE
      if (server && server.status === 'PROVISIONING') {
          setServer((prev: any) => ({ ...prev, status: 'LIVE' }));
      }
  }, [server]);

  const handleAction = async (action: 'start' | 'stop' | 'restart' | 'delete') => {
    setLoadingAction(action);
    try {
      if (action === 'delete') {
        if (confirm('Are you sure?')) {
          await deleteServer(id);
          router.push('/dashboard/servers');
        }
      } else if (action === 'start') {
          await startServer(id);
      } else if (action === 'stop') {
          await stopServer(id);
      } else if (action === 'restart') {
          await restartServer(id);
      }
    } catch (e) {
      alert('Action failed');
    } finally {
      setLoadingAction(null);
    }
  };

  const getDefaultConfigFile = (gameType: string) => {
      switch(gameType) {
          case 'minecraft': return 'server.properties';
          case 'terraria': return 'serverconfig.txt';
          case 'valheim': return 'valheim_server.cfg'; 
          case 'ark': 
          case 'asa': return 'ShooterGame/Saved/Config/LinuxServer/GameUserSettings.ini';
          default: return 'server.properties';
      }
  };

  if (!server) return <div className="min-h-screen bg-[#05050A] flex items-center justify-center">Loading...</div>;

  const isProvisioning = server.status === 'PROVISIONING';
  const isOnline = ['LIVE', 'STARTING', 'RUNNING'].includes(server.status);
  const isModdable = ['minecraft-forge', 'minecraft-fabric'].includes(server.gameType);
  
  // Use public IP for client-side socket connection, assume port 3000 for now or env var
  const controllerUrl = process.env.NEXT_PUBLIC_CONTROLLER_URL || 'http://localhost:3000';

  return (
    <div className="text-white">
      <main className="space-y-8">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
            <Link href="/dashboard/servers" className="hover:text-white">Servers</Link>
            <ChevronRight size={12} />
            <span className="text-brand-purple">{server.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-4">
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic">{server.name}</h1>
                <div className="px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-brand-purple/20 text-brand-purple border border-brand-purple/30">
                    {server.status}
                </div>
            </div>
            <p className="text-gray-500">{(server.gameType || 'module').toUpperCase()} • {server.node?.location} • {server.status === 'LIVE' ? (server.subdomain || 'Syncing DNS...') : 'Provisioning...'}</p>
          </div>

          <div className="flex gap-3">
            {!isOnline ? (
                <button disabled={isProvisioning} onClick={() => handleAction('start')} className="btn-primary !h-12">Start</button>
            ) : (
                <>
                    <button onClick={() => handleAction('stop')} className="px-6 py-3 rounded-xl bg-red-600/20 text-red-500 border border-red-500/30">Stop</button>
                    <button onClick={() => handleAction('restart')} className="px-6 py-3 rounded-xl bg-white/5 border border-white/10">Restart</button>
                </>
            )}
            <button onClick={() => handleAction('delete')} className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-gray-500"><Trash2 size={20} /></button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6">
            <StatCard label="CPU" value={`${liveStats?.cpu ?? server.cpuUsage}%`} icon={<Cpu size={20}/>} />
            <StatCard label="RAM" value={`${liveStats?.ram ?? server.ramUsage}MB`} icon={<Activity size={20}/>} />
            <StatCard label="Players" value={liveStats?.players?.length ?? server.playerCount} icon={<Globe size={20}/>} />
            <div className="glass-card p-6 flex flex-col justify-center border-brand-purple/20 bg-brand-purple/5 col-span-1 md:col-span-2">
                <p className="text-[8px] font-black uppercase text-brand-purple tracking-widest mb-1">Access Point</p>
                <h3 className="text-sm font-mono font-bold text-white break-all">{server.subdomain ? `${server.subdomain}:${server.port}` : 'GEN-ALPHA-LINKING...'}</h3>
            </div>
        </div>

        <div className="space-y-6">
            <div className="flex gap-2 p-1 bg-white/5 rounded-2xl w-fit overflow-x-auto max-w-full">
                <button onClick={() => setActiveTab('console')} className={clsx("px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", activeTab === 'console' ? "bg-white/10 text-white" : "text-gray-500 hover:text-white")}>Console</button>
                <button onClick={() => setActiveTab('players')} className={clsx("px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", activeTab === 'players' ? "bg-white/10 text-white" : "text-gray-500 hover:text-white")}>Users</button>
                {isModdable && <button onClick={() => setActiveTab('mods')} className={clsx("px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", activeTab === 'mods' ? "bg-white/10 text-white" : "text-gray-500 hover:text-white")}>Mods</button>}
                <button onClick={() => setActiveTab('files')} className={clsx("px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", activeTab === 'files' ? "bg-white/10 text-white" : "text-gray-500 hover:text-white")}>Files</button>
                <button onClick={() => setActiveTab('world')} className={clsx("px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", activeTab === 'world' ? "bg-white/10 text-white" : "text-gray-500 hover:text-white")}>World</button>
                <button onClick={() => setActiveTab('metrics')} className={clsx("px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", activeTab === 'metrics' ? "bg-white/10 text-white" : "text-gray-500 hover:text-white")}>Telemetry</button>
                <button onClick={() => setActiveTab('config')} className={clsx("px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all", activeTab === 'config' ? "bg-white/10 text-white" : "text-gray-500 hover:text-white")}>Config</button>
            </div>

            <div className="glass-card min-h-[500px] relative overflow-hidden bg-black/20">
                {activeTab === 'console' && (
                    <LiveConsole serverId={id} controllerUrl={controllerUrl} onStats={handleLiveStats} />
                )}

                {activeTab === 'mods' && (
                    <ModBrowser serverId={id} gameType={server.gameType} />
                )}

                {activeTab === 'players' && (
                    <div className="p-8">
                        <PlayerList serverId={id} players={server.players || []} />
                    </div>
                )}

                {activeTab === 'world' && (
                    <div className="p-12 max-w-2xl mx-auto text-center space-y-8">
                        <div className="w-20 h-20 rounded-full bg-brand-purple/10 flex items-center justify-center mx-auto text-brand-purple">
                            <Database size={40} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black uppercase italic tracking-tight">World Archive Protocol</h3>
                            <p className="text-gray-500 text-sm mt-2 leading-relaxed">Package your entire server data directory into a compressed archive for migration or local storage.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <button className="glass-card p-6 hover:border-brand-purple transition-all group">
                                <span className="block text-[10px] font-black uppercase text-gray-500 mb-2">Export Data</span>
                                <span className="text-sm font-bold text-white uppercase tracking-widest">CREATE BACKUP</span>
                            </button>
                            <button className="glass-card p-6 hover:border-brand-blue transition-all group opacity-50 cursor-not-allowed">
                                <span className="block text-[10px] font-black uppercase text-gray-500 mb-2">Restore Data</span>
                                <span className="text-sm font-bold text-white uppercase tracking-widest">IMPORT ARCHIVE</span>
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'metrics' && (
                    <div className="p-8">
                        <UsageAnalytics serverId={id} />
                    </div>
                )}

                {activeTab === 'config' && (
                    isProvisioning ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#05050A]/90 backdrop-blur-sm z-50">
                            <div className="text-center space-y-4">
                                <Clock size={40} className="mx-auto text-brand-purple animate-pulse" />
                                <h3 className="text-xl font-black uppercase italic">Module Provisioning</h3>
                                <p className="text-gray-500 text-xs max-w-xs">Configuration is locked until the game engine is fully initialized.</p>
                            </div>
                        </div>
                    ) : (
                        <ConfigEditor serverId={id} filename={getDefaultConfigFile(server.gameType)} />
                    )
                )}

                {activeTab === 'files' && (
                    <ProFileManager serverId={id} />
                )}
            </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ label, value, icon }: any) {
    return (
        <div className="glass-card p-6 flex items-center gap-4">
            <div className="text-brand-purple">{icon}</div>
            <div>
                <p className="text-[10px] font-black uppercase text-gray-500">{label}</p>
                <h3 className="text-xl font-black text-white italic">{value}</h3>
            </div>
        </div>
    );
}