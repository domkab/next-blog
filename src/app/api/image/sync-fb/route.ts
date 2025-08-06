import { NextResponse } from 'next/server';
import { withAdminAuth } from '@/lib/auth/withAdminAuth';

export const POST = withAdminAuth(async () => {
  const { syncFromFirebase } = await import('@/lib/firebaseSync')

  try {
    await syncFromFirebase();

    return NextResponse.json({ success: true, message: 'Sync complete.' });
  } catch (err) {
    console.error('🔥 Sync failed:', err);
    return NextResponse.json({ success: false, message: 'Sync failed.', error: String(err) }, { status: 500 });
  }
});