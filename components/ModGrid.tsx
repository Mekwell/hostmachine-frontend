"use client";

import { useState } from 'react';
import { Package, Download, Check, Trash2 } from 'lucide-react';
import { clsx } from 'clsx';

interface Mod {
    id: string;
    name: string;
    description: string;
    category: string;
    version: string;
}

export default function ModGrid({ mods, installedIds, onToggle }: { mods: Mod[], installedIds: string[], onToggle: (id: string) => void }) {
    const [filter, setFilter] = useState('all');

    const filteredMods = filter === 'all' ? mods : mods.filter(m => m.category === filter);
    const categories = ['all', ...Array.from(new Set(mods.map(m => m.category)))];

    return (
        <div className="space-y-6">
            <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map(cat => (
                    <button 
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={clsx(
                            "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                            filter === cat ? "bg-brand-purple text-white" : "bg-white/5 text-gray-500 hover:text-white"
                        )}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMods.map(mod => {
                    const isInstalled = installedIds.includes(mod.id);
                    return (
                        <div key={mod.id} className={clsx("glass-card p-6 flex flex-col justify-between group border transition-all", isInstalled ? "border-brand-purple/50 bg-brand-purple/5" : "hover:border-white/20")}>
                            <div>
                                <div className="flex justify-between items-start mb-2">
                                    <div className="p-2 rounded-lg bg-white/5 text-brand-purple">
                                        <Package size={20} />
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-500 uppercase">{mod.version}</span>
                                </div>
                                <h4 className="text-white font-bold text-sm mb-1">{mod.name}</h4>
                                <p className="text-xs text-gray-400 line-clamp-2">{mod.description}</p>
                            </div>
                            
                            <button 
                                onClick={() => onToggle(mod.id)}
                                className={clsx(
                                    "mt-4 w-full py-3 rounded-xl flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest transition-all",
                                    isInstalled ? "bg-red-500/10 text-red-500 hover:bg-red-500/20" : "bg-white/10 text-white hover:bg-white/20"
                                )}
                            >
                                {isInstalled ? (
                                    <>Uninstalling <Trash2 size={12} /></>
                                ) : (
                                    <>Install <Download size={12} /></>
                                )}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
