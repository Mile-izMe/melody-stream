"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  User as UserIcon,
  Lock,
  Mail,
  X,
  Check,
} from "lucide-react";
import { motion } from "framer-motion";
import { requestRegister } from "@/src/features/graphql/mutations/auth";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToLogin: () => void;
}

export function RegisterModal({
  isOpen,
  onClose,
  onSwitchToLogin,
}: RegisterModalProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    if (!username || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validateForm()) return;
    setLoading(true);

    try {
      const response = await requestRegister({ username, email, password });
      if (!response.register.data) {
        throw new Error(response.register.message || "Registration failed");
      }

      setSuccess(true);
      setTimeout(() => {
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setSuccess(false);
        onClose();
        onSwitchToLogin();
      }, 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const passwordsMatch = confirmPassword && password === confirmPassword;
  const passwordsMismatch = confirmPassword && password !== confirmPassword;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ms-bg-deep/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm max-h-[90vh] bg-ms-bg-raised rounded-2xl p-7 border border-ms-border-default shadow-2xl relative overflow-y-auto"
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
            Create an account
          </h1>
          <p className="text-sm text-ms-text-secondary">
            Join MelodyStream and start uploading
          </p>
        </div>

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-lg text-sm mb-5 bg-ms-success/10 border border-ms-success/20 text-ms-success flex items-center gap-2"
          >
            <Check size={16} />
            Account created. Redirecting to sign in...
          </motion.div>
        )}

        {error && (
          <div className="p-3 rounded-lg text-sm mb-5 bg-ms-error/10 border border-ms-error/20 text-ms-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="register-username"
              className="text-xs font-semibold text-ms-text-secondary"
            >
              Username
            </label>
            <div className="relative">
              <UserIcon
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ms-text-tertiary"
                size={16}
              />
              <input
                id="register-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-ms-bg-elevated border border-ms-border-default focus:border-ms-accent rounded-xl outline-none text-sm text-ms-text-primary placeholder:text-ms-text-tertiary ms-transition"
                placeholder="Choose a username"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="register-email"
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
                id="register-email"
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
              htmlFor="register-password"
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
                id="register-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-ms-bg-elevated border border-ms-border-default focus:border-ms-accent rounded-xl outline-none text-sm text-ms-text-primary placeholder:text-ms-text-tertiary ms-transition"
                placeholder="Min. 6 characters"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="register-confirm"
              className="text-xs font-semibold text-ms-text-secondary"
            >
              Confirm Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ms-text-tertiary"
                size={16}
              />
              <input
                id="register-confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-ms-bg-elevated border border-ms-border-default focus:border-ms-accent rounded-xl outline-none text-sm text-ms-text-primary placeholder:text-ms-text-tertiary ms-transition"
                placeholder="Repeat your password"
                required
              />
            </div>
            {passwordsMatch && (
              <p className="text-xs text-ms-success flex items-center gap-1 px-1">
                <Check size={12} /> Passwords match
              </p>
            )}
            {passwordsMismatch && (
              <p className="text-xs text-ms-error px-1">
                Passwords do not match
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ms-accent text-ms-bg-deep font-semibold py-3 rounded-xl hover:bg-ms-accent-hover active:scale-[0.98] flex items-center justify-center gap-2 ms-transition disabled:opacity-50 mt-2"
          >
            {loading ? (
              <span>Creating account...</span>
            ) : (
              <>
                <span>Create Account</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-ms-border-subtle text-center">
          <button
            onClick={() => {
              onClose();
              onSwitchToLogin();
            }}
            className="text-sm text-ms-accent-text hover:text-ms-accent ms-transition"
          >
            Already have an account? Sign in
          </button>
        </div>
      </motion.div>
    </div>
  );
}
