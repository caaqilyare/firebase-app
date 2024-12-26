import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'categories'), orderBy('name'));
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const categoriesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setCategories(categoriesData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching categories:', error);
        setError(error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addCategory = async (categoryData) => {
    try {
      await addDoc(collection(db, 'categories'), categoryData);
      toast.success('Category added successfully');
    } catch (err) {
      console.error('Error adding category:', err);
      toast.error('Failed to add category');
      throw err;
    }
  };

  const updateCategory = async (id, categoryData) => {
    try {
      const categoryRef = doc(db, 'categories', id);
      await updateDoc(categoryRef, categoryData);
      toast.success('Category updated successfully');
    } catch (err) {
      console.error('Error updating category:', err);
      toast.error('Failed to update category');
      throw err;
    }
  };

  const deleteCategory = async (id) => {
    try {
      await deleteDoc(doc(db, 'categories', id));
      toast.success('Category deleted successfully');
    } catch (err) {
      console.error('Error deleting category:', err);
      toast.error('Failed to delete category');
      throw err;
    }
  };

  return {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory
  };
}
