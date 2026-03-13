"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Home, Lightbulb } from "lucide-react";

const links = [
  { href: "/", label: "Сегодня", icon: Home },
  { href: "/calendar", label: "Календарь", icon: CalendarDays },
  { href: "/inspirations", label: "Вдохновение", icon: Lightbulb },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--border)] bg-[var(--bg)] md:static md:border-r md:border-t-0 md:w-56 md:min-h-screen md:pt-6">
      <div className="hidden md:block px-5 pb-6">
        <h1 className="text-lg font-bold tracking-tight">🇫🇷 French Super</h1>
        <p className="text-xs text-[var(--text-muted)] mt-1">Marketing Hub</p>
      </div>
      <div className="flex md:flex-col">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-5 py-3 flex-1 md:flex-none text-sm transition-colors ${
                active
                  ? "text-[var(--accent-light)] bg-[var(--accent)]/10"
                  : "text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--card)]"
              }`}
            >
              <Icon size={18} />
              <span className="hidden md:inline">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
