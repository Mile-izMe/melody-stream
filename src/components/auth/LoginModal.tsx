"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/stores/use-auth-store";
import { ArrowRight, Mail, Lock, X } from "lucide-react";
import { motion } from "framer-motion";
import {
  decodeJwtPayload,
  deriveUsernameFromEmail,
  getOrCreateDeviceId,
} from "@/src/libs/auth-session";
import { requestLogin } from "@/src/features/graphql/mutations/auth";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export function LoginModal({
  isOpen,
  onClose,
  onSwitchToRegister,
}: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const deviceId = getOrCreateDeviceId();
      const response = await requestLogin({
        email,
        password,
        deviceId,
      });

      const session = response.login.data;
      if (!session) {
        throw new Error(response.login.message || "Unable to sign in");
      }

      const decoded = decodeJwtPayload(session.accessToken);
      login({
        id: decoded?.sub ?? email,
        username: deriveUsernameFromEmail(email),
        email,
        token: session.accessToken,
        refreshToken: session.refreshToken,
        deviceId,
      });

      setEmail("");
      setPassword("");
      onClose();
      router.push("/");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ms-bg-deep/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm bg-ms-bg-raised rounded-2xl p-7 border border-ms-border-default shadow-2xl relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-ms-text-tertiary hover:text-ms-text-primary ms-transition"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight mb-1.5">
            Welcome back
          </h1>
          <p className="text-sm text-ms-text-secondary">
            Sign in to your account to continue
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg text-sm mb-5 bg-ms-error/10 border border-ms-error/20 text-ms-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="login-email"
              className="text-xs font-semibold text-ms-text-secondary"
            >
              Email
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ms-text-tertiary"
                size={16}
              />
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-ms-bg-elevated border border-ms-border-default focus:border-ms-accent rounded-xl outline-none text-sm text-ms-text-primary placeholder:text-ms-text-tertiary ms-transition"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="login-password"
              className="text-xs font-semibold text-ms-text-secondary"
            >
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ms-text-tertiary"
                size={16}
              />
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-ms-bg-elevated border border-ms-border-default focus:border-ms-accent rounded-xl outline-none text-sm text-ms-text-primary placeholder:text-ms-text-tertiary ms-transition"
                placeholder="Your password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ms-accent text-ms-bg-deep font-semibold py-3 rounded-xl hover:bg-ms-accent-hover active:scale-[0.98] flex items-center justify-center gap-2 ms-transition disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span>Signing in...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-ms-border-subtle text-center">
          <button
            onClick={() => {
              onClose();
              onSwitchToRegister();
            }}
            className="text-sm text-ms-accent-text hover:text-ms-accent ms-transition"
          >
            No account? Create one
          </button>
        </div>
      </motion.div>
    </div>
  );
}
