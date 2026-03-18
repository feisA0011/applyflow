"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  FileText,
  Send,
  BarChart2,
  MessageSquare,
  Linkedin,
  Globe,
  TrendingUp,
  Settings,
  Menu,
  X,
  Bot,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/home", icon: LayoutDashboard },
  { label: "Master CV", href: "/cv", icon: FileText },
  { label: "Apply", href: "/apply", icon: Send },
  { label: "Tracker", href: "/tracker", icon: BarChart2 },
  { label: "Interviews", href: "/interviews", icon: MessageSquare },
  { label: "LinkedIn", href: "/linkedin", icon: Linkedin },
  { label: "Portfolio", href: "/portfolio", icon: Globe },
  { label: "Career", href: "/career", icon: TrendingUp },
  { label: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const NavContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-5 border-b border-[#EDEAE4]">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#0D9488]">
          <Bot className="h-4 w-4 text-white" />
        </div>
        <span
          className="text-lg font-semibold text-[#1C1917] tracking-tight"
          style={{ fontFamily: "var(--font-fraunces), Georgia, serif" }}
        >
          ApplyFlow
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 space-y-0.5 px-2 py-4">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || (href !== "/home" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-[#CCFBF1] text-[#0D9488]"
                  : "text-[#57534E] hover:bg-[#EDEAE4] hover:text-[#1C1917]"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  isActive ? "text-[#0D9488]" : "text-[#A8A29E]"
                )}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User section */}
      <div className="border-t border-[#EDEAE4] p-3">
        <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-[#EDEAE4] transition-colors cursor-pointer">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0D9488]/10 text-[#0D9488] text-sm font-semibold">
            JD
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-[#1C1917]">
              Jane Doe
            </p>
            <p className="truncate text-xs text-[#A8A29E]">Free plan</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 shrink-0 flex-col border-r border-[#EDEAE4] bg-[#F5F3EF] h-screen sticky top-0">
        <NavContent />
      </aside>

      {/* Mobile hamburger */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          className="fixed top-4 left-4 z-40 flex h-9 w-9 items-center justify-center rounded-lg bg-[#F5F3EF] border border-[#EDEAE4] shadow-sm text-[#57534E] hover:text-[#1C1917] transition-colors"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-[#1C1917]/30 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Mobile drawer */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 bg-[#F5F3EF] border-r border-[#EDEAE4] transform transition-transform duration-200 ease-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <button
            onClick={() => setMobileOpen(false)}
            className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-lg text-[#57534E] hover:bg-[#EDEAE4] transition-colors"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
          <NavContent />
        </aside>
      </div>
    </>
  );
}
