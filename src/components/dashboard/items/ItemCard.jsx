import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ItemField } from './ItemField';
import { ChevronDown, ChevronUp, MoreVertical, Edit2, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddItemForm } from './AddItemForm';

export function ItemCard({ item, viewMode = 'grid', onEdit, onDelete }) {
  const [showSecretFields, setShowSecretFields] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const toggleFieldVisibility = (fieldName) => {
    setShowSecretFields(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  const handleEdit = async (formData) => {
    try {
      setIsUpdating(true);
      if (!item?.id) {
        throw new Error('Item ID is missing');
      }

      // Include categoryId in the update data
      const updateData = {
        id: item.id,
        title: formData.title || item.title,
        categoryId: formData.categoryId || item.categoryId,
        fields: formData.fields || {}
      };

      await onEdit(updateData);
      toast.success('Item updated successfully');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error(error.message || 'Failed to update item');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isEditing) {
    return (
      <motion.div layout>
        <AddItemForm 
          initialData={{
            id: item.id,
            title: item.title,
            fields: item.fields
          }}
          onSubmit={handleEdit}
          onCancel={() => setIsEditing(false)}
          isLoading={isUpdating}
        />
      </motion.div>
    );
  }

  return (
    <motion.div
      layout
      className={cn(
        "group relative",
        "rounded-xl border bg-card",
        "transition-all duration-300",
        viewMode === 'grid' ? "p-4" : "p-6",
        "hover:shadow-lg hover:shadow-primary/5"
      )}
    >
      {/* Card Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{item.title}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MoreVertical className="h-4 w-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem 
              onClick={() => setIsEditing(true)}
              disabled={isUpdating}
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-red-600"
              onClick={() => onDelete(item.id)}
              disabled={isUpdating}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Card Content */}
      <div className="space-y-4">
        {Object.entries(item.fields || {}).map(([fieldName, fieldValue]) => (
          <ItemField
            key={fieldName}
            fieldName={fieldName}
            fieldValue={fieldValue}
            showSecretFields={showSecretFields}
            toggleFieldVisibility={toggleFieldVisibility}
            viewMode={viewMode}
          />
        ))}
      </div>
    </motion.div>
  );
}
