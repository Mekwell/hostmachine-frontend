"use client";

import { motion } from 'framer-motion';
import { 
    Box, Cpu, Zap, ArrowRight, Shield, Rocket, 
    Layers, Layout, ChevronRight, Plus, Terminal,
    Database, Activity, Globe, Sparkles, Pickaxe
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';
import { clsx } from 'clsx';

const mcVariants = [
    {
        id: 'minecraft-java',
        name: 'Java Edition',
        tag: 'The Original',
        description: 'Native PaperMC/Purpur high-performance cores. Full support for standard plugins and player customization.',
        features: ['Full RCON Access', 'Real-time Console', 'Paper/Purpur Optimization', 'Custom .jar Support'],
        icon: <Terminal className="text-brand-purple" />,
        color: 'from-brand-purple/20 to-brand-purple/5'
    },
    {
        id: 'minecraft-bedrock',
        name: 'Bedrock Edition',
        tag: 'Cross-Platform',
        description: 'Official Bedrock server software. Allows play from Windows 10, Xbox, PlayStation, Switch, and Mobile.',
        features: ['Console Friendly', 'Mobile Optimization', 'Instant Setup', 'Low Resource Overhead'],
        icon: <Globe className="text-brand-blue" />,
        color: 'from-brand-blue/20 to-brand-blue/5'
    },
    {
        id: 'minecraft-forge',
        name: 'Modded (Forge)',
        tag: 'The Powerhouse',
        description: 'Advanced Forge environment. Perfect for heavy modpacks like RLCraft, Pixelmon, or custom tech stacks.',
        features: ['One-Click Mod Installer', 'Heap Management', 'Auto-Backup Sync', 'Heavy Stack Ready'],
        icon: <Pickaxe className="text-green-500" />,
        color: 'from-green-500/20 to-green-500/5'
    },
    {
        id: 'minecraft-fabric',
        name: 'Modded (Fabric)',
        tag: 'Modern Modular',
        description: 'Ultra-efficient Fabric core. The modern choice for high-tech modding with minimal performance impact.',
        features: ['Fast Boot Times', 'High-Entity Optimization', 'Modular Extensions', 'Native Java 21+'],
        icon: <Sparkles className="text-brand-purple" />,
        color: 'from-brand-purple/20 to-brand-blue/20'
    }
];

export default function MinecraftPage() {
  return (
    <div className="min-h-screen bg-[#05050A] text-foreground font-sans selection:bg-brand-purple/30">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[-10%] right-[-10%] w-[60%] h-[60%] bg-brand-purple/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-brand-blue/5 blur-[120px] rounded-full" />
        </div>

        <div className="container-main relative z-10 text-center space-y-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                    <Box size={14} className="text-brand-purple" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">Protocol // Minecraft</span>
                </div>
                <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter text-white">
                    BLOCK <span className="text-gradient">OPTIMIZED.</span>
                </h1>
                <p className="max-w-2xl mx-auto text-sm md:text-lg text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                    HostMachine provides the most advanced Minecraft hosting infrastructure in the southern hemisphere. Low latency, high uptime, zero limits.
                </p>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex justify-center gap-12 pt-8 grayscale opacity-40">
                {/* Visual logos or icons would go here */}
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white">NVMe Gen4</div>
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white">AMD EPYC™</div>
                <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white">DDR5 RAM</div>
            </motion.div>
        </div>
      </section>

      {/* Grid of Variants */}
      <section className="py-24 container-main">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {mcVariants.map((variant, idx) => (
                <motion.div
                    key={variant.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                >
                    <Link href={`/servers/new?gameId=${variant.id}&type=fixed`} className="group block relative h-full">
                        <div className={clsx(
                            "glass-card h-full p-12 flex flex-col justify-between border-white/5 hover:border-brand-purple/50 transition-all duration-500 bg-gradient-to-br overflow-hidden relative",
                            variant.color
                        )}>
                            {/* Visual Polish */}
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity duration-700">
                                {variant.icon}
                            </div>

                            <div className="space-y-8 relative z-10">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-brand-purple uppercase tracking-widest">{variant.tag}</span>
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-brand-purple group-hover:text-white transition-all">
                                            <ChevronRight size={20} />
                                        </div>
                                    </div>
                                    <h3 className="text-4xl font-black uppercase tracking-tighter text-white italic">{variant.name}</h3>
                                    <p className="text-gray-400 font-bold uppercase tracking-tight text-[11px] leading-relaxed max-w-sm">
                                        {variant.description}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {variant.features.map((f, fidx) => (
                                        <div key={fidx} className="flex items-center gap-2">
                                            <div className="w-1 h-1 rounded-full bg-brand-purple" />
                                            <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 group-hover:text-white transition-colors">{f}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-12 relative z-10">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-purple border-b-2 border-brand-purple/20 pb-1 group-hover:border-brand-purple transition-all">
                                    Initialize Deployment Sequence
                                </span>
                            </div>
                        </div>
                    </Link>
                </motion.div>
            ))}
        </div>
      </section>

      {/* Feature Highlight: One-Click Mods */}
      <section className="py-24 relative overflow-hidden bg-white/5">
          <div className="container-main flex flex-col md:flex-row items-center gap-20">
              <div className="flex-1 space-y-8">
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-brand-purple/10 border border-brand-purple/20">
                      <Plus size={14} className="text-brand-purple" />
                      <span className="text-[10px] font-black text-brand-purple uppercase tracking-[0.3em]">Expansion Module</span>
                  </div>
                  <h2 className="text-5xl font-black uppercase tracking-tighter text-white">
                      ONE-CLICK <span className="text-gradient">EXPANSION.</span>
                  </h2>
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-sm leading-relaxed">
                      Install entire modpacks or individual extensions without touching a single file. Our automated registry synchronizes Forge and Fabric modules in real-time.
                  </p>
                  <div className="grid grid-cols-2 gap-8 pt-4">
                      <FeatureMini icon={<Rocket size={18} />} title="Auto-Dependency" desc="Resolution of all required libs" />
                      <FeatureMini icon={<Shield size={18} />} title="Safe-Mode" desc="Automated pre-install backups" />
                  </div>
              </div>
              <div className="flex-1 relative">
                  <div className="glass-card aspect-square max-w-md mx-auto p-8 border-brand-purple/20 relative animate-pulse-slow">
                      <div className="w-full h-full border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center space-y-6">
                          <Plus size={48} className="text-brand-purple opacity-20" />
                          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-700">Mod Registry Interface</p>
                      </div>
                      
                      {/* Floating Mock Mod Cards */}
                      <MockModCard className="top-[-10%] right-[-10%]" name="Lithium" type="Optimization" />
                      <MockModCard className="bottom-[20%] left-[-20%]" name="Journeymap" type="UI Module" />
                      <MockModCard className="top-[20%] left-[-15%]" name="WorldEdit" type="Utility" />
                  </div>
              </div>
          </div>
      </section>
    </div>
  );
}

function FeatureMini({ icon, title, desc }: any) {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-3 text-white">
                {icon}
                <h4 className="text-[10px] font-black uppercase tracking-widest">{title}</h4>
            </div>
            <p className="text-[9px] text-gray-600 font-bold uppercase tracking-tight">{desc}</p>
        </div>
    );
}

function MockModCard({ className, name, type }: any) {
    return (
        <div className={clsx("absolute p-4 glass-card border-brand-purple/30 bg-[#0A0A1A] w-40 shadow-2xl", className)}>
            <div className="flex items-center justify-between mb-2">
                <div className="w-2 h-2 rounded-full bg-brand-purple" />
                <span className="text-[8px] font-black uppercase text-gray-600">Active</span>
            </div>
            <h5 className="text-xs font-black uppercase text-white">{name}</h5>
            <p className="text-[8px] font-bold uppercase text-brand-purple">{type}</p>
        </div>
    );
}
