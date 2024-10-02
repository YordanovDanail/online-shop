import { ref as dbRef, set } from 'firebase/database';
import { auth, db } from '../config/firebase-config';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from 'firebase/auth';

export const registerUser = async (email: string, password: string) => {
    const auth = getAuth();
    return await createUserWithEmailAndPassword(auth, email, password);
  };

  export const loginUser = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

export const logoutUser = async (uid: string) => {
  if (uid) {
    const userStatusRef = dbRef(db, `status/${uid}`);
    await set(userStatusRef, { state: 'offline', last_changed: Date.now() });
  }
};
