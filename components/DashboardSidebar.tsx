"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Server, Settings, CreditCard, Activity, LogOut, X, Terminal, Cpu, Zap } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { clsx } from 'clsx';
import { useEffect, useState } from 'react';
import { getUserSubscriptions } from '@/app/actions';
import HostBotWidget from './HostBotWidget';

const userRoutes = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'My Servers', href: '/dashboard/servers', icon: Server },
  { name: 'Plan & Billing', href: '/dashboard/plans', icon: CreditCard },
];

export default function DashboardSidebar({ mobileOpen, setMobileOpen }: { mobileOpen?: boolean, setMobileOpen?: (v: boolean) => void }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [hasFlexi, setHasFlexi] = useState(false);

  useEffect(() => {
    if (user) {
      (getUserSubscriptions(user.id) as any).then((subs: any[]) => {
        const flexi = subs.some(s => s.plan?.type === 'flexi');
        setHasFlexi(flexi);
      });
    }
  }, [user]);

  const routes = [...userRoutes];
  if (hasFlexi) {
    routes.push({ name: 'Resource Hub', href: '/dashboard/resources', icon: Zap });
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen?.(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={clsx(
        "fixed top-0 left-0 z-50 h-screen w-72 border-r border-white/5 bg-[#05050A]/80 backdrop-blur-xl transition-transform duration-300 ease-in-out",
        mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="flex flex-col h-full p-8 overflow-y-auto">
          {/* Logo Area */}
          <div className="mb-12 px-2 flex flex-col gap-2">
             <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-blue to-brand-purple flex items-center justify-center text-white shadow-lg shadow-brand-blue/20">
                    <Terminal size={20} />
                </div>
                <span className="text-xl font-black uppercase tracking-tighter text-white">Host Machine</span>
             </Link>
             <Link href="/" className="text-[9px] font-black uppercase tracking-[0.2em] text-transparent bg-clip-text bg-gradient-to-r from-brand-purple to-brand-blue hover:opacity-80 transition-opacity ml-1">
                {'//'} Leave Dashboard
             </Link>
          </div>

          <div className="mb-10">
            <HostBotWidget />
          </div>

          {/* Action Button */}
          <Link href="/servers/new" className="btn-primary !h-12 !px-4 flex items-center justify-center gap-2 mb-10 !rounded-xl text-xs">
            <Zap size={16} /> NEW INSTANCE
          </Link>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 px-2">
            <div className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.3em] mb-6 ml-2">
              User Dashboard
            </div>
            {routes.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-4 px-4 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all duration-300",
                    isActive 
                      ? "bg-brand-blue/10 text-brand-blue border border-brand-blue/20 shadow-lg shadow-brand-blue/5" 
                      : "text-gray-500 hover:text-white hover:bg-white/5"
                  )}
                >
                  <item.icon size={18} className={isActive ? "text-brand-blue" : "text-gray-600"} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Profile Footer */}
          <div className="mt-auto pt-6 border-t border-white/5">
            <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center text-[10px] font-black text-white uppercase">
                {user?.email?.substring(0, 2) || 'US'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-black text-white truncate uppercase tracking-widest">{user?.email?.split('@')[0] || 'User'}</p>
                <div className="flex items-center gap-1 text-[8px] font-bold text-brand-blue uppercase tracking-widest">
                    <span className="w-1 h-1 rounded-full bg-brand-blue animate-pulse" /> Online
                </div>
              </div>
              <button onClick={() => logout()} className="text-gray-500 hover:text-red-400 transition-colors" title="Logout">
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
