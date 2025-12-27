"use client";

import { useState, Suspense } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Terminal, ArrowRight, Mail, Rocket } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';

function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const { register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(email, password);
      if (returnTo) {
          // If returnTo is present, we still might show sent screen or redirect?
          // For now, let's just show Sent screen to force verification.
          // Or if we want auto-login behavior (if implemented in backend register), we could redirect.
          // But backend currently just sends email. So 'Sent' screen is correct.
          setSent(true);
      } else {
          setSent(true);
      }
    } catch (err: any) {
      alert(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05050A] flex flex-col font-sans text-foreground relative overflow-hidden">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-purple/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-blue/10 blur-[120px] rounded-full" />
      </div>

      <Header />

      <main className="flex-1 flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-md space-y-10">
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 shadow-xl mb-4">
                    <Rocket size={32} className="text-brand-blue" />
                </div>
                <h1 className="text-4xl font-black tracking-tighter uppercase">Initialize Sign Up</h1>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Join the High-Performance Fleet</p>
            </div>

            <div className="glass-card p-10 border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Rocket size={80} />
                </div>

                {sent ? (
                    <div className="text-center space-y-6">
                        <div className="w-16 h-16 rounded-full bg-brand-blue/20 flex items-center justify-center mx-auto">
                            <Mail className="text-brand-blue" size={32} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold uppercase tracking-tight">Transmission Sent</h3>
                            <p className="text-sm text-gray-400 mt-2 leading-relaxed">Secure verification link transmitted to <br/> <span className="text-white font-mono">{email}</span></p>
                        </div>
                        <button onClick={() => setSent(false)} className="text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest">
                            Try another address
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Registry Email</label>
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="operator@hostmachine.net"
                                className="w-full h-14 px-6 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-gray-700 focus:outline-none focus:border-brand-blue transition-all font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Secure Password</label>
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full h-14 px-6 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-gray-700 focus:outline-none focus:border-brand-blue transition-all font-medium"
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="btn-primary w-full h-14 uppercase tracking-[0.2em] text-xs font-black !from-brand-blue !to-brand-purple"
                        >
                            {loading ? "Processing..." : "INITIATE SESSION"} 
                            {!loading && <ArrowRight size={18} className="ml-2" />}
                        </button>
                    </form>
                )}
            </div>

            <div className="text-center">
                <Link 
                    href={returnTo ? `/login?returnTo=${encodeURIComponent(returnTo)}` : "/login"}
                    className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-brand-blue transition-colors"
                >
                    Already an operator? Access the bridge
                </Link>
            </div>
        </div>
      </main>
    </div>
  );
}
export default function SignupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#05050A] flex items-center justify-center text-white">Loading Interface...</div>}>
      <SignupForm />
    </Suspense>
  );
}