import { NextResponse } from 'next/server';
import { adminStorage } from '@/firebase/firebase-admin';

export async function GET() {
  try {
    const bucket = adminStorage.bucket();
    const [files] = await bucket.getFiles({ prefix: 'posts/', maxResults: 1 });

    return NextResponse.json({
      status: 'ok',
      message: 'Bucket is accessible',
      foundFiles: files.length,
    });
  } catch (err: unknown) {
    const errorMessage = (err instanceof Error) ? err.message : String(err);
    console.error('Health check failed:', errorMessage);
    return NextResponse.json(
      {
        status: 'error',
        message: 'Bucket access failed',
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}