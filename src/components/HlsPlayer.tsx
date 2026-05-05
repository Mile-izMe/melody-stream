"use client";

import React, { useEffect, useRef } from "react";
import { attachHlsStream, resolveStreamUrl } from "@/src/services/hls";

export default function HlsPlayer({ src }: { src: string }) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const resolvedSrc = resolveStreamUrl(src);

  useEffect(() => {
    const audio = ref.current;
    if (!audio) return;

    return attachHlsStream(audio, resolvedSrc);
  }, [resolvedSrc]);

  return <audio ref={ref} controls preload="none" className="w-full" />;
}
