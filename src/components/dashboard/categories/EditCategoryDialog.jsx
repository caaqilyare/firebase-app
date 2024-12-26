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
  { value: "textarea", label: "Code Block" },
  { value: "date", label: "Date" },
  { value: "time", label: "Time" },
  { value: "datetime", label: "Date & Time" },
  { value: "phone", label: "Phone Number" },
  { value: "username", label: "Username" },
  { value: "wallet", label: "Wallet Address" }
];

export function EditCategoryDialog({ category, open, onOpenChange, onSubmit, isSubmitting }) {
  const [name, setName] = useState('');
  const [fields, setFields] = useState([]);

  useEffect(() => {
    if (category) {
      setName(category.name);
      setFields(category.fields?.length > 0 
        ? category.fields 
        : [{ name: '', type: 'text', required: false }]
      );
    }
  }, [category]);

  const handleAddField = () => {
    setFields([...fields, { name: '', type: 'text', required: false }]);
  };

  const handleRemoveField = (index) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const handleFieldChange = (index, key, value) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], [key]: value };
    setFields(newFields);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validFields = fields.filter(field => field.name.trim() !== '');
    onSubmit(category.id, { name, fields: validFields });
  };

  const handleClose = () => {
    setName('');
    setFields([{ name: '', type: 'text', required: false }]);
    onOpenChange(false);
  };

  if (!category) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Edit Category
          </DialogTitle>
          <DialogDescription>
            Modify category details and fields
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Category Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                  onClick={handleAddField}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Field
                </Button>
              </div>

              {fields.map((field, index) => (
                <div
                  key={index}
                  className="flex items-end gap-2 p-4 rounded-lg border bg-muted/50"
                >
                  <div className="flex-1 space-y-2">
                    <Label>Field Name</Label>
                    <Input
                      value={field.name}
                      onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                      placeholder="Enter field name"
                    />
                  </div>

                  <div className="w-[150px] space-y-2">
                    <Label>Type</Label>
                    <Select
                      value={field.type}
                      onValueChange={(value) => handleFieldChange(index, 'type', value)}
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
                      onClick={() => handleFieldChange(index, 'required', !field.required)}
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
                      onClick={() => handleRemoveField(index)}
                      className="h-9 w-9 text-destructive"
                      disabled={fields.length === 1}
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
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !name.trim() || fields.every(f => !f.name.trim())}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 