"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Zap,
  Music,
  Users,
  Upload,
  LogOut,
  Disc3,
  Volume2,
  ListMusic,
} from "lucide-react";
import { useAuth } from "@/src/stores/use-auth";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { requestSongs, type SongItem } from "@/src/graphql/queries/songs";
import { Spinner } from "@/src/components/ui/spinner";
import { attachHlsStream, resolveStreamUrl } from "@/src/services/hls";

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainSeconds.toString().padStart(2, "0")}`;
}

export default function Home() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [activeSong, setActiveSong] = useState<SongItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const songsQuery = useQuery({
    queryKey: ["songs", user?.id],
    enabled: Boolean(user?.token),
    queryFn: async () => {
      if (!user?.token) {
        return {
          count: 0,
          cursor: undefined as string | undefined,
          data: [],
        };
      }

      const response = await requestSongs(
        {
          filters: {
            pageNumber: 1,
            limit: 12,
          },
        },
        user.token,
      );

      return response.songs.data;
    },
    // Worker converts uploaded song to HLS asynchronously.
    // Poll to display the track once playlist.m3u8 is ready.
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (!activeSong || !audioRef.current) {
      return;
    }

    const audio = audioRef.current;
    const streamUrl = resolveStreamUrl(activeSong.audioUrl);
    const cleanup = attachHlsStream(audio, streamUrl);

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime || 0);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      void audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
      cleanup();
    };
  }, [activeSong]);

  const handleSelectSong = (song: SongItem) => {
    if (activeSong?.id === song.id) {
      const audio = audioRef.current;
      if (!audio) return;

      if (isPlaying) {
        audio.pause();
        setIsPlaying(false);
      } else {
        void audio
          .play()
          .then(() => setIsPlaying(true))
          .catch(() => setIsPlaying(false));
      }
      return;
    }

    setCurrentTime(0);
    setDuration(0);
    setActiveSong(song);
  };

  const handleTogglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      void audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  const handleSeek = (nextProgress: number) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;

    const nextTime = (nextProgress / 100) * duration;
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleUpload = () => {
    router.push("/upload");
  };

  // If user is logged in, show dashboard
  if (user) {
    return (
      <div className="flex flex-col flex-1 bg-black text-white pb-32">
        {/* User Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-white/10 backdrop-blur-xl"
        >
          <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-linear-to-tr from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {user.username?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
              <div>
                <p className="font-bold text-lg">{user.username}</p>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <motion.button
                onClick={handleUpload}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-purple-500 to-blue-500 rounded-xl font-bold hover:shadow-lg hover:shadow-purple-500/50 transition-shadow"
              >
                <Upload size={18} />
                Upload Music
              </motion.button>

              <motion.button
                onClick={handleLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 border border-white/20 rounded-xl font-bold hover:bg-white/10 transition-colors"
              >
                <LogOut size={18} />
                Logout
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <section className="flex-1 flex flex-col items-center justify-center px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold mb-6">
              Welcome back,{" "}
              <span className="bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {user.username}
              </span>
              !
            </h1>
            <p className="text-xl text-gray-400 mb-12">
              Ready to share your music with the world?
            </p>

            <motion.button
              onClick={handleUpload}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-10 py-4 bg-white text-black font-bold rounded-2xl hover:shadow-xl transition-shadow text-lg"
            >
              Start Uploading
            </motion.button>
          </motion.div>
        </section>

        <section className="px-8 pb-20">
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Your Media Library</h2>
              {songsQuery.isFetching ? (
                <div className="inline-flex items-center gap-2 text-sm text-gray-400">
                  <Spinner className="size-4" />
                  Syncing processed tracks...
                </div>
              ) : null}
            </div>

            {songsQuery.isLoading ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center text-gray-300 inline-flex items-center gap-3">
                <Spinner className="size-5" />
                Loading songs...
              </div>
            ) : songsQuery.data?.data?.length ? (
              <div className="grid gap-4 md:grid-cols-2">
                {songsQuery.data.data.map((song, idx) => {
                  const isActive = activeSong?.id === song.id;
                  const gradients = [
                    "from-indigo-700/80 via-violet-800/80 to-fuchsia-700/70",
                    "from-blue-800/80 via-cyan-800/70 to-emerald-700/70",
                    "from-zinc-800/80 via-slate-800/70 to-indigo-700/70",
                  ];
                  const gradientClass = gradients[idx % gradients.length];

                  return (
                    <article
                      key={song.id}
                      className={`rounded-3xl border border-white/15 bg-linear-to-r ${gradientClass} p-5 shadow-xl overflow-hidden`}
                    >
                      <div className="flex items-center gap-5">
                        {song.thumbnailUrl ? (
                          <Image
                            src={song.thumbnailUrl}
                            alt={song.title}
                            width={84}
                            height={84}
                            className="size-24 rounded-2xl object-cover border border-white/20 shadow-lg"
                          />
                        ) : (
                          <div className="size-24 rounded-2xl border border-dashed border-white/30 bg-white/10 flex items-center justify-center">
                            <Disc3 className="size-10 text-white/75" />
                          </div>
                        )}

                        <div className="min-w-0 flex-1">
                          <h3 className="text-2xl font-bold leading-tight truncate">
                            {song.title}
                          </h3>
                          <p className="text-white/80 truncate mt-1">
                            {song.artist}
                          </p>

                          <button
                            type="button"
                            onClick={() => handleSelectSong(song)}
                            className="mt-4 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white text-black font-semibold shadow-lg hover:scale-[1.02] transition-transform"
                          >
                            {isActive && isPlaying ? (
                              <Pause size={16} />
                            ) : (
                              <Play size={16} />
                            )}
                            {isActive && isPlaying ? "Pause" : "Play Now"}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-gray-300">
                <div className="inline-flex items-center gap-3">
                  <Spinner className="size-5" />
                  No HLS track yet. If you just uploaded, worker is processing
                  to playlist.m3u8...
                </div>
              </div>
            )}
          </div>
        </section>

        {activeSong ? (
          <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#141414]/95 backdrop-blur-2xl px-4 py-3 shadow-[0_-10px_30px_rgba(0,0,0,0.35)]">
            <audio ref={audioRef} preload="metadata" className="hidden" />

            <div className="max-w-7xl mx-auto flex flex-col gap-3 md:flex-row md:items-center md:gap-6">
              <div className="flex items-center gap-3 min-w-0 md:w-1/4">
                {activeSong.thumbnailUrl ? (
                  <Image
                    src={activeSong.thumbnailUrl}
                    alt={activeSong.title}
                    width={48}
                    height={48}
                    className="size-12 rounded-md object-cover border border-white/15 shadow-md"
                  />
                ) : (
                  <div className="size-12 rounded-md bg-white/10 border border-white/15 flex items-center justify-center shrink-0">
                    <Disc3 className="size-5 text-violet-300" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-semibold truncate leading-tight">
                    {activeSong.title}
                  </p>
                  <p className="text-sm text-gray-400 truncate">
                    {activeSong.artist}
                  </p>
                </div>
              </div>

              <div className="flex-1 flex flex-col items-center gap-2">
                <div className="flex items-center gap-5 text-gray-300">
                  <button
                    type="button"
                    className="hover:text-white transition-colors"
                  >
                    <Shuffle size={18} />
                  </button>
                  <button
                    type="button"
                    className="hover:text-white transition-colors"
                  >
                    <SkipBack size={20} />
                  </button>
                  <button
                    type="button"
                    onClick={handleTogglePlay}
                    className="size-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
                  >
                    {isPlaying ? (
                      <Pause size={18} />
                    ) : (
                      <Play size={18} className="ml-0.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    className="hover:text-white transition-colors"
                  >
                    <SkipForward size={20} />
                  </button>
                  <button
                    type="button"
                    className="hover:text-white transition-colors"
                  >
                    <Repeat size={18} />
                  </button>
                </div>

                <div className="flex items-center gap-3 w-full max-w-4xl">
                  <span className="text-xs text-gray-400 w-10 text-right tabular-nums">
                    {formatTime(currentTime)}
                  </span>

                  <div className="relative flex-1 h-1.5 rounded-full bg-white/15 overflow-hidden">
                    <div
                      className="absolute left-0 top-0 h-full rounded-full bg-orange-400"
                      style={{
                        width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                      }}
                    />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={duration ? (currentTime / duration) * 100 : 0}
                      onChange={(e) => handleSeek(Number(e.target.value))}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>

                  <span className="text-xs text-gray-400 w-10 tabular-nums">
                    {formatTime(duration)}
                  </span>
                </div>
              </div>

              <div className="hidden md:flex items-center justify-end gap-4 md:w-1/4 text-gray-300">
                <button
                  type="button"
                  className="hover:text-white transition-colors"
                >
                  <Volume2 size={18} />
                </button>
                <button
                  type="button"
                  className="hover:text-white transition-colors"
                >
                  <ListMusic size={18} />
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  }

  // If not logged in, show marketing page
  return (
    <div className="flex flex-col flex-1 bg-black text-white">
      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl text-center"
        >
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-linear-to-tr from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/50">
              <Play size={40} fill="white" className="text-white ml-1" />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Welcome to{" "}
            <span className="bg-linear-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              MelodyStream
            </span>
          </h1>

          <p className="text-xl text-gray-400 mb-10">
            Stream, upload, and discover music like never before. A modern
            platform built with cutting-edge technology.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <motion.a
              href="/login"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-black font-bold rounded-2xl hover:shadow-xl transition-shadow"
            >
              Get Started
            </motion.a>
            <motion.a
              href="#features"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-white font-bold rounded-2xl hover:bg-white/10 transition-colors"
            >
              Learn More
            </motion.a>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-8 py-20 bg-white/5 backdrop-blur-xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl font-bold text-center mb-16"
        >
          Powerful Features
        </motion.h2>

        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <Music size={32} />,
              title: "Stream Quality",
              desc: "Crystal-clear audio with adaptive bitrate streaming",
            },
            {
              icon: <Zap size={32} />,
              title: "Lightning Fast",
              desc: "Optimized for speed and performance across all devices",
            },
            {
              icon: <Users size={32} />,
              title: "Community",
              desc: "Discover artists and share your favorite tracks",
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors"
            >
              <div className="text-purple-400 mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-8 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto bg-linear-to-r from-purple-600 to-blue-600 rounded-3xl p-12 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to dive in?</h2>
          <p className="text-lg mb-8 text-white/80">
            Join thousands of music lovers and creators on MelodyStream
          </p>
          <motion.a
            href="/login"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-8 py-4 bg-white text-black font-bold rounded-2xl hover:shadow-xl transition-shadow"
          >
            Sign Up Now
          </motion.a>
        </motion.div>
      </section>
    </div>
  );
}
