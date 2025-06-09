import { withAdminAuth } from '@/lib/auth/withAdminAuth';
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import { uploadToFirebase } from '@/lib/firebaseSync';

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

    let resized: Buffer;
    if (target === 'main') {
      resized = await sharp(buffer)
        .resize({ width: 1200, height: 800, fit: 'cover' })
        .webp()
        .toBuffer();
    } else if (target === 'inline') {
      resized = await sharp(buffer)
        .resize({ width: 640, height: 480, fit: 'inside' })
        .webp()
        .toBuffer();
    } else {
      return NextResponse.json({ error: 'Invalid target' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'posts', slug);
    fs.mkdirSync(uploadDir, { recursive: true });

    const fileName = `${target}-${Date.now()}-${uuidv4()}.webp`;
    const filePath = path.join(uploadDir, fileName);
    fs.writeFileSync(filePath, resized);

    const publicUrl = `/uploads/posts/${slug}/${fileName}`;

    if (process.env.ENABLE_FIREBASE_SYNC === 'true') {
      await uploadToFirebase(filePath, `posts/${slug}/${fileName}`);
    }

    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error('Upload failed:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
});