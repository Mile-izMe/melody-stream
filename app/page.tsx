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
  Music,
  Upload,
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
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainSeconds.toString().padStart(2, "0")}`;
}

/* ─── Track list row ─── */
function TrackRow({
  song,
  index,
  isActive,
  isPlaying,
  onSelect,
}: {
  song: SongItem;
  index: number;
  isActive: boolean;
  isPlaying: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`
        w-full grid grid-cols-[2rem_1fr_5rem] sm:grid-cols-[2.5rem_2fr_1fr_5rem]
        gap-4 px-5 py-3 items-center text-left group ms-transition
        hover:bg-ms-bg-elevated
        ${isActive ? "bg-ms-accent-subtle" : ""}
      `}
    >
      {/* Number / play indicator */}
      <span className="text-sm tabular-nums flex items-center justify-center">
        {isActive && isPlaying ? (
          <Disc3
            size={16}
            className="text-ms-accent animate-spin"
            style={{ animationDuration: "3s" }}
          />
        ) : (
          <>
            <span className="text-ms-text-tertiary group-hover:hidden">{index + 1}</span>
            <Play size={14} className="text-ms-text-primary hidden group-hover:block" />
          </>
        )}
      </span>

      {/* Title + thumbnail + artist (mobile) */}
      <div className="flex items-center gap-3 min-w-0">
        {song.thumbnailUrl ? (
          <Image
            src={song.thumbnailUrl}
            alt={song.title}
            width={40}
            height={40}
            className="size-10 rounded-md object-cover border border-ms-border-subtle shrink-0"
          />
        ) : (
          <div className="size-10 rounded-md bg-ms-bg-elevated border border-ms-border-subtle flex items-center justify-center shrink-0">
            <Music size={16} className="text-ms-text-tertiary" />
          </div>
        )}
        <div className="min-w-0">
          <span
            className={`block truncate text-sm font-medium ${
              isActive ? "text-ms-accent" : "text-ms-text-primary"
            }`}
          >
            {song.title}
          </span>
          <span className="block sm:hidden truncate text-xs text-ms-text-secondary">
            {song.artist}
          </span>
        </div>
      </div>

      {/* Artist (desktop) */}
      <span className="hidden sm:block text-sm text-ms-text-secondary truncate">
        {song.artist}
      </span>

      {/* Duration */}
      <span className="text-right text-sm text-ms-text-tertiary tabular-nums">
        {song.duration ? formatTime(song.duration) : "--:--"}
      </span>
    </button>
  );
}

/* ─── Player bar ─── */
function PlayerBar({
  activeSong,
  isPlaying,
  currentTime,
  duration,
  audioRef,
  onTogglePlay,
  onSeek,
}: {
  activeSong: SongItem;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  onTogglePlay: () => void;
  onSeek: (progress: number) => void;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-ms-border-default bg-ms-bg-deep/95 backdrop-blur-lg px-4 py-3">
      <audio ref={audioRef} preload="metadata" className="hidden" />
      <div className="max-w-7xl mx-auto flex flex-col gap-2 md:flex-row md:items-center md:gap-6">
        {/* Track info */}
        <div className="flex items-center gap-3 min-w-0 md:w-1/4">
          {activeSong.thumbnailUrl ? (
            <Image
              src={activeSong.thumbnailUrl}
              alt={activeSong.title}
              width={44}
              height={44}
              className="size-11 rounded-md object-cover border border-ms-border-subtle"
            />
          ) : (
            <div className="size-11 rounded-md bg-ms-bg-raised border border-ms-border-subtle flex items-center justify-center shrink-0">
              <Disc3 size={18} className="text-ms-accent" />
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-medium truncate leading-tight">{activeSong.title}</p>
            <p className="text-xs text-ms-text-secondary truncate">{activeSong.artist}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex-1 flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-5 text-ms-text-secondary">
            <button type="button" className="hover:text-ms-text-primary ms-transition" aria-label="Shuffle"><Shuffle size={16} /></button>
            <button type="button" className="hover:text-ms-text-primary ms-transition" aria-label="Previous"><SkipBack size={18} /></button>
            <button
              type="button"
              onClick={onTogglePlay}
              className="size-9 rounded-full bg-ms-accent text-ms-bg-deep flex items-center justify-center hover:bg-ms-accent-hover active:scale-95 ms-transition"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
            </button>
            <button type="button" className="hover:text-ms-text-primary ms-transition" aria-label="Next"><SkipForward size={18} /></button>
            <button type="button" className="hover:text-ms-text-primary ms-transition" aria-label="Repeat"><Repeat size={16} /></button>
          </div>
          <div className="flex items-center gap-3 w-full max-w-3xl">
            <span className="text-[10px] text-ms-text-tertiary w-9 text-right tabular-nums">{formatTime(currentTime)}</span>
            <div className="relative flex-1 h-1 rounded-full bg-ms-border-default overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-ms-accent ms-transition"
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              />
              <input
                type="range" min="0" max="100"
                value={duration ? (currentTime / duration) * 100 : 0}
                onChange={(e) => onSeek(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Seek"
              />
            </div>
            <span className="text-[10px] text-ms-text-tertiary w-9 tabular-nums">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume */}
        <div className="hidden md:flex items-center justify-end gap-3 md:w-1/4 text-ms-text-secondary">
          <button type="button" className="hover:text-ms-text-primary ms-transition" aria-label="Volume"><Volume2 size={16} /></button>
          <button type="button" className="hover:text-ms-text-primary ms-transition" aria-label="Queue"><ListMusic size={16} /></button>
        </div>
      </div>
    </div>
  );
}

/* ─── Home page — unified experience for everyone ─── */
export default function Home() {
  const { user } = useAuth();
  const router = useRouter();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [activeSong, setActiveSong] = useState<SongItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  /* Fetch songs — public, no auth required */
  const songsQuery = useQuery({
    queryKey: ["songs", user?.id ?? "public"],
    queryFn: async () => {
      const response = await requestSongs(
        { filters: { pageNumber: 1, limit: 20 } },
        user?.token,
      );
      return response.songs.data;
    },
    refetchInterval: 5000,
  });

  /* HLS stream binding */
  useEffect(() => {
    if (!activeSong || !audioRef.current) return;
    const audio = audioRef.current;
    const streamUrl = resolveStreamUrl(activeSong.audioUrl);
    const cleanup = attachHlsStream(audio, streamUrl);

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime || 0);
    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      void audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    };
    const handleEnded = () => { setIsPlaying(false); setCurrentTime(0); };

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
      if (isPlaying) { audio.pause(); setIsPlaying(false); }
      else { void audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false)); }
      return;
    }
    setCurrentTime(0);
    setDuration(0);
    setActiveSong(song);
  };

  const handleTogglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) { audio.pause(); setIsPlaying(false); }
    else { void audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false)); }
  };

  const handleSeek = (p: number) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    audio.currentTime = (p / 100) * duration;
    setCurrentTime(audio.currentTime);
  };

  const songs = songsQuery.data?.data ?? [];
  const hasSongs = songs.length > 0;

  return (
    <div className="flex flex-col flex-1 pb-28">
      {/* Page header */}
      <div className="px-8 pt-8 pb-2">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ms-accent mb-2">
              Discover
            </p>
            <h1 className="text-3xl font-bold tracking-tight">
              {user ? `Welcome back, ${user.username}` : "Explore Music"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {songsQuery.isFetching && (
              <span className="inline-flex items-center gap-2 text-xs text-ms-text-tertiary">
                <Spinner className="size-3" />
                Syncing...
              </span>
            )}
            {user && (
              <button
                type="button"
                onClick={() => router.push("/upload")}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-ms-accent text-ms-bg-deep font-semibold text-sm rounded-lg hover:bg-ms-accent-hover active:scale-[0.98] ms-transition"
              >
                <Upload size={15} />
                Upload
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Sign-in prompt for guests — subtle, non-blocking */}
      {!user && (
        <div className="px-8 pt-4 pb-2">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-ms-accent-subtle border border-ms-accent/10">
            <span className="text-sm text-ms-text-secondary">
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="font-semibold text-ms-accent hover:text-ms-accent-hover ms-transition"
              >
                Sign in
              </button>
              {" "}to upload tracks, save favorites, and build your library.
            </span>
          </div>
        </div>
      )}

      {/* Trending tracks */}
      <div className="px-8 pt-6 pb-2">
        <h2 className="text-lg font-semibold tracking-tight mb-4">
          Trending Tracks
        </h2>
      </div>

      <div className="px-8 flex-1">
        {songsQuery.isLoading ? (
          <div className="flex items-center gap-3 text-ms-text-secondary py-12">
            <Spinner className="size-5" />
            Loading tracks...
          </div>
        ) : hasSongs ? (
          <div className="rounded-xl border border-ms-border-subtle overflow-hidden">
            {/* Table header */}
            <div className="grid grid-cols-[2rem_1fr_5rem] sm:grid-cols-[2.5rem_2fr_1fr_5rem] gap-4 px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-ms-text-tertiary border-b border-ms-border-subtle">
              <span>#</span>
              <span>Title</span>
              <span className="hidden sm:block">Artist</span>
              <span className="text-right">Time</span>
            </div>
            {songs.map((song, idx) => (
              <TrackRow
                key={song.id}
                song={song}
                index={idx}
                isActive={activeSong?.id === song.id}
                isPlaying={activeSong?.id === song.id && isPlaying}
                onSelect={() => handleSelectSong(song)}
              />
            ))}
          </div>
        ) : (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="size-16 rounded-2xl bg-ms-accent-subtle flex items-center justify-center mb-5">
              <Music size={28} className="text-ms-accent" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No tracks yet</h3>
            <p className="text-sm text-ms-text-secondary max-w-sm mb-6">
              {user
                ? "Upload your first track and it will appear here once HLS processing is complete."
                : "No music has been uploaded yet. Check back soon, or sign in to be the first to upload."}
            </p>
            {user && (
              <button
                type="button"
                onClick={() => router.push("/upload")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-ms-accent text-ms-bg-deep font-semibold text-sm rounded-lg hover:bg-ms-accent-hover active:scale-[0.98] ms-transition"
              >
                <Upload size={15} />
                Upload Your First Track
              </button>
            )}
          </motion.div>
        )}
      </div>

      {/* Player bar — available to everyone */}
      {activeSong && (
        <PlayerBar
          activeSong={activeSong}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          audioRef={audioRef}
          onTogglePlay={handleTogglePlay}
          onSeek={handleSeek}
        />
      )}
    </div>
  );
}
