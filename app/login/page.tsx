"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/stores/use-auth";
import { Play, ArrowRight, User as UserIcon, Lock } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const endpoint = isLogin ? "/api/login" : "/api/register";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Đã có lỗi xảy ra");
      }

      if (isLogin) {
        login(data);
        router.push("/");
      } else {
        // After register, auto login or switch to login
        setIsLogin(true);
        setPassword("");
        setError("Đăng ký thành công! Vui lòng đăng nhập.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center pt-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/10 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-blue-500"></div>

        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-purple-500/20">
            <Play size={32} fill="white" className="text-white ml-1" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-center">
            {isLogin ? "Welcome Back" : "Join MelodyStream"}
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            {isLogin
              ? "Enter your credentials to continue"
              : "Create an account to start uploading"}
          </p>
        </div>

        {error && (
          <div
            className={`p-4 rounded-xl text-sm mb-6 border ${
              error.includes("thành công")
                ? "bg-green-500/10 border-green-500/20 text-green-400"
                : "bg-red-500/10 border-red-500/20 text-red-400"
            }`}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 focus:border-purple-500 focus:bg-white/10 rounded-2xl outline-none transition-all placeholder:text-gray-600 text-white"
                placeholder="Enter your username"
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
                className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 focus:border-purple-500 focus:bg-white/10 rounded-2xl outline-none transition-all placeholder:text-gray-600 text-white"
                placeholder="Enter your password"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-bold py-4 rounded-2xl shadow-xl hover:scale-[1.02] active:scale-95 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 group mt-4"
          >
            <span>
              {loading
                ? "Processing..."
                : isLogin
                  ? "Sign In"
                  : "Create Account"}
            </span>
            {!loading && (
              <ArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            )}
          </button>
        </form>

        <div className="mt-10 pt-6 border-t border-white/5 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
