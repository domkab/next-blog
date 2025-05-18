import { initializeApp, getApps, applicationDefault } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

if (!getApps().length) {
  initializeApp({
    credential: applicationDefault(),
    storageBucket: 'next-blog-acbbc.firebasestorage.app',
  });
}

export const adminStorage = getStorage();