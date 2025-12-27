"use client";

import Link from "next/link";
import { ChevronRight, Play } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
      <div className="container-main text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold tracking-widest uppercase text-brand-purple mb-8">
            <span className="w-2 h-2 rounded-full bg-brand-purple animate-pulse" />
            Australian Infrastructure Online
        </div>
        
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
            PREMIUM GAME <br />
            <span className="text-gradient">SERVER HOSTING.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed italic">
            Australia Game Hosting solutions, For the everyday gamer.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/store" className="btn-primary flex items-center gap-2 w-full sm:w-auto">
                GET STARTED <ChevronRight size={20} />
            </Link>
            <Link href="/#plans" className="btn-secondary flex items-center gap-2 w-full sm:w-auto">
                VIEW PLANS <Play size={16} fill="currentColor" />
            </Link>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-purple/20 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-blue/20 blur-[120px] rounded-full animate-pulse" />
      </div>
    </section>
  );
}