/** Settings page — profile and preferences. */

"use client";

import { Settings as SettingsIcon, User, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/shared/glass-card";
import { PageTransition } from "@/components/shared/page-transition";
import { useAuthStore } from "@/stores/auth-store";

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <PageTransition>
      <div className="flex flex-col gap-6 max-w-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-500/10 text-zinc-400 flex items-center justify-center">
            <SettingsIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Manage your account
            </p>
          </div>
        </div>

        {/* Profile Card */}
        <GlassCard hover={false} className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[var(--accent-1)]/20 flex items-center justify-center text-2xl font-bold text-[var(--accent-1)]">
            {user?.full_name?.[0] || user?.username?.[0] || "U"}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold">
              {user?.full_name || user?.username}
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">{user?.email}</p>
            <p className="text-xs text-[var(--text-tertiary)] mt-1">
              Joined{" "}
              {user?.created_at
                ? new Date(user.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "recently"}
            </p>
          </div>
          <Badge variant="outline" className="rounded-lg text-xs">
            Free Plan
          </Badge>
        </GlassCard>

        {/* Account Info */}
        <GlassCard hover={false} className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <User className="w-4 h-4" />
            Account Details
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[var(--text-tertiary)] mb-1">Username</p>
              <p className="text-sm font-medium">{user?.username}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-tertiary)] mb-1">Email</p>
              <p className="text-sm font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-tertiary)] mb-1">Full Name</p>
              <p className="text-sm font-medium">{user?.full_name || "Not set"}</p>
            </div>
            <div>
              <p className="text-xs text-[var(--text-tertiary)] mb-1">Plan</p>
              <p className="text-sm font-medium">Free — Unlimited Access</p>
            </div>
          </div>
        </GlassCard>

        {/* Theme */}
        <GlassCard hover={false} className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold">Appearance</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Dark Mode</p>
              <p className="text-xs text-[var(--text-tertiary)]">
                Optimized for focus and reduced eye strain
              </p>
            </div>
            <Badge className="bg-[var(--accent-1)] text-white rounded-lg text-xs">
              Active
            </Badge>
          </div>
        </GlassCard>

        {/* Danger Zone */}
        <GlassCard hover={false} className="border border-[var(--danger)]/20">
          <h3 className="text-lg font-semibold text-[var(--danger)] mb-4">
            Danger Zone
          </h3>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="rounded-xl border-[var(--danger)]/30 text-[var(--danger)] hover:bg-[var(--danger)]/10"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </GlassCard>
      </div>
    </PageTransition>
  );
}
