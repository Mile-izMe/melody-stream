"use client";

import Image from "next/image";
import {
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Disc3,
  Volume2,
  ListMusic,
} from "lucide-react";
import type { SongItem } from "@/src/graphql/queries/songs";
import { formatTime } from "@/src/libs/formatTime";

export default function PlayerBar({
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
            <p className="text-sm font-medium truncate leading-tight">
              {activeSong.title}
            </p>
            <p className="text-xs text-ms-text-secondary truncate">
              {activeSong.artist}
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-5 text-ms-text-secondary">
            <button
              type="button"
              className="hover:text-ms-text-primary ms-transition"
              aria-label="Shuffle"
            >
              <Shuffle size={16} />
            </button>
            <button
              type="button"
              className="hover:text-ms-text-primary ms-transition"
              aria-label="Previous"
            >
              <SkipBack size={18} />
            </button>
            <button
              type="button"
              onClick={onTogglePlay}
              className="size-9 rounded-full bg-ms-accent text-ms-bg-deep flex items-center justify-center hover:bg-ms-accent-hover active:scale-95 ms-transition"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause size={16} />
              ) : (
                <Play size={16} className="ml-0.5" />
              )}
            </button>
            <button
              type="button"
              className="hover:text-ms-text-primary ms-transition"
              aria-label="Next"
            >
              <SkipForward size={18} />
            </button>
            <button
              type="button"
              className="hover:text-ms-text-primary ms-transition"
              aria-label="Repeat"
            >
              <Repeat size={16} />
            </button>
          </div>
          <div className="flex items-center gap-3 w-full max-w-3xl">
            <span className="text-[10px] text-ms-text-tertiary w-9 text-right tabular-nums">
              {formatTime(currentTime)}
            </span>
            <div className="relative flex-1 h-1 rounded-full bg-ms-border-default overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full rounded-full bg-ms-accent ms-transition"
                style={{
                  width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                }}
              />
              <input
                type="range"
                min="0"
                max="100"
                value={duration ? (currentTime / duration) * 100 : 0}
                onChange={(e) => onSeek(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label="Seek"
              />
            </div>
            <span className="text-[10px] text-ms-text-tertiary w-9 tabular-nums">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center justify-end gap-3 md:w-1/4 text-ms-text-secondary">
          <button
            type="button"
            className="hover:text-ms-text-primary ms-transition"
            aria-label="Volume"
          >
            <Volume2 size={16} />
          </button>
          <button
            type="button"
            className="hover:text-ms-text-primary ms-transition"
            aria-label="Queue"
          >
            <ListMusic size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
