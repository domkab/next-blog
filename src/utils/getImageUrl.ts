export function getImageUrl(path?: string): string {
  if (!path) return '/placeholder.jpg';

  // Absolute URL? keep it.
  if (/^https?:\/\//i.test(path)) return path;

  // Same-origin relative path (best for your setup)
  // This avoids ever producing /undefined/...
  return path.startsWith('/') ? path : `/${path}`;
}