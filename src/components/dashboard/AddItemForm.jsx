import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export function AddItemForm({ categories = [], onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    fields: {}
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when categories change
  useEffect(() => {
    if (categories.length === 1) {
      setFormData(prev => ({
        ...prev,
        categoryId: categories[0].id
      }));
    }
  }, [categories]);

  const resetForm = () => {
    setFormData({
      title: '',
      categoryId: '',
      fields: {}
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (!formData.categoryId) {
        toast.error("Please select a category", {
          description: "A category is required to create an item",
          className: "bg-red-500 text-white",
        });
        return;
      }

      const category = categories.find(c => c.id === formData.categoryId);
      const requiredFields = category?.fields.filter(f => f.required) || [];
      const missingFields = requiredFields.filter(field => 
        !formData.fields[field.name]?.toString().trim()
      );

      if (missingFields.length > 0) {
        toast.error("Required fields missing", {
          description: `Please fill in: ${missingFields.map(f => f.name).join(', ')}`,
          className: "bg-red-500 text-white",
        });
        return;
      }

      setIsSubmitting(true);
      await onSubmit(formData);
      resetForm(); // Reset form after successful submission
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to create item", {
        description: error.message,
        className: "bg-red-500 text-white",
      });
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

  if (categories.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-muted-foreground">
          Please create a category first before adding items.
        </p>
      </div>
    );
  }

  return (
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
            required
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

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !formData.title.trim() || !formData.categoryId}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            'Create Item'
          )}
        </Button>
      </div>
    </form>
  );
}
