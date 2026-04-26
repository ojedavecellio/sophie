"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/ritual", label: "Ritual" },
  { href: "/history", label: "Historial" },
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="border-b border-[var(--color-border)]">
      <div className="mx-auto flex w-full max-w-[640px] items-center justify-between px-6 py-5">
        <Link
          href="/ritual"
          className="font-[family-name:var(--font-libre-caslon-text)] text-[18px] font-normal"
        >
          Sophie
        </Link>

        <nav className="flex items-center gap-6">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-[14px] ${
                  isActive
                    ? "font-medium text-[var(--color-text-primary)]"
                    : "font-normal text-[var(--color-text-secondary)] hover:opacity-90"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
