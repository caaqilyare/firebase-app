import React, { useState } from 'react';
import { ItemList } from './items/ItemList';
import { AddItemForm } from './items/AddItemForm';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { useItems } from '@/hooks/useItems';
import { toast } from 'sonner';
import { useCategories } from '@/hooks/useCategories';

export function DashboardContainer() {
  const { items, loading, error, addItem, updateItem, deleteItem } = useItems();
  const { categories } = useCategories();
  const [viewMode, setViewMode] = useState('grid');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAdd = async (newItem) => {
    try {
      await addItem(newItem);
      setShowAddForm(false);
    } catch (err) {
      console.error('Error adding item:', err);
    }
  };

  const handleEdit = async (updatedItem) => {
    try {
      if (!updatedItem?.id) {
        throw new Error('Item ID is missing');
      }

      const updateData = {
        title: updatedItem.title,
        categoryId: updatedItem.categoryId,
        fields: updatedItem.fields
      };

      await updateItem(updatedItem.id, updateData);
      toast.success('Item updated successfully');
    } catch (err) {
      console.error('Error updating item:', err);
      toast.error(err.message || 'Failed to update item');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteItem(id);
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Manage your items and credentials</p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {showAddForm && (
        <div className="mb-6">
          <AddItemForm 
            onSubmit={handleAdd}
            onCancel={() => setShowAddForm(false)}
            categories={categories}
          />
        </div>
      )}

      <ItemList 
        items={items} 
        categories={categories}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
} 