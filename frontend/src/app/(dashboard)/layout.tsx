/** Dashboard layout with responsive sidebar navigation. */

"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  FileText,
  Home,
  LogOut,
  Menu,
  Settings,
  Shield,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";

import { useAuthStore } from "@/stores/auth-store";
import { cn } from "@/lib/utils";
import type { User } from "@/types";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/simulator", label: "Future Simulator", icon: TrendingUp },
  { href: "/reality-check", label: "Reality Check", icon: Shield },
  { href: "/mind-mirror", label: "Mind Mirror", icon: Brain },
  { href: "/reports", label: "Reports", icon: FileText },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading, hydrate, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-[var(--surface-3)] border-t-[var(--accent-1)] rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-[var(--border-subtle)] bg-[var(--surface-1)] p-4 sticky top-0 h-screen">
        <SidebarContent
          pathname={pathname}
          user={user}
          onLogout={handleLogout}
        />
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 glass-strong border-b border-[var(--border-subtle)]">
        <div className="flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[var(--accent-1)]" />
            <span className="font-semibold text-sm">Tomorrow Me</span>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-[var(--surface-2)] rounded-lg"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-72 z-50 bg-[var(--surface-1)] border-r border-[var(--border-subtle)] p-4"
            >
              <SidebarContent
                pathname={pathname}
                user={user}
                onLogout={handleLogout}
                onNavigate={() => setSidebarOpen(false)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 lg:p-8 p-4 pt-18 lg:pt-8 overflow-x-hidden">
        <div className="max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}

/* ===== Sidebar Content ===== */
function SidebarContent({
  pathname,
  user,
  onLogout,
  onNavigate,
}: {
  pathname: string;
  user: User | null;
  onLogout: () => void;
  onNavigate?: () => void;
}) {
  return (
    <>
      {/* Logo */}
      <Link
        href="/dashboard"
        className="flex items-center gap-2 px-3 py-2 mb-6"
        onClick={onNavigate}
      >
        <Sparkles className="w-5 h-5 text-[var(--accent-1)]" />
        <span className="font-semibold">Tomorrow Me</span>
      </Link>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "bg-[var(--accent-1)]/10 text-[var(--accent-1)]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)]"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-[var(--accent-1)]"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Info + Logout */}
      <div className="border-t border-[var(--border-subtle)] pt-4 mt-4">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-[var(--accent-1)]/20 flex items-center justify-center text-sm font-medium text-[var(--accent-1)]">
            {user?.full_name?.[0] || user?.username?.[0] || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.full_name || user?.username}
            </p>
            <p className="text-xs text-[var(--text-tertiary)] truncate">
              {user?.email}
            </p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-[var(--text-secondary)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/10 transition-all w-full"
        >
          <LogOut className="w-4 h-4" />
          Sign out
        </button>
      </div>
    </>
  );
}
