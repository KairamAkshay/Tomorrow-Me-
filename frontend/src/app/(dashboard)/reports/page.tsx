/** Reports page — list all analyses with type badges and dates. */

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Brain, FileText, Shield, TrendingUp, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/shared/glass-card";
import { PageLoader } from "@/components/shared/loading-spinner";
import { PageTransition } from "@/components/shared/page-transition";
import { reports } from "@/lib/api";
import type { ReportItem } from "@/types";

const typeConfig = {
  simulation: {
    icon: TrendingUp,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    label: "Future Simulation",
  },
  reality_check: {
    icon: Shield,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    label: "Reality Check",
  },
  mind_assessment: {
    icon: Brain,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    label: "Mind Mirror",
  },
};

export default function ReportsPage() {
  const [items, setItems] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await reports.list();
        setItems(res.reports);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load reports");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (loading) return <PageLoader text="Loading reports..." />;

  return (
    <PageTransition>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Reports</h1>
            <p className="text-sm text-[var(--text-secondary)]">
              All your analyses in one place
            </p>
          </div>
        </div>

        {error && (
          <p className="text-sm text-[var(--danger)] text-center">{error}</p>
        )}

        {items.length === 0 ? (
          <GlassCard hover={false} className="text-center py-16">
            <FileText className="w-12 h-12 text-[var(--text-tertiary)] mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No reports yet</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Run a simulation, reality check, or mind assessment to see your
              reports here.
            </p>
          </GlassCard>
        ) : (
          <div className="flex flex-col gap-4">
            {items.map((item, i) => {
              const config =
                typeConfig[item.type as keyof typeof typeConfig] ||
                typeConfig.simulation;
              const Icon = config.icon;

              return (
                <motion.div
                  key={`${item.type}-${item.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <GlassCard className="flex items-start gap-4">
                    <div
                      className={`w-10 h-10 rounded-xl ${config.bg} ${config.color} flex items-center justify-center shrink-0`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-sm font-semibold truncate">
                            {item.title}
                          </h3>
                          <p className="text-xs text-[var(--text-secondary)] mt-0.5 line-clamp-2">
                            {item.summary}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {item.score !== null && (
                            <Badge
                              variant="outline"
                              className="text-xs rounded-lg"
                            >
                              Score: {item.score}
                            </Badge>
                          )}
                          <Badge
                            variant="secondary"
                            className={`text-xs rounded-lg ${config.color}`}
                          >
                            {config.label}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-xs text-[var(--text-tertiary)] mt-2">
                        {new Date(item.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </PageTransition>
  );
}
