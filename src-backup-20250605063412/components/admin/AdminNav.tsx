'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, Map, Hotel, Mountain, Image as ImageIcon, Settings, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

export function AdminNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Tours', href: '/admin/tours', icon: Mountain },
    { name: 'Accommodations', href: '/admin/accommodations', icon: Hotel },
    { name: 'Attractions', href: '/admin/attractions', icon: Map },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Media', href: '/admin/media', icon: ImageIcon },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <nav className="flex min-h-screen w-64 flex-col bg-gray-900 p-4 text-white">
      <div className="mb-8 p-4">
        <h1 className="text-2xl font-bold">Nyika Safaris</h1>
        <p className="text-sm text-gray-400">Admin Dashboard</p>
      </div>
      
      <div className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center rounded-lg p-3 transition-colors ${
                    isActive
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      
      <div className="mt-auto border-t border-gray-800 pt-4">
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex w-full items-center rounded-lg p-3 text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </button>
      </div>
    </nav>
  );
}
