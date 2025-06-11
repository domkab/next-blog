import { adminStorage } from '@/firebase/firebase-admin';
import fs from 'fs';
import path from 'path';

export async function uploadToFirebase(localPath: string, destination: string) {
  const bucket = adminStorage.bucket();
  const fileRef = bucket.file(destination);

  return new Promise((resolve, reject) => {
    fs.createReadStream(localPath)
      .pipe(fileRef.createWriteStream({
        resumable: false,
        gzip: true,
        public: true,
        contentType: 'image/webp',
      }))
      .on('error', reject)
      .on('finish', resolve);
  });
}

export async function syncFromFirebase() {
  const bucket = adminStorage.bucket();
  const [files] = await bucket.getFiles({ prefix: '' });

  for (const file of files) {
    const remotePath = file.name;

    if (remotePath.endsWith('/')) continue;

    const localPath = path.join(process.cwd(), 'public', 'uploads', remotePath);

    if (fs.existsSync(localPath)) {
      continue; // Skip if file already exists
    }

    const localDir = path.dirname(localPath);
    fs.mkdirSync(localDir, { recursive: true });

    const writeStream = fs.createWriteStream(localPath);

    await new Promise((resolve, reject) => {
      file.createReadStream()
        .on('error', reject)
        .on('end', resolve)
        .pipe(writeStream);
    });

    console.log(`✅ Synced: ${remotePath}`);
  }

  console.log('🔥 Image sync from Firebase complete.');
}