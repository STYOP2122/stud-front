/** Origin API без слэша в конце. Пусто = тот же хост (прокси Vite в dev). */
export const API_ORIGIN = (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ?? '';

/** Basename для React Router (Vite BASE_URL всегда с / в конце). */
export const ROUTER_BASENAME = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined;

/** Абсолютный URL для /uploads/... с бэкенда. */
export function mediaUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
}
