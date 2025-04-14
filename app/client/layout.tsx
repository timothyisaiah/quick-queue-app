'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { LogOut, CalendarCheck, PlusCircle, Menu } from 'lucide-react';
import {cn} from '@/lib/utils/cn';
import { signOut } from 'next-auth/react';

const navLinks = [
  {
    href: '/client/appointments',
    label: 'My Appointments',
    icon: CalendarCheck,
  },
  {
    href: '/client/book',
    label: 'Book Appointment',
    icon: PlusCircle,
  },
];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [expanded, setExpanded] = useState(true);

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900 text-white">
      {/* Sidebar */}
      <aside
        className={cn(
          'transition-all duration-300 bg-gray-800 p-4 flex flex-col gap-6 h-screen',
          expanded ? 'w-64' : 'w-20 items-center'
        )}
      >
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="text-white hover:text-gray-400"
        >
          <Menu />
        </button>

        <nav className="flex flex-col gap-4 mt-4 w-full">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-4 px-4 py-2 rounded-md transition w-full',
                pathname === href
                  ? 'bg-white text-gray-900 font-semibold'
                  : 'text-white hover:bg-gray-700'
              )}
            >
              <Icon className="w-5 h-5" />
              {expanded && <span>{label}</span>}
            </Link>
          ))}
        </nav>

        <button
          onClick={handleSignOut}
          className="mt-auto flex items-center gap-4 px-4 py-2 rounded-md transition w-full text-white hover:bg-red-600"
        >
          <LogOut className="w-5 h-5" />
          {expanded && <span>Sign Out</span>}
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}