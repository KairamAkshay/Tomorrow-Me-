/** Forgot Password page */

"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, KeyRound, Mail, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FloatingParticles } from "@/components/shared/floating-particles";
import { auth } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [resetUrl, setResetUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await auth.forgotPassword({ email: email.trim().toLowerCase() });
      setMessage(res.message);
      if (res.reset_url) {
        setResetUrl(res.reset_url);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to process request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex items-center justify-center min-h-screen px-6">
      <FloatingParticles count={25} />

      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-center gap-2 mb-8">
          <Sparkles className="w-6 h-6 text-[var(--accent-1)]" />
          <span className="text-xl font-semibold">Tomorrow Me</span>
        </div>

        <div className="glass rounded-2xl p-8">
          <div className="w-12 h-12 rounded-xl bg-[var(--accent-1)]/10 text-[var(--accent-1)] flex items-center justify-center mx-auto mb-4">
            <KeyRound className="w-6 h-6" />
          </div>

          <h1 className="text-2xl font-bold text-center mb-2">Reset Password</h1>
          <p className="text-sm text-[var(--text-secondary)] text-center mb-6">
            Enter your email to receive a password reset link
          </p>

          {message ? (
            <div className="flex flex-col gap-4">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm leading-relaxed">
                {message}
              </div>
              {resetUrl && (
                <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border-default)] text-xs flex flex-col gap-2">
                  <span className="font-semibold text-[var(--text-primary)]">Development Link:</span>
                  <Link href={resetUrl} className="text-[var(--accent-1)] break-all hover:underline">
                    {resetUrl}
                  </Link>
                </div>
              )}
              <Link
                href="/login"
                className="w-full h-11 rounded-xl bg-[var(--accent-1)] hover:bg-[var(--accent-2)] text-white text-sm font-medium flex items-center justify-center mt-2 transition-colors"
              >
                Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-[var(--surface-2)] border-[var(--border-default)] focus:border-[var(--accent-1)] rounded-xl h-11"
                />
              </div>

              {error && (
                <p className="text-sm text-[var(--danger)] text-center">{error}</p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-11 rounded-xl bg-[var(--accent-1)] hover:bg-[var(--accent-2)] text-white font-medium"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending link...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Send Reset Link
                  </span>
                )}
              </Button>

              <div className="text-center mt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </main>
  );
}
