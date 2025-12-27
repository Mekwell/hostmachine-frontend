"use client";

import { Check, X, Server, Layers } from "lucide-react";

export default function HostingComparison() {
    return (
        <section id="comparison" className="py-24">
            <div className="container-main">
                <div className="text-center mb-16">
                    <h2 className="text-sm font-bold tracking-[0.3em] text-gray-500 uppercase mb-4">Deployment Models</h2>
                    <p className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">Fixed vs Flexi Plans.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Fixed Plan */}
                    <div className="glass-card p-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-10">
                            <Server size={120} />
                        </div>
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-brand-purple/20 flex items-center justify-center text-brand-purple mb-6">
                                <Server size={24} />
                            </div>
                            <h3 className="text-2xl font-black uppercase mb-4 text-white">Fixed Modules</h3>
                            <p className="text-gray-400 text-sm mb-8">Perfect for single community servers with dedicated resources.</p>
                            
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-sm font-medium">
                                    <Check size={18} className="text-green-500" /> Dedicated RAM & CPU
                                </li>
                                <li className="flex items-center gap-3 text-sm font-medium">
                                    <Check size={18} className="text-green-500" /> Single Instance Deploy
                                </li>
                                <li className="flex items-center gap-3 text-sm font-medium">
                                    <Check size={18} className="text-green-500" /> Instant Setup
                                </li>
                                <li className="flex items-center gap-3 text-sm font-medium text-gray-600">
                                    <X size={18} /> Multi-Instance Sharding
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Flexi Plan */}
                    <div className="glass-card p-10 border-brand-purple/30 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-6 opacity-10">
                            <Layers size={120} />
                        </div>
                        <div className="absolute inset-0 bg-brand-purple/5 pointer-events-none" />
                        <div className="relative z-10">
                            <div className="w-12 h-12 rounded-xl bg-brand-blue/20 flex items-center justify-center text-brand-blue mb-6">
                                <Layers size={24} />
                            </div>
                            <h3 className="text-2xl font-black uppercase mb-4 text-white text-gradient">Flexi Resource Pools</h3>
                            <p className="text-gray-400 text-sm mb-8">Buy a block of resources and deploy as many instances as you need.</p>
                            
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-sm font-medium">
                                    <Check size={18} className="text-green-500" /> Shared Resource Pool
                                </li>
                                <li className="flex items-center gap-3 text-sm font-medium">
                                    <Check size={18} className="text-green-500" /> Unlimited Instances
                                </li>
                                <li className="flex items-center gap-3 text-sm font-medium">
                                    <Check size={18} className="text-green-500" /> Dynamic Resizing
                                </li>
                                <li className="flex items-center gap-3 text-sm font-medium">
                                    <Check size={18} className="text-green-500" /> API Access
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}