import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

export const isFirebaseConfigured = (): boolean => {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;
  return Boolean(
    apiKey &&
    apiKey.trim() !== '' &&
    !apiKey.includes('YOUR_') &&
    apiKey !== 'your-api-key' &&
    apiKey !== 'placeholder' &&
    apiKey !== 'AIzaSyYourApiKeyHere' &&
    projectId &&
    projectId.trim() !== '' &&
    projectId !== 'your-project-id'
  );
};

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let firestore: Firestore | null = null;
let storage: FirebaseStorage | null = null;

if (isFirebaseConfigured()) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    auth = getAuth(app);
    firestore = getFirestore(app);
    storage = getStorage(app);
    console.info('[ACCA Master] Connected to live Firebase backend:', firebaseConfig.projectId);
  } catch (error) {
    console.warn('[ACCA Master] Failed to initialize Firebase. Falling back to robust local database mode:', error);
  }
} else {
  console.info('[ACCA Master] Running in Local Database Mode. Fill in .env with your Firebase project keys for live cloud sync.');
}

export { app, auth, firestore, storage };
