import { NextResponse } from 'next/server';
import { deleteInlineImageFromUrl } from '@/firebase/deleteImages';
import { withAdminAuth } from '@/lib/auth/withAdminAuth';

export const DELETE = withAdminAuth<{ url: string }>(async (_user, body) => {
  const { url } = body;

  if (!url) {
    return NextResponse.json({ error: 'Missing image URL' }, { status: 400 });
  }

  try {
    await deleteInlineImageFromUrl(url);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete inline image:', error);
    return NextResponse.json({ error: 'Deletion failed' }, { status: 500 });
  }
});