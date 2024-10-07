import { ref, push, get, DatabaseReference, remove } from 'firebase/database';
import { db, storage } from '../config/firebase-config';
import { Item } from '../models/Item';
import { ref as storageRef,getDownloadURL, uploadBytes } from 'firebase/storage';

// GET
export const addItem = async (item: Omit<Item, 'id'>): Promise<void> => {
  try {
    const itemsRef: DatabaseReference = ref(db, 'items');
    await push(itemsRef, {
      ...item,
      createdAt: new Date().toISOString()
    });
  } catch (error: any) {
    throw new Error('Error adding item: ' + error.message);
  }
};

// FETCH
export const fetchItems = async (): Promise<Item[]> => {
  const itemsRef = ref(db, 'items');
  try {
    const snapshot = await get(itemsRef);
    if (snapshot.exists()) {
      const items: Item[] = [];
      snapshot.forEach((childSnapshot) => {
        const item = childSnapshot.val();
        items.push({ id: childSnapshot.key, ...item });
      });
      return items;
    }
    return [];
  } catch (error: any) {
    throw new Error('Error fetching items: ' + error.message);
  }
};

export const getItemById = async (itemId: string): Promise<Item | null> => {
  const itemRef = ref(db, `items/${itemId}`);
  try {
    const snapshot = await get(itemRef);
    if (snapshot.exists()) {
      return snapshot.val() as Item;
    }
    return null;
  } catch (error: any) {
    throw new Error('Error retrieving item: ' + error.message);
  }
};

// UPLOAD 
export const uploadItemImages = async (imageFile: File): Promise<string> => {
  try {
    const imageStorageRef = storageRef(storage, `items/${imageFile.name}`);
    const snapshot = await uploadBytes(imageStorageRef, imageFile);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error: any) {
    throw new Error('Error uploading image: ' + error.message);
  }
};

// DELETE 
export const deleteItem = async (itemId: string): Promise<void> => {
  const itemRef = ref(db, `items/${itemId}`);
  try {
    await remove(itemRef);
  } catch (error: any) {
    throw new Error('Error deleting item: ' + error.message);
  }
};