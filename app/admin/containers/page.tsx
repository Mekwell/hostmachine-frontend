"use client";

import { useEffect, useState } from 'react';
import { getAdminSystemState } from '@/app/actions';
import { Server, Activity, Users, Box, Cpu, AlertCircle, RefreshCw } from 'lucide-react';
import { clsx } from 'clsx';

export default function ContainersPage() {
  const [nodes, setNodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getAdminSystemState();
      setNodes((data as any[]) || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter text-white italic">Global <span className="text-brand-purple">Grid</span></h1>
            <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1">Live Container Telemetry</p>
        </div>
        <button onClick={loadData} className="btn-secondary !py-2 gap-2 text-xs">
            <RefreshCw size={14} className={clsx(loading && "animate-spin")} /> REFRESH
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {nodes.map(node => (
            <div key={node.id} className="glass-card p-6 space-y-6">
                <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-lg bg-brand-purple/20 flex items-center justify-center text-brand-purple">
                            <Server size={20} />
                        </div>
                        <div>
                            <h3 className="font-black uppercase text-white">{node.hostname}</h3>
                            <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex gap-2">
                                <span>{node.specs.cpuCores} Cores</span> • <span>{node.specs.osPlatform}</span> • <span className="text-green-400">ONLINE</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-black text-white italic">{node.activeContainers?.length || 0}</div>
                        <div className="text-[8px] text-gray-500 font-black uppercase tracking-widest">Active Containers</div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="text-gray-600 font-black uppercase tracking-widest border-b border-white/5">
                                <th className="pb-3 pl-2">Identity</th>
                                <th className="pb-3">Owner</th>
                                <th className="pb-3">Port</th>
                                <th className="pb-3">Status</th>
                                <th className="pb-3 text-right pr-2">Load</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {node.activeContainers?.length === 0 ? (
                                <tr><td colSpan={5} className="py-8 text-center text-gray-600 italic">No active workloads.</td></tr>
                            ) : (
                                node.activeContainers?.map((c: any) => (
                                    <tr key={c.id || c.name} className="hover:bg-white/5 transition-colors">
                                        <td className="py-3 pl-2">
                                            <div className="flex items-center gap-3">
                                                <Box size={14} className="text-gray-500" />
                                                <div>
                                                    <div className="font-bold text-white">{c.name || c.id.substring(0,8)}</div>
                                                    <div className="text-[9px] text-gray-500 uppercase">{c.game || 'Unknown Image'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3">
                                            {c.owner ? (
                                                <div className="flex items-center gap-2 text-gray-300">
                                                    <Users size={12} />
                                                    <span className="font-mono text-[10px]">{c.owner.substring(0,8)}...</span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-600 italic">System / Unregistered</span>
                                            )}
                                        </td>
                                        <td className="py-3 font-mono text-gray-400">{c.port || '-'}</td>
                                        <td className="py-3">
                                            <span className={clsx(
                                                "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest",
                                                c.status === 'RUNNING' ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"
                                            )}>
                                                {c.status || 'UNKNOWN'}
                                            </span>
                                        </td>
                                        <td className="py-3 pr-2 text-right">
                                            <div className="flex items-center justify-end gap-2 text-gray-400">
                                                <Cpu size={12} />
                                                <span>--%</span> 
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        ))}
      </div>
    </div>
  );
}
