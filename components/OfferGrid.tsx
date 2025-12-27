"use client";

import { Zap, ShieldCheck, Cpu, Globe, Headphones, HardDrive } from "lucide-react";

const OFFERS = [
    {
        icon: <Zap className="text-brand-purple" />,
        title: "Instant Provisioning",
        desc: "Automated deployment within 60 seconds of purchase."
    },
    {
        icon: <ShieldCheck className="text-brand-blue" />,
        title: "DDoS Mitigation",
        desc: "Advanced L7 protection included with every node."
    },
    {
        icon: <Cpu className="text-brand-purple" />,
        title: "Enterprise Hardware",
        desc: "Ryzen 9 7950X / Intel Gold dedicated processing."
    },
    {
        icon: <Globe className="text-brand-blue" />,
        title: "Global Network",
        desc: "Low-latency uplinks via our custom mesh VPN."
    },
    {
        icon: <Headphones className="text-brand-purple" />,
        title: "Expert Support",
        desc: "24/7 technical assistance from gamers who care."
    },
    {
        icon: <HardDrive className="text-brand-blue" />,
        title: "NVMe Storage",
        desc: "Pure Gen4 NVMe arrays for zero disk-wait times."
    }
];

export default function OfferGrid() {
    return (
        <section className="py-24">
            <div className="container-main">
                <div className="text-center mb-16">
                    <h2 className="text-sm font-bold tracking-[0.3em] text-gray-500 uppercase mb-4">Infrastructure Specs</h2>
                    <p className="text-4xl md:text-5xl font-black uppercase tracking-tighter">Engineered for Performance.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {OFFERS.map((offer, i) => (
                        <div key={i} className="glass-card p-10 hover:border-white/20 transition-all group">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                {offer.icon}
                            </div>
                            <h3 className="text-xl font-bold uppercase tracking-tight mb-3 text-white">{offer.title}</h3>
                            <p className="text-gray-400 leading-relaxed text-sm">{offer.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
