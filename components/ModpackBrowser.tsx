"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { Search, Box, Download, Check, Star, Users, Loader2 } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { clsx } from 'clsx';

export default function ModpackBrowser({ serverId }: { serverId: string }) {
    const [search, setSearch] = useState("");
    const [packs, setPacks] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchPacks = useCallback(async (query: string) => {
        setLoading(true);
        try {
            const facets = JSON.stringify([["project_type:modpack"]]);
            const url = `https://api.modrinth.com/v2/search?query=${encodeURIComponent(query)}&facets=${encodeURIComponent(facets)}&limit=12`;
            const res = await fetch(url);
            const data = await res.json();
            setPacks(data.hits || []);
        } catch (err) {
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => fetchPacks(search), 300);
        return () => clearTimeout(timeout);
    }, [search, fetchPacks]);

    return (
        <div className="space-y-10 p-8">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black uppercase tracking-tighter italic">Engine Modpacks</h2>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Full environment overrides via Modrinth.</p>
                </div>
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input 
                        type="text"
                        placeholder="Search modpacks..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full h-12 pl-12 pr-6 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm focus:border-brand-purple outline-none transition-all"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {packs.map((pack) => (
                        <motion.div 
                            layout
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            key={pack.project_id} 
                            className="glass-card p-6 border-white/5 hover:border-brand-purple/40 transition-all group"
                        >
                            <div className="flex gap-4">
                                <img 
                                    src={pack.icon_url || 'https://api.dicebear.com/9.x/identicon/svg?seed=' + pack.title} 
                                    className="w-20 h-20 rounded-2xl bg-white/5 object-cover shadow-2xl group-hover:scale-105 transition-transform"
                                    alt={pack.title}
                                />
                                <div className="flex-1 space-y-1">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-lg font-black uppercase text-white tracking-tight line-clamp-1">{pack.title}</h3>
                                    </div>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter line-clamp-2 italic leading-relaxed">
                                        {pack.description}
                                    </p>
                                    <div className="flex items-center gap-3 pt-2">
                                        <div className="flex items-center gap-1 text-[9px] font-black text-brand-purple">
                                            <Download size={10} /> {Math.floor(pack.downloads / 1000)}K
                                        </div>
                                        <div className="flex items-center gap-1 text-[9px] font-black text-orange-400">
                                            <Star size={10} /> {pack.follows}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                                <span className="text-[8px] font-black text-gray-600 uppercase">Ver: {pack.latest_version || '1.21.1'}</span>
                                <button 
                                    className="flex items-center gap-2 px-6 py-2 rounded-xl bg-white/5 text-white border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-brand-purple hover:border-brand-purple transition-all"
                                >
                                    Install Pack
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
}
