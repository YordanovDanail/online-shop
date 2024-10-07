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
    <div className="max-w-7xl mx-auto p-8 bg-gray-50 shadow-md rounded-md mt-8">
      <h1 className="text-4xl font-bold mb-10 text-center text-teal-700">Items for Sale</h1>
      {items.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No items available</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
              <div className="overflow-hidden rounded-lg mb-4">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-56 object-cover transform hover:scale-105 transition duration-300"
                />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-800">{item.title}</h3>
              <p className="text-gray-700 mb-3 text-sm line-clamp-3">{item.description}</p>
              <p className="text-gray-900 font-bold text-lg mb-2">${item.price}</p>
              <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                <p>Category: <span className="font-medium">{item.category}</span></p>
                <p>Condition: <span className="font-medium">{item.condition}</span></p>
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <p>Quantity: <span className="font-medium">{item.quantity}</span></p>
                <p>Seller: <span className="font-medium">{item.username}</span></p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ItemsPage;