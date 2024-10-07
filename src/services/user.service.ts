import { ref, set, get, query, equalTo, orderByChild, child } from 'firebase/database';
import { db } from '../config/firebase-config';
import { User } from '../models/User';

// CREATE
export const createUser = async (
  username: string,
  uid: string,
  email: string,
  firstName: string,
  lastName: string,
  phoneNumber: string
): Promise<User> => {
  const user: User = {
    username,
    uid,
    email,
    firstName,
    lastName,
    phoneNumber,
    createdAt: new Date(),
  };

  const userRef = ref(db, `users/${username}`);
  try {
    await set(userRef, user);
    return user;
  } catch (error: any) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user: ' + error.message);
  }
};

export const getUserData = async (uid: string): Promise<any> => {
  const userRef = query(ref(db, 'users'), orderByChild('uid'), equalTo(uid));
  try {
    const snapshot = await get(userRef);
    if (!snapshot.exists()) {
      throw new Error('User not found');
    }

    const userData = snapshot.val();
    const userKey = Object.keys(userData)[0];
    return userData[userKey];
  } catch (error: any) {
    console.error('Error retrieving user data:', error);
    throw new Error('Failed to retrieve user data: ' + error.message);
  }
};

// RETRIEVE
export const getUserByUsername = async (username: string): Promise<User | null> => {
  const userRef = ref(db, `users/${username}`);
  try {
    const snapshot = await get(userRef);
    if (!snapshot.exists()) {
      return null;
    }

    const user = snapshot.val();
    return user as User;
  } catch (error: any) {
    console.error('Error retrieving user by username:', error);
    throw new Error('Failed to retrieve user: ' + error.message);
  }
};

// CHECK
export const getEmail = async (email: string): Promise<boolean> => {
  const emailRef = query(ref(db, 'users'), orderByChild('email'), equalTo(email));
  try {
    const snapshot = await get(emailRef);
    return snapshot.exists();
  } catch (error: any) {
    console.error('Error checking email:', error);
    throw new Error('Failed to check email: ' + error.message);
  }
};

export const getPhoneNumber = async (phoneNumber: string): Promise<boolean> => {
  const phoneRef = query(ref(db, 'users'), orderByChild('phoneNumber'), equalTo(phoneNumber));
  try {
    const snapshot = await get(phoneRef);
    return snapshot.exists();
  } catch (error: any) {
    console.error('Error checking phone number:', error);
    throw new Error('Failed to check phone number: ' + error.message);
  }
};
