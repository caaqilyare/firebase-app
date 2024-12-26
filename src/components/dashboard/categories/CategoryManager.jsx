import React, { useState } from 'react';
import { 
  Plus, Pencil, Trash2, Save, X, GripVertical, 
  ChevronDown, ChevronRight, MoreVertical, Loader2,
  FolderTree
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';
import { EditCategoryDialog } from './EditCategoryDialog';

export function CategoryManager({ categories = [], onAdd, onEdit, onDelete }) {
  const [expandedCategories, setExpandedCategories] = useState({});
  const [isDeleting, setIsDeleting] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const handleEdit = async (categoryId, categoryData) => {
    try {
      setIsEditing(true);
      await onEdit(categoryId, categoryData);
      setEditingCategory(null);
    } catch (error) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
    } finally {
      setIsEditing(false);
    }
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
  };

  const handleDelete = async (categoryId) => {
    try {
      setIsDeleting(categoryId);
      await onDelete(categoryId);
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Categories</h2>
          <p className="text-muted-foreground">
            Manage your categories and their fields
          </p>
        </div>
        <Button
          onClick={onAdd}
          className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:opacity-90"
        >
          <Plus className="mr-2 h-4 w-4" />
          New Category
        </Button>
      </div>

      {/* Categories List */}
      <div className="grid gap-4">
        {categories.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-8 text-center">
            <div className="rounded-full bg-muted/10 p-3 mb-4">
              <FolderTree className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">No categories yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get started by creating your first category
            </p>
            <Button
              onClick={onAdd}
              variant="outline"
              className="mt-2"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </Card>
        ) : (
          <AnimatePresence>
            {categories.map((category) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card>
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                      <div 
                        className="flex items-center gap-2 cursor-pointer"
                        onClick={() => toggleCategory(category.id)}
                      >
                        {expandedCategories[category.id] ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                        <CardTitle className="text-lg font-semibold">
                          {category.name}
                        </CardTitle>
                        <Badge variant="outline" className="ml-2">
                          {category.fields?.length || 0} fields
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditClick(category)}
                          disabled={isEditing}
                        >
                          {isEditing ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Pencil className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleDelete(category.id)}
                          disabled={isDeleting === category.id}
                        >
                          {isDeleting === category.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  {expandedCategories[category.id] && (
                    <CardContent className="p-4 pt-0">
                      <Separator className="my-4" />
                      {category.fields?.length > 0 ? (
                        <div className="grid gap-3">
                          {category.fields.map((field, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex flex-col">
                                  <span className="font-medium">{field.name}</span>
                                  <span className="text-xs text-muted-foreground">
                                    Type: {field.type}
                                  </span>
                                </div>
                              </div>
                              <Badge variant={field.required ? "default" : "outline"}>
                                {field.required ? "Required" : "Optional"}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          No fields defined for this category
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <EditCategoryDialog
        category={editingCategory}
        open={!!editingCategory}
        onOpenChange={(open) => !open && setEditingCategory(null)}
        onSubmit={handleEdit}
        isSubmitting={isEditing}
      />
    </div>
  );
}

export default CategoryManager; 