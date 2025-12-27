"use client";

import Header from '@/components/Header';
import { Book, Shield, Zap, Terminal, Activity, FileText } from 'lucide-react';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-[#05050A] flex flex-col relative overflow-hidden">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-purple/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-blue/10 blur-[120px] rounded-full" />
      </div>

      <Header />

      <main className="flex-1 container-main py-32 space-y-16 relative z-10">
        <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                <Book size={14} /> Knowledge Base
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9]">
                System <span className="text-gradient">Manuals.</span>
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed font-medium">
                Everything you need to operate, scale, and secure your high-performance game infrastructure.
            </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <DocCard 
                icon={<Zap className="text-brand-purple" />}
                title="Getting Started"
                description="Initialize your first module and establish a connection to the Australian tier-3 grid."
            />
            <DocCard 
                icon={<Activity className="text-brand-blue" />}
                title="Resource Hub"
                description="Learn how to manage dynamic RAM allocation for modular FlexiHost subscriptions."
            />
            <DocCard 
                icon={<Shield className="text-green-500" />}
                title="Security Protocol"
                description="Hardening your instances and managing SFTP access credentials."
            />
            <DocCard 
                icon={<Terminal className="text-orange-500" />}
                title="CLI Commands"
                description="Direct interaction with the Host Machine agent for advanced operations."
            />
            <DocCard 
                icon={<FileText className="text-gray-400" />}
                title="API Specification"
                description="Build custom integrations with our high-performance control plane."
            />
        </div>

        <div className="glass-card p-12 text-center rounded-[3rem] border-white/5">
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Need Tactical Support?</h3>
            <p className="text-gray-500 mb-8 max-w-xl mx-auto">Our infrastructure operators are available 24/7 for emergency deployments and node maintenance.</p>
            <button className="btn-secondary !h-14 !px-10 uppercase tracking-widest font-black text-xs">Contact Headquarters</button>
        </div>
      </main>
    </div>
  );
}

function DocCard({ icon, title, description }: any) {
    return (
        <div className="glass-card p-8 rounded-3xl border-white/5 hover:border-white/20 transition-all group">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">{title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
        </div>
    );
}
