import React from 'react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../../ui/dialog';
import { getFieldType } from './field-utils';

export function AddItemDialog({
  open,
  onOpenChange,
  newItem,
  onFieldChange,
  onSubmit,
  categories,
  isAdding
}) {
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validate category selection
      if (!newItem.categoryId) {
        toast.error("Please select a category");
        return;
      }

      // Validate required fields
      const category = categories.find(c => c.id === newItem.categoryId);
      const requiredFields = category?.fields.filter(f => f.required) || [];
      const missingFields = requiredFields.filter(field => 
        !newItem.fields[field.name]?.toString().trim()
      );

      if (missingFields.length > 0) {
        toast.error(`Please fill in required fields: ${missingFields.map(f => f.name).join(', ')}`);
        return;
      }

      await onSubmit(e);
    } catch (error) {
      console.error("Error adding item:", error);
      toast.error("Failed to add item");
    }
  };

  const renderFieldInput = (field) => {
    const fieldType = getFieldType(field.name);
    const value = newItem.fields[field.name] || '';

    switch (fieldType.value) {
      case 'textarea':
        return (
          <textarea
            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
            value={value}
            onChange={(e) => onFieldChange(field.name, e.target.value)}
            placeholder={`Enter ${field.name.toLowerCase()}`}
            required={field.required}
          />
        );

      case 'password':
      case 'key':
      case 'privateKey':
        return (
          <Input
            type="password"
            value={value}
            onChange={(e) => onFieldChange(field.name, e.target.value)}
            placeholder={`Enter ${field.name.toLowerCase()}`}
            required={field.required}
            className="font-mono"
          />
        );

      default:
        return (
          <Input
            type={fieldType.value === 'number' ? 'number' : 'text'}
            value={value}
            onChange={(e) => onFieldChange(field.name, e.target.value)}
            placeholder={`Enter ${field.name.toLowerCase()}`}
            required={field.required}
          />
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Add New Item
          </DialogTitle>
          <DialogDescription>
            Fill in the details for your new item
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {newItem.categoryId && categories.find(c => c.id === newItem.categoryId)?.fields.map(field => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name}>
                  {field.name}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {renderFieldInput(field)}
                {field.required && !newItem.fields[field.name] && (
                  <p className="text-xs text-red-500 mt-1">This field is required</p>
                )}
              </div>
            ))}
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isAdding}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isAdding}
            >
              {isAdding ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Item'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
