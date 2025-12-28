"use client";

import { useEffect, useState } from 'react';
import { 
  Server, Shield, Cpu, Zap, Activity, Clock, Plus, ChevronRight
} from 'lucide-react';
import { getServers, getUserSubscriptions } from '@/app/actions';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { clsx } from 'clsx';
import HostBotWidget from '@/components/HostBotWidget';
import { Moon } from 'lucide-react';

export default function UserDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalServers: 0,
    activeServers: 0,
    totalRam: 0,
    usedRam: 0,
    planName: 'Loading...',
    planType: 'fixed'
  });
  const [recentServers, setRecentServers] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
        try {
            const [servers, subs] = await Promise.all([
                getServers() as Promise<any[]>,
                getUserSubscriptions(user.id) as Promise<any[]>
            ]);

            // In a real app, getServers() would filter by userId on the server side
            // For now, we filter here if needed, but assuming for this demo it returns user's servers
            const userServers = servers.filter(s => s.userId === user.id);
            const activeServers = userServers.filter(s => ['RUNNING', 'LIVE', 'STARTING'].includes(s.status)).length;
            const usedRam = userServers.reduce((acc, s) => acc + (['RUNNING', 'LIVE', 'STARTING'].includes(s.status) ? s.memoryLimitMb : 0), 0);

            const activeSub = subs.find(s => s.status === 'ACTIVE');
            
            setStats({
                totalServers: userServers.length,
                activeServers,
                totalRam: activeSub?.plan?.ramMb || 0,
                usedRam,
                planName: activeSub?.plan?.name || 'No Active Plan',
                planType: activeSub?.plan?.type || 'fixed'
            });

            setRecentServers(userServers.slice(0, 5));
        } catch (e) {
            console.error(e);
        }
    };
    loadData();
  }, [user]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back, {user?.email?.split('@')[0]}</h1>
          <p className="text-gray-400">Manage your high-performance game instances.</p>
        </div>
        <Link href="/servers/new" className="btn-primary !h-12 flex items-center gap-2 !rounded-xl">
            <Plus size={18} /> Deploy New Module
        </Link>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
            title="Active Plan" 
            value={stats.planName} 
            subtitle={stats.planType === 'flexi' ? 'Flexi Resource Pool' : 'Standard Tier'}
            icon={<Zap size={24} className="text-brand-blue" />} 
        />
        <StatCard 
            title="Running Modules" 
            value={`${stats.activeServers} / ${stats.totalServers}`} 
            subtitle="Operational instances"
            icon={<Server size={24} className="text-brand-purple" />} 
        />
        <StatCard 
            title="RAM Utilization" 
            value={`${(stats.usedRam / 1024).toFixed(1)} GB`} 
            subtitle={`of ${(stats.totalRam / 1024).toFixed(1)} GB allocated`}
            icon={<Cpu size={24} className="text-green-400" />} 
        />
        <StatCard 
            title="Network Status" 
            value="Stable" 
            subtitle="Low-latency AU hub"
            icon={<Activity size={24} className="text-orange-400" />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Servers List */}
        <div className="lg:col-span-2 space-y-6">
            <HostBotWidget />
            
            <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-white">Recent Modules</h2>
                <Link href="/dashboard/servers" className="text-sm font-bold text-brand-blue hover:text-white transition-colors flex items-center gap-1 uppercase tracking-widest">
                    View All <ChevronRight size={14} />
                </Link>
            </div>
            
            {recentServers.length > 0 ? (
                <div className="space-y-3">
                    {recentServers.map(server => (
                        <Link 
                            key={server.id} 
                            href={`/dashboard/servers/${server.id}`}
                            className="glass-card p-4 rounded-2xl flex items-center justify-between hover:border-brand-blue/30 transition-all group"
                        >
                            <div className="flex items-center gap-4">
                                <div className={clsx(
                                    "w-12 h-12 rounded-xl flex items-center justify-center text-white",
                                    server.status === 'LIVE' || server.status === 'RUNNING' ? "bg-green-500/20 text-green-500" : 
                                    server.status === 'SLEEPING' ? "bg-brand-blue/20 text-brand-blue" :
                                    "bg-gray-500/20 text-gray-500"
                                )}>
                                    {server.status === 'SLEEPING' ? <Moon size={24} /> : <Server size={24} />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-white group-hover:text-brand-blue transition-colors">{server.name || 'Unnamed Module'}</h3>
                                    <p className="text-xs text-gray-500 uppercase tracking-widest">{server.gameType} • {server.memoryLimitMb}MB RAM</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-right hidden sm:block">
                                    <div className={clsx(
                                        "text-[10px] font-black uppercase tracking-[0.2em] mb-1",
                                        server.status === 'LIVE' || server.status === 'RUNNING' ? "text-green-500" : 
                                        server.status === 'SLEEPING' ? "text-brand-blue" :
                                        "text-gray-500"
                                    )}>
                                        {server.status}
                                    </div>
                                    <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Status</div>
                                </div>
                                <ChevronRight size={20} className="text-gray-700 group-hover:text-white transition-colors" />
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="glass-card p-12 rounded-2xl text-center">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-600">
                        <Server size={32} />
                    </div>
                    <p className="text-gray-400 mb-6">You haven't deployed any modules yet.</p>
                    <Link href="/servers/new" className="btn-primary !inline-flex">
                        Deploy your first server
                    </Link>
                </div>
            )}
        </div>

        {/* Quick Actions / System Info */}
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
            <div className="glass-card rounded-2xl p-6 space-y-4">
                <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
                    <div className="flex items-center gap-3">
                        <Plus size={18} className="text-brand-blue" />
                        <span className="text-sm font-bold text-white group-hover:translate-x-1 transition-transform">Create Instance</span>
                    </div>
                </button>
                <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
                    <div className="flex items-center gap-3">
                        <Shield size={18} className="text-green-500" />
                        <span className="text-sm font-bold text-white group-hover:translate-x-1 transition-transform">Security Audit</span>
                    </div>
                </button>
                <button className="w-full flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
                    <div className="flex items-center gap-3">
                        <Activity size={18} className="text-orange-500" />
                        <span className="text-sm font-bold text-white group-hover:translate-x-1 transition-transform">View Global Status</span>
                    </div>
                </button>
            </div>

            <div className="glass-card rounded-2xl p-6 bg-gradient-to-br from-brand-blue/10 to-transparent border-brand-blue/10">
                <h3 className="text-sm font-black text-brand-blue uppercase tracking-[0.2em] mb-4">Australia Hub Health</h3>
                <div className="space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400">Latency (Local)</span>
                        <span className="text-xs font-bold text-green-500 tracking-widest">4ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400">Uptime</span>
                        <span className="text-xs font-bold text-white tracking-widest">99.99%</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-xs text-gray-400">Node Load</span>
                        <span className="text-xs font-bold text-white tracking-widest">Optimal</span>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon }: any) {
    return (
        <div className="glass-card p-6 rounded-2xl relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-white">{value}</h3>
                </div>
                <div className="p-3 bg-white/5 rounded-xl">
                    {icon}
                </div>
            </div>
            <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
    );
}
