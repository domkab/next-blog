import { initializeApp } from "firebase/app";
import { Analytics, getAnalytics, isSupported } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "next-blog-acbbc.firebaseapp.com",
  projectId: "next-blog-acbbc",
  storageBucket: "next-blog-acbbc.appspot.com",
  messagingSenderId: "747614347281",
  appId: "1:747614347281:web:bf168be2a99bc06aee51b0",
  measurementId: "G-KL3MM058ZJ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

let analytics: Analytics | null = null;

// Initialize analytics only in the browser and if supported
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { analytics };