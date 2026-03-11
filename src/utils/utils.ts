// export function normalizePostContent(content: string): string {
//   return content
//     .replace(/&nbsp;|&#160;/gi, " ")
//     .replace(/>\s+</g, "><")
//     .trim();
// }

// created ehanched util, needs more testing

export function normalizePostContent(content: string): string {
  return content
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/\u00A0/g, " ")
    .replace(/>\s+</g, "><")
    .trim();
}
