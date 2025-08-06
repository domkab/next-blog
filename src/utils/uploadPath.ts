import path from 'path';

export function getUploadsBaseDir(): string {
  const isProd = process.env.NODE_ENV === 'production';
  const prodAppName = process.env.PROD_APP_NAME;

  return isProd
    ? `/var/www/${prodAppName}/uploads`
    : path.join(process.cwd(), 'public', 'uploads');
}

export function getUploadsPath(relativePath: string): string {
  return path.join(getUploadsBaseDir(), relativePath) || '';
}