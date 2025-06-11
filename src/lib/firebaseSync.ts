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
};

export async function syncFromFirebase() {
  const bucket = adminStorage.bucket();
  const [files] = await bucket.getFiles({ prefix: '' });
  const baseUploadsDir = path.join(process.cwd(), 'src', 'uploads');

  if (!baseUploadsDir.includes('/public/uploads')) {
    throw new Error(`Invalid baseUploadsDir: ${baseUploadsDir}`);
  };

  for (const file of files) {
    const remotePath = file.name;

    if (!remotePath || remotePath.endsWith('/')) continue;

    const localPath = path.join(baseUploadsDir, remotePath);
    const localDir = path.dirname(localPath);

    if (fs.existsSync(localPath)) {
      console.log(`🔁 Skipped (already exists): ${localPath}`);
      continue;
    };

    fs.mkdirSync(localDir, { recursive: true });

    console.log('✅ Target directory =', localDir);

    const writeStream = fs.createWriteStream(localPath);
    writeStream.on('finish', () => {
      console.log(`✅ Finished writing: ${localPath}`);
    });

    await new Promise((resolve, reject) => {
      file.createReadStream()
        .on('error', reject)
        .on('end', resolve)
        .pipe(writeStream);
    });

    console.log(`✅ Synced: ${remotePath}`);
  };

  console.log('🔥 Image sync from Firebase complete.');
};