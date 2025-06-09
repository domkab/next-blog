export const replaceInlineImagePaths = async (html: string): Promise<string> => {
  const regex = /<img[^>]+src="([^"]+)"[^>]*>/g;
  const matches = [...html.matchAll(regex)];

  let updatedHtml = html;

  for (const match of matches) {
    const path = match[1];
    const res = await fetch(`/api/image/image-url?path=${encodeURIComponent(path)}`);
    const { url } = await res.json();
    updatedHtml = updatedHtml.replace(path, url);
  }

  return updatedHtml;
};