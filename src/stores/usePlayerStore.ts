import create from "zustand";

type PlayerState = {
  playing: boolean;
  setPlaying: (v: boolean) => void;
};

export const usePlayerStore = create<PlayerState>((set) => ({
  playing: false,
  setPlaying: (v: boolean) => set({ playing: v }),
}));
