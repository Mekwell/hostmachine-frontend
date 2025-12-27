"use client";

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { LogOut, Terminal, Server, Menu, X, Rocket, LayoutDashboard, ShoppingBag, BookOpen, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 py-6">
      <nav className="container-main flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-2">
          <span className="text-2xl font-black tracking-tighter text-gradient group-hover:scale-105 transition-transform duration-300">
            HOSTMACHINE
          </span>
        </Link>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link href="/servers/new" className="btn-primary !h-11 !px-6 !py-0 flex items-center gap-2 text-xs font-black uppercase tracking-widest hidden md:flex">
            Deploy Server <Rocket size={14} />
          </Link>

          <div className="relative">
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="btn-secondary !h-11 !px-5 !py-0 flex items-center gap-2 text-xs font-black uppercase tracking-widest"
            >
              {menuOpen ? <X size={16} /> : <Menu size={16} />}
              <span>Menu</span>
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-4 w-64 bg-[#0A0A1A]/90 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-3 shadow-2xl"
                >
                  <div className="flex flex-col gap-1">
                    <DropdownLink href="/" label="Home" icon={<Terminal size={14} />} onClick={() => setMenuOpen(false)} />
                    <DropdownLink href="/store" label="Store" icon={<ShoppingBag size={14} />} onClick={() => setMenuOpen(false)} />
                    <DropdownLink href="/docs" label="Manuals" icon={<BookOpen size={14} />} onClick={() => setMenuOpen(false)} />
                    
                    <div className="h-px bg-white/5 my-2" />
                    
                    {user ? (
                      <>
                        <DropdownLink 
                            href="/dashboard" 
                            label="Control Center" 
                            icon={<LayoutDashboard size={14} />} 
                            onClick={() => setMenuOpen(false)} 
                        />
                        {user.role === 'admin' && (
                          <DropdownLink 
                              href="/admin" 
                              label="Admin Interface" 
                              icon={<ShieldCheck size={14} className="text-brand-purple" />} 
                              onClick={() => setMenuOpen(false)} 
                          />
                        )}
                        <button 
                          onClick={() => { logout(); setMenuOpen(false); }}
                          className="w-full text-left px-4 py-3 text-xs font-bold text-red-400 hover:bg-red-500/10 rounded-xl transition-all flex items-center gap-3 uppercase tracking-widest"
                        >
                          <LogOut size={14} /> Disconnect
                        </button>
                      </>
                    ) : (
                      <>
                        <DropdownLink href="/login" label="Login" icon={<Server size={14} />} onClick={() => setMenuOpen(false)} />
                        <DropdownLink href="/signup" label="Sign Up" icon={<Rocket size={14} />} onClick={() => setMenuOpen(false)} />
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>
    </header>
  );
}

function DropdownLink({ href, label, icon, onClick }: { href: string, label: string, icon: React.ReactNode, onClick: () => void }) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3.5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all"
    >
      {icon}
      {label}
    </Link>
  );
}