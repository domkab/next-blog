import { withAdminAuth } from '@/lib/auth/withAdminAuth';

export const POST = withAdminAuth(async () => {
  const { cleanupUnusedImagesFromFirebaseAndFilestore } = await import('@/lib/firebaseSync');
  const { connect } = await import('@/lib/mongodb/mongoose');

  await connect();

  try {
    const result = await cleanupUnusedImagesFromFirebaseAndFilestore();
    return new Response(`Deleted ${result.deletedCount} unused images.`, { status: 200 });
  } catch (error) {
    console.error('[CLEANUP_FAILED]', error);
    return new Response('Failed to clean up unused images.', { status: 500 });
  }
});