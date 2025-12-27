"use client";

import { useEffect, useState } from "react";
import { User, ShieldX, LogOut } from "lucide-react";

export default function PlayerList({ serverId, players = [] }: { serverId: string, players: any[] }) {
    const [list, setPlayers] = useState(players);

    useEffect(() => {
        setPlayers(players);
    }, [players]);

    const handleAction = (player: string, action: 'kick' | 'ban') => {
        // Placeholder for administrative RCON command
        alert(`Requesting ${action} for ${player} on ${serverId}`);
    };

    return (
        <div className="glass-card overflow-hidden">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-widest text-white italic">Active Operatives</h3>
                <span className="px-3 py-1 rounded-lg bg-brand-purple/20 text-brand-purple text-[10px] font-black">{list.length} ONLINE</span>
            </div>
            
            <div className="divide-y divide-white/5">
                {list.length > 0 ? list.map((p, idx) => (
                    <div key={idx} className="p-4 flex items-center justify-between group hover:bg-white/5 transition-all">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-gray-400">
                                <User size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-white text-sm tracking-tight">{p.name || 'Unknown Entity'}</p>
                                <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">{p.ping || 0}ms Latency</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={() => handleAction(p.name, 'kick')}
                                className="w-8 h-8 rounded-lg bg-yellow-500/10 text-yellow-500 flex items-center justify-center hover:bg-yellow-500 hover:text-black transition-all"
                                title="Kick Player"
                            >
                                <LogOut size={14} />
                            </button>
                            <button 
                                onClick={() => handleAction(p.name, 'ban')}
                                className="w-8 h-8 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                                title="Ban Player"
                            >
                                <ShieldX size={14} />
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="p-12 text-center text-gray-600 font-black uppercase tracking-widest text-xs italic">
                        No active connections detected in this sector.
                    </div>
                )}
            </div>
        </div>
    );
}
