"use client";

import { LoginModal } from "@/src/components/auth/LoginModal";
import { RegisterModal } from "@/src/components/auth/RegisterModal";
import { useAuth } from "@/src/stores/use-auth-store";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoginPage() {
  const [isLoginOpen, setIsLoginOpen] = useState(true);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) router.push("/");
  }, [user, router]);

  const handleOpenLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  const handleOpenRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      {/* Background — warm dark with subtle depth */}
      <div className="absolute inset-0 bg-ms-bg-deep">
        <div className="absolute inset-0 overflow-hidden">
          {/* Subtle warm glow — top right */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-1/3 -right-1/4 w-[600px] h-[600px] rounded-full blur-[120px]"
            style={{ background: "oklch(0.70 0.18 38 / 6%)" }}
          />
          {/* Subtle warm glow — bottom left */}
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
            className="absolute -bottom-1/3 -left-1/4 w-[500px] h-[500px] rounded-full blur-[120px]"
            style={{ background: "oklch(0.70 0.18 38 / 4%)" }}
          />
        </div>

        {/* Centered branding */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className="flex items-center gap-3 mb-3">
            <div className="size-10 rounded-xl bg-ms-accent flex items-center justify-center">
              <Play size={20} className="text-ms-bg-deep ml-0.5" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-ms-text-primary">
              MelodyStream
            </span>
          </div>
          <p className="text-sm text-ms-text-tertiary">
            Your music, your stage.
          </p>
        </div>
      </div>

      {/* Auth modals */}
      <div className="relative z-10 w-full h-full">
        <LoginModal
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          onSwitchToRegister={handleOpenRegister}
        />
        <RegisterModal
          isOpen={isRegisterOpen}
          onClose={() => setIsRegisterOpen(false)}
          onSwitchToLogin={handleOpenLogin}
        />
      </div>
    </div>
  );
}
