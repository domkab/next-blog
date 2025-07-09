import { deleteMainPostImage } from '@/firebase/deleteImages';
import { withAdminAuth } from '@/lib/auth/withAdminAuth';
import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { getUploadsPath } from '@/utils/uploadPath';

export const DELETE = withAdminAuth(
  async (_user, _body): Promise<Response> => {
    try {
      const url = new URL(_body?.url || 'http://localhost');
      const slug = url.pathname.split('/').filter(Boolean).at(-2);

      if (!slug) {
        return NextResponse.json(
          { success: false, error: 'Missing slug' },
          { status: 400 }
        );
      }

      await deleteMainPostImage(slug);

      const postDir = getUploadsPath(`posts/${slug}`);

      try {
        const files = await fs.readdir(postDir);
        const mainImages = files.filter(file => file.startsWith('main-'));

        if (mainImages.length > 0) {
          await Promise.all(
            mainImages.map(async file => {
              const filePath = path.join(postDir, file);

              await fs.unlink(filePath);

              console.log(`Deleted: ${filePath}`);
            })
          );
        } else {
          console.warn(`No local main images found in: ${postDir}`);
        }
      } catch (fsErr) {
        if ((fsErr as NodeJS.ErrnoException).code !== 'ENOENT') {
          throw fsErr;
        }
        console.warn(`Local post directory not found: ${postDir}`);
      }

      return NextResponse.json({ success: true });
    } catch (err) {
      console.error('Error deleting post main images:', err);

      return NextResponse.json({ success: false }, { status: 500 });
    }
  }
);