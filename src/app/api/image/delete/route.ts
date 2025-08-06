import { withAdminAuth } from '@/lib/auth/withAdminAuth';
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import { getUploadsPath } from '@/utils/uploadPath';
import { existsSync } from 'fs';

export const DELETE = withAdminAuth<{ url: string }>(async (_user, body) => {
  const { deleteInlineImageFromUrl } = await import('@/firebase/deleteImages');
  const { url } = body;

  if (!url) {
    return NextResponse.json({ error: 'Missing image URL' }, { status: 400 });
  }

  try {
    const pathname = url.startsWith('http')
      ? new URL(url).pathname
      : url;

    const relativePath = pathname.replace(/^\/uploads\//, '');
    const fullPath = getUploadsPath(relativePath);

    if (!fullPath || !existsSync(fullPath)) {
      console.warn(`Skipping delete, file not found: ${fullPath}`);
    } else {
      await fs.unlink(fullPath);
    }

    try {
      await fs.unlink(fullPath);
      console.log(`✅ Deleted local image: ${fullPath}`);
    } catch (err) {
      if ((err as NodeJS.ErrnoException).code !== 'ENOENT') throw err;
      console.warn(`⚠️ Local file not found: ${fullPath}`);
    }

    await deleteInlineImageFromUrl(relativePath);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('🛑 Failed to delete inline image:', error);
    return NextResponse.json({ error: 'Deletion failed' }, { status: 500 });
  }
});