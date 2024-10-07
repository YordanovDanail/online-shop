import { useState, useContext } from 'react';
import Swal from 'sweetalert2';
import { addItem, uploadItemImages } from '../../services/item.service';
import { Item } from '../../models/Item';
import { AppContext } from '../../state/AppContext';

export const UploadItems: React.FC = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState<number>(0);
    const [category, setCategory] = useState('');
    const [condition, setCondition] = useState<'new' | 'used'>('new');
    const [images, setImages] = useState<File[]>([]);
    const [quantity, setQuantity] = useState<number>(1);
    const { userData } = useContext(AppContext);
  
    const handleUpload = async () => {
      if (!userData) {
        Swal.fire('Error', 'User not authenticated', 'error');
        return;
      }
  
      if (images.length === 0) {
        Swal.fire('Error', 'Please upload at least one image', 'error');
        return;
      }
  
      try {
        const uploadedImages: string[] = [];
  
        for (const image of images) {
          const imageUrl = await uploadItemImages(image);
          uploadedImages.push(imageUrl);
        }
  
        await addItem({
          username: userData.username,
          title,
          description,
          price,
          category,
          condition,
          createdAt: new Date().toISOString(),
          imageUrl: uploadedImages[0],
          userId: userData.uid,
          quantity,
        });
  
        Swal.fire('Success', 'Item uploaded successfully!', 'success');
      } catch (error) {
        Swal.fire('Error', 'Error uploading item', 'error');
        console.error('Error uploading item:', error);
      }
    };
  
    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-md mt-8">
          <h1 className="text-3xl font-semibold mb-6 text-center">Upload Item</h1>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-teal-500"
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-teal-500"
            ></textarea>
            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-teal-500"
            />
            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-teal-500"
            />
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value as 'new' | 'used')}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-teal-500"
            >
              <option value="new">New</option>
              <option value="used">Used</option>
            </select>
            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-teal-500"
            />
            <input
              type="file"
              multiple
              onChange={(e) => setImages(e.target.files ? Array.from(e.target.files) : [])}
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-teal-500"
            />
            <button
              onClick={handleUpload}
              className="w-full bg-teal-600 text-white py-3 rounded mt-4 hover:bg-teal-700 transition duration-300"
            >
              Upload
            </button>
          </div>
        </div>
      );
    };