"use client";

import { Search, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FullGameGrid({ games }: { games: any[] }) {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<'game' | 'voip' | 'web'>('game');
    
    // Ensure we have a valid array
    const displayGames = Array.isArray(games) ? games : [];

    const cycleCategory = () => {
        const cats: ('game' | 'voip' | 'web')[] = ['game', 'voip', 'web'];
        const nextIdx = (cats.indexOf(selectedCategory) + 1) % cats.length;
        setSelectedCategory(cats[nextIdx]);
    };

    const getCategoryLabel = () => {
        switch(selectedCategory) {
            case 'game': return "Games";
            case 'voip': return "VoIP";
            case 'web': return "Web Hosting";
            default: return "Modules";
        }
    };

    const filtered = displayGames.filter(g => {
        const matchesSearch = g.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory = g.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <section className="py-24 relative overflow-hidden">
            <div className="container-main">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
                    <div>
                        <h2 className="text-sm font-bold tracking-[0.4em] text-brand-purple uppercase mb-4">Discovery Engine</h2>
                        <div 
                            className="flex items-center gap-6 group cursor-pointer select-none" 
                            onClick={cycleCategory}
                        >
                            <p className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-none">
                                Available <span className="text-gradient">{getCategoryLabel()}.</span>
                            </p>
                            <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-brand-purple group-hover:bg-brand-purple group-hover:text-white transition-all shadow-lg shadow-brand-purple/0 group-hover:shadow-brand-purple/20">
                                <ArrowRight size={32} />
                            </div>
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 mt-4">
                            Click title or arrow to cycle categories
                        </p>
                    </div>

                    <div className="relative w-full md:w-[28rem]">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                        <input 
                            type="text"
                            placeholder="Search 150+ modules..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] h-16 pl-16 pr-8 text-white text-lg placeholder:text-gray-700 focus:outline-none focus:border-brand-purple transition-all shadow-2xl"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filtered.map((game) => (
                        <button 
                            key={game.id} 
                            onClick={() => router.push(`/servers/new?gameId=${game.id}`)}
                            className="relative aspect-[16/11] group overflow-hidden rounded-[2.5rem] border border-white/10 hover:border-brand-purple/50 transition-all duration-700 bg-gray-900"
                        >
                            {/* Background Banner */}
                            <div className="absolute inset-0 transition-transform duration-1000 group-hover:scale-110">
                                {game.banner ? (
                                    <img 
                                        src={game.banner} 
                                        alt={game.name}
                                        className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-700"
                                        onError={(e) => {
                                            (e.target as any).src = `https://api.dicebear.com/9.x/identicon/svg?seed=${game.id}`;
                                            (e.target as any).className = "w-full h-full object-cover opacity-20 p-12";
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-gray-900 via-black to-brand-purple/10 flex items-center justify-center">
                                        <span className="text-6xl opacity-20 transform -rotate-12 grayscale">🎮</span>
                                    </div>
                                )}
                            </div>

                            {/* Overlays */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90" />
                            
                            {/* Content */}
                            <div className="absolute inset-0 p-10 flex flex-col justify-end text-left">
                                <div className="transform group-hover:-translate-y-3 transition-transform duration-700">
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="px-3 py-1 rounded-full bg-brand-purple/20 border border-brand-purple/30 text-[10px] font-black text-brand-purple uppercase tracking-widest">
                                            {game.category || 'Module'}
                                        </span>
                                        {game.icon && !game.banner && <span className="text-xl">{game.icon}</span>}
                                    </div>
                                    
                                    <h4 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white leading-[0.9] mb-4 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
                                        {game.name}
                                    </h4>
                                    
                                    <div className="h-0 group-hover:h-auto overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-700">
                                        <p className="text-sm text-gray-400 font-bold leading-tight uppercase tracking-tight line-clamp-2">
                                            {game.description || 'Enterprise-grade Australian hosting.'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Interactive Glow */}
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none duration-1000">
                                <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-brand-purple/20 blur-[120px] rounded-full" />
                            </div>
                        </button>
                    ))}
                </div>

                {filtered.length === 0 && (
                    <div className="py-40 text-center glass-card rounded-[3rem] border-dashed border-2">
                        <div className="text-6xl mb-6 grayscale opacity-20">🔎</div>
                        <p className="text-gray-500 font-black uppercase tracking-[0.3em] text-xl">Module "{search}" not found in manifest</p>
                        <button onClick={() => setSearch("")} className="mt-8 text-brand-purple font-black uppercase tracking-widest text-sm hover:underline">Clear Search Filter</button>
                    </div>
                )}
            </div>
        </section>
    );
}