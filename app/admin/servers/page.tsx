"use client";

import { useEffect, useState } from 'react';
import { startServer, stopServer, deleteServer, getServers, getUserSubscriptions } from '@/app/actions';
import { RefreshCw, Play, Square, Trash2, Rocket, Globe, HardDrive, Box, Gamepad2, ChevronRight, Activity, Cpu, Layers } from 'lucide-react';
import Link from 'next/link';
import { clsx } from 'clsx';
import { useAuth } from '@/lib/auth-context';

export default function AdminServersPage() {
  const { user } = useAuth();
  const [servers, setServers] = useState<any[]>([]);
  const [subs, setSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [serverData, subData] = await Promise.all([
        getServers(),
        getUserSubscriptions(user.id)
      ]);
      setServers((serverData as any[]) || []);
      setSubs((subData as any[]) || []);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const totalRam = subs.reduce((acc, s) => acc + (s.plan?.ramMb || 0), 0);
  const usedRam = servers.reduce((acc, s) => acc + (s.memoryLimitMb || 0), 0);
  const remainingRam = totalRam - usedRam;
  const ramPercent = totalRam > 0 ? Math.min(100, (usedRam / totalRam) * 100) : 0;

  const handleAction = async (id: string, action: 'start' | 'stop' | 'delete') => {
    if (action === 'delete' && !confirm('Are you sure you want to delete this server? This cannot be undone.')) return;
    
    setServers(prev => prev.map(s => {
        if (s.id !== id) return s;
        if (action === 'start') return { ...s, status: 'RUNNING' as const };
        if (action === 'stop') return { ...s, status: 'STOPPED' as const };
        return s;
    }).filter(s => action !== 'delete' || s.id !== id));

    try {
        if (action === 'start') await startServer(id);
        if (action === 'stop') await stopServer(id);
        if (action === 'delete') await deleteServer(id);
    } catch (err) {
        alert('Action failed');
        loadData(); 
    }
  };

  return (
    <div className="space-y-10">
      {/* Resource Allocation Bar */}
      <div className="glass-card p-8 flex flex-col md:flex-row items-center justify-between gap-8 border-brand-purple/20 bg-brand-purple/5">
          <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-brand-purple/20 flex items-center justify-center text-brand-purple shadow-lg shadow-brand-purple/10">
                  <Layers size={28} />
              </div>
              <div>
                  <h2 className="text-xl font-black uppercase tracking-tighter text-white">Resource Allocation</h2>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Fleet Capacity Monitoring</p>
              </div>
          </div>

          <div className="flex-1 w-full max-w-xl space-y-3">
              <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-widest">
                  <span className="text-gray-500">RAM USAGE // {ramPercent.toFixed(0)}%</span>
                  <span className="text-white italic">
                    {usedRam / 1024}GB USED / {remainingRam / 1024}GB REMAINING
                  </span>
              </div>
              <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <div 
                    className={clsx(
                        "h-full transition-all duration-1000 ease-out",
                        ramPercent > 90 ? "bg-red-500" : "bg-gradient-to-r from-brand-purple to-brand-blue"
                    )}
                    style={{ width: `${ramPercent}%` }}
                  />
              </div>
          </div>

          <Link href="/store" className="btn-secondary !py-3 !px-6 text-[10px] font-black uppercase tracking-widest hover:border-brand-purple/50">
              Upgrade Capacity
          </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase text-white italic">Active <span className="text-gradient">Fleet.</span></h1>
          <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-1">Operational Systems Grid</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadData} className="btn-secondary !py-2.5 !px-5 gap-2 text-xs">
            <RefreshCw size={14} className={clsx(loading && "animate-spin")} /> RE-SCAN
          </button>
          <Link href="/servers/new" className="btn-primary !py-2.5 !px-6 gap-2 text-xs">
            <Rocket size={14} /> DEPLOY MODULE
          </Link>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
            <thead>
                <tr className="bg-white/5 border-b border-white/5">
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">System Identity</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Uplink Endpoint</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Operational Status</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Resource Load</th>
                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Overrides</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
                {loading && servers.length === 0 ? (
                    <tr><td colSpan={5} className="p-20 text-center text-gray-600 font-bold uppercase tracking-widest italic animate-pulse">Syncing fleet manifest...</td></tr>
                ) : servers.length === 0 ? (
                    <tr><td colSpan={5} className="p-20 text-center space-y-6">
                        <div className="text-gray-600 font-bold uppercase tracking-widest">No active modules found in sector.</div>
                        <Link href="/servers/new" className="btn-primary inline-flex">INITIALIZE DEPLOYMENT</Link>
                    </td></tr>
                ) : (
                servers.map((server) => (
                    <tr key={server.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white shadow-lg">
                                {server.gameType?.includes('minecraft') ? <Box size={24} /> : <Gamepad2 size={24} />}
                            </div>
                            <div>
                                <Link href={`/admin/servers/${server.id}`} className="font-black text-white uppercase tracking-tighter text-sm hover:text-brand-purple transition-colors">
                                    {server.name || 'NX-' + server.id.slice(0,4)}
                                </Link>
                                <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-1 italic">{server.gameType}</div>
                            </div>
                        </div>
                    </td>
                    <td className="p-6">
                        <div className="flex flex-col gap-1">
                            <span className="font-mono text-xs font-bold text-white tracking-tighter hover:text-brand-purple transition-colors cursor-pointer" onClick={() => { navigator.clipboard.writeText(`${server.node?.publicIp || server.node?.vpnIp || '192.168.30.7'}:${server.port}`); alert('Endpoint copied!'); }}>
                                {server.node?.publicIp || server.node?.vpnIp || '192.168.30.7'}:{server.port}
                            </span>
                            <div className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Uplink Address</div>
                        </div>
                    </td>
                    <td className="p-6">
                        <span className={clsx(
                            "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all duration-500",
                            server.status === 'RUNNING' ? "bg-green-500/10 text-green-400 border-green-500/20" :
                            server.status === 'PROVISIONING' ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.1)]" :
                            "bg-red-500/10 text-red-400 border-red-500/20"
                        )}>
                            <div className={clsx(
                                "w-1.5 h-1.5 rounded-full",
                                server.status === 'RUNNING' ? "bg-green-400 animate-pulse" : 
                                server.status === 'PROVISIONING' ? "bg-yellow-400 animate-spin" : "bg-red-400"
                            )} />
                            {server.status}
                        </span>
                    </td>
                    <td className="p-6">
                        <div className="flex flex-col gap-1">
                            <span className="font-mono text-xs font-bold text-white tracking-tighter">{server.memoryLimitMb / 1024}GB RAM</span>
                            <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-brand-purple" style={{ width: '40%' }} />
                            </div>
                        </div>
                    </td>
                    <td className="p-6 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleAction(server.id, 'start'); }}
                            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-green-400 hover:bg-green-500/10 transition-all" 
                            disabled={server.status === 'RUNNING'}
                        >
                            <Play size={16} />
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleAction(server.id, 'stop'); }}
                            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-yellow-400 hover:bg-yellow-500/10 transition-all" 
                            disabled={server.status === 'STOPPED'}
                        >
                            <Square size={16} />
                        </button>
                        <div className="w-px h-6 bg-white/5 mx-1" />
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleAction(server.id, 'delete'); }}
                            className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all" 
                        >
                            <Trash2 size={16} />
                        </button>
                        </div>
                    </td>
                    </tr>
                ))
                )}
            </tbody>
            </table>
        </div>
      </div>
    </div>
  );
}