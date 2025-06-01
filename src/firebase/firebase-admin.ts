import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

const decoded = JSON.parse(
  Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64!, 'base64').toString('utf8')
);

if (!getApps().length) {
  initializeApp({
    credential: cert(decoded),
    storageBucket: 'next-blog-acbbc.firebasestorage.app',
  });
}

export const adminStorage = getStorage();