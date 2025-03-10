import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "next-blog-acbbc.firebaseapp.com",
  projectId: "next-blog-acbbc",
  storageBucket: "next-blog-acbbc.firebasestorage.app",
  messagingSenderId: "747614347281",
  appId: "1:747614347281:web:bf168be2a99bc06aee51b0",
  measurementId: "G-KL3MM058ZJ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const analytics = getAnalytics(app);