"use client";

import { ReactNode, useState } from "react";
import { Menu, CalendarDays, Clock, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname,useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

type Props = {
  children: ReactNode;
};

export default function ProviderLayout({ children }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    {
      label: "Availability",
      href: "/provider/dashboard?tab=availability",
      icon: <CalendarDays size={18} />,
    },
    {
      label: "Appointments",
      href: "/provider/dashboard?tab=appointments",
      icon: <Clock size={18} />,
    },
  ];
  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/login');
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={`bg-gray-800 text-white transition-all duration-300 ease-in-out ${
          collapsed ? "w-16" : "w-56"
        }`}
      >
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
          <span className="text-lg font-bold">
            {!collapsed && "QuickQueue"}
          </span>
          <button onClick={() => setCollapsed(!collapsed)}>
            <Menu size={20} />
          </button>
        </div>

        <nav className="mt-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname.includes(
              item.href.split("?")[1]?.split("=")[1] || ""
            );
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-2 text-sm hover:bg-gray-700 ${
                  isActive ? "bg-gray-700" : ""
                }`}
              >
                {item.icon}
                {!collapsed && <span className="ml-3">{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        <button
          onClick={handleSignOut}
          className="mt-auto flex items-center gap-4 px-4 py-2 rounded-md transition w-full text-white hover:bg-red-600"
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  );
}
