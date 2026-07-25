/** Landing page — Tomorrow Me */

"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  ChevronDown,
  Eye,
  Lightbulb,
  Play,
  Search,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { DemoModal } from "@/components/shared/demo-modal";
import { Button } from "@/components/ui/button";
import { FloatingParticles } from "@/components/shared/floating-particles";
import { GlassCard } from "@/components/shared/glass-card";
import {
  FadeInUp,
  StaggerContainer,
} from "@/components/shared/page-transition";

export default function LandingPage() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  return (
    <main className="relative min-h-screen">
      <FloatingParticles count={40} />

      <HeroSection onWatchDemo={() => setIsDemoOpen(true)} />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <FAQSection />
      <FooterSection />

      <DemoModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
      />
    </main>
  );
}

/* ===== Hero ===== */
function HeroSection({ onWatchDemo }: { onWatchDemo: () => void }) {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center">
      <StaggerContainer className="flex flex-col items-center gap-6 max-w-4xl">
        <FadeInUp>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-[var(--text-secondary)]">
            <Sparkles className="w-4 h-4 text-[var(--accent-1)]" />
            AI-Powered Decision Intelligence
          </div>
        </FadeInUp>

        <FadeInUp>
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1]">
            Meet{" "}
            <span className="gradient-text">Tomorrow You</span>
            <span className="gradient-text">.</span>
          </h1>
        </FadeInUp>

        <FadeInUp>
          <p className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl leading-relaxed">
            Every decision creates a different future. See possible outcomes
            before choosing. Powered by AI reasoning, not fortune telling.
          </p>
        </FadeInUp>

        <FadeInUp>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link href="/register">
              <Button
                size="lg"
                className="px-8 py-6 text-base font-medium bg-[var(--accent-1)] hover:bg-[var(--accent-2)] text-white rounded-xl glow transition-all"
              >
                Start Simulation
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              onClick={onWatchDemo}
              className="px-8 py-6 text-base font-medium rounded-xl border-[var(--border-default)] text-[var(--text-primary)] hover:bg-[var(--surface-2)] cursor-pointer"
            >
              <Play className="mr-2 w-5 h-5" />
              Watch Demo
            </Button>
          </div>
        </FadeInUp>

        <FadeInUp>
          <p className="text-sm text-[var(--text-tertiary)] mt-4">
            No credit card required · Free to try · 2 minute setup
          </p>
        </FadeInUp>
      </StaggerContainer>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="w-6 h-6 text-[var(--text-tertiary)]" />
      </motion.div>
    </section>
  );
}

/* ===== Features ===== */
function FeaturesSection() {
  const features = [
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Future Simulator",
      description:
        "Enter your situation, goals, and choices. Get AI-generated timeline simulations showing career, income, skills, and wellbeing projections across 5 years.",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Reality Check",
      description:
        "Paste any advice, tweet, or article. Get an AI-powered credibility analysis with bias detection, evidence scoring, and a clear Reality Score.",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
    },
    {
      icon: <Brain className="w-6 h-6" />,
      title: "Mind Mirror",
      description:
        "Track your sleep, screen time, exercise, and mood. Get insights on focus, burnout risk, and whether you're in the right state to make big decisions.",
      color: "text-purple-400",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <section className="py-24 px-6" id="features">
      <div className="max-w-6xl mx-auto">
        <StaggerContainer className="text-center mb-16">
          <FadeInUp>
            <p className="text-sm font-medium text-[var(--accent-1)] mb-3 tracking-wider uppercase">
              Features
            </p>
          </FadeInUp>
          <FadeInUp>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Three tools.{" "}
              <span className="text-[var(--text-tertiary)]">One mission.</span>
            </h2>
          </FadeInUp>
          <FadeInUp>
            <p className="text-[var(--text-secondary)] mt-4 max-w-2xl mx-auto">
              Make better decisions with AI that analyzes your options, checks your sources, and understands your mental state.
            </p>
          </FadeInUp>
        </StaggerContainer>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <FadeInUp key={feature.title}>
              <GlassCard className="h-full flex flex-col gap-4">
                <div
                  className={`w-12 h-12 rounded-xl ${feature.bg} ${feature.color} flex items-center justify-center`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed flex-1">
                  {feature.description}
                </p>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-1 text-sm text-[var(--accent-1)] hover:text-[var(--accent-2)] transition-colors mt-2"
                >
                  Try it now <ArrowRight className="w-4 h-4" />
                </Link>
              </GlassCard>
            </FadeInUp>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

/* ===== How It Works ===== */
function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      icon: <Lightbulb className="w-5 h-5" />,
      title: "Describe Your Decision",
      description: "Tell us your situation, your goal, and the choices you're considering.",
    },
    {
      num: "02",
      icon: <Zap className="w-5 h-5" />,
      title: "AI Analyzes",
      description: "Four specialized AI agents analyze your decision from every angle.",
    },
    {
      num: "03",
      icon: <Eye className="w-5 h-5" />,
      title: "See Possible Futures",
      description: "View detailed timeline simulations with charts, scores, and insights.",
    },
    {
      num: "04",
      icon: <Target className="w-5 h-5" />,
      title: "Decide with Confidence",
      description: "Get a clear recommendation and export your report as a PDF.",
    },
  ];

  return (
    <section className="py-24 px-6" id="how-it-works">
      <div className="max-w-5xl mx-auto">
        <StaggerContainer className="text-center mb-16">
          <FadeInUp>
            <p className="text-sm font-medium text-[var(--accent-1)] mb-3 tracking-wider uppercase">
              How It Works
            </p>
          </FadeInUp>
          <FadeInUp>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Four steps to{" "}
              <span className="text-[var(--text-tertiary)]">clarity.</span>
            </h2>
          </FadeInUp>
        </StaggerContainer>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => (
            <FadeInUp key={step.num}>
              <div className="flex flex-col items-center text-center gap-4 p-6">
                <div className="w-14 h-14 rounded-2xl glass flex items-center justify-center text-[var(--accent-1)]">
                  {step.icon}
                </div>
                <span className="text-xs font-mono text-[var(--text-tertiary)]">
                  {step.num}
                </span>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  {step.description}
                </p>
              </div>
            </FadeInUp>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

/* ===== Testimonials ===== */
function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "I was torn between an internship and a full-time job. Tomorrow Me showed me timelines I hadn't even considered. I went with the internship and it turned into my dream role.",
      name: "Priya S.",
      role: "CS Student, IIT Delhi",
    },
    {
      quote:
        "The Reality Check feature saved me from following terrible LinkedIn advice. It caught biases I completely missed.",
      name: "Arjun K.",
      role: "Fresh Graduate, Mumbai",
    },
    {
      quote:
        "Mind Mirror helped me realize I was making big career decisions while burned out. I waited, recovered, and chose so much better.",
      name: "Sneha R.",
      role: "Junior Developer, Bangalore",
    },
  ];

  return (
    <section className="py-24 px-6" id="testimonials">
      <div className="max-w-6xl mx-auto">
        <StaggerContainer className="text-center mb-16">
          <FadeInUp>
            <p className="text-sm font-medium text-[var(--accent-1)] mb-3 tracking-wider uppercase">
              Testimonials
            </p>
          </FadeInUp>
          <FadeInUp>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Real people.{" "}
              <span className="text-[var(--text-tertiary)]">Better decisions.</span>
            </h2>
          </FadeInUp>
        </StaggerContainer>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <FadeInUp key={t.name}>
              <GlassCard className="flex flex-col gap-4 h-full">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Sparkles
                      key={i}
                      className="w-4 h-4 text-[var(--accent-2)]"
                    />
                  ))}
                </div>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed flex-1 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <p className="font-medium text-sm">{t.name}</p>
                  <p className="text-xs text-[var(--text-tertiary)]">{t.role}</p>
                </div>
              </GlassCard>
            </FadeInUp>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}

/* ===== FAQ ===== */
function FAQSection() {
  const faqs = [
    {
      q: "Does Tomorrow Me predict the future?",
      a: "No. Tomorrow Me simulates plausible outcomes based on patterns and evidence. It helps you think through possibilities, not predict what will happen.",
    },
    {
      q: "What AI does it use?",
      a: "Tomorrow Me uses a multi-agent AI system with specialized agents for future simulation, reality checking, psychology analysis, and final recommendations.",
    },
    {
      q: "Is my data private?",
      a: "Yes. Your decisions and analyses are stored securely and are only accessible to you. We don't share or sell your data.",
    },
    {
      q: "Is it free?",
      a: "Yes, Tomorrow Me is free to use. We believe everyone deserves access to better decision-making tools.",
    },
    {
      q: "Who is this for?",
      a: "College students, fresh graduates, early professionals — anyone facing important life decisions and wanting to think them through more carefully.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-24 px-6" id="faq">
      <div className="max-w-3xl mx-auto">
        <StaggerContainer className="text-center mb-16">
          <FadeInUp>
            <p className="text-sm font-medium text-[var(--accent-1)] mb-3 tracking-wider uppercase">
              FAQ
            </p>
          </FadeInUp>
          <FadeInUp>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Questions?{" "}
              <span className="text-[var(--text-tertiary)]">Answered.</span>
            </h2>
          </FadeInUp>
        </StaggerContainer>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full glass rounded-xl p-5 text-left flex items-center justify-between hover:bg-[var(--surface-2)] transition-colors"
              >
                <span className="font-medium text-sm pr-4">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-[var(--text-tertiary)] shrink-0 transition-transform ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              <motion.div
                initial={false}
                animate={{
                  height: openIndex === i ? "auto" : 0,
                  opacity: openIndex === i ? 1 : 0,
                }}
                className="overflow-hidden"
              >
                <p className="px-5 py-3 text-sm text-[var(--text-secondary)] leading-relaxed">
                  {faq.a}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===== Footer ===== */
function FooterSection() {
  return (
    <footer className="py-12 px-6 border-t border-[var(--border-subtle)]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[var(--accent-1)]" />
          <span className="font-semibold">Tomorrow Me</span>
        </div>
        <nav className="flex gap-6 text-sm text-[var(--text-secondary)]">
          <a href="#features" className="hover:text-[var(--text-primary)] transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-[var(--text-primary)] transition-colors">How It Works</a>
          <a href="#testimonials" className="hover:text-[var(--text-primary)] transition-colors">Testimonials</a>
          <a href="#faq" className="hover:text-[var(--text-primary)] transition-colors">FAQ</a>
        </nav>
        <p className="text-xs text-[var(--text-tertiary)]">
          © 2025 Tomorrow Me. Built with AI.
        </p>
      </div>
    </footer>
  );
}
