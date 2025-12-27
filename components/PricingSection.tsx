"use client";

import { useEffect, useState } from 'react';
import { getPlans } from "@/app/actions";
import PlanCard from "./PlanCard";
import { motion } from "framer-motion";
import { Zap, Cpu, Layers } from "lucide-react";

export default function PricingSection() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlans().then(data => {
        setPlans(Array.isArray(data) ? data : []);
        setLoading(false);
    });
  }, []);

  const flexiPlans = plans.filter((p) => !p.name.toLowerCase().includes("minecraft"));
  const fixedPlans = plans.filter((p) => p.name.toLowerCase().includes("minecraft"));

  if (loading) {
      return (
          <div className="container-tight py-24 text-center">
              <div className="w-12 h-12 border-2 border-brand-purple border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500 font-black uppercase tracking-widest text-[10px]">Syncing Fleet Rates...</p>
          </div>
      );
  }

  return (
    <div className="space-y-32 py-24">
      {/* FlexiHost Pricing */}
      <section className="container-tight" id="pricing-flexi">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-purple/10 border border-brand-purple/20 text-brand-purple text-[10px] font-black uppercase tracking-widest">
                <Layers size={14} /> Modular Infrastructure
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">FlexiHost <span className="text-brand-purple">Systems.</span></h2>
            <p className="text-gray-500 text-lg font-medium">Resource-based server blocks with complete game engine flexibility. Deploy any image to your provisioned hardware.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {flexiPlans.map((plan, i) => (
            <motion.div 
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
            >
                <PlanCard 
                    plan={plan} 
                    buttonVariant={plan.price > 15 ? "primary" : "secondary"} 
                />
            </motion.div>
          ))}
        </div>
      </section>

      {/* FixedHost Pricing */}
      <section className="container-tight" id="pricing-fixed">
        <div className="nexus-glass rounded-[3rem] p-8 md:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/10 rounded-full blur-[100px] -z-10" />
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                <div className="max-w-2xl space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-brand-blue text-[10px] font-black uppercase tracking-widest">
                        <Zap size={14} /> Optimized Engines
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter">FixedHost <span className="text-brand-blue">Nodes.</span></h2>
                    <p className="text-gray-500 text-lg font-medium">Game-specific nodes pre-configured for maximum performance and zero-latency throughput.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {fixedPlans.map((plan, i) => (
                    <motion.div 
                        key={plan.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                    >
                        <PlanCard 
                            plan={plan} 
                            buttonVariant="secondary" 
                        />
                    </motion.div>
                ))}
            </div>
        </div>
      </section>
    </div>
  );
}