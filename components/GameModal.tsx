"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Server, Layers, ArrowRight, Zap, Cpu } from "lucide-react";
import Link from "next/link";

interface GameModalProps {
    game: { id: string; name: string; image?: string; category?: string } | null;
    onClose: () => void;
}

export default function GameModal({ game, onClose }: GameModalProps) {
    if (!game) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-md"
                />
                
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-4xl bg-[#05050A] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
                >
                    {/* Header Image */}
                    {game.image && (
                        <div className="relative h-48 md:h-64 w-full">
                            <img src={game.image} className="w-full h-full object-cover opacity-40" alt={game.name} />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#05050A] to-transparent" />
                            <button 
                                onClick={onClose}
                                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/50 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    )}

                    <div className="p-8 md:p-12">
                        <div className="mb-10">
                            <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white mb-2">{game.name}</h2>
                            <p className="text-brand-purple font-bold uppercase tracking-[0.3em] text-xs">{game.category || 'Battle-Ready Game'}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Fixed Plan Option */}
                            <div className="glass-card p-8 hover:border-brand-purple/30 transition-all group">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-brand-purple/20 flex items-center justify-center text-brand-purple">
                                        <Server size={24} />
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Starting At</span>
                                        <span className="text-2xl font-black text-white">$10.00</span>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold uppercase text-white mb-3 tracking-tight">Fixed Module</h3>
                                <p className="text-gray-400 text-sm mb-8 leading-relaxed">Dedicated resources for a single high-performance instance.</p>
                                <Link 
                                    href={`/servers/new?gameId=${game.id}&type=fixed`}
                                    className="btn-primary w-full !h-12 flex items-center justify-center gap-2 text-xs uppercase font-black tracking-widest"
                                >
                                    VIEW FIXED PLANS <ArrowRight size={16} />
                                </Link>
                            </div>

                            {/* Flexi Plan Option */}
                            <div className="glass-card p-8 border-brand-blue/20 hover:border-brand-blue/40 transition-all group relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4">
                                    <span className="bg-brand-blue text-white text-[8px] font-black uppercase px-2 py-1 rounded-full">POPULAR</span>
                                </div>
                                <div className="flex items-center justify-between mb-6">
                                    <div className="w-12 h-12 rounded-xl bg-brand-blue/20 flex items-center justify-center text-brand-blue">
                                        <Layers size={24} />
                                    </div>
                                    <div className="text-right">
                                        <span className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest">Starting At</span>
                                        <span className="text-2xl font-black text-white">$45.00</span>
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold uppercase text-white mb-3 tracking-tight">Flexi Pool</h3>
                                <p className="text-gray-400 text-sm mb-8 leading-relaxed">Scalable resource block for unlimited instance deployments.</p>
                                <Link 
                                    href={`/servers/new?gameId=${game.id}&type=flexi`}
                                    className="btn-secondary w-full !h-12 flex items-center justify-center gap-2 text-xs uppercase font-black tracking-widest hover:bg-brand-blue/20"
                                >
                                    VIEW FLEXI POOLS <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>

                        <div className="mt-10 flex items-center justify-center gap-8 text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em]">
                            <div className="flex items-center gap-2"><Zap size={14} className="text-brand-purple" /> Instant Setup</div>
                            <div className="flex items-center gap-2"><Cpu size={14} className="text-brand-blue" /> Ryzen 9 7950X</div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
