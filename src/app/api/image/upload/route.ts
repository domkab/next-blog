import { withAdminAuth } from '@/lib/auth/withAdminAuth';
import { NextRequest, NextResponse } from 'next/server';
import { adminStorage } from '@/firebase/firebase-admin';

export const POST = withAdminAuth(async (_user, req: NextRequest) => {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const slug = formData.get('slug') as string;
  const target = formData.get('target') as 'main' | 'inline' | 'featured';

  if (!file || !slug || !target) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const bucket = adminStorage.bucket();

    let filePath: string;

    if (target === 'featured') {
      // Save to root level featured-posts folder
      const fileName = `${slug}-main-${Date.now()}-${file.name}`;
      filePath = `featured-posts/${fileName}`;
    } else {
      // Standard post image path
      const folderPath = `posts/${slug}`;
      const prefix = target === 'main' ? 'main' : 'inline';
      const fileName = `${prefix}-${Date.now()}-${file.name}`;
      filePath = `${folderPath}/${fileName}`;
    }

    const fileRef = bucket.file(filePath);

    await fileRef.save(buffer, {
      contentType: file.type,
      public: true,
    });

    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(
      fileRef.name
    )}?alt=media`;

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error('Upload failed:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
});