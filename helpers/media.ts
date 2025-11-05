// helpers/media.ts
export const toAbsoluteUrl = (url?: string | null): string => {
  if (!url) return '';
  const s = String(url);
  return s.startsWith('http') ? s : `${process.env.NEXT_PUBLIC_BACKEND_URL}${s}`;
};
