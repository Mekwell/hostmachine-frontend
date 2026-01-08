"use client";

import { useEffect, useState } from 'react';
import { ShoppingBag, Search, Filter } from 'lucide-react';
import { getGames } from '@/app/actions';
import Header from '@/components/Header';
import GameModal from '@/components/GameModal';

export default function StorePage() {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedGame, setSelectedGame] = useState<any>(null);

  useEffect(() => {
    getGames().then(data => {
        setGames(Array.isArray(data) ? data : [
            { id: 'minecraft-java', name: 'Minecraft Java', category: 'Sandbox', image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&q=80&w=600' },
            { id: 'rust', name: 'Rust', category: 'Survival', image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=600' },
            { id: 'cs2', name: 'CS2', category: 'Tactical', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=600' },
            { id: 'palworld', name: 'Palworld', category: 'Survival', image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=600' },
            { id: 'asa', name: 'ARK: Survival Ascended', category: 'Survival', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=600' },
            { id: 'project-zomboid', name: 'Project Zomboid', category: 'Hardcore', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=600' },
            { id: 'valheim', name: 'Valheim', category: 'Co-op', image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=600' },
            { id: 'dayz', name: 'DayZ', category: 'Survival', image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&q=80&w=600' },
        ]);
        setLoading(false);
    });
  }, []);

  const filtered = games.filter(g => g.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#05050A] flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-purple/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-blue/10 blur-[120px] rounded-full" />
      </div>

      <Header />
      
      <main className="flex-1 container-main py-32 space-y-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-brand-purple/20 bg-brand-purple/10 text-[10px] font-black uppercase tracking-widest text-brand-purple">
                    <ShoppingBag size={12} /> Global Game Market
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase leading-[0.9]">
                    Choose Your <span className="text-gradient">Game.</span>
                </h1>
                <p className="text-xl text-gray-400 leading-relaxed font-medium">
                    Deploy high-performance game instances on bare metal. Select a template below to begin the synchronization sequence.
                </p>
            </div>

            <div className="relative w-full md:w-96">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                    type="text"
                    placeholder="Search modules..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 pl-12 pr-6 text-white placeholder:text-gray-700 focus:outline-none focus:border-brand-purple transition-all"
                />
            </div>
        </div>

        {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="aspect-[4/5] rounded-[2.5rem] glass-card border-white/5 animate-pulse" />)}
            </div>
        ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {filtered.map((game) => (
                    <button
                        key={game.id}
                        onClick={() => setSelectedGame(game)}
                        className="group relative block aspect-[4/5] overflow-hidden rounded-[2rem] glass-card border-white/5 hover:border-brand-purple/50 transition-all duration-500 text-left w-full"
                    >
                        <img 
                            src={game.image || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=600'} 
                            alt={game.name}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-40 group-hover:opacity-60"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                        
                        <div className="absolute bottom-0 left-0 p-6 w-full translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                            <h4 className="text-xl font-black uppercase tracking-tighter text-white mb-1">{game.name}</h4>
                            <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">{game.category || 'Battle Ready'}</p>
                        </div>
                    </button>
                ))}
            </div>
        )}
      </main>

      <GameModal game={selectedGame} onClose={() => setSelectedGame(null)} />
    </div>
  );
}
