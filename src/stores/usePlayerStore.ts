import { create } from "zustand";
import type { SongItem } from "@/src/features/graphql/queries/songs";

type PlayerState = {
  playing: boolean;
  setPlaying: (v: boolean) => void;
  repeatMode: "off" | "one" | "all";
  setRepeatMode: (mode: "off" | "one" | "all") => void;
  toggleRepeatMode: () => void;
  activeSong: SongItem | null;
  setActiveSong: (s: SongItem | null) => void;
  currentTime: number;
  setCurrentTime: (t: number) => void;
  duration: number;
  setDuration: (d: number) => void;
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
  activeSong: null,
  setActiveSong: (s: SongItem | null) => set({ activeSong: s }),
  currentTime: 0,
  setCurrentTime: (t: number) => set({ currentTime: t }),
  duration: 0,
  setDuration: (d: number) => set({ duration: d }),
}));
