export interface Track {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  thumbnailUrl?: string;
  duration?: number; // ms
  createdAt: string;
}
