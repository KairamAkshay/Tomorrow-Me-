/** Reality Check page — paste content, get AI analysis. */

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Search, Shield, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/shared/glass-card";
import { ScoreGauge } from "@/components/shared/score-gauge";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { PageTransition } from "@/components/shared/page-transition";
import { reality } from "@/lib/api";
import type { ContentType, RealityCheck } from "@/types";

const contentTypes: { value: ContentType; label: string }[] = [
  { value: "advice", label: "Advice" },
  { value: "tweet", label: "Tweet" },
  { value: "linkedin_post", label: "LinkedIn Post" },
  { value: "instagram_caption", label: "Instagram" },
  { value: "article", label: "Article" },
  { value: "other", label: "Other" },
];

type Step = "input" | "loading" | "results";

export default function RealityCheckPage() {
  const [step, setStep] = useState<Step>("input");
  const [content, setContent] = useState("");
  const [contentType, setContentType] = useState<ContentType>("advice");
  const [result, setResult] = useState<RealityCheck | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (content.trim().length < 10) {
      setError("Please paste at least 10 characters of content to analyze");
      return;
    }

    setError("");
    setStep("loading");

    try {
      const res = await reality.analyze({
        content: content.trim(),
        content_type: contentType,
      });
      setResult(res);
      setStep("results");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Analysis failed");
      setStep("input");
    }
  };

  const reset = () => {
    setStep("input");
    setContent("");
    setResult(null);
  };

  return (
    <PageTransition>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Reality Check</h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Analyze any advice or content for credibility
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-6 max-w-2xl"
            >
              <GlassCard hover={false} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                  <Label className="text-sm font-medium">Content Type</Label>
                  <div className="flex flex-wrap gap-2">
                    {contentTypes.map((ct) => (
                      <button
                        key={ct.value}
                        onClick={() => setContentType(ct.value)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                          contentType === ct.value
                            ? "bg-[var(--accent-1)] text-white"
                            : "glass text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        }`}
                      >
                        {ct.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="content" className="text-sm font-medium">
                    Paste Content to Analyze
                  </Label>
                  <Textarea
                    id="content"
                    placeholder={`Paste the ${contentType.replace("_", " ")} you want to analyze. For example: "Just quit your job and follow your passion. Money will follow. I did it and now I'm making 7 figures."`}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={6}
                    className="bg-[var(--surface-2)] border-[var(--border-default)] rounded-xl resize-none"
                  />
                  <span className="text-xs text-[var(--text-tertiary)]">
                    {content.length} / 5000 characters
                  </span>
                </div>
              </GlassCard>

              {error && (
                <p className="text-sm text-[var(--danger)] text-center">
                  {error}
                </p>
              )}

              <Button
                onClick={handleSubmit}
                className="w-full sm:w-auto sm:self-end px-8 h-11 rounded-xl bg-[var(--accent-1)] hover:bg-[var(--accent-2)] text-white font-medium"
              >
                <Search className="w-4 h-4 mr-2" />
                Analyze Content
              </Button>
            </motion.div>
          )}

          {step === "loading" && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center min-h-[50vh]"
            >
              <LoadingSpinner
                size="lg"
                text="Reality Agent is checking credibility..."
              />
            </motion.div>
          )}

          {step === "results" && result && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-6"
            >
              {/* Overall Score */}
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <ScoreGauge
                  score={result.analysis.overall_score || result.overall_score}
                  size={140}
                  strokeWidth={10}
                  label="Reality Score"
                />
                <GlassCard hover={false} className="flex-1">
                  <h3 className="text-lg font-semibold mb-2">Summary</h3>
                  <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                    {result.analysis.summary}
                  </p>
                </GlassCard>
              </div>

              {/* Score Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(result.analysis.scores || {}).map(
                  ([key, value]) => (
                    <GlassCard key={key} hover={false} className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium capitalize">
                          {key.replace(/_/g, " ")}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-xs rounded-lg ${
                            key === "bias_level" || key === "hidden_assumptions"
                              ? (value as number) > 60
                                ? "text-[var(--danger)]"
                                : "text-[var(--success)]"
                              : (value as number) >= 60
                              ? "text-[var(--success)]"
                              : "text-[var(--warning)]"
                          }`}
                        >
                          {value as number}/100
                        </Badge>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[var(--surface-3)]">
                        <motion.div
                          className="h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${value}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          style={{
                            background:
                              key === "bias_level" ||
                              key === "hidden_assumptions"
                                ? (value as number) > 60
                                  ? "var(--danger)"
                                  : "var(--success)"
                                : (value as number) >= 60
                                ? "var(--success)"
                                : "var(--warning)",
                          }}
                        />
                      </div>
                      <p className="text-xs text-[var(--text-tertiary)] leading-relaxed">
                        {result.analysis.explanations?.[key] || ""}
                      </p>
                    </GlassCard>
                  )
                )}
              </div>

              {/* Red Flags & Strengths */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard hover={false}>
                  <h3 className="text-lg font-semibold mb-3 text-[var(--danger)]">
                    Red Flags
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {result.analysis.red_flags?.map((flag, i) => (
                      <li
                        key={i}
                        className="flex gap-2 text-sm text-[var(--text-secondary)]"
                      >
                        <span className="text-[var(--danger)] shrink-0">⚠</span>
                        {flag}
                      </li>
                    ))}
                  </ul>
                </GlassCard>

                <GlassCard hover={false}>
                  <h3 className="text-lg font-semibold mb-3 text-[var(--success)]">
                    Strengths
                  </h3>
                  <ul className="flex flex-col gap-2">
                    {result.analysis.strengths?.map((s, i) => (
                      <li
                        key={i}
                        className="flex gap-2 text-sm text-[var(--text-secondary)]"
                      >
                        <span className="text-[var(--success)] shrink-0">✓</span>
                        {s}
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </div>

              {/* Recommendation */}
              <GlassCard hover={false} glow>
                <h3 className="text-lg font-semibold mb-2">
                  <Sparkles className="w-4 h-4 inline mr-2 text-[var(--accent-1)]" />
                  Recommendation
                </h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {result.analysis.recommendation}
                </p>
              </GlassCard>

              <Button
                onClick={reset}
                variant="outline"
                className="w-fit rounded-xl border-[var(--border-default)]"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Check Another
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
