import React, { useRef, useState, useEffect } from "react";
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Music,
} from "lucide-react";
import { Track } from "@/src/types/track";

interface AudioPlayerProps {
  track: Track;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ track }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(console.error);
      setIsPlaying(true);
    }
  }, [track]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current =
        (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(current);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
      const newTime =
        (parseFloat(e.target.value) / 100) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setProgress(parseFloat(e.target.value));
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="bg-black/60 backdrop-blur-3xl border-t border-white/10 p-3 md:px-8 flex items-center justify-between shadow-2xl h-24 text-white">
      <audio
        ref={audioRef}
        src={track.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Track Info */}
      <div className="flex items-center space-x-4 w-1/3 min-w-[200px]">
        <div className="w-14 h-14 bg-white/5 rounded-lg overflow-hidden border border-white/10 shadow-lg flex-shrink-0 flex items-center justify-center">
          <Music size={24} className="text-purple-400/50" />
        </div>
        <div className="overflow-hidden">
          <p className="font-bold text-sm leading-tight truncate hover:underline cursor-pointer">
            {track.title}
          </p>
          <p className="text-xs text-gray-400 truncate">{track.artist}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center w-1/3 space-y-2">
        <div className="flex items-center space-x-6">
          <button className="text-gray-400 hover:text-white transition-colors">
            <SkipBack size={20} fill="currentColor" />
          </button>
          <button
            onClick={togglePlay}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 active:scale-95 transition-transform"
          >
            {isPlaying ? (
              <Pause size={24} fill="currentColor" />
            ) : (
              <Play size={24} fill="currentColor" className="ml-1" />
            )}
          </button>
          <button className="text-gray-400 hover:text-white transition-colors">
            <SkipForward size={20} fill="currentColor" />
          </button>
        </div>

        <div className="flex items-center space-x-2 w-full max-w-md">
          <span className="text-[10px] text-gray-500 w-8 text-right">
            {formatTime(audioRef.current?.currentTime || 0)}
          </span>
          <div className="flex-1 h-1 bg-white/10 rounded-full relative group cursor-pointer">
            <div
              className="absolute left-0 top-0 h-full bg-purple-500 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
            <input
              type="range"
              value={progress}
              onChange={handleProgressChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
          </div>
          <span className="text-[10px] text-gray-500 w-8">
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Volume */}
      <div className="hidden md:flex items-center space-x-3 w-1/3 justify-end">
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="text-gray-400 hover:text-white transition-colors"
        >
          {isMuted || volume === 0 ? (
            <VolumeX size={20} />
          ) : (
            <Volume2 size={20} />
          )}
        </button>
        <div className="w-24 h-1 bg-white/10 rounded-full relative">
          <div
            className="absolute left-0 top-0 h-full bg-white rounded-full"
            style={{ width: `${isMuted ? 0 : volume * 100}%` }}
          ></div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              const v = parseFloat(e.target.value);
              setVolume(v);
              if (audioRef.current) audioRef.current.volume = v;
              if (v > 0) setIsMuted(false);
            }}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
        </div>
      </div>
    </div>
  );
};
