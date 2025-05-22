import { adminStorage } from '@/firebase/firebase-admin';

export async function deletePostImages(slug: string): Promise<void> {
  const bucket = adminStorage.bucket();
  const prefix = `posts/${slug}/`;

  const [files] = await bucket.getFiles({ prefix });

  const deletionPromises = files.map(file => file.delete());
  await Promise.all(deletionPromises);

  console.log(`Deleted ${files.length} image(s) for post: ${slug}`);
}

export async function deleteFeaturedImage(slug: string): Promise<void> {
  const bucket = adminStorage.bucket();
  const prefix = `featured-posts/${slug}-main`;

  const [files] = await bucket.getFiles({ prefix });

  const deletionPromises = files.map(file => file.delete());
  await Promise.all(deletionPromises);

  console.log(`Deleted ${files.length} featured image(s) for post: ${slug}`);
}