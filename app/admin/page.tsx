"use client";

import { useEffect, useState } from 'react';
import { 
  LayoutDashboard, Server, Settings, Users, Activity, 
  TrendingUp, TrendingDown, Clock, Shield, DollarSign, HardDrive, Cpu 
} from 'lucide-react';import { getNodes, getServers, getPlans } from '@/app/actions';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    nodes: 0,
    onlineNodes: 0,
    servers: 0,
    activeServers: 0,
    plans: 0,
    totalRam: 0,
    usedRam: 0,
    totalCores: 0
  });

  useEffect(() => {
    const loadData = async () => {
        try {
            const [nodes, servers, plans] = await Promise.all([
                getNodes() as Promise<any[]>, 
                getServers() as Promise<any[]>, 
                getPlans() as Promise<any[]>
            ]);

            const onlineNodes = nodes.filter(n => n.status === 'ONLINE').length;
            const activeServers = servers.filter(s => s.status === 'RUNNING').length;
            
            // Calculate resources
            const totalRam = nodes.reduce((acc, n) => acc + n.specs.totalMemoryMb, 0);
            const totalCores = nodes.reduce((acc, n) => acc + n.specs.cpuCores, 0);
            const usedRam = servers.reduce((acc, s) => acc + (s.status === 'RUNNING' ? s.memoryLimitMb : 0), 0);

            setStats({
                nodes: nodes.length,
                onlineNodes,
                servers: servers.length,
                activeServers,
                plans: plans.length,
                totalRam,
                usedRam,
                totalCores
            });
        } catch (e) {
            console.error(e);
        }
    };
    loadData();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Command Center</h1>
        <p className="text-gray-400">System-wide health and performance metrics.</p>
      </div>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
            title="Total Revenue" 
            value="$1,250.00" 
            subtitle="+12% from last month"
            icon={<DollarSign size={24} className="text-green-400" />} 
            trend="up"
        />
        <StatCard 
            title="Active Servers" 
            value={`${stats.activeServers} / ${stats.servers}`} 
            subtitle="Instances running"
            icon={<Server size={24} className="text-brand-purple" />} 
        />
          <StatCard 
            title="Infrastructure Health" 
            value="Optimal" 
            icon={<Shield className="text-green-400" />} 
            trend="+0.01% uptime"
          />
        <StatCard 
            title="Registered Users" 
            value="156" 
            subtitle="+8 this week"
            icon={<Users size={24} className="text-orange-400" />} 
            trend="up"
        />
      </div>

      {/* Resource Usage */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <HardDrive size={20} className="text-gray-400" /> 
                Memory Allocation
            </h3>
            <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                    <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-brand-purple bg-brand-purple/20">
                            RAM Usage
                        </span>
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-brand-purple">
                            {((stats.usedRam / (stats.totalRam || 1)) * 100).toFixed(1)}%
                        </span>
                    </div>
                </div>
                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-white/10">
                    <div style={{ width: `${(stats.usedRam / (stats.totalRam || 1)) * 100}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-brand-purple"></div>
                </div>
                <div className="flex justify-between text-xs text-gray-400">
                    <span>Used: {(stats.usedRam / 1024).toFixed(1)} GB</span>
                    <span>Total: {(stats.totalRam / 1024).toFixed(1)} GB</span>
                </div>
            </div>
        </div>

        <div className="glass-card p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                <Cpu size={20} className="text-gray-400" /> 
                CPU Allocation
            </h3>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-white mb-1">{stats.totalCores}</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">Total Cores</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 text-center">
                    <div className="text-3xl font-bold text-green-400 mb-1">12%</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">Avg Load</div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subtitle, icon, trend }: any) {
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
            <div className="flex items-center gap-2">
                {trend === 'up' && <TrendingUp size={16} className="text-green-400" />}
                <p className="text-xs text-gray-500">{subtitle}</p>
            </div>
        </div>
    );
}
