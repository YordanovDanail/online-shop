import { useEffect, useState } from 'react';
import { fetchItems } from '../../services/item.service';
import { Item } from '../../models/Item';

const ItemsPage = () => {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const fetchedItems = await fetchItems();
        setItems(fetchedItems);
      } catch (error) {
        console.error('Error loading items:', error);
      }
    };

    loadItems();
  }, []);

  return (
    <div className="items-page">
      <h1 className="text-2xl font-bold">Items for Sale</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="item-card">
              <img src={item.imageUrl} alt={item.title} className="w-full h-48 object-cover" />
              <h2 className="text-lg font-bold">{item.title}</h2>
              <p>{item.description}</p>
              <p className="text-sm">Category: {item.category}</p>
              <p className="text-sm">Condition: {item.condition}</p>
              <p className="text-lg font-bold">${item.price}</p>
            </div>
          ))
        ) : (
          <p>No items available</p>
        )}
      </div>
    </div>
  );
};

export default ItemsPage;
