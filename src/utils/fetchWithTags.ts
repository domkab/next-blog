export async function fetchWithTag<T>(path: string, tag: string): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_URL;

  if (!baseUrl) {
    throw new Error('Missing NEXT_PUBLIC_URL in environment variables');
  }

  const fullUrl = path.startsWith('http') ? path : `${baseUrl}${path}`;

  const res = await fetch(fullUrl, {
    next: { tags: [tag] },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${fullUrl}: ${res.statusText}`);
  }

  return res.json();
}