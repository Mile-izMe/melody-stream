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
      setError("Vui lòng điền tất cả các trường");
      return false;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return false;
    }

    if (!email.includes("@")) {
      setError("Email không hợp lệ");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Fake register - just show success
      const userData = {
        id: Date.now().toString(),
        username,
        email,
        token: Math.random().toString(36).substring(2),
      };
      // Don't login yet, just show success
      setSuccess(true);

      // Show success message then redirect to login
      setTimeout(() => {
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        onClose();
        onSwitchToLogin();
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const handleSocialRegister = async (provider: "google" | "facebook") => {
    setLoading(true);
    setError("");

    try {
      // Fake social register - show success then redirect to login
      setSuccess(true);

      setTimeout(() => {
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        onClose();
        onSwitchToLogin();
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Đã có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="w-full max-w-md max-h-[90vh] bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl relative overflow-y-auto"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col items-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-center">
            Join MelodyStream
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Create an account to start uploading
          </p>
        </div>

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl text-sm mb-6 border bg-green-500/10 border-green-500/20 text-green-400 flex items-center gap-2"
          >
            <Check size={18} />
            Đăng ký thành công! Đang chuyển hướng...
          </motion.div>
        )}

        {error && (
          <div className="p-4 rounded-xl text-sm mb-6 border bg-red-500/10 border-red-500/20 text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 px-1">
              Username
            </label>
            <div className="relative">
              <UserIcon
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 focus:border-blue-500 focus:bg-white/10 rounded-2xl outline-none transition-all placeholder:text-gray-600 text-white"
                placeholder="Choose a username"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 px-1">
              Email
            </label>
            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 focus:border-blue-500 focus:bg-white/10 rounded-2xl outline-none transition-all placeholder:text-gray-600 text-white"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 px-1">
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 focus:border-blue-500 focus:bg-white/10 rounded-2xl outline-none transition-all placeholder:text-gray-600 text-white"
                placeholder="Create a password (min. 6 characters)"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 px-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 focus:border-blue-500 focus:bg-white/10 rounded-2xl outline-none transition-all placeholder:text-gray-600 text-white"
                placeholder="Confirm your password"
                required
              />
            </div>
            {confirmPassword && password === confirmPassword && (
              <p className="text-xs text-green-400 px-1 flex items-center gap-1">
                <Check size={14} /> Passwords match
              </p>
            )}
            {confirmPassword && password !== confirmPassword && (
              <p className="text-xs text-red-400 px-1">
                Passwords don&apos;t match
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-bold py-4 rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 group mt-6"
          >
            <span>{loading ? "Creating Account..." : "Create Account"}</span>
            {!loading && (
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="text-xs text-gray-500 text-center mb-4">
            Or sign up with
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => handleSocialRegister("google")}
              disabled={loading}
              className="flex-1 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="text-sm">Google</span>
            </button>
            <button
              onClick={() => handleSocialRegister("facebook")}
              disabled={loading}
              className="flex-1 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                />
              </svg>
              <span className="text-sm">Facebook</span>
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <button
            onClick={() => {
              onClose();
              onSwitchToLogin();
            }}
            className="text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
          >
            Already have an account? Sign in
          </button>
        </div>
      </motion.div>
    </div>
  );
}
