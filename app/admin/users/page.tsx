"use client";

import { useEffect, useState } from 'react';
import { getAdminUsers } from '@/app/actions';
import { Users, Shield, CreditCard, Server, Search } from 'lucide-react';

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
        try {
            const data = await getAdminUsers();
            setUsers((data as any[]) || []);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    load();
  }, []);

  return (
    <div className="space-y-8">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter text-white italic">User <span className="text-brand-purple">Directory</span></h1>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1">Access Control & Billing</p>
            </div>
            <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="text" placeholder="Search users..." className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-xs text-white placeholder-gray-600 focus:border-brand-purple/50 outline-none w-64" />
            </div>
        </div>

        <div className="glass-card overflow-hidden">
            <table className="w-full text-left text-xs">
                <thead>
                    <tr className="text-gray-600 font-black uppercase tracking-widest border-b border-white/5 bg-white/[0.02]">
                        <th className="p-4 pl-6">User Identity</th>
                        <th className="p-4">Active Plans</th>
                        <th className="p-4">Deployed Servers</th>
                        <th className="p-4">Monthly Spend</th>
                        <th className="p-4 text-right pr-6">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {loading ? (
                        <tr><td colSpan={5} className="p-8 text-center text-gray-600 animate-pulse">Scanning user database...</td></tr>
                    ) : (
                        users.map(user => (
                            <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                                <td className="p-4 pl-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-purple to-brand-blue flex items-center justify-center text-white font-black text-[10px]">
                                            {user.email?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                        <div>
                                            <div className="font-bold text-white">{user.email}</div>
                                            <div className="font-mono text-[9px] text-gray-500">{user.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-wrap gap-1">
                                        {user.plans.map((p: string, i: number) => (
                                            <span key={i} className="px-2 py-0.5 rounded bg-white/10 text-gray-300 text-[9px] font-bold uppercase">{p}</span>
                                        ))}
                                    </div>
                                </td>
                                <td className="p-4 text-gray-300 font-medium">
                                    <div className="flex items-center gap-2">
                                        <Server size={12} className="text-gray-500" />
                                        {user.servers} Active
                                    </div>
                                </td>
                                <td className="p-4 font-mono text-green-400 font-bold">
                                    ${user.spent.toFixed(2)}
                                </td>
                                <td className="p-4 pr-6 text-right">
                                    <button className="text-gray-500 hover:text-white font-bold uppercase text-[9px] tracking-widest border border-white/10 hover:bg-white/10 px-3 py-1.5 rounded transition-all">
                                        Manage
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    </div>
  );
}