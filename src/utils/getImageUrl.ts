export function getImageUrl(relativePath?: string): string {
  if (!relativePath) return '/placeholder.jpg';

  const base =
    process.env.NODE_ENV === 'production'
      ? process.env.NEXT_PUBLIC_URL
      : 'http://localhost:3000';

  return `${base}${relativePath}`;
}