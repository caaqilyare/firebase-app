import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CodeInput } from './CodeInput';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, Key, Lock, Terminal, Type, User, Wallet, Package, Loader2 } from 'lucide-react';
import { fieldTypes } from './field-types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AddItemForm({ 
  onSubmit, 
  onCancel, 
  initialData = null, 
  isLoading = false,
  categories = []
}) {
  const [formData, setFormData] = useState(initialData || {
    title: '',
    categoryId: '',
    fields: {}
  });
  const [newField, setNewField] = useState({ name: '', type: '' });
  const [showFieldSelector, setShowFieldSelector] = useState(false);

  const [showSecretFields, setShowSecretFields] = useState({});
  const [isFullscreen, setIsFullscreen] = useState(false);

  const isEditing = !!initialData;

  const handleFieldChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      fields: {
        ...prev.fields,
        [fieldName]: value
      }
    }));
  };

  const toggleFieldVisibility = (fieldName) => {
    setShowSecretFields(prev => ({
      ...prev,
      [fieldName]: !prev[fieldName]
    }));
  };

  const getFieldTypeConfig = (fieldName) => {
    // Convert fieldName to lowercase and remove spaces for matching
    const normalizedName = fieldName.toLowerCase().replace(/\s+/g, '');
    return fieldTypes.find(type => 
      normalizedName.includes(type.value) || 
      type.value.includes(normalizedName)
    ) || fieldTypes[0]; // Default to text type if no match found
  };

  const renderFieldInput = (fieldName) => {
    const fieldConfig = getFieldTypeConfig(fieldName);
    const Icon = fieldConfig.icon;

    return (
      <div className="font-mono text-xs">
        <div className={cn(
          "relative rounded-md overflow-hidden",
          fieldConfig.style,
          "group/field"
        )}>
          {/* Background Effect */}
          <div className="absolute inset-0">
            <div className={cn(
              "absolute inset-0",
              fieldConfig.style
            )} />
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
          </div>

          {/* Header */}
          <div className={cn(
            "relative px-4 py-3 border-b",
            fieldConfig.style.replace('bg-gradient-to-r', 'border-b')
          )}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "h-6 w-6 rounded-full flex items-center justify-center",
                  fieldConfig.iconStyle
                )}>
                  <Icon className="h-3 w-3" />
                </div>
                <span className={cn(
                  "text-xs font-medium",
                  fieldConfig.iconStyle.replace('bg-', 'text-')
                )}>
                  {fieldName}
                </span>
                {fieldConfig.badge && (
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded-full",
                    fieldConfig.badgeStyle
                  )}>
                    {fieldConfig.badge}
                  </span>
                )}
              </div>
              {(fieldConfig.value === 'password' || fieldConfig.value === 'key') && (
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-6 w-6",
                    `hover:${fieldConfig.iconStyle}`
                  )}
                  onClick={() => toggleFieldVisibility(fieldName)}
                >
                  {showSecretFields[fieldName] ? (
                    <EyeOff className="h-3 w-3 text-zinc-400" />
                  ) : (
                    <Eye className="h-3 w-3 text-zinc-400" />
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Input Area */}
          <div className="relative p-4">
            {fieldConfig.value === 'code' ? (
              <CodeInput
                value={formData.fields[fieldName] || ''}
                onChange={(e) => handleFieldChange(fieldName, e.target.value)}
                isFullscreen={isFullscreen}
                onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
              />
            ) : (
              <input
                type={getInputType(fieldConfig.value, showSecretFields[fieldName])}
                value={formData.fields[fieldName] || ''}
                onChange={(e) => handleFieldChange(fieldName, e.target.value)}
                className={cn(
                  "w-full bg-black/20 rounded border",
                  "px-3 py-2 font-mono text-sm",
                  "focus:outline-none focus:ring-1",
                  fieldConfig.style.replace('bg-gradient-to-r', 'border-')
                )}
                placeholder={`Enter ${fieldName}...`}
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  const getInputType = (fieldType, isVisible) => {
    switch (fieldType) {
      case 'password':
      case 'key':
        return isVisible ? 'text' : 'password';
      case 'number':
        return 'number';
      case 'email':
        return 'email';
      case 'url':
        return 'url';
      case 'date':
        return 'date';
      case 'time':
        return 'time';
      case 'datetime':
        return 'datetime-local';
      case 'tel':
        return 'tel';
      default:
        return 'text';
    }
  };

  const renderTitleInput = () => (
    <div className="space-y-4">
      <Input
        type="text"
        value={formData.title}
        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
        placeholder="Enter item title..."
        className="text-lg font-medium"
      />
      <Select
        value={formData.categoryId}
        onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Category" />
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
  );

  const addNewField = () => {
    if (newField.name && newField.type) {
      setFormData(prev => ({
        ...prev,
        fields: {
          ...prev.fields,
          [newField.name]: ''
        }
      }));
      setNewField({ name: '', type: '' });
      setShowFieldSelector(false);
    }
  };

  const renderFieldTypeSelector = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {fieldTypes.map((type) => {
        const Icon = type.icon;
        return (
          <button
            key={type.value}
            type="button"
            onClick={() => {
              setNewField(prev => ({ ...prev, type: type.value }));
              setShowFieldSelector(false);
            }}
            className={cn(
              "relative group p-4 rounded-lg border transition-all duration-200",
              "flex flex-col items-center gap-3 text-center",
              type.style,
              "hover:scale-105"
            )}
          >
            <div className={cn(
              "h-12 w-12 rounded-full flex items-center justify-center",
              type.iconStyle
            )}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <div className="font-medium">{type.label}</div>
              <div className="text-xs text-muted-foreground">
                {type.description}
              </div>
            </div>
            {type.badge && (
              <span className={cn(
                "absolute top-2 right-2",
                "text-[10px] px-1.5 py-0.5 rounded-full",
                type.badgeStyle
              )}>
                {type.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );

  const renderAddField = () => (
    <div className="space-y-4">
      {!showFieldSelector ? (
        <div className="flex gap-4">
          <input
            type="text"
            value={newField.name}
            onChange={(e) => setNewField(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter field name..."
            className={cn(
              "flex-1",
              "px-4 py-2 rounded-lg",
              "bg-black/5 border border-zinc-200/20",
              "focus:outline-none focus:ring-2 focus:ring-violet-500/20",
              "placeholder:text-zinc-500"
            )}
          />
          <Button
            type="button"
            onClick={() => setShowFieldSelector(true)}
            className={cn(
              "bg-gradient-to-r from-violet-600 to-indigo-600",
              "hover:from-violet-500 hover:to-indigo-500",
              "text-white"
            )}
          >
            Choose Type
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-violet-500/5 to-indigo-500/5 border-b border-zinc-200/20">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Choose Field Type</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowFieldSelector(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
          {renderFieldTypeSelector()}
        </div>
      )}
    </div>
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Ensure we have the required data structure
    const submitData = {
      title: formData.title,
      fields: formData.fields,
      ...(initialData?.id ? { id: initialData.id } : {}) // Include ID if it exists
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        {/* Title Input */}
        {renderTitleInput()}

        {/* Dynamic Fields */}
        <div className="space-y-4">
          {Object.entries(formData.fields || {}).map(([fieldName]) => (
            <div key={fieldName}>
              {renderFieldInput(fieldName)}
            </div>
          ))}
        </div>

        {/* Add New Field Section - Only show when creating new item */}
        {!isEditing && (
          <div className="pt-4 border-t border-zinc-200/20">
            <h3 className="text-lg font-semibold mb-4">Add New Field</h3>
            {renderAddField()}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button 
            type="submit" 
            className={cn(
              "flex-1",
              "bg-gradient-to-r from-emerald-600 to-cyan-600",
              "hover:from-emerald-500 hover:to-cyan-500",
              "text-white font-medium"
            )}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Updating...</span>
              </div>
            ) : (
              <span>{initialData ? 'Update Item' : 'Add Item'}</span>
            )}
          </Button>
          <Button 
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
} 