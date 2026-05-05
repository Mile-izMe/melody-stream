"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Home as HomeIcon,
  Upload as UploadIcon,
  LogIn,
  LogOut,
  Sun,
  Moon,
  Play,
} from "lucide-react";
import { useAuth } from "@/src/stores/use-auth";

interface LayoutProps {
  children: React.ReactNode;
  toggleTheme: () => void;
  isDarkMode: boolean;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  toggleTheme,
  isDarkMode,
}) => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex flex-col h-screen relative z-10">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white/5 backdrop-blur-xl border-r border-white/10 hidden md:flex flex-col p-6 space-y-8 z-20">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-lg flex items-center justify-center shadow-lg">
              <Play size={18} fill="white" className="text-white ml-0.5" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              MelodyStream
            </span>
          </Link>

          <nav className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              Discover
            </p>
            <Link
              href="/"
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${pathname === "/" ? "bg-white/10 text-white font-bold" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
            >
              <HomeIcon size={20} />
              <span>Trang chủ</span>
            </Link>
            {user && (
              <Link
                href="/upload"
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${pathname === "/upload" ? "bg-white/10 text-white font-bold" : "text-gray-400 hover:bg-white/5 hover:text-white"}`}
              >
                <UploadIcon size={20} />
                <span>Tải nhạc lên</span>
              </Link>
            )}
          </nav>

          <div className="mt-auto">
            {user ? (
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white uppercase">
                    {user.username.substring(0, 2)}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="text-sm font-medium truncate">
                      {user.username}
                    </p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                      Premium
                    </p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors text-sm border border-red-500/20"
                >
                  <LogOut size={16} />
                  <span>Đăng xuất</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white text-black font-bold text-sm hover:scale-105 active:scale-95 transition-transform"
              >
                <LogIn size={18} />
                <span>Đăng nhập</span>
              </Link>
            )}

            <button
              onClick={toggleTheme}
              className="mt-4 w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-white/5 transition-colors"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              <span>{isDarkMode ? "Chế độ sáng" : "Chế độ tối"}</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto relative z-0">
          {/* Header Mobile & Desktop Gradient Overlay */}
          <div className="sticky top-0 h-20 flex items-center justify-between px-8 bg-white/5 backdrop-blur-md z-30 border-b border-white/5">
            <div className="flex md:hidden items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-tr from-purple-500 to-blue-500 rounded flex items-center justify-center">
                <Play size={12} fill="white" className="text-white ml-0.5" />
              </div>
              <span className="font-bold">MelodyStream</span>
            </div>

            <div className="hidden md:flex gap-4">
              {/* Search placeholder or nav buttons */}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex bg-black/30 rounded-full p-1 border border-white/10">
                <button
                  onClick={() => !isDarkMode && toggleTheme()}
                  className={`px-4 py-1 rounded-full text-xs transition-all ${isDarkMode ? "bg-white text-black font-semibold" : "text-gray-400"}`}
                >
                  Dark
                </button>
                <button
                  onClick={() => isDarkMode && toggleTheme()}
                  className={`px-4 py-1 rounded-full text-xs transition-all ${!isDarkMode ? "bg-white text-black font-semibold" : "text-gray-400"}`}
                >
                  Light
                </button>
              </div>
              {user && (
                <button
                  onClick={logout}
                  className="hidden md:block px-6 py-2 rounded-full bg-white text-black font-bold text-sm hover:scale-105 active:scale-95 transition-transform"
                >
                  Đăng xuất
                </button>
              )}
            </div>
          </div>

          <div className="p-8 pb-32">{children}</div>
        </main>
      </div>
    </div>
  );
};
