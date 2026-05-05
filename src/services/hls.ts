import Hls from "hls.js";
import { getServiceEndpoint } from "@/src/libs/constants";

export function resolveStreamUrl(src: string) {
  if (/^https?:\/\//i.test(src)) {
    return src;
  }

  const graphqlEndpoint = getServiceEndpoint("graphql");
  const apiBase = graphqlEndpoint.replace(/\/graphql\/?$/, "");
  const normalizedSrc = src.startsWith("/") ? src : `/${src}`;

  return `${apiBase}${normalizedSrc}`;
}

export function attachHlsStream(media: HTMLMediaElement, src: string) {
  if (Hls.isSupported()) {
    const hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true,
    });

    hls.loadSource(src);
    hls.attachMedia(media);

    return () => {
      hls.destroy();
    };
  }

  media.src = src;
  return () => {
    media.removeAttribute("src");
    media.load();
  };
}
