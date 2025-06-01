import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

const serviceAccount = JSON.parse(
  Buffer.from(process.env.GOOGLE_APPLICATION_CREDENTIALS_BASE64!, 'base64').toString('utf8')
);

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
    storageBucket: "next-blog-acbbc.appspot.com",
  });
}

export const adminStorage = getStorage();