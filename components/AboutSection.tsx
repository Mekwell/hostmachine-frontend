"use client";

import { motion } from 'framer-motion';
import { Rocket, ShieldCheck, Heart } from 'lucide-react';

export default function AboutSection() {
  return (
    <section className="container-tight py-32">
      <div className="nexus-glass rounded-[3.5rem] p-12 md:p-24 relative overflow-hidden border-white/5">
        <div className="absolute top-[-20%] left-[-10%] w-[40rem] h-[40rem] bg-brand-purple/5 rounded-full blur-[120px] -z-10" />
        
        <div className="max-w-3xl space-y-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 text-brand-purple font-black uppercase tracking-[0.3em] text-[10px]">
                <Heart size={14} /> Mission Statement
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none">
              BUILT BY PLAYERS, <br />
              FOR THE <span className="text-brand-purple">COMMUNITY.</span>
            </h2>
          </div>

          <p className="text-gray-400 text-xl font-medium leading-relaxed">
            Host Machine wasn't born in a boardroom. It was forged in the heat of competitive play, 
            where every millisecond of latency is the difference between victory and defeat. 
            We provide the hardware, you provide the skill.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
            <div className="space-y-2">
                <h4 className="text-white font-black uppercase tracking-widest text-xs flex items-center gap-2">
                    <Rocket size={16} className="text-brand-purple" /> Maximum Velocity
                </h4>
                <p className="text-gray-500 text-sm font-medium">Australia-wide routing for the lowest possible AU pings.</p>
            </div>
            <div className="space-y-2">
                <h4 className="text-white font-black uppercase tracking-widest text-xs flex items-center gap-2">
                    <ShieldCheck size={16} className="text-brand-blue" /> Ironclad Security
                </h4>
                <p className="text-gray-500 text-sm font-medium">Automatic mitigation of DDoS attacks at the network edge.</p>
            </div>
          </div>
        </div>

        {/* Branding Decoration */}
        <div className="absolute bottom-[-10%] right-[-5%] opacity-10 pointer-events-none select-none hidden lg:block">
            <span className="text-[20rem] font-black tracking-tighter text-white">HM</span>
        </div>
      </div>
    </section>
  );
}