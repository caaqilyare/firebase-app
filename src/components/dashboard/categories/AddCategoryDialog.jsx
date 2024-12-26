import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const FIELD_TYPES = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "email", label: "Email" },
  { value: "url", label: "URL" },
  { value: "password", label: "Password" },
  { value: "textarea", label: "Text Area" },
  { value: "key", label: "API Key" },
  { value: "privateKey", label: "Private Key" },
  { value: "code", label: "Code Block" },
  { value: "date", label: "Date" },
  { value: "time", label: "Time" },
  { value: "datetime", label: "Date & Time" },
  { value: "phone", label: "Phone Number" },
  { value: "username", label: "Username" },
  { value: "wallet", label: "Wallet Address" }
];

export function AddCategoryDialog({ open, onOpenChange, onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({
    name: '',
    fields: []
  });

  const resetForm = () => {
    setFormData({
      name: '',
      fields: []
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
      resetForm(); // Reset form after successful submission
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // Reset form when dialog is closed
  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const addField = () => {
    setFormData(prev => ({
      ...prev,
      fields: [...prev.fields, { name: '', type: 'text', required: false }]
    }));
  };

  const removeField = (index) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index)
    }));
  };

  const updateField = (index, field) => {
    setFormData(prev => ({
      ...prev,
      fields: prev.fields.map((f, i) => i === index ? field : f)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Add New Category
          </DialogTitle>
          <DialogDescription>
            Create a new category to organize your items
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter category name"
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Fields</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addField}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Field
                </Button>
              </div>

              {formData.fields.map((field, index) => (
                <div
                  key={index}
                  className="flex items-end gap-2 p-4 rounded-lg border bg-muted/50"
                >
                  <div className="flex-1 space-y-2">
                    <Label>Field Name</Label>
                    <Input
                      value={field.name}
                      onChange={(e) => updateField(index, { ...field, name: e.target.value })}
                      placeholder="Enter field name"
                    />
                  </div>

                  <div className="w-[150px] space-y-2">
                    <Label>Type</Label>
                    <Select
                      value={field.type}
                      onValueChange={(value) => updateField(index, { ...field, type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {FIELD_TYPES.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-2 pb-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => updateField(index, { ...field, required: !field.required })}
                      className="h-9 w-9"
                    >
                      <Badge variant={field.required ? "default" : "outline"}>
                        {field.required ? "Req" : "Opt"}
                      </Badge>
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeField(index)}
                      className="h-9 w-9 text-destructive"
                      disabled={formData.fields.length === 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onOpenChange}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !formData.name.trim() || formData.fields.every(f => !f.name.trim())}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Category'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 