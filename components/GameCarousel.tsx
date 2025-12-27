"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import GameModal from "./GameModal";

const POPULAR_GAMES = [
  { 
    id: 'minecraft', 
    name: 'Minecraft', 
    image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&q=80&w=600',
    character: 'https://r2cdn.perplexity.ai/assets/mc-character.png', // Simulated 3D character
    color: 'from-green-500/20'
  },
  { 
    id: 'rust', 
    name: 'Rust', 
    image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=600',
    character: 'https://r2cdn.perplexity.ai/assets/rust-char.png',
    color: 'from-orange-500/20'
  },
  { 
    id: 'cs2', 
    name: 'Counter-Strike 2', 
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=600',
    character: 'https://r2cdn.perplexity.ai/assets/cs-char.png',
    color: 'from-yellow-500/20'
  },
  { 
    id: 'valheim', 
    name: 'Valheim', 
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=600',
    character: 'https://r2cdn.perplexity.ai/assets/val-char.png',
    color: 'from-cyan-500/20'
  }
];

export default function GameCarousel({ games }: { games: any[] }) {
  const [selectedGame, setSelectedGame] = useState<any>(null);

  return (
    <section className="py-20 relative z-10 overflow-visible">
      <div className="container-main">
        <div className="flex items-center justify-between mb-16">
            <div>
                <h2 className="text-sm font-bold tracking-[0.2em] text-gray-500 uppercase mb-2">Featured Deployments</h2>
                <p className="text-3xl font-black uppercase tracking-tighter text-white">Battle-Ready <span className="text-gradient">Nodes.</span></p>
            </div>
            <Link href="/store" className="text-xs font-bold text-brand-purple hover:text-white transition-colors flex items-center gap-1 uppercase tracking-widest">
                Explore Library <ArrowUpRight size={14} />
            </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {POPULAR_GAMES.map((game) => (
                <button 
                    key={game.id} 
                    onClick={() => setSelectedGame(game)}
                    className="group relative block aspect-[4/5] rounded-[2.5rem] transition-all duration-500 text-left w-full perspective-1000"
                >
                    <div className="absolute inset-0 rounded-[2.5rem] glass-card border-white/5 group-hover:border-brand-purple/50 transition-all duration-500 overflow-hidden">
                        <img 
                            src={game.image} 
                            alt={game.name}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-30 group-hover:opacity-40 blur-[2px] group-hover:blur-0"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                        <div className={game.color + " absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"} />
                    </div>

                    {/* 3D Character Overlay */}
                    <div className="absolute inset-0 pointer-events-none overflow-visible">
                        <motion.img 
                            src={game.character}
                            alt=""
                            className="absolute bottom-[-10%] left-1/2 -translate-x-1/2 w-[120%] h-auto max-w-none transition-transform duration-500 group-hover:scale-110 group-hover:translate-y-[-5%] drop-shadow-[0_20px_30px_rgba(0,0,0,0.8)]"
                            onError={(e: any) => e.target.style.display = 'none'} // Hide if 404
                        />
                    </div>
                    
                    <div className="absolute bottom-0 left-0 p-8 w-full z-20">
                        <h4 className="text-2xl font-black uppercase tracking-tighter text-white mb-2">{game.name}</h4>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-purple">Select Plan</span>
                            <ArrowUpRight size={14} className="text-brand-purple" />
                        </div>
                    </div>
                </button>
            ))}
        </div>
      </div>

      <GameModal game={selectedGame} onClose={() => setSelectedGame(null)} />
    </section>
  );
}
