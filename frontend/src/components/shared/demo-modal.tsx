/** Interactive Demo Modal showcasing product features in action. */

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  TrendingUp,
  Shield,
  Brain,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DemoModal({ isOpen, onClose }: DemoModalProps) {
  const [activeTab, setActiveTab] = useState<"simulator" | "reality" | "mind">(
    "simulator"
  );
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  // Auto progress bar animation when playing
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          return 0;
        }
        return prev + 1;
      });
    }, 120);

    return () => clearInterval(interval);
  }, [isOpen, isPlaying, activeTab]);

  // Reset progress on tab change
  const handleTabChange = (tab: "simulator" | "reality" | "mind") => {
    setActiveTab(tab);
    setProgress(0);
    setIsPlaying(true);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="relative w-full max-w-4xl glass-strong rounded-2xl overflow-hidden border border-[var(--border-strong)] shadow-2xl z-10 my-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-subtle)] bg-[var(--surface-1)]">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[var(--accent-1)]/20 text-[var(--accent-1)] flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Tomorrow Me Demo</h3>
                <p className="text-xs text-[var(--text-tertiary)]">
                  Interactive Product Walkthrough
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] rounded-lg hover:bg-[var(--surface-2)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Feature Selector Tabs */}
          <div className="flex border-b border-[var(--border-subtle)] bg-[var(--surface-0)] p-2 gap-2 overflow-x-auto">
            <button
              onClick={() => handleTabChange("simulator")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === "simulator"
                  ? "bg-[var(--accent-1)] text-white"
                  : "text-[var(--text-secondary)] hover:bg-[var(--surface-2)]"
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Future Simulator
            </button>
            <button
              onClick={() => handleTabChange("reality")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === "reality"
                  ? "bg-blue-600 text-white"
                  : "text-[var(--text-secondary)] hover:bg-[var(--surface-2)]"
              }`}
            >
              <Shield className="w-4 h-4" />
              Reality Check
            </button>
            <button
              onClick={() => handleTabChange("mind")}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                activeTab === "mind"
                  ? "bg-purple-600 text-white"
                  : "text-[var(--text-secondary)] hover:bg-[var(--surface-2)]"
              }`}
            >
              <Brain className="w-4 h-4" />
              Mind Mirror
            </button>
          </div>

          {/* Interactive Screen Preview */}
          <div className="p-6 bg-[var(--surface-0)] min-h-[360px] flex flex-col justify-between relative">
            {activeTab === "simulator" && (
              <SimulatorDemoView progress={progress} />
            )}
            {activeTab === "reality" && <RealityDemoView progress={progress} />}
            {activeTab === "mind" && <MindDemoView progress={progress} />}

            {/* Video Player Progress & Controls */}
            <div className="mt-6 pt-4 border-t border-[var(--border-subtle)] flex flex-col gap-3">
              {/* Progress Bar */}
              <div className="w-full h-1.5 rounded-full bg-[var(--surface-3)] overflow-hidden cursor-pointer">
                <div
                  className="h-full bg-[var(--accent-1)] transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-1.5 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text-primary)]"
                  >
                    {isPlaying ? (
                      <Pause className="w-4 h-4" />
                    ) : (
                      <Play className="w-4 h-4" />
                    )}
                  </button>
                  <button
                    onClick={() => setProgress(0)}
                    className="p-1.5 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <span className="font-mono text-[11px]">
                    00:{Math.floor((progress / 100) * 12).toString().padStart(2, "0")} / 00:12
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <Link href="/register" onClick={onClose}>
                    <Button size="sm" className="bg-[var(--accent-1)] hover:bg-[var(--accent-2)] text-white text-xs rounded-lg">
                      Try This Simulation
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

/* ===== Simulator Demo Preview ===== */
function SimulatorDemoView({ progress }: { progress: number }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs text-emerald-400 border-emerald-500/30">
            Scenario: Career Decision
          </Badge>
          <span className="text-xs text-[var(--text-tertiary)]">Alex, CS Graduate</span>
        </div>
        <Badge className="bg-emerald-500/10 text-emerald-400 text-xs">
          Simulating 5-Year Outcomes
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Timeline A */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            progress > 25
              ? "border-emerald-500/40 bg-emerald-500/5"
              : "border-[var(--border-default)] bg-[var(--surface-1)]"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">Timeline A: AI Startup</span>
            <span className="text-xs text-emerald-400 font-bold">92% Growth</span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mb-3">
            High initial risk, explosive skill compound by Year 3. $140k+ potential.
          </p>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between text-[var(--text-tertiary)]">
              <span>Skill Compound</span>
              <span className="text-emerald-400">95/100</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[var(--surface-3)] overflow-hidden">
              <div className="h-full bg-emerald-400" style={{ width: `${Math.min(95, progress * 1.2)}%` }} />
            </div>
          </div>
        </div>

        {/* Timeline B */}
        <div
          className={`p-4 rounded-xl border transition-all ${
            progress > 50
              ? "border-blue-500/40 bg-blue-500/5"
              : "border-[var(--border-default)] bg-[var(--surface-1)]"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold">Timeline B: Corporate Job</span>
            <span className="text-xs text-blue-400 font-bold">78% Growth</span>
          </div>
          <p className="text-xs text-[var(--text-secondary)] mb-3">
            Steady salary stability from Year 1. Slower leadership growth.
          </p>
          <div className="space-y-1.5 text-[11px]">
            <div className="flex justify-between text-[var(--text-tertiary)]">
              <span>Financial Stability</span>
              <span className="text-blue-400">88/100</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[var(--surface-3)] overflow-hidden">
              <div className="h-full bg-blue-400" style={{ width: `${Math.min(88, progress * 1.1)}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Judge Verdict Callout */}
      {progress > 70 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-xl glass border border-[var(--accent-1)]/30 flex items-center justify-between text-xs"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[var(--accent-1)] shrink-0" />
            <span>
              <strong>Judge Verdict:</strong> Timeline A offers 2.4x higher career trajectory over 5 years.
            </span>
          </div>
          <Badge className="bg-[var(--accent-1)] text-white text-[10px]">
            89% Confidence
          </Badge>
        </motion.div>
      )}
    </div>
  );
}

/* ===== Reality Demo Preview ===== */
function RealityDemoView({ progress }: { progress: number }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="p-3 rounded-xl bg-[var(--surface-1)] border border-[var(--border-default)]">
        <span className="text-[11px] font-mono text-[var(--text-tertiary)] uppercase block mb-1">
          Analyzed Tweet / LinkedIn Post
        </span>
        <p className="text-xs italic text-[var(--text-secondary)]">
          &ldquo;Quit your 9-to-5 job today. Anyone can build a $100k/mo AI agency with zero experience. If you are not doing this, you are wasting your 20s.&rdquo;
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 rounded-xl glass text-center">
          <span className="text-xs text-[var(--text-tertiary)] block mb-1">Credibility</span>
          <span className="text-xl font-bold text-red-400">32 / 100</span>
        </div>
        <div className="p-3 rounded-xl glass text-center">
          <span className="text-xs text-[var(--text-tertiary)] block mb-1">Survivorship Bias</span>
          <span className="text-xl font-bold text-orange-400">High (92%)</span>
        </div>
        <div className="p-3 rounded-xl glass text-center">
          <span className="text-xs text-[var(--text-tertiary)] block mb-1">Practicality</span>
          <span className="text-xl font-bold text-yellow-400">28 / 100</span>
        </div>
      </div>

      {progress > 50 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300 flex items-start gap-2"
        >
          <span className="text-red-400 font-bold shrink-0">⚠ Red Flag:</span>
          <span>
            Ignores market saturation, initial capital requirements, and 95%+ fail rate. Highly promotional language.
          </span>
        </motion.div>
      )}
    </div>
  );
}

/* ===== Mind Demo Preview ===== */
function MindDemoView({ progress }: { progress: number }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between text-xs">
        <span className="text-[var(--text-secondary)]">Lifestyle Inputs</span>
        <span className="text-[var(--text-tertiary)]">Sleep: 5.5h · Screen Time: 9h · Stress: 8/10</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-xl glass text-center">
          <span className="text-[11px] text-[var(--text-tertiary)] block mb-1">Focus Score</span>
          <span className="text-lg font-bold text-yellow-400">48 / 100</span>
        </div>
        <div className="p-3 rounded-xl glass text-center">
          <span className="text-[11px] text-[var(--text-tertiary)] block mb-1">Burnout Risk</span>
          <span className="text-lg font-bold text-red-400">76% (High)</span>
        </div>
        <div className="p-3 rounded-xl glass text-center">
          <span className="text-[11px] text-[var(--text-tertiary)] block mb-1">Decision Ready</span>
          <span className="text-lg font-bold text-orange-400">42 / 100</span>
        </div>
        <div className="p-3 rounded-xl glass text-center">
          <span className="text-[11px] text-[var(--text-tertiary)] block mb-1">Attention Health</span>
          <span className="text-lg font-bold text-red-400">38 / 100</span>
        </div>
      </div>

      {progress > 60 && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-xl glass border border-purple-500/30 text-xs text-purple-300"
        >
          <p className="font-semibold text-purple-200 mb-1">💡 Psychology Insight:</p>
          <p className="text-[var(--text-secondary)]">
            High stress (8/10) and sleep deficit (5.5h) reduce prefrontal cortex executive function. We recommend recovering 2 nights of 7.5h+ sleep before finalizing life-altering career moves.
          </p>
        </motion.div>
      )}
    </div>
  );
}
