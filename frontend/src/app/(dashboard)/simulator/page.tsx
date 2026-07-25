/** Future Simulator page — multi-step form + AI results. */

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Minus,
  Plus,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/shared/glass-card";
import { ScoreGauge } from "@/components/shared/score-gauge";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { PageTransition } from "@/components/shared/page-transition";
import { simulator } from "@/lib/api";
import type { Simulation, Timeline } from "@/types";

type Step = "input" | "loading" | "results";

export default function SimulatorPage() {
  const [step, setStep] = useState<Step>("input");
  const [situation, setSituation] = useState("");
  const [goal, setGoal] = useState("");
  const [choices, setChoices] = useState(["", ""]);
  const [result, setResult] = useState<Simulation | null>(null);
  const [error, setError] = useState("");
  const [selectedTimeline, setSelectedTimeline] = useState(0);

  const addChoice = () => {
    if (choices.length < 5) setChoices([...choices, ""]);
  };

  const removeChoice = (index: number) => {
    if (choices.length > 2) setChoices(choices.filter((_, i) => i !== index));
  };

  const updateChoice = (index: number, value: string) => {
    const updated = [...choices];
    updated[index] = value;
    setChoices(updated);
  };

  const handleSubmit = async () => {
    const validChoices = choices.filter((c) => c.trim().length > 0);
    if (validChoices.length < 2) {
      setError("Please provide at least 2 choices");
      return;
    }
    if (situation.trim().length < 10) {
      setError("Please describe your situation in more detail");
      return;
    }
    if (goal.trim().length < 5) {
      setError("Please describe your goal");
      return;
    }

    setError("");
    setStep("loading");

    try {
      const res = await simulator.run({
        situation: situation.trim(),
        goal: goal.trim(),
        choices: validChoices,
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
    setSituation("");
    setGoal("");
    setChoices(["", ""]);
    setResult(null);
    setSelectedTimeline(0);
  };

  return (
    <PageTransition>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Future Simulator</h1>
            <p className="text-sm text-[var(--text-secondary)]">
              See where your choices could lead
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === "input" && (
            <InputStep
              key="input"
              situation={situation}
              setSituation={setSituation}
              goal={goal}
              setGoal={setGoal}
              choices={choices}
              updateChoice={updateChoice}
              addChoice={addChoice}
              removeChoice={removeChoice}
              onSubmit={handleSubmit}
              error={error}
            />
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
                text="AI agents are analyzing your choices..."
              />
            </motion.div>
          )}

          {step === "results" && result && (
            <ResultsStep
              key="results"
              result={result}
              selectedTimeline={selectedTimeline}
              setSelectedTimeline={setSelectedTimeline}
              onReset={reset}
            />
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}

/* ===== Input Step ===== */
function InputStep({
  situation,
  setSituation,
  goal,
  setGoal,
  choices,
  updateChoice,
  addChoice,
  removeChoice,
  onSubmit,
  error,
}: {
  situation: string;
  setSituation: (v: string) => void;
  goal: string;
  setGoal: (v: string) => void;
  choices: string[];
  updateChoice: (i: number, v: string) => void;
  addChoice: () => void;
  removeChoice: (i: number) => void;
  onSubmit: () => void;
  error: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="flex flex-col gap-6 max-w-2xl"
    >
      <GlassCard hover={false} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="situation" className="text-sm font-medium">
            Current Situation
          </Label>
          <Textarea
            id="situation"
            placeholder="Describe your current situation in detail. For example: I'm a final year CS student with an internship offer from a startup and a job offer from a large company..."
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            rows={4}
            className="bg-[var(--surface-2)] border-[var(--border-default)] rounded-xl resize-none"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="goal" className="text-sm font-medium">
            Your Goal
          </Label>
          <Input
            id="goal"
            placeholder="What do you want to achieve? E.g., Build a strong career in tech"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="bg-[var(--surface-2)] border-[var(--border-default)] rounded-xl h-11"
          />
        </div>

        <div className="flex flex-col gap-3">
          <Label className="text-sm font-medium">
            Choices to Simulate ({choices.length}/5)
          </Label>
          {choices.map((choice, i) => (
            <div key={i} className="flex gap-2 items-center">
              <span className="text-xs text-[var(--text-tertiary)] w-6 shrink-0">
                {String.fromCharCode(65 + i)}.
              </span>
              <Input
                placeholder={`Choice ${String.fromCharCode(65 + i)} — e.g., Take the startup internship`}
                value={choice}
                onChange={(e) => updateChoice(i, e.target.value)}
                className="bg-[var(--surface-2)] border-[var(--border-default)] rounded-xl h-10"
              />
              {choices.length > 2 && (
                <button
                  onClick={() => removeChoice(i)}
                  className="p-2 text-[var(--text-tertiary)] hover:text-[var(--danger)] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
          {choices.length < 5 && (
            <button
              onClick={addChoice}
              className="flex items-center gap-2 text-sm text-[var(--accent-1)] hover:text-[var(--accent-2)] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add another choice
            </button>
          )}
        </div>
      </GlassCard>

      {error && (
        <p className="text-sm text-[var(--danger)] text-center">{error}</p>
      )}

      <Button
        onClick={onSubmit}
        className="w-full sm:w-auto sm:self-end px-8 h-11 rounded-xl bg-[var(--accent-1)] hover:bg-[var(--accent-2)] text-white font-medium"
      >
        <Sparkles className="w-4 h-4 mr-2" />
        Run Simulation
      </Button>
    </motion.div>
  );
}

/* ===== Results Step ===== */
function ResultsStep({
  result,
  selectedTimeline,
  setSelectedTimeline,
  onReset,
}: {
  result: Simulation;
  selectedTimeline: number;
  setSelectedTimeline: (v: number) => void;
  onReset: () => void;
}) {
  const timeline = result.timelines[selectedTimeline];
  const colors = ["#22c55e", "#3b82f6", "#a855f7", "#f59e0b", "#ef4444"];

  // Radar data
  const radarData = Object.entries(timeline?.scores || {}).map(([key, value]) => ({
    metric: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    value: value as number,
  }));

  // Compare bar data
  const compareData = Object.keys(result.timelines[0]?.scores || {}).map((key) => {
    const entry: Record<string, unknown> = {
      metric: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).substring(0, 12),
    };
    result.timelines.forEach((t, i) => {
      entry[`Choice ${String.fromCharCode(65 + i)}`] = (t.scores as unknown as Record<string, number>)[key];
    });
    return entry;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex flex-col gap-6"
    >
      {/* Timeline selector */}
      <div className="flex flex-wrap gap-2">
        {result.timelines.map((t, i) => (
          <button
            key={i}
            onClick={() => setSelectedTimeline(i)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              selectedTimeline === i
                ? "bg-[var(--accent-1)] text-white"
                : "glass text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            Timeline {String.fromCharCode(65 + i)}: {t.choice}
          </button>
        ))}
      </div>

      {/* Timeline Detail */}
      {timeline && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Summary */}
          <GlassCard hover={false}>
            <h3 className="text-lg font-semibold mb-3">Timeline Summary</h3>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
              {timeline.timeline_summary}
            </p>
            <div className="flex flex-col gap-3">
              {[
                { label: "Year 1", text: timeline.year_1 },
                { label: "Year 2", text: timeline.year_2 },
                { label: "Year 3", text: timeline.year_3 },
                { label: "Year 5", text: timeline.year_5 },
              ].map((yr) => (
                <div key={yr.label} className="flex gap-3">
                  <Badge variant="outline" className="shrink-0 mt-0.5 text-xs rounded-lg">
                    {yr.label}
                  </Badge>
                  <p className="text-sm text-[var(--text-secondary)]">{yr.text}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Radar Chart */}
          <GlassCard hover={false}>
            <h3 className="text-lg font-semibold mb-3">Score Breakdown</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.06)" />
                  <PolarAngleAxis
                    dataKey="metric"
                    tick={{ fill: "var(--text-tertiary)", fontSize: 10 }}
                  />
                  <Radar
                    dataKey="value"
                    stroke={colors[selectedTimeline]}
                    fill={colors[selectedTimeline]}
                    fillOpacity={0.15}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Risks & Opportunities */}
          <GlassCard hover={false}>
            <h3 className="text-lg font-semibold mb-3">Key Risks</h3>
            <ul className="flex flex-col gap-2">
              {timeline.key_risks?.map((risk, i) => (
                <li key={i} className="flex gap-2 text-sm text-[var(--text-secondary)]">
                  <span className="text-[var(--danger)] shrink-0">⚠</span>
                  {risk}
                </li>
              ))}
            </ul>
            <h3 className="text-lg font-semibold mt-6 mb-3">Opportunities</h3>
            <ul className="flex flex-col gap-2">
              {timeline.key_opportunities?.map((opp, i) => (
                <li key={i} className="flex gap-2 text-sm text-[var(--text-secondary)]">
                  <span className="text-[var(--success)] shrink-0">✦</span>
                  {opp}
                </li>
              ))}
            </ul>
          </GlassCard>

          {/* Milestones */}
          <GlassCard hover={false}>
            <h3 className="text-lg font-semibold mb-3">Critical Milestones</h3>
            <ul className="flex flex-col gap-3">
              {timeline.critical_milestones?.map((ms, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <div className="w-6 h-6 rounded-full bg-[var(--accent-1)]/10 text-[var(--accent-1)] flex items-center justify-center text-xs font-bold shrink-0">
                    {i + 1}
                  </div>
                  <span className="text-[var(--text-secondary)]">{ms}</span>
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>
      )}

      {/* Comparison Chart */}
      {result.timelines.length > 1 && (
        <GlassCard hover={false}>
          <h3 className="text-lg font-semibold mb-3">Comparison</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={compareData}>
                <CartesianGrid stroke="rgba(255,255,255,0.04)" />
                <XAxis
                  dataKey="metric"
                  tick={{ fill: "var(--text-tertiary)", fontSize: 10 }}
                  angle={-30}
                  textAnchor="end"
                  height={60}
                />
                <YAxis tick={{ fill: "var(--text-tertiary)", fontSize: 10 }} />
                <Tooltip
                  contentStyle={{
                    background: "var(--surface-2)",
                    border: "1px solid var(--border-default)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                {result.timelines.map((_, i) => (
                  <Bar
                    key={i}
                    dataKey={`Choice ${String.fromCharCode(65 + i)}`}
                    fill={colors[i]}
                    radius={[4, 4, 0, 0]}
                    fillOpacity={0.8}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      )}

      {/* Recommendation */}
      {result.recommendation && (
        <GlassCard hover={false} glow>
          <div className="flex items-start gap-4">
            <ScoreGauge
              score={result.recommendation.confidence}
              size={80}
              label="Confidence"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold mb-1">AI Recommendation</h3>
              <p className="text-sm font-medium text-[var(--accent-1)] mb-2">
                {result.recommendation.verdict}
              </p>
              <p className="text-sm text-[var(--text-secondary)] mb-3">
                {result.recommendation.reasoning}
              </p>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium text-[var(--text-tertiary)] uppercase">
                  Next Steps
                </span>
                {result.recommendation.next_steps?.map((step, i) => (
                  <p key={i} className="text-sm text-[var(--text-secondary)]">
                    {i + 1}. {step}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </GlassCard>
      )}

      <div className="flex gap-3">
        <Button
          onClick={onReset}
          variant="outline"
          className="rounded-xl border-[var(--border-default)]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          New Simulation
        </Button>
      </div>
    </motion.div>
  );
}
