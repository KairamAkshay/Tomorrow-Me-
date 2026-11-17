/** Reset Password page */

"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Eye, EyeOff, KeyRound, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FloatingParticles } from "@/components/shared/floating-particles";
import { auth } from "@/lib/api";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Missing or invalid reset token. Please request a new link.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/\d/.test(newPassword)) {
      setError("Password must contain at least one uppercase letter, one lowercase letter, and one number");
      return;
    }

    setLoading(true);

    try {
      await auth.resetPassword({
        token,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass rounded-2xl p-8">
      <div className="w-12 h-12 rounded-xl bg-[var(--accent-1)]/10 text-[var(--accent-1)] flex items-center justify-center mx-auto mb-4">
        <KeyRound className="w-6 h-6" />
      </div>

      <h1 className="text-2xl font-bold text-center mb-2">Set New Password</h1>
      <p className="text-sm text-[var(--text-secondary)] text-center mb-6">
        Create a new, strong password for your account
      </p>

      {success ? (
        <div className="flex flex-col gap-4 text-center">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <p className="text-sm text-[var(--text-secondary)]">
            Your password has been successfully reset! You can now sign in with your new password.
          </p>
          <Link
            href="/login"
            className="w-full h-11 rounded-xl bg-[var(--accent-1)] hover:bg-[var(--accent-2)] text-white text-sm font-medium flex items-center justify-center mt-2 transition-colors"
          >
            Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Min 8 chars, 1 upper, 1 lower, 1 digit"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="bg-[var(--surface-2)] border-[var(--border-default)] focus:border-[var(--accent-1)] rounded-xl h-11 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Repeat your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
            className="w-full h-11 rounded-xl bg-[var(--accent-1)] hover:bg-[var(--accent-2)] text-white font-medium mt-2"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Resetting password...
              </span>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
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

        <Suspense fallback={
          <div className="glass rounded-2xl p-8 flex justify-center">
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        }>
          <ResetPasswordForm />
        </Suspense>
      </motion.div>
    </main>
  );
}
