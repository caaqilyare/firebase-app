import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ItemField } from './ItemField';
import { ChevronDown, ChevronUp, MoreVertical, Edit2, Trash2, Loader2, Package, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
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
  const [isHovered, setIsHovered] = useState(false);

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
      <motion.div 
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "group relative overflow-hidden",
        "rounded-xl border bg-gradient-to-br from-background/50 to-background/10",
        "backdrop-blur-sm shadow-lg transition-all duration-300",
        viewMode === 'grid' ? "p-6" : "p-6",
        "hover:shadow-xl hover:border-violet-500/20"
      )}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-fuchsia-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Card Header */}
      <div className="relative flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/10 to-cyan-500/10 flex items-center justify-center">
            <Package className="h-5 w-5 text-violet-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
              {item.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <Calendar className="h-3 w-3" />
              <span>{formatDistanceToNow(new Date(item.createdAt || Date.now()), { addSuffix: true })}</span>
            </div>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8 rounded-lg transition-colors",
                "hover:bg-violet-500/10 hover:text-violet-500"
              )}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MoreVertical className="h-4 w-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem 
              onClick={() => setIsEditing(true)}
              disabled={isUpdating}
              className="flex items-center gap-2 hover:bg-violet-500/10 hover:text-violet-500"
            >
              <Edit2 className="h-4 w-4" />
              Edit Item
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(item.id)}
              disabled={isUpdating}
              className="flex items-center gap-2 hover:bg-red-500/10 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
              Delete Item
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Card Content */}
      <motion.div 
        className="relative space-y-4"
        animate={{ opacity: isHovered ? 1 : 0.9 }}
        transition={{ duration: 0.2 }}
      >
        {Object.entries(item.fields || {}).map(([fieldName, fieldValue], index) => (
          <motion.div
            key={fieldName}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-3 rounded-lg bg-gradient-to-br from-background/50 to-background/30 border border-border/50 hover:border-violet-500/20 transition-colors"
          >
            <ItemField
              fieldName={fieldName}
              fieldValue={fieldValue}
              showSecretFields={showSecretFields}
              toggleFieldVisibility={toggleFieldVisibility}
              viewMode={viewMode}
            />
          </motion.div>
        ))}
        {Object.keys(item.fields || {}).length === 0 && (
          <div className="text-center py-4 text-muted-foreground">
            <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No fields added yet</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
