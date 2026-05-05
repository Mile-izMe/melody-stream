"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/src/stores/use-auth";
import { LoginModal } from "@/src/components/auth/LoginModal";
import { RegisterModal } from "@/src/components/auth/RegisterModal";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(true);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push("/");
    }
  }, [user, router]);

  const handleOpenLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  const handleOpenRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  const handleCloseLogin = () => {
    setIsLoginOpen(false);
  };

  const handleCloseRegister = () => {
    setIsRegisterOpen(false);
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-linear-to-br from-slate-900 via-slate-900 to-slate-800">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-1/2 -right-1/4 w-200 h-200 bg-linear-to-tl from-purple-600/20 to-blue-600/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              y: [0, 20, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute -bottom-1/2 -left-1/4 w-200 h-200 bg-linear-to-tr from-blue-600/20 to-cyan-600/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/2 left-1/3 w-150 h-150 bg-linear-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-3xl"
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full h-full">
        <LoginModal
          isOpen={isLoginOpen}
          onClose={handleCloseLogin}
          onSwitchToRegister={handleOpenRegister}
        />

        <RegisterModal
          isOpen={isRegisterOpen}
          onClose={handleCloseRegister}
          onSwitchToLogin={handleOpenLogin}
        />
      </div>
    </div>
  );
}
