/** Mind Mirror page — lifestyle inputs + wellness analysis. */

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Brain, Moon, Monitor, BookOpen, Dumbbell, Frown, Smile, Sparkles } from "lucide-react";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/shared/glass-card";
import { ScoreGauge } from "@/components/shared/score-gauge";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { PageTransition } from "@/components/shared/page-transition";
import { mind } from "@/lib/api";
import type { MindAssessment } from "@/types";

type Step = "input" | "loading" | "results";

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  unit: string;
  icon: React.ReactNode;
}

function SliderInput({ label, value, onChange, min, max, step, unit, icon }: SliderInputProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium flex items-center gap-2">
          {icon}
          {label}
        </Label>
        <span className="text-sm font-mono text-[var(--accent-1)]">
          {value} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer bg-[var(--surface-3)]"
        style={{
          background: `linear-gradient(to right, var(--accent-1) 0%, var(--accent-1) ${((value - min) / (max - min)) * 100}%, var(--surface-3) ${((value - min) / (max - min)) * 100}%, var(--surface-3) 100%)`,
        }}
      />
      <div className="flex justify-between text-xs text-[var(--text-tertiary)]">
        <span>{min} {unit}</span>
        <span>{max} {unit}</span>
      </div>
    </div>
  );
}

export default function MindMirrorPage() {
  const [step, setStep] = useState<Step>("input");
  const [sleep, setSleep] = useState(7);
  const [screenTime, setScreenTime] = useState(6);
  const [studyHours, setStudyHours] = useState(5);
  const [exercise, setExercise] = useState(30);
  const [stress, setStress] = useState(5);
  const [mood, setMood] = useState(6);
  const [result, setResult] = useState<MindAssessment | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setStep("loading");

    try {
      const res = await mind.assess({
        sleep,
        screen_time: screenTime,
        study_hours: studyHours,
        exercise,
        stress,
        mood,
      });
      setResult(res);
      setStep("results");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Assessment failed");
      setStep("input");
    }
  };

  const reset = () => {
    setStep("input");
    setResult(null);
  };

  return (
    <PageTransition>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Mind Mirror</h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Understand your mental readiness
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-6 max-w-2xl"
            >
              <GlassCard hover={false} className="flex flex-col gap-6">
                <SliderInput label="Sleep" value={sleep} onChange={setSleep} min={0} max={12} step={0.5} unit="hrs" icon={<Moon className="w-4 h-4 text-blue-400" />} />
                <SliderInput label="Screen Time" value={screenTime} onChange={setScreenTime} min={0} max={16} step={0.5} unit="hrs" icon={<Monitor className="w-4 h-4 text-orange-400" />} />
                <SliderInput label="Study / Work" value={studyHours} onChange={setStudyHours} min={0} max={16} step={0.5} unit="hrs" icon={<BookOpen className="w-4 h-4 text-emerald-400" />} />
                <SliderInput label="Exercise" value={exercise} onChange={setExercise} min={0} max={180} step={5} unit="min" icon={<Dumbbell className="w-4 h-4 text-red-400" />} />
                <SliderInput label="Stress Level" value={stress} onChange={setStress} min={1} max={10} step={1} unit="/10" icon={<Frown className="w-4 h-4 text-yellow-400" />} />
                <SliderInput label="Mood" value={mood} onChange={setMood} min={1} max={10} step={1} unit="/10" icon={<Smile className="w-4 h-4 text-pink-400" />} />
              </GlassCard>

              {error && <p className="text-sm text-[var(--danger)] text-center">{error}</p>}

              <Button
                onClick={handleSubmit}
                className="w-full sm:w-auto sm:self-end px-8 h-11 rounded-xl bg-[var(--accent-1)] hover:bg-[var(--accent-2)] text-white font-medium"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Run Assessment
              </Button>
            </motion.div>
          )}

          {step === "loading" && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center min-h-[50vh]">
              <LoadingSpinner size="lg" text="Psychology Agent is analyzing your wellness..." />
            </motion.div>
          )}

          {step === "results" && result && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-6"
            >
              {/* Score Gauges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                <ScoreGauge score={result.focus_score} label="Focus Score" />
                <ScoreGauge score={result.burnout_risk} label="Burnout Risk" />
                <ScoreGauge score={result.decision_readiness} label="Decision Ready" />
                <ScoreGauge score={result.attention_health} label="Attention Health" />
              </div>

              {/* Radar */}
              <GlassCard hover={false}>
                <h3 className="text-lg font-semibold mb-3">Wellness Profile</h3>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart
                      data={[
                        { metric: "Focus", value: result.focus_score },
                        { metric: "Burnout Risk", value: 100 - result.burnout_risk },
                        { metric: "Decision Ready", value: result.decision_readiness },
                        { metric: "Attention", value: result.attention_health },
                        { metric: "Overall", value: result.analysis?.overall_wellness || 50 },
                      ]}
                    >
                      <PolarGrid stroke="rgba(255,255,255,0.06)" />
                      <PolarAngleAxis dataKey="metric" tick={{ fill: "var(--text-tertiary)", fontSize: 11 }} />
                      <Radar dataKey="value" stroke="#a855f7" fill="#a855f7" fillOpacity={0.15} strokeWidth={2} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </GlassCard>

              {/* Analysis */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(result.analysis?.analysis || {}).map(([key, text]) => (
                  <GlassCard key={key} hover={false}>
                    <h4 className="text-sm font-semibold capitalize mb-2">
                      {key.replace(/_/g, " ")}
                    </h4>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                      {text as string}
                    </p>
                  </GlassCard>
                ))}
              </div>

              {/* Recommendations */}
              <GlassCard hover={false} glow>
                <h3 className="text-lg font-semibold mb-4">
                  <Sparkles className="w-4 h-4 inline mr-2 text-[var(--accent-1)]" />
                  Recommendations
                </h3>
                <div className="flex flex-col gap-4">
                  {result.analysis?.recommendations?.map((rec, i) => (
                    <div key={i} className="flex gap-3">
                      <Badge
                        variant="outline"
                        className={`shrink-0 text-xs rounded-lg capitalize ${
                          rec.priority === "high"
                            ? "text-[var(--danger)] border-[var(--danger)]/30"
                            : rec.priority === "medium"
                            ? "text-[var(--warning)] border-[var(--warning)]/30"
                            : "text-[var(--info)] border-[var(--info)]/30"
                        }`}
                      >
                        {rec.priority}
                      </Badge>
                      <div>
                        <p className="text-sm font-medium">{rec.area}</p>
                        <p className="text-sm text-[var(--text-secondary)]">{rec.suggestion}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Positive & Warning */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard hover={false}>
                  <h3 className="text-lg font-semibold mb-3 text-[var(--success)]">What&apos;s Going Well</h3>
                  <ul className="flex flex-col gap-2">
                    {result.analysis?.positive_habits?.map((h, i) => (
                      <li key={i} className="flex gap-2 text-sm text-[var(--text-secondary)]">
                        <span className="text-[var(--success)] shrink-0">✓</span>{h}
                      </li>
                    ))}
                  </ul>
                </GlassCard>
                <GlassCard hover={false}>
                  <h3 className="text-lg font-semibold mb-3 text-[var(--warning)]">Watch Out For</h3>
                  <ul className="flex flex-col gap-2">
                    {result.analysis?.warning_signs?.map((w, i) => (
                      <li key={i} className="flex gap-2 text-sm text-[var(--text-secondary)]">
                        <span className="text-[var(--warning)] shrink-0">⚠</span>{w}
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </div>

              <Button onClick={reset} variant="outline" className="w-fit rounded-xl border-[var(--border-default)]">
                <ArrowLeft className="w-4 h-4 mr-2" />
                New Assessment
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
