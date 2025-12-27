"use client";

import { useState, useEffect } from 'react';
import AdminSidebar from "@/components/AdminSidebar";
import { Menu, Bell, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
        router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading || (!user || user.role !== 'admin')) {
      return null;
  }

  return (
    <div className="min-h-screen bg-[#05050A] relative overflow-hidden">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-purple/10 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-blue/10 blur-[120px] rounded-full" />
      </div>

      <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      
      <main className="md:pl-72 min-h-screen">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-20 px-8 border-b border-white/5 bg-[#05050A]/40 backdrop-blur-xl">
            <div className="flex items-center gap-4 flex-1">
                <button 
                    onClick={() => setMobileOpen(true)}
                    className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
                >
                    <Menu size={24} />
                </button>
                
                <div className="hidden md:flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2 w-96 group focus-within:border-brand-purple/50 transition-all">
                    <Search size={16} className="text-gray-500 group-focus-within:text-brand-purple" />
                    <input type="text" placeholder="Search systems..." className="bg-transparent border-none outline-none text-sm text-white w-full" />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-all relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-brand-purple rounded-full border-2 border-[#05050A]" />
                </button>
            </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}