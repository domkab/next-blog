import { adminStorage } from '@/firebase/firebase-admin';

export async function deletePostImages(slug: string): Promise<void> {
  const bucket = adminStorage.bucket();
  const prefix = `posts/${slug}/`;

  const [files] = await bucket.getFiles({ prefix });

  const deletionPromises = files.map(file => file.delete());
  await Promise.all(deletionPromises);

  console.log(`Deleted ${files.length} image(s) for post: ${slug}`);
};

export async function deleteMainPostImage(slug: string): Promise<void> {
  const bucket = adminStorage.bucket();
  const prefix = `posts/${slug}/`;

  const [files] = await bucket.getFiles({ prefix });

  const mainImageFiles = files.filter(file => file.name.includes('main'));

  if (mainImageFiles.length === 0) {
    console.warn(`No main image found for post: ${slug}`);
    return;
  }

  const deletionPromises = mainImageFiles.map(file => file.delete());
  await Promise.all(deletionPromises);

  console.log(`✅ Deleted ${mainImageFiles.length} main image(s) for post: ${slug}`);
}

export async function deleteFeaturedImage(slug: string): Promise<void> {
  const bucket = adminStorage.bucket();
  const prefix = `featured-posts/${slug}-main`;

  const [files] = await bucket.getFiles({ prefix });

  const deletionPromises = files.map(file => file.delete());
  await Promise.all(deletionPromises);

  console.log(`Deleted ${files.length} featured image(s) for post: ${slug}`);
};

export async function deleteInlineImageFromUrl(firebasePath: string): Promise<void> {
  const bucket = adminStorage.bucket();
  const file = bucket.file(`${firebasePath}`);

  try {
    await file.delete();
    console.log(`✅ Deleted Firebase inline image: posts/${firebasePath}`);
  } catch {
    console.error(`🛑 Failed to delete Firebase inline image: posts/${firebasePath}`);
    throw new Error(`Failed to delete inline image: ${firebasePath}`);
  }
}