"use client";

import { motion, AnimatePresence } from 'framer-motion';
import { Search, Box, Download, Check, Trash2, Pickaxe, Sparkles, Loader2, Server } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { clsx } from 'clsx';
import { getMods, installMod, uninstallMod } from '@/app/actions';

export default function ModBrowser({ serverId, gameType }: { serverId: string, gameType: string }) {
    const [search, setSearch] = useState("");
    const [mods, setMods] = useState<any[]>([]);
    const [installed, setInstalled] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [actionId, setActionId] = useState<string | null>(null);

    const loaderType = gameType.includes('fabric') ? 'fabric' : (gameType.includes('forge') ? 'forge' : null);

    const fetchInstalled = useCallback(async () => {
        try {
            const data = await getMods(serverId);
            setInstalled(Array.isArray(data) ? data : []);
        } catch (e) {}
    }, [serverId]);

    const fetchModrinth = useCallback(async (query: string) => {
        if (!loaderType) return;
        setLoading(true);
        try {
            const facets = JSON.stringify([[`categories:${loaderType}`], ["project_type:mod"]]);
            const url = `https://api.modrinth.com/v2/search?query=${encodeURIComponent(query)}&facets=${encodeURIComponent(facets)}&limit=8`;
            const res = await fetch(url);
            const data = await res.json();
            setMods(data.hits || []);
        } catch (err) {
        } finally {
            setLoading(false);
        }
    }, [loaderType]);

    useEffect(() => {
        fetchInstalled();
        const timeout = setTimeout(() => fetchModrinth(search), 300);
        return () => clearTimeout(timeout);
    }, [search, fetchModrinth, fetchInstalled]);

    const handleInstall = async (modId: string) => {
        setActionId(modId);
        try {
            await installMod(serverId, modId);
            await fetchInstalled();
        } catch (e) {
            alert('Injection failed');
        } finally {
            setActionId(null);
        }
    };

    const handleUninstall = async (modId: string) => {
        setActionId(modId);
        try {
            await uninstallMod(serverId, modId);
            await fetchInstalled();
        } catch (e) {
        } finally {
            setActionId(null);
        }
    };

    return (
        <div className="space-y-10 p-8 h-full">
            {/* Live Mods Section (Top) */}
            {installed.length > 0 && (
                <div className="space-y-6">
                    <div className="flex items-center gap-3">
                        <Server size={16} className="text-green-500" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Active Grid Modules ({installed.length})</h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {installed.map((mod) => (
                            <div key={mod.id} className="glass-card p-4 border-green-500/20 bg-green-500/5 flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                                        <Check size={14} className="text-green-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-black text-white uppercase tracking-tight line-clamp-1">{mod.name}</h4>
                                        <p className="text-[8px] font-bold text-gray-500 uppercase">{mod.version}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleUninstall(mod.id)}
                                    className="w-8 h-8 rounded-lg hover:bg-red-500/20 text-gray-600 hover:text-red-500 transition-all flex items-center justify-center"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="h-px bg-white/5" />

            {/* Discovery Section */}
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-black uppercase tracking-tighter italic">Discovery Engine</h2>
                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Querying Modrinth Global Registry...</p>
                    </div>
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input 
                            type="text"
                            placeholder="Search modules..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full h-12 pl-12 pr-6 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm focus:border-brand-purple outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    <AnimatePresence mode="popLayout">
                        {mods.map((mod) => {
                            const isInstalled = installed.some(m => m.id === mod.project_id);
                            return (
                                <motion.div 
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    key={mod.project_id} 
                                    className="glass-card p-6 flex flex-col justify-between hover:border-brand-purple/40 transition-all group"
                                >
                                    <div>
                                        <div className="flex justify-between items-start mb-4">
                                            <img 
                                                src={mod.icon_url || 'https://api.dicebear.com/9.x/identicon/svg?seed=' + mod.title} 
                                                className="w-10 h-10 rounded-lg bg-white/5 object-cover"
                                                alt={mod.title}
                                            />
                                            <div className="text-right">
                                                <div className="px-2 py-1 rounded bg-brand-purple/10 text-brand-purple text-[8px] font-black uppercase tracking-widest mb-1">
                                                    {mod.categories?.[0] || 'Mod'}
                                                </div>
                                                <span className="text-[9px] font-bold text-gray-600 uppercase tracking-tight">{Math.floor(mod.downloads / 1000)}K DLs</span>
                                            </div>
                                        </div>
                                        <h3 className="text-base font-black uppercase text-white mb-1 tracking-tight line-clamp-1">{mod.title}</h3>
                                        <p className="text-[10px] text-gray-500 font-bold mb-4 uppercase tracking-tighter line-clamp-2 leading-relaxed italic">
                                            {mod.description}
                                        </p>
                                    </div>

                                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                        <span className="text-[8px] font-black text-gray-600 uppercase">By {mod.author}</span>
                                        
                                        <button 
                                            onClick={() => handleInstall(mod.project_id)}
                                            disabled={actionId === mod.project_id || isInstalled}
                                            className={clsx(
                                                "flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                                                isInstalled 
                                                    ? "bg-green-500/20 text-green-500 border border-green-500/30" 
                                                    : "bg-brand-purple/10 text-brand-purple hover:bg-brand-purple hover:text-white border border-brand-purple/20"
                                            )}
                                        >
                                            {actionId === mod.project_id ? (
                                                <Loader2 className="animate-spin" size={12} />
                                            ) : isInstalled ? (
                                                <><Check size={12} /> Active</>
                                            ) : (
                                                <><Download size={12} /> Inject</>
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
