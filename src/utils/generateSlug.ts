export const generateSlug = (text: string): string =>
  text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export function getSlugSource(title: { bold: string; regular?: string }) {
  return [title.bold, title.regular].filter(Boolean).join(' ');
};