"use client";

import { subscribeToPlan } from "@/app/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Check, ArrowRight, Zap, ShieldCheck, Cpu, Layers } from "lucide-react";
import { clsx } from "clsx";

interface PlanProps {
  plan: {
    id: string;
    name: string;
    description: string;
    price: number;
    ramMb: number;
    cpuCores: number;
  };
  buttonVariant?: "primary" | "secondary";
  hideButton?: boolean;
}

export default function PlanCard({ plan, buttonVariant = "primary", hideButton = false }: PlanProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const isFixed = plan.name.toLowerCase().includes("minecraft");

  const handleSubscribe = async () => {
    if (!user) {
      router.push(`/signup?redirect=plan&planId=${plan.id}`);
      return;
    }

    setLoading(true);
    try {
      const result: any = await subscribeToPlan(user.id, plan.id);
      if (result.status === 'success') {
         const gameId = isFixed ? 'minecraft-java' : '';
         router.push(`/servers/new?planId=${plan.id}&subId=${result.subscriptionId}${gameId ? `&gameId=${gameId}` : ''}`);
      } else {
        alert("Provisioning failed: " + result.message);
      }
    } catch (err) {
      console.error(err);
      alert("Host Machine connection lost. Retrying...");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={clsx(
        "glass-card p-10 flex flex-col relative overflow-hidden group hover:scale-[1.02] transition-all duration-500",
        buttonVariant === 'primary' ? "border-brand-purple/40 bg-brand-purple/5" : "border-white/5"
    )}>
      {buttonVariant === 'primary' && (
          <div className="absolute top-0 right-0 p-6">
              <span className="bg-brand-purple text-white text-[8px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full shadow-lg">Recommended</span>
          </div>
      )}

      <div className="mb-10">
        <div className="flex items-center gap-4 mb-6">
            <div className={clsx(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg",
                buttonVariant === 'primary' ? "bg-brand-purple text-white shadow-brand-purple/20" : "bg-white/5 text-gray-500"
            )}>
                <Zap size={24} />
            </div>
            <h3 className="text-2xl font-black uppercase tracking-tighter text-white">{plan.name}</h3>
        </div>
        
        <div className="flex items-baseline gap-1">
          <span className="text-5xl font-black text-white tracking-tighter">${plan.price}</span>
          <span className="text-gray-500 text-xs font-bold uppercase tracking-widest ml-2">/ month</span>
        </div>
        <p className="text-gray-400 text-sm mt-6 font-medium leading-relaxed">{plan.description}</p>
      </div>

      <div className="space-y-4 mb-12 flex-1">
        {[
            { label: `${plan.ramMb / 1024}GB Dedicated RAM`, icon: <Layers size={14} /> },
            { label: `${plan.cpuCores} vCPU Priority Cores`, icon: <Cpu size={14} /> },
            { label: "Unlimited Player Slots", icon: <Check size={14} /> },
            { label: "NVMe Storage Block", icon: <Zap size={14} /> }
        ].map((feat, i) => (
            <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-brand-purple">
                    {feat.icon}
                </div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{feat.label}</span>
            </div>
        ))}
      </div>

      {!hideButton && (
        <button
            className={clsx(
                "w-full h-14 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-2 group/btn",
                buttonVariant === 'primary' 
                    ? "btn-primary" 
                    : "btn-secondary"
            )}
            onClick={handleSubscribe}
            disabled={loading}
        >
            {loading ? "Initializing..." : user ? "Deploy Module" : "Get Started"} 
            <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
        </button>
      )}

      <div className="mt-8 flex items-center justify-center gap-2 text-[8px] font-black text-gray-700 uppercase tracking-widest italic">
          <ShieldCheck size={12} /> Australian Infrastructure Security Locked
      </div>
    </div>
  );
}