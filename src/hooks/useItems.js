import { useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs,
  query,
  orderBy 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';

export function useItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const q = query(collection(db, 'items'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedItems = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setItems(fetchedItems);
      } catch (err) {
        console.error('Error fetching items:', err);
        setError(err.message);
        toast.error('Failed to load items');
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Add item
  const addItem = async (newItem) => {
    try {
      const { id, ...itemData } = newItem;
      
      const docRef = await addDoc(collection(db, 'items'), {
        ...itemData,
        createdAt: new Date().toISOString()
      });

      const itemWithId = { ...itemData, id: docRef.id };
      setItems(prev => [itemWithId, ...prev]);
      toast.success('Item added successfully');
      return itemWithId;
    } catch (err) {
      console.error('Error adding item:', err);
      toast.error('Failed to add item');
      throw err;
    }
  };

  // Update item
  const updateItem = async (id, updatedData) => {
    if (!id || typeof id !== 'string') {
      const error = new Error('Valid item ID is required for update');
      console.error('Invalid ID:', id);
      throw error;
    }

    try {
      // Remove id from the data to be updated
      const { id: itemId, ...updateFields } = updatedData;

      // Create clean update data including categoryId
      const cleanData = {
        title: updateFields.title,
        categoryId: updateFields.categoryId,
        fields: updateFields.fields || {},
        updatedAt: new Date().toISOString()
      };

      // Get document reference
      const itemRef = doc(db, 'items', id);

      // Update in Firestore
      await updateDoc(itemRef, cleanData);

      // Update local state
      setItems(prev => prev.map(item => 
        item.id === id ? { ...item, ...cleanData } : item
      ));

      toast.success('Item updated successfully');
      return true;
    } catch (err) {
      console.error('Error updating item:', err);
      throw new Error(`Failed to update item: ${err.message}`);
    }
  };

  // Delete item
  const deleteItem = async (id) => {
    if (!id) {
      throw new Error('Item ID is required for deletion');
    }

    try {
      await deleteDoc(doc(db, 'items', id));
      setItems(prev => prev.filter(item => item.id !== id));
      toast.success('Item deleted successfully');
    } catch (err) {
      console.error('Error deleting item:', err);
      toast.error('Failed to delete item');
      throw err;
    }
  };

  return {
    items,
    loading,
    error,
    addItem,
    updateItem,
    deleteItem
  };
}
