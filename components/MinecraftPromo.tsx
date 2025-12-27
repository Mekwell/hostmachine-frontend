"use client";

import { motion } from 'framer-motion';
import { ArrowRight, Box, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';

export default function MinecraftPromo() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] pointer-events-none opacity-20">
          <div className="absolute top-[10%] right-[20%] w-96 h-96 bg-brand-purple/30 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[10%] left-[20%] w-96 h-96 bg-green-500/20 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container-main relative z-10">
        <Link href="/minecraft" className="block group">
          <div className="glass-card relative md:aspect-[21/8] min-h-[380px] overflow-hidden rounded-[2.5rem] border-white/10 hover:border-brand-purple/50 transition-all duration-700 shadow-2xl">
            {/* Background Image with Parallax-like effect */}
            <div className="absolute inset-0 transition-transform duration-1000 group-hover:scale-105">
                <img 
                    src="https://external-preview.redd.it/-4dssItg5b3VM2DvwH0k8Rt4uCiTfcjOns0rUdsFayk.jpg?auto=webp&s=7a1c8caf33928e13272015d4c1688e862beb9c01" 
                    alt="Minecraft Worlds"
                    className="w-full h-full object-cover opacity-40 group-hover:opacity-60 transition-opacity"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#05050A] via-[#05050A]/60 to-transparent" />
            </div>

            <div className="absolute inset-0 p-8 md:p-12 lg:p-16 flex flex-col justify-center max-w-xl">
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-3 md:space-y-5"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 w-fit backdrop-blur-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[8px] md:text-[9px] font-black text-green-500 uppercase tracking-[0.2em]">Block Optimization Active</span>
                    </div>

                    <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-white leading-[0.95]">
                        YOUR <span className="text-gradient">MINECRAFT</span> SERVER,<br />
                        YOUR WAY.
                    </h2>

                    <p className="text-[10px] md:text-xs lg:text-sm text-gray-400 font-medium leading-relaxed uppercase tracking-wide max-w-sm">
                        Deploy Vanilla, Modded, or Bedrock modules in seconds. Powered by low-latency NVMe nodes and automated mod management.
                    </p>

                    <div className="flex flex-wrap gap-4 md:gap-5 pt-1">
                        <div className="flex items-center gap-2 text-white/60">
                            <Zap size={14} className="text-brand-purple" />
                            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest">Zero Latency</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/60">
                            <Box size={14} className="text-brand-blue" />
                            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest">One-Click Mods</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/60">
                            <Sparkles size={14} className="text-brand-purple" />
                            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest">Cross-Play</span>
                        </div>
                    </div>

                    <div className="pt-4">
                        <div className="inline-flex items-center gap-4 group/btn">
                            <span className="btn-primary !h-11 md:!h-12 !px-6 md:!px-8 text-[9px] md:text-[10px] font-black uppercase tracking-widest">Explore Minecraft Fleet</span>
                            <div className="w-11 h-11 md:w-12 md:h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover/btn:bg-brand-purple group-hover/btn:border-brand-purple transition-all duration-500">
                                <ArrowRight size={18} />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Float Floating Elements */}
            <div className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 hidden md:block pointer-events-none">
                <motion.div
                    animate={{ y: [0, -20, 0], rotate: [0, 6, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    className="w-40 h-40 md:w-56 md:h-56 relative flex items-center justify-center"
                >
                    <div className="absolute inset-0 bg-brand-purple/20 blur-[60px] rounded-full" />
                    <img 
                        src="https://minecraft.wiki/images/Diamond_Pickaxe_JE3_BE3.png?7409d" 
                        alt="Diamond Pickaxe"
                        className="w-24 h-24 md:w-36 md:h-36 object-contain drop-shadow-[0_15px_40px_rgba(147,51,234,0.4)]"
                    />
                </motion.div>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}