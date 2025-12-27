"use client";

import { useEffect, useState } from 'react';
import { getPlans, getUserSubscriptions, subscribeToPlan } from "@/app/actions";
import PlanCard from "@/components/PlanCard";
import { useAuth } from "@/lib/auth-context";
import { CreditCard, Zap, Layers, CheckCircle2, AlertTriangle } from "lucide-react";
import { clsx } from 'clsx';

export default function UserPlansPage() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<any[]>([]);
  const [subs, setSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
        const [planData, subData] = await Promise.all([
            getPlans(),
            getUserSubscriptions(user.id)
        ]);
        setPlans(Array.isArray(planData) ? planData : []);
        setSubs(Array.isArray(subData) ? subData : []);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const activeSub = subs.find(s => s.status === 'ACTIVE');
  const activePlanId = activeSub?.plan?.id;

  const handleUpgrade = async (planId: string) => {
      if (!user) return;
      if (planId === activePlanId) return;
      
      setProcessingId(planId);
      try {
          await subscribeToPlan(user.id, planId);
          await loadData();
          alert('Subscription updated successfully!');
      } catch (err) {
          alert('Failed to update subscription.');
      } finally {
          setProcessingId(null);
      }
  };

  if (loading) {
      return <div className="p-20 text-center animate-pulse text-gray-500 font-bold uppercase tracking-widest">Accessing billing records...</div>;
  }

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">Plan & <span className="text-brand-blue">Billing.</span></h1>
          <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-1">Subscription Management Interface</p>
        </div>
        <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4">
            <div className="w-10 h-10 rounded-xl bg-brand-blue/20 flex items-center justify-center text-brand-blue">
                <CreditCard size={20} />
            </div>
            <div>
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Active Method</p>
                <p className="text-sm font-bold text-white tracking-tighter uppercase">Visa •••• 4242</p>
            </div>
        </div>
      </div>

      {activeSub ? (
          <div className="glass-card p-8 border-brand-blue/30 bg-brand-blue/5 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-brand-blue/20 flex items-center justify-center text-brand-blue shadow-xl shadow-brand-blue/10">
                      <CheckCircle2 size={32} />
                  </div>
                  <div>
                      <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded bg-brand-blue/20 text-brand-blue text-[8px] font-black uppercase tracking-widest mb-2">Active Subscription</div>
                      <h2 className="text-2xl font-black text-white uppercase tracking-tighter">{activeSub.plan?.name}</h2>
                      <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Renews on Jan 22, 2026</p>
                  </div>
              </div>
              <div className="flex items-center gap-12">
                  <div className="text-center">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Price</p>
                      <p className="text-2xl font-black text-white tracking-tighter">${activeSub.plan?.price}<span className="text-sm text-gray-600">/mo</span></p>
                  </div>
                  <div className="text-center">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Resources</p>
                      <p className="text-2xl font-black text-white tracking-tighter">{activeSub.plan?.ramMb / 1024}GB <span className="text-sm text-gray-600">RAM</span></p>
                  </div>
              </div>
          </div>
      ) : (
          <div className="glass-card p-8 border-yellow-500/20 bg-yellow-500/5 flex items-center gap-6">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center text-yellow-500">
                  <AlertTriangle size={24} />
              </div>
              <div>
                  <h3 className="text-lg font-bold text-white">No Active Plan</h3>
                  <p className="text-gray-400 text-sm">Select a plan below to activate your infrastructure.</p>
              </div>
          </div>
      )}

      <div className="space-y-16">
        <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                <Layers size={20} className="text-brand-purple" /> FlexiHost Tiers
            </h2>
            <p className="text-gray-500 text-sm mt-1 mb-8 font-medium">Global resource pools for dynamic module deployment.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.filter(p => p.type === 'flexi').map(plan => (
                    <div key={plan.id} className="relative">
                        <PlanCard 
                            plan={plan} 
                            buttonVariant={plan.id === activePlanId ? "secondary" : "primary"}
                            hideButton={plan.id === activePlanId}
                        />
                        {plan.id !== activePlanId && (
                            <button 
                                onClick={() => handleUpgrade(plan.id)}
                                disabled={processingId !== null}
                                className="absolute bottom-10 left-10 right-10 btn-primary !h-12 text-xs font-black uppercase tracking-widest"
                            >
                                {processingId === plan.id ? 'Processing...' : 'Switch to this plan'}
                            </button>
                        )}
                        {plan.id === activePlanId && (
                            <div className="absolute bottom-10 left-10 right-10 py-3 text-center border border-brand-blue/30 rounded-xl text-brand-blue text-[10px] font-black uppercase tracking-[0.2em] bg-brand-blue/5">
                                Current Allocation
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>

        <div>
            <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                <Zap size={20} className="text-brand-blue" /> FixedHost Nodes
            </h2>
            <p className="text-gray-500 text-sm mt-1 mb-8 font-medium">Optimized single-engine game server instances.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {plans.filter(p => p.type === 'fixed').map(plan => (
                    <div key={plan.id} className="relative">
                        <PlanCard 
                            plan={plan} 
                            buttonVariant="secondary"
                            hideButton={plan.id === activePlanId}
                        />
                        {plan.id !== activePlanId && (
                            <button 
                                onClick={() => handleUpgrade(plan.id)}
                                disabled={processingId !== null}
                                className="absolute bottom-10 left-10 right-10 btn-secondary !h-12 text-xs font-black uppercase tracking-widest"
                            >
                                {processingId === plan.id ? 'Processing...' : 'Select Plan'}
                            </button>
                        )}
                        {plan.id === activePlanId && (
                            <div className="absolute bottom-10 left-10 right-10 py-3 text-center border border-brand-blue/30 rounded-xl text-brand-blue text-[10px] font-black uppercase tracking-[0.2em] bg-brand-blue/5">
                                Current Active Node
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
