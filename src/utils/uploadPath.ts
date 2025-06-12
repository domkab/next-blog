import path from 'path';

export function getUploadsBaseDir(): string {
  const isProd = process.env.NODE_ENV === 'production';

  return isProd
    ? '/var/www/next-blog/uploads'
    : path.join(process.cwd(), 'public', 'uploads');
}

export function getUploadsPath(relativePath: string): string {
  return path.join(getUploadsBaseDir(), relativePath);
}