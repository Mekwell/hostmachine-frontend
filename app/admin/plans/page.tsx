"use client";

import { useEffect, useState } from 'react';
import { Package, Cpu, HardDrive, Plus, Trash2, X, Server, Layers } from 'lucide-react';
import { createPlan, deletePlan, getPlans, getGames } from '@/app/actions';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  ramMb: number;
  cpuCores: number;
  type: 'fixed' | 'flexi';
  gameId?: string;
}

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [games, setGames] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 10,
    ramMb: 4096,
    cpuCores: 2,
    type: 'fixed' as const,
    gameId: ''
  });

  const loadData = async () => {
    try {
      const [planData, gameData] = await Promise.all([
          getPlans(),
          getGames()
      ]);
      setPlans(planData as Plan[]);
      setGames(gameData as any[]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createPlan(formData);
      setShowModal(false);
      loadData();
    } catch (err) {
      alert('Failed to create plan');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this plan?')) return;
    await deletePlan(id);
    loadData();
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase text-white">Service Plans</h1>
          <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1">Global Infrastructure Tiers</p>
        </div>
        <button 
            onClick={() => setShowModal(true)}
            className="btn-primary !py-2.5 !px-6 text-xs gap-2"
        >
          <Plus size={16} />
          CREATE PLAN
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.id} className="glass-card p-8 group relative overflow-hidden">
            <div className={clsx(
                "absolute top-0 right-0 p-4",
                plan.type === 'flexi' ? "text-brand-blue" : "text-brand-purple"
            )}>
                {plan.type === 'flexi' ? <Layers size={40} className="opacity-10" /> : <Server size={40} className="opacity-10" />}
            </div>

            <button 
                onClick={() => handleDelete(plan.id)}
                className="absolute top-4 right-4 text-gray-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            >
                <Trash2 size={18} />
            </button>

            <div className="flex items-center gap-4 mb-6">
                <div className={clsx(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg",
                    plan.type === 'flexi' ? "bg-brand-blue/20 text-brand-blue" : "bg-brand-purple/20 text-brand-purple"
                )}>
                    <Package size={24} />
                </div>
                <div>
                    <h3 className="text-xl font-black uppercase tracking-tighter text-white">{plan.name}</h3>
                    <div className="flex items-center gap-2">
                        <span className="text-white font-black text-lg italic">${plan.price}</span>
                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">/ month</span>
                    </div>
                </div>
            </div>
            
            <p className="text-sm text-gray-400 mb-8 font-medium leading-relaxed">{plan.description}</p>

            <div className="space-y-3">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                    <span>Provisioning Mode</span>
                    <span className="text-white">{plan.type}</span>
                </div>
                {plan.gameId && (
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                        <span>Engine Link</span>
                        <span className="text-brand-purple">{plan.gameId}</span>
                    </div>
                )}
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-500 pt-2 border-t border-white/5">
                    <span>RAM Allocation</span>
                    <span className="text-white">{plan.ramMb / 1024} GB</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-500">
                    <span>vCPU Priority</span>
                    <span className="text-white">{plan.cpuCores} Cores</span>
                </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card w-full max-w-lg p-10 relative">
                <button onClick={() => setShowModal(false)} className="absolute top-6 right-6 text-gray-500 hover:text-white"><X size={24} /></button>
                <h2 className="text-3xl font-black uppercase tracking-tighter text-white mb-8">Define <span className="text-gradient">Tier.</span></h2>
                
                <form onSubmit={handleCreate} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Plan Mode</label>
                            <select 
                                className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-brand-purple transition-all"
                                value={formData.type}
                                onChange={e => setFormData({...formData, type: e.target.value as any})}
                            >
                                <option value="fixed">Fixed Module</option>
                                <option value="flexi">Flexi Pool</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Linked Game (Optional)</label>
                            <select 
                                className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-brand-purple transition-all"
                                value={formData.gameId}
                                onChange={e => setFormData({...formData, gameId: e.target.value})}
                            >
                                <option value="">None (Generic Fixed)</option>
                                {games.map(g => (
                                    <option key={g.id} value={g.id} className="bg-[#05050A]">{g.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Identity Name</label>
                        <input 
                            className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-800 focus:outline-none focus:border-brand-purple transition-all" 
                            placeholder="e.g. Starter Pro"
                            value={formData.name}
                            onChange={e => setFormData({...formData, name: e.target.value})}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Brief Manifest</label>
                        <input 
                            className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-gray-800 focus:outline-none focus:border-brand-purple transition-all" 
                            placeholder="Perfect for small communities..."
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Cost ($)</label>
                            <input type="number" className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-brand-purple" 
                                value={formData.price}
                                onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">RAM (MB)</label>
                            <input type="number" className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-brand-purple" 
                                value={formData.ramMb}
                                onChange={e => setFormData({...formData, ramMb: parseInt(e.target.value)})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">vCPU</label>
                            <input type="number" className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-brand-purple" 
                                value={formData.cpuCores}
                                onChange={e => setFormData({...formData, cpuCores: parseInt(e.target.value)})}
                            />
                        </div>
                    </div>

                    <button className="btn-primary w-full h-14 uppercase tracking-[0.2em] font-black text-xs mt-4">
                        INITIALIZE PLAN
                    </button>
                </form>
            </motion.div>
        </div>
      )}
    </div>
  );
}