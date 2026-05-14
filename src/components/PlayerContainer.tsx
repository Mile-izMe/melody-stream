"use client";

import { useEffect, useRef } from "react";
import PlayerBar from "@/src/components/PlayerBar";
import { attachHlsStream, resolveStreamUrl } from "@/src/services/hls";
import { usePlayerStore } from "@/src/stores/usePlayerStore";

export default function PlayerContainer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const activeSong = usePlayerStore((s) => s.activeSong);
  const playing = usePlayerStore((s) => s.playing);
  const setPlaying = usePlayerStore((s) => s.setPlaying);
  const currentTime = usePlayerStore((s) => s.currentTime);
  const setCurrentTime = usePlayerStore((s) => s.setCurrentTime);
  const duration = usePlayerStore((s) => s.duration);
  const setDuration = usePlayerStore((s) => s.setDuration);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // keep play state and audio in sync
    if (playing) {
      void audio.play().catch(() => setPlaying(false));
    } else {
      audio.pause();
    }
  }, [playing, setPlaying]);

  useEffect(() => {
    if (!activeSong || !audioRef.current) return;
    const audio = audioRef.current;
    const streamUrl = resolveStreamUrl(activeSong.audioUrl);
    const cleanup = attachHlsStream(audio, streamUrl);

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime || 0);
    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      void audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => setPlaying(false));
    };
    const handleEnded = () => {
      const state = usePlayerStore.getState();
      const repeatMode = state.repeatMode;

      if (repeatMode === "one") {
        try {
          audio.currentTime = 0;
          void audio
            .play()
            .then(() => setPlaying(true))
            .catch(() => setPlaying(false));
        } catch {
          setPlaying(false);
        }
        return;
      }

      // If there's a queue, play the next song
      if (state.queue.length > 0) {
        state.playNext();
        return;
      }

      setPlaying(false);
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
  }, [activeSong, setCurrentTime, setDuration, setPlaying]);

  const onTogglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      usePlayerStore.getState().setPlaying(false);
      return;
    }
    void audio
      .play()
      .then(() => usePlayerStore.getState().setPlaying(true))
      .catch(() => usePlayerStore.getState().setPlaying(false));
  };

  const onSeek = (p: number) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    audio.currentTime = (p / 100) * duration;
    usePlayerStore.getState().setCurrentTime(audio.currentTime);
  };

  if (!activeSong) return null;

  return (
    <PlayerBar
      activeSong={activeSong}
      isPlaying={playing}
      currentTime={currentTime}
      duration={duration}
      audioRef={audioRef}
      onTogglePlay={onTogglePlay}
      onSeek={onSeek}
    />
  );
}
