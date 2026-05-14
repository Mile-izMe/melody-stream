import { create } from "zustand";
import type { SongItem } from "@/src/features/graphql/queries/songs";

type PlayerState = {
  playing: boolean;
  setPlaying: (v: boolean) => void;
  repeatMode: "off" | "one" | "all";
  setRepeatMode: (mode: "off" | "one" | "all") => void;
  toggleRepeatMode: () => void;
  shuffleMode: boolean;
  setShuffleMode: (v: boolean) => void;
  toggleShuffleMode: () => void;
  activeSong: SongItem | null;
  setActiveSong: (s: SongItem | null) => void;
  currentTime: number;
  setCurrentTime: (t: number) => void;
  duration: number;
  setDuration: (d: number) => void;
  queue: SongItem[];
  setQueue: (songs: SongItem[]) => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  playNext: () => void;
  playPrevious: () => void;
};

export const usePlayerStore = create<PlayerState>((set) => ({
  playing: false,
  setPlaying: (v: boolean) => set({ playing: v }),
  repeatMode: "off",
  setRepeatMode: (mode: "off" | "one" | "all") => set({ repeatMode: mode }),
  toggleRepeatMode: () =>
    set((state) => ({
      repeatMode:
        state.repeatMode === "off"
          ? "one"
          : state.repeatMode === "one"
            ? "all"
            : "off",
    })),
  shuffleMode: false,
  setShuffleMode: (v: boolean) => set({ shuffleMode: v }),
  toggleShuffleMode: () =>
    set((state) => ({
      shuffleMode: !state.shuffleMode,
    })),
  activeSong: null,
  setActiveSong: (s: SongItem | null) => set({ activeSong: s }),
  currentTime: 0,
  setCurrentTime: (t: number) => set({ currentTime: t }),
  duration: 0,
  setDuration: (d: number) => set({ duration: d }),
  queue: [],
  setQueue: (songs: SongItem[]) => set({ queue: songs, currentIndex: 0 }),
  currentIndex: 0,
  setCurrentIndex: (index: number) => set({ currentIndex: index }),
  playNext: () =>
    set((state) => {
      const queue = state.queue;
      if (queue.length === 0) return {};

      let nextIndex = state.currentIndex + 1;

      if (state.shuffleMode) {
        nextIndex = Math.floor(Math.random() * queue.length);
      } else {
        if (nextIndex >= queue.length) {
          nextIndex = state.repeatMode === "all" ? 0 : queue.length - 1;
        }
      }

      return {
        currentIndex: nextIndex,
        activeSong: queue[nextIndex] || null,
        playing: true,
      };
    }),
  playPrevious: () =>
    set((state) => {
      const queue = state.queue;
      if (queue.length === 0) return {};

      let prevIndex = state.currentIndex - 1;

      if (state.shuffleMode) {
        prevIndex = Math.floor(Math.random() * queue.length);
      } else {
        if (prevIndex < 0) {
          prevIndex = 0;
        }
      }

      return {
        currentIndex: prevIndex,
        activeSong: queue[prevIndex] || null,
        playing: true,
      };
    }),
}));
