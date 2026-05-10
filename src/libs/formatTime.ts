export function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainSeconds.toString().padStart(2, "0")}`;
}
