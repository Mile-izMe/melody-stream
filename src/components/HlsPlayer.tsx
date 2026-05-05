"use client";

import React, { useEffect, useRef } from "react";
import Hls from "hls.js";

export default function HlsPlayer({
  src,
  poster,
}: {
  src: string;
  poster?: string;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      return () => hls.destroy();
    }

    // fallback: set native src
    video.src = src;
  }, [src]);

  return (
    <video
      ref={ref}
      controls
      className="w-full max-w-2xl rounded"
      poster={poster}
    />
  );
}
