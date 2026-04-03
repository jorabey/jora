export function timeAgo(date) {

  const diff = Math.floor((Date.now() - date) / 1000);

  if (diff < 60) return diff + " soniya oldin";

  const minutes = Math.floor(diff / 60);
  if (minutes < 60) return minutes + " daqiqa oldin";

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours + " soat oldin";

  const days = Math.floor(hours / 24);
  if (days < 7) return days + " kun oldin";

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return weeks + " hafta oldin";

  const months = Math.floor(days / 30);
  if (months < 12) return months + " oy oldin";

  const years = Math.floor(days / 365);
  return years + " yil oldin";
}