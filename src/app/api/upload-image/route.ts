// app/api/upload/route.ts
import { withAdminAuth } from '@/lib/auth/withAdminAuth';
import { NextRequest, NextResponse } from 'next/server';
import { adminStorage } from '@/firebase/firebase-admin';
import { v4 as uuidv4 } from 'uuid';

export const POST = withAdminAuth(async (_user, req: NextRequest) => {
  const formData = await req.formData();
  const file = formData.get('file') as File;
  const slug = formData.get('slug') as string;
  const target = formData.get('target') as 'main' | 'inline';

  if (!file || !slug || !target) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const folderPath = `posts/${slug}`;
    const prefix = target === 'main' ? 'main' : 'inline';
    const fileName = `${prefix}-${Date.now()}-${file.name}`;
    const bucket = adminStorage.bucket();

    const fileRef = bucket.file(`${folderPath}/${fileName}`);

    await fileRef.save(buffer, {
      contentType: file.type,
      public: true,
      metadata: {
        firebaseStorageDownloadTokens: uuidv4(),
      },
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