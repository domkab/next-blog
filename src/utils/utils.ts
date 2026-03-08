export function normalizePostContent(content: string): string {
  return content
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/>\s+</g, "><")
    .trim();
}