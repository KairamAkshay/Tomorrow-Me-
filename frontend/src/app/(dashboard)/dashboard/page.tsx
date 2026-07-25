/** Dashboard home page with feature cards. */

"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  FileText,
  History,
  Settings,
  Shield,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

import { GlassCard } from "@/components/shared/glass-card";
import {
  FadeInUp,
  PageTransition,
  StaggerContainer,
} from "@/components/shared/page-transition";
import { useAuthStore } from "@/stores/auth-store";

const features = [
  {
    title: "Future Simulator",
    description: "Simulate different life paths and see where each choice could lead over the next 5 years.",
    icon: TrendingUp,
    href: "/simulator",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    gradient: "from-emerald-500/20 to-transparent",
  },
  {
    title: "Reality Check",
    description: "Paste any advice or content and get an AI-powered credibility and bias analysis.",
    icon: Shield,
    href: "/reality-check",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    gradient: "from-blue-500/20 to-transparent",
  },
  {
    title: "Mind Mirror",
    description: "Track your lifestyle metrics and understand your mental readiness for big decisions.",
    icon: Brain,
    href: "/mind-mirror",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    gradient: "from-purple-500/20 to-transparent",
  },
  {
    title: "Reports",
    description: "View all your past analyses and download detailed PDF reports.",
    icon: FileText,
    href: "/reports",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    gradient: "from-orange-500/20 to-transparent",
  },
  {
    title: "History",
    description: "Browse your complete decision-making history and track patterns over time.",
    icon: History,
    href: "/reports",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    gradient: "from-pink-500/20 to-transparent",
  },
  {
    title: "Settings",
    description: "Manage your account, preferences, and application settings.",
    icon: Settings,
    href: "/settings",
    color: "text-zinc-400",
    bg: "bg-zinc-500/10",
    gradient: "from-zinc-500/20 to-transparent",
  },
];

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <PageTransition>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Welcome back,{" "}
            <span className="gradient-text">
              {user?.full_name?.split(" ")[0] || user?.username || "there"}
            </span>
          </h1>
          <p className="text-[var(--text-secondary)] mt-2">
            What decision are you thinking about today?
          </p>
        </div>

        {/* Feature Cards */}
        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature) => (
            <FadeInUp key={feature.title}>
              <Link href={feature.href}>
                <GlassCard className="h-full flex flex-col gap-4 relative overflow-hidden group">
                  {/* Gradient accent */}
                  <div
                    className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${feature.gradient} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />

                  <div className="relative z-10 flex flex-col gap-4">
                    <div
                      className={`w-11 h-11 rounded-xl ${feature.bg} ${feature.color} flex items-center justify-center`}
                    >
                      <feature.icon className="w-5 h-5" />
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                        {feature.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-[var(--accent-1)] font-medium mt-auto">
                      Open
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </GlassCard>
              </Link>
            </FadeInUp>
          ))}
        </StaggerContainer>
      </div>
    </PageTransition>
  );
}
