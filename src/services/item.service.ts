import { ref, push, get, DatabaseReference } from 'firebase/database';
import { db } from '../config/firebase-config';
import { Item } from '../models/Item';

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
