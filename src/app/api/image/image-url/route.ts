import { adminStorage } from '@/firebase/firebase-admin';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const path = req.nextUrl.searchParams.get('path');
  if (!path) {
    return NextResponse.json({ error: 'Missing path' }, { status: 400 });
  }

  console.log('Signing URL for path:', path);
  
  try {
    const [url] = await adminStorage
      .bucket()
      .file(path)
      .getSignedUrl({
        action: 'read',
        expires: Date.now() + 60 * 1000, // ⏱ 10 seconds
      });

    console.log('signed url:', url);

    return NextResponse.json({ url });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to sign image URL' }, { status: 500 });
  }
};
