"use client";

import { useState, Suspense } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter, useSearchParams } from 'next/navigation';
import { Terminal, ArrowRight, Mail } from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/Header';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      
      // Get the updated state from localStorage since the context might not have finished updating
      const stored = localStorage.getItem('hm_session');
      const user = stored ? JSON.parse(stored) : null;

      if (returnTo) {
          router.push(returnTo);
          return;
      }

      if (user?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      alert('Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05050A] flex flex-col font-sans text-foreground relative overflow-hidden">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-purple/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-blue/10 blur-[120px] rounded-full" />
      </div>

      <Header />

      <main className="flex-1 flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-md space-y-10">
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 shadow-xl mb-4">
                    <Terminal size={32} className="text-brand-purple" />
                </div>
                <h1 className="text-4xl font-black tracking-tighter uppercase">Access Uplink</h1>
                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Secure Authentication Protocol</p>
            </div>

            <div className="glass-card p-10 border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Terminal size={80} />
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Registry Email</label>
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="operator@hostmachine.net"
                                className="w-full h-14 px-6 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-gray-700 focus:outline-none focus:border-brand-purple transition-all font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Security Key</label>
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full h-14 px-6 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-gray-700 focus:outline-none focus:border-brand-purple transition-all font-medium"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="btn-primary w-full h-14 uppercase tracking-[0.2em] text-xs font-black"
                    >
                        {loading ? "Authenticating..." : "ESTABLISH UPLINK"} 
                        {!loading && <ArrowRight size={18} className="ml-2" />}
                    </button>
                </form>
            </div>

            <div className="text-center">
                <Link 
                    href={returnTo ? `/signup?returnTo=${encodeURIComponent(returnTo)}` : "/signup"}
                    className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-brand-purple transition-colors"
                >
                    New operator? Initialize sign up
                </Link>
            </div>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#05050A] flex items-center justify-center text-white">Loading Interface...</div>}>
      <LoginForm />
    </Suspense>
  );
}