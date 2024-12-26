import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

export function EditItemDialog({ item, categories, open, onOpenChange, onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    fields: {}
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        id: item.id,
        title: item.title,
        categoryId: item.categoryId,
        fields: { ...item.fields }
      });
    }
  }, [item]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      if (!formData.id) {
        toast.error("Invalid item ID");
        return;
      }

      if (!formData.categoryId) {
        toast.error("Please select a category");
        return;
      }

      const category = categories.find(c => c.id === formData.categoryId);
      const requiredFields = category?.fields.filter(f => f.required) || [];
      const missingFields = requiredFields.filter(field => 
        !formData.fields[field.name]?.toString().trim()
      );

      if (missingFields.length > 0) {
        toast.error(`Please fill in required fields: ${missingFields.map(f => f.name).join(', ')}`);
        return;
      }

      const updateData = {
        id: formData.id,
        title: formData.title,
        categoryId: formData.categoryId,
        fields: formData.fields
      };

      await onSubmit(updateData);
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error("Failed to update item");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFieldChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      fields: {
        ...prev.fields,
        [fieldName]: value
      }
    }));
  };

  const selectedCategory = categories.find(c => c.id === formData.categoryId);

  if (!item) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Edit Item
          </DialogTitle>
          <DialogDescription>
            Modify the item details below
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter item title"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={formData.categoryId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedCategory?.fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label>
                  {field.name}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                <Input
                  type={field.type === 'number' ? 'number' : 'text'}
                  value={formData.fields[field.name] || ''}
                  onChange={(e) => handleFieldChange(field.name, e.target.value)}
                  placeholder={`Enter ${field.name.toLowerCase()}`}
                  required={field.required}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Item'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
