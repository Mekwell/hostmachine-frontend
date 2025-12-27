"use client";

import { useEffect, useState } from 'react';
import { Bot, Shield, CheckCircle, AlertTriangle, Zap } from 'lucide-react';
import { clsx } from 'clsx';

export default function HostBotWidget() {
  const [status, setStatus] = useState<'nominal' | 'active' | 'alert'>('nominal');
  const [lastAction, setLastAction] = useState<string | null>(null);

  // In a real app, we'd fetch this from the /tickets or /ai/status endpoint
  // For now, we simulate a "live" feel
  useEffect(() => {
      const interval = setInterval(() => {
          // Randomly show "Analyzing" to look alive
          if (Math.random() > 0.95) {
              setStatus('active');
              setLastAction('Optimizing network routes...');
              setTimeout(() => setStatus('nominal'), 3000);
          }
      }, 10000);
      return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-card p-4 border-brand-blue/20 bg-brand-blue/5 overflow-hidden relative">
        <div className="absolute -right-4 -top-4 text-brand-blue/10">
            <Bot size={80} />
        </div>
        
        <div className="relative z-10 flex items-center gap-4">
            <div className={clsx(
                "w-10 h-10 rounded-full flex items-center justify-center shadow-lg",
                status === 'nominal' ? "bg-green-500/20 text-green-400" : 
                status === 'active' ? "bg-brand-blue/20 text-brand-blue animate-pulse" :
                "bg-red-500/20 text-red-400"
            )}>
                {status === 'nominal' ? <Shield size={20} /> : <Bot size={20} />}
            </div>
            
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-white">HostBot Intelligence</h4>
                    <span className={clsx(
                        "text-[8px] font-black uppercase px-2 py-0.5 rounded-full border",
                        status === 'nominal' ? "border-green-500/30 text-green-400" : "border-brand-blue/30 text-brand-blue"
                    )}>
                        {status}
                    </span>
                </div>
                <p className="text-[9px] text-gray-500 font-bold mt-1 uppercase tracking-tighter">
                    {lastAction || 'All systems operating within parameters.'}
                </p>
            </div>
        </div>
    </div>
  );
}
