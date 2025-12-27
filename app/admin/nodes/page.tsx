"use client";

import { useEffect, useState } from 'react';
import { 
  Server, Cpu, HardDrive, Search, Filter, 
  MoreVertical, RefreshCw, Power, Trash2, 
  Terminal, Activity, CheckCircle2, AlertCircle, Copy, X
} from 'lucide-react';
import { getNodes, deleteNode, rebootNode, getEnrollmentCommand } from '@/app/actions';

interface Node {
  id: string;
  hostname: string;
  status: 'ONLINE' | 'OFFLINE';
  lastSeen: string;
  vpnIp?: string;
  specs: {
    cpuCores: number;
    totalMemoryMb: number;
    totalDiskGb: number;
    osPlatform: string;
  };
}

export default function NodesPage() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [enrollCommand, setEnrollCommand] = useState('Loading...');

  const loadNodes = async () => {
    try {
      const data = await getNodes();
      setNodes(data as Node[]);
    } catch (err) {
      console.error('Failed to fetch nodes', err);
    } finally {
      setLoading(false);
    }
  };

  const loadEnrollment = async () => {
      try {
          const res: any = await getEnrollmentCommand();
          setEnrollCommand(res.command);
      } catch (err) {
          setEnrollCommand('Failed to load command.');
      }
  };

  useEffect(() => {
    loadNodes();
    loadEnrollment();
  }, []);

  const handleDelete = async (id: string) => {
      if (!confirm('Are you sure? This will remove the node from the cluster.')) return;
      try {
          await deleteNode(id);
          loadNodes();
      } catch (err) {
          alert('Failed to delete node');
      }
  };

  const handleReboot = async (id: string) => {
      if (!confirm('Reboot this physical node? All servers on it will stop.')) return;
      try {
          await rebootNode(id);
          alert('Reboot signal sent.');
      } catch (err) {
          alert('Failed to reboot node');
      }
  };

  const copyCommand = () => {
      navigator.clipboard.writeText(enrollCommand);
      alert('Command copied to clipboard!');
  };

  const filteredNodes = nodes.filter(n => 
    n.hostname.toLowerCase().includes(search.toLowerCase()) || 
    n.id.includes(search)
  );

  const stats = {
    total: nodes.length,
    online: nodes.filter(n => n.status === 'ONLINE').length,
    cores: nodes.reduce((acc, n) => acc + n.specs.cpuCores, 0),
    ram: nodes.reduce((acc, n) => acc + n.specs.totalMemoryMb, 0)
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Infrastructure</h1>
          <p className="text-gray-400">Manage your bare-metal infrastructure status and resources.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={loadNodes} className="btn btn--secondary btn--sm gap-2">
            <RefreshCw size={16} /> Refresh
          </button>
          <button onClick={() => setShowAddModal(true)} className="btn btn--primary btn--sm gap-2">
            <Terminal size={16} /> Add Node
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard title="Total Nodes" value={stats.total} icon={<Server size={20} className="text-purple-400"/>} />
        <StatCard title="Online Status" value={`${stats.online}/${stats.total}`} icon={<Activity size={20} className="text-green-400"/>} />
        <StatCard title="Total Cores" value={stats.cores} icon={<Cpu size={20} className="text-blue-400"/>} />
        <StatCard title="Total RAM" value={`${(stats.ram / 1024).toFixed(0)} GB`} icon={<HardDrive size={20} className="text-orange-400"/>} />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 bg-white/5 border border-white/10 p-2 rounded-lg">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="Search hostname, ID, or IP..." 
            className="w-full bg-transparent border-none text-white pl-10 focus:ring-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="h-6 w-px bg-white/10"></div>
        <button className="flex items-center gap-2 text-gray-400 hover:text-white px-3">
          <Filter size={18} />
          <span>Filter</span>
        </button>
      </div>

      {/* Data Table */}
      <div className="border border-white/10 rounded-xl overflow-hidden bg-black/40 backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="p-4 text-sm font-medium text-gray-400">Hostname</th>
              <th className="p-4 text-sm font-medium text-gray-400">Status</th>
              <th className="p-4 text-sm font-medium text-gray-400">IP Address</th>
              <th className="p-4 text-sm font-medium text-gray-400">Specs</th>
              <th className="p-4 text-sm font-medium text-gray-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading infrastructure data...</td></tr>
            ) : filteredNodes.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-gray-500">No nodes found.</td></tr>
            ) : (
              filteredNodes.map((node) => (
                <tr key={node.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="p-4">
                    <div className="font-medium text-white">{node.hostname}</div>
                    <div className="text-xs text-gray-500 font-mono">{node.id.slice(0, 8)}</div>
                  </td>
                  <td className="p-4">
                    {node.status === 'ONLINE' ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                        <CheckCircle2 size={12} /> Online
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                        <AlertCircle size={12} /> Offline
                      </span>
                    )}
                  </td>
                  <td className="p-4 font-mono text-sm text-gray-300">
                    {node.vpnIp || '10.x.x.x'}
                  </td>
                  <td className="p-4 text-sm text-gray-400">
                    {node.specs.cpuCores}vCPU • {(node.specs.totalMemoryMb / 1024).toFixed(0)}GB RAM
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleReboot(node.id)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white" title="Reboot">
                        <Power size={16} />
                      </button>
                      <button onClick={() => handleDelete(node.id)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-400" title="Delete">
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

        {/* Add Node Modal */}
        {showAddModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="glass-card w-full max-w-lg rounded-2xl p-6 relative bg-[#0A0A1A] border border-white/10">
                    <button onClick={() => setShowAddModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white"><X size={24} /></button>
                    <h2 className="text-xl font-bold text-white mb-2">Connect New Node</h2>
                    <p className="text-gray-400 text-sm mb-6">Run this command on your fresh Ubuntu 22.04 LTS server to install the HostAgent.</p>
                    
                    <div className="bg-black/50 border border-white/10 rounded-lg p-4 font-mono text-sm text-green-400 break-all mb-4 relative group">
                        {enrollCommand}
                        <button onClick={copyCommand} className="absolute top-2 right-2 p-2 bg-white/10 hover:bg-white/20 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            <Copy size={16} />
                        </button>
                    </div>

                    <div className="text-xs text-gray-500 space-y-2">
                        <p>• Requires root privileges (sudo).</p>
                        <p>• Installs Docker, WireGuard, and Node.js runtime.</p>
                        <p>• Automatically pairs with this controller.</p>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string, value: string | number, icon: React.ReactNode }) {
  return (
    <div className="bg-black/40 border border-white/10 rounded-xl p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400">{title}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  );
}
