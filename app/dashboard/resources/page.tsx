"use client";

import { useEffect, useState } from 'react';
import { getServers, getUserSubscriptions, startServer, stopServer } from '@/app/actions';
import { useAuth } from '@/lib/auth-context';
import { Zap, Cpu, Server, Play, Square, AlertCircle, Info, Plus } from 'lucide-react';
import { clsx } from 'clsx';
import Link from 'next/link';

export default function ResourceHubPage() {
  const { user } = useAuth();
  const [servers, setServers] = useState<any[]>([]);
  const [activeSub, setActiveSub] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [serverData, subData] = await Promise.all([
        getServers(user.id),
        getUserSubscriptions(user.id)
      ]);
      setServers((serverData as any[]) || []);
      const flexi = (subData as any[])?.find(s => s.plan?.type === 'flexi' && s.status === 'ACTIVE');
      setActiveSub(flexi);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const totalRam = activeSub?.plan?.ramMb || 0;
  const usedRam = servers
    .filter(s => s.status === 'RUNNING')
    .reduce((acc, s) => acc + (s.memoryLimitMb || 0), 0);
  const remainingRam = totalRam - usedRam;
  const ramPercent = totalRam > 0 ? (usedRam / totalRam) * 100 : 0;

  const handleAction = async (id: string, action: 'start' | 'stop') => {
    const server = servers.find(s => s.id === id);
    if (action === 'start' && server.memoryLimitMb > remainingRam) {
        alert("Insufficient RAM in your resource pool. Stop another module first.");
        return;
    }

    setServers(prev => prev.map(s => {
        if (s.id !== id) return s;
        return { ...s, status: action === 'start' ? 'RUNNING' : 'STOPPED' };
    }));

    try {
        if (action === 'start') await startServer(id);
        else await stopServer(id);
    } catch (err) {
        loadData();
    }
  };

  if (loading) return <div className="p-20 text-center text-gray-500 font-bold uppercase tracking-widest animate-pulse">Synchronizing Resource Pool...</div>;

  if (!activeSub) {
      return (
          <div className="max-w-2xl mx-auto py-20 text-center space-y-8">
              <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto text-gray-700">
                  <Zap size={40} />
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-black text-white uppercase tracking-tighter">FlexiPlan Required</h1>
                <p className="text-gray-500">Resource allocation is only available for modular FlexiHost subscriptions.</p>
              </div>
              <Link href="/dashboard/plans" className="btn-primary !h-14 !px-10 inline-flex items-center gap-2">
                  Upgrade Now <Plus size={18} />
              </Link>
          </div>
      );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Resource <span className="text-brand-blue">Hub.</span></h1>
          <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-1">Dynamic Allocation Control</p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="w-10 h-10 rounded-xl bg-brand-blue/20 flex items-center justify-center text-brand-blue">
                <Cpu size={20} />
            </div>
            <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Pool Capacity</p>
                <p className="text-sm font-bold text-white tracking-tighter uppercase">{(totalRam / 1024).toFixed(1)} GB Bare Metal</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Resource Monitor */}
        <div className="lg:col-span-2 glass-card p-8 space-y-8 border-brand-blue/20 bg-brand-blue/5">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <Zap size={16} className="text-brand-blue" /> Allocation Status
                </h3>
                <span className={clsx(
                    "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded",
                    ramPercent > 90 ? "bg-red-500/20 text-red-500" : "bg-green-500/20 text-green-400"
                )}>
                    {ramPercent > 90 ? 'Critical' : 'Healthy'}
                </span>
            </div>

            <div className="space-y-6">
                <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden border border-white/10 p-0.5">
                    <div 
                        className={clsx(
                            "h-full rounded-full transition-all duration-1000 ease-out",
                            ramPercent > 90 ? "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]" : "bg-gradient-to-r from-brand-blue to-brand-purple shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                        )}
                        style={{ width: `${ramPercent}%` }}
                    />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div>
                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">In Use</p>
                        <p className="text-2xl font-black text-white tracking-tighter">{(usedRam / 1024).toFixed(1)}GB</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">Available</p>
                        <p className="text-2xl font-black text-brand-blue tracking-tighter">{(remainingRam / 1024).toFixed(1)}GB</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">Modules</p>
                        <p className="text-2xl font-black text-white tracking-tighter">{servers.length}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1">Utilization</p>
                        <p className="text-2xl font-black text-white tracking-tighter">{ramPercent.toFixed(0)}%</p>
                    </div>
                </div>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/5 flex items-start gap-3">
                <Info size={18} className="text-brand-blue shrink-0 mt-0.5" />
                <p className="text-xs text-gray-400 leading-relaxed">
                    Stopping a module instantly releases its assigned RAM back to your global pool. You can then use this RAM to start other modules or deploy new ones.
                </p>
            </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card p-8 flex flex-col justify-center text-center space-y-6">
            <div className="w-16 h-16 bg-brand-blue/10 rounded-2xl flex items-center justify-center text-brand-blue mx-auto">
                <Server size={32} />
            </div>
            <div>
                <h3 className="text-lg font-bold text-white uppercase tracking-tighter">New Module</h3>
                <p className="text-xs text-gray-500 mt-2">Create a new server using your available pool resources.</p>
            </div>
            <Link href="/servers/new" className="btn-primary !h-12 w-full flex items-center justify-center gap-2">
                <Plus size={18} /> Deploy
            </Link>
        </div>
      </div>

      <div className="space-y-6">
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">Module <span className="text-brand-blue">Inventory.</span></h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {servers.map(server => (
                  <div key={server.id} className={clsx(
                      "glass-card p-6 border-white/5 transition-all group",
                      server.status === 'RUNNING' ? "border-green-500/20 bg-green-500/5" : "hover:border-white/20"
                  )}>
                      <div className="flex items-start justify-between mb-6">
                          <div className="flex items-center gap-3">
                              <div className={clsx(
                                  "w-10 h-10 rounded-xl flex items-center justify-center text-white",
                                  server.status === 'RUNNING' ? "bg-green-500/20 text-green-500" : "bg-white/5 text-gray-600"
                              )}>
                                  <Server size={20} />
                              </div>
                              <div>
                                  <h4 className="font-bold text-white text-sm group-hover:text-brand-blue transition-colors">{server.name}</h4>
                                  <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{server.gameType}</p>
                              </div>
                          </div>
                          <span className={clsx(
                              "text-[8px] font-black uppercase tracking-widest px-2 py-1 rounded-full",
                              server.status === 'RUNNING' ? "bg-green-500/20 text-green-400" : "bg-white/5 text-gray-600"
                          )}>
                              {server.status}
                          </span>
                      </div>

                      <div className="space-y-4">
                          <div className="flex justify-between items-end">
                              <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">Resource Load</span>
                              <span className="text-xs font-black text-white">{server.memoryLimitMb / 1024} GB RAM</span>
                          </div>
                          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                              <div className={clsx(
                                  "h-full rounded-full",
                                  server.status === 'RUNNING' ? "bg-brand-blue" : "bg-gray-800"
                              )} style={{ width: '100%' }} />
                          </div>
                      </div>

                      <div className="mt-8 pt-6 border-t border-white/5 flex gap-3">
                          {server.status === 'RUNNING' ? (
                              <button 
                                onClick={() => handleAction(server.id, 'stop')}
                                className="flex-1 h-10 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all"
                              >
                                  <Square size={14} /> Stop & Release
                              </button>
                          ) : (
                              <button 
                                onClick={() => handleAction(server.id, 'start')}
                                className="flex-1 h-10 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-green-500 hover:text-white transition-all disabled:opacity-50"
                                disabled={server.memoryLimitMb > remainingRam}
                              >
                                  <Play size={14} /> Initialize
                              </button>
                          )}
                      </div>
                  </div>
              ))}
              
              {servers.length === 0 && (
                  <div className="col-span-full py-20 text-center glass-card">
                      <p className="text-gray-600 font-bold uppercase tracking-widest italic">No modules deployed in this sector.</p>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
}
