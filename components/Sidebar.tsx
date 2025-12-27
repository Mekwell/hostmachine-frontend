"use client";

import { Home, Server, Settings, Activity } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';

const navItems = [
  { name: 'Overview', href: '/admin', icon: Home },
  { name: 'Nodes', href: '/admin/nodes', icon: Activity },
  { name: 'Plans', href: '/admin/plans', icon: Settings },
  { name: 'Servers', href: '/admin/servers', icon: Server },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-border bg-card z-50 flex flex-col hidden md:flex">
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          HOSTMACHINE
        </h1>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive 
                  ? "bg-secondary text-foreground" 
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              )}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
