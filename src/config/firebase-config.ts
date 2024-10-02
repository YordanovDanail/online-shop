import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getDatabase, Database } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY as string,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN as string,
  projectId: process.env.REACT_APP_PROJECT_ID as string,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET as string,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID as string,
  appId: process.env.REACT_APP_FIREBASE_APP_ID as string,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL as string,
};

const app: FirebaseApp = initializeApp(firebaseConfig);

export const auth: Auth = getAuth(app);
export const db: Database = getDatabase(app);
export const storage = getStorage(app);
