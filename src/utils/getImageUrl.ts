// export function getImageUrl(relativePath?: string): string {
//   if (!relativePath) return '/placeholder.jpg';

//   const base =
//     process.env.NODE_ENV === 'production'
//       ? process.env.NEXT_PUBLIC_URL
//       : 'http://localhost:3000';

//   return `${base}${relativePath}`;
// }


export function getImageUrl(path?: string): string {
  if (!path) return '/placeholder.jpg';

  // Absolute URL? keep it.
  if (/^https?:\/\//i.test(path)) return path;

  // Same-origin relative path (best for your setup)
  // This avoids ever producing /undefined/...
  return path.startsWith('/') ? path : `/${path}`;
}
//test