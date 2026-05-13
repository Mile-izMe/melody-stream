"use client";

import { useAuth } from "@/src/stores/use-auth-store";
import {
  Home as HomeIcon,
  LogIn,
  LogOut,
  Upload as UploadIcon,
  Search,
  Play,
  Heart,
  Library,
  MoonStar,
  SunMedium,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useTheme } from "@/src/providers/theme-provider";

interface LayoutProps {
  children: React.ReactNode;
}

function NavLink({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ms-transition
        ${
          active
            ? "bg-ms-accent-subtle text-ms-accent font-semibold"
            : "text-ms-text-secondary hover:text-ms-text-primary hover:bg-ms-bg-elevated"
        }
      `}
    >
      <Icon size={18} />
      <span>{label}</span>
    </Link>
  );
}

/* Auth-gated button — prompts login instead of navigating */
function AuthGatedLink({
  href,
  icon: Icon,
  label,
  active,
  isAuthed,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
  isAuthed: boolean;
}) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    if (!isAuthed) {
      e.preventDefault();
      router.push("/login");
    }
  };

  return (
    <Link
      href={href}
      onClick={handleClick}
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ms-transition
        ${
          active
            ? "bg-ms-accent-subtle text-ms-accent font-semibold"
            : "text-ms-text-secondary hover:text-ms-text-primary hover:bg-ms-bg-elevated"
        }
      `}
    >
      <Icon size={18} />
      <span>{label}</span>
      {!isAuthed && (
        <span className="ml-auto text-[9px] uppercase tracking-widest font-semibold text-ms-text-tertiary bg-ms-bg-elevated px-1.5 py-0.5 rounded">
          Sign in
        </span>
      )}
    </Link>
  );
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const isAuthed = Boolean(user);
  const { toggleTheme } = useTheme();

  return (
    <div className="flex flex-col h-screen relative z-10">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-60 bg-ms-bg-raised border-r border-ms-border-subtle hidden md:flex flex-col z-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 px-6 py-5 border-b border-ms-border-subtle"
          >
            <div className="size-7 rounded-lg bg-ms-accent flex items-center justify-center">
              <Play size={14} className="text-ms-accent-text ml-0.5" />
            </div>
            <span className="text-base font-bold tracking-tight text-ms-text-primary">
              MelodyStream
            </span>
          </Link>

          {/* Browse — open to everyone */}
          <nav className="px-3 py-4 space-y-1">
            <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-ms-text-tertiary">
              Browse
            </p>
            <NavLink
              href="/"
              icon={HomeIcon}
              label="Home"
              active={pathname === "/"}
            />
            <NavLink
              href="/search"
              icon={Search}
              label="Search"
              active={pathname === "/search"}
            />
          </nav>

          {/* Your stuff — auth-gated */}
          <nav className="px-3 pb-4 space-y-1">
            <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-ms-text-tertiary">
              Your Music
            </p>
            <AuthGatedLink
              href="/upload"
              icon={UploadIcon}
              label="Upload"
              active={pathname === "/upload"}
              isAuthed={isAuthed}
            />
            <AuthGatedLink
              href="/library"
              icon={Library}
              label="Library"
              active={pathname === "/library"}
              isAuthed={isAuthed}
            />
            <AuthGatedLink
              href="/liked"
              icon={Heart}
              label="Liked Songs"
              active={pathname === "/liked"}
              isAuthed={isAuthed}
            />
          </nav>

          <div className="px-3 pb-4">
            <button
              type="button"
              onClick={toggleTheme}
              className="cursor-pointer w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg bg-ms-bg-elevated border border-ms-border-subtle text-sm text-ms-text-secondary hover:text-ms-text-primary ms-transition"
              aria-label="Toggle theme"
            >
              <span className="flex items-center gap-2 min-w-0">
                <MoonStar size={16} className="block dark:hidden" />
                <SunMedium size={16} className="hidden dark:block" />
                <span className="truncate">Theme</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-ms-text-tertiary">
                <span className="dark:hidden">Dark</span>
                <span className="hidden dark:inline">Light</span>
              </span>
            </button>
          </div>

          {/* User section */}
          <div className="px-3 pb-25 mt-auto">
            {user ? (
              <div className="rounded-xl bg-ms-bg-elevated border border-ms-border-subtle p-3.5 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="size-8 rounded-full bg-ms-accent flex items-center justify-center text-ms-accent-text text-xs font-bold uppercase shrink-0">
                    {user.username.substring(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate text-ms-text-primary">
                      {user.username}
                    </p>
                    <p className="text-[10px] text-ms-text-tertiary uppercase tracking-widest font-semibold">
                      Creator
                    </p>
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs text-ms-error border border-ms-error/20 hover:bg-ms-error/8 ms-transition"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-ms-text-tertiary text-center px-2">
                  Sign in to upload, save, and build your library.
                </p>
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-ms-accent text-ms-accent-text font-semibold text-sm hover:bg-ms-accent-hover active:scale-[0.98] ms-transition"
                >
                  <LogIn size={16} />
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto relative z-0">
          {/* Mobile header */}
          <div className="sticky top-0 z-30 h-14 flex md:hidden items-center justify-between px-4 bg-ms-bg-raised/95 backdrop-blur-md border-b border-ms-border-subtle">
            <Link href="/" className="flex items-center gap-2">
              <div className="size-6 rounded bg-ms-accent flex items-center justify-center">
                <Play size={11} className="text-ms-accent-text ml-0.5" />
              </div>
              <span className="text-sm font-bold">MelodyStream</span>
            </Link>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={toggleTheme}
                className="text-ms-text-secondary hover:text-ms-text-primary ms-transition"
                aria-label="Toggle theme"
              >
                <MoonStar size={18} className="block dark:hidden" />
                <SunMedium size={18} className="hidden dark:block" />
              </button>
              <Link
                href="/search"
                className="text-ms-text-secondary hover:text-ms-text-primary ms-transition"
              >
                <Search size={20} />
              </Link>
              {user ? (
                <button
                  onClick={logout}
                  className="text-ms-text-secondary hover:text-ms-text-primary ms-transition"
                >
                  <LogOut size={18} />
                </button>
              ) : (
                <Link
                  href="/login"
                  className="text-xs font-semibold text-ms-accent hover:text-ms-accent-hover ms-transition"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>

          <div className="w-full h-full">{children}</div>
        </main>
      </div>
    </div>
  );
};
