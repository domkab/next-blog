export function normalizePostContent(content: string): string {
  return content
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/\u00A0/g, " ")
    .replace(/>\s+</g, "><")
    .trim();
}

export function extractPlainText(html: string): string {
  if (!html) return "";

  const sanitized = normalizePostContent(html)
    // Drop script and style blocks entirely
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    // Strip all other tags
    .replace(/<[^>]+>/g, " ")
    // Handle a couple of frequent entities without needing an extra dep
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'");

  return sanitized.replace(/\s+/g, " ").trim();
}

export function getReadTimeMinutes(html: string, wordsPerMinute = 200): number {
  const plainText = extractPlainText(html);

  if (!plainText) return 1;

  const wordCount = plainText.split(/\s+/).filter(Boolean).length;

  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}
