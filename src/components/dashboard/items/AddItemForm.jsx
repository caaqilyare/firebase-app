import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CodeInput } from './CodeInput';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, Key, Lock, Terminal, Type, User, Wallet, Package, Loader2, Plus, X } from 'lucide-react';
import { fieldTypes } from './field-types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from 'framer-motion';

const formVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const fieldVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 }
};

const buttonVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
  hover: { scale: 1.05 }
};

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
      <motion.div 
        variants={fieldVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="font-mono text-xs"
      >
        <div className={cn(
          "relative rounded-xl overflow-hidden",
          "bg-gradient-to-br from-background/50 to-background/10",
          "backdrop-blur-sm border border-border/40",
          "shadow-lg hover:shadow-xl transition-all duration-300",
          "group/field"
        )}>
          {/* Header */}
          <div className={cn(
            "relative px-4 py-3 border-b border-border/40",
            "bg-gradient-to-br from-background/50 to-background/10"
          )}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={cn(
                  "h-8 w-8 rounded-lg flex items-center justify-center",
                  "bg-gradient-to-br",
                  fieldConfig.iconStyle
                )}>
                  <Icon className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium">
                  {fieldName}
                </span>
                {fieldConfig.badge && (
                  <span className={cn(
                    "text-xs px-2 py-0.5 rounded-full",
                    "bg-gradient-to-br",
                    fieldConfig.badgeStyle
                  )}>
                    {fieldConfig.badge}
                  </span>
                )}
              </div>
              {(fieldConfig.value === 'password' || fieldConfig.value === 'key') && (
                <motion.div
                  whileHover="hover"
                  variants={buttonVariants}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-8 w-8 rounded-lg",
                      "hover:bg-rose-500/10 hover:text-rose-500",
                      "transition-colors duration-200"
                    )}
                    onClick={() => toggleFieldVisibility(fieldName)}
                  >
                    <AnimatePresence mode="wait">
                      {showSecretFields[fieldName] ? (
                        <motion.div
                          key="eyeoff"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                        >
                          <EyeOff className="h-4 w-4" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="eye"
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                        >
                          <Eye className="h-4 w-4" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Button>
                </motion.div>
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
                  "w-full bg-background/50 rounded-lg border border-border/40",
                  "px-4 py-2.5 font-mono text-sm",
                  "focus:outline-none focus:ring-2 focus:ring-violet-500/20",
                  "hover:border-violet-500/20",
                  "transition-colors duration-200"
                )}
                placeholder={`Enter ${fieldName}...`}
              />
            )}
          </div>
        </div>
      </motion.div>
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
    <motion.div 
      variants={formVariants}
      initial="hidden"
      animate="visible"
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="space-y-4"
    >
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Title</Label>
        <Input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Enter item title..."
          className={cn(
            "text-lg font-medium",
            "bg-background/50 backdrop-blur-sm border-border/40",
            "hover:border-violet-500/20 focus:border-violet-500/40",
            "transition-colors duration-300"
          )}
        />
      </div>
      <div className="space-y-2">
        <Label className="text-sm text-muted-foreground">Category</Label>
        <Select
          value={formData.categoryId}
          onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
        >
          <SelectTrigger className={cn(
            "bg-background/50 backdrop-blur-sm border-border/40",
            "hover:border-violet-500/20 focus:border-violet-500/40",
            "transition-colors duration-300"
          )}>
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent className="bg-background/95 backdrop-blur-sm border-border/40">
            {categories.map((category) => (
              <SelectItem 
                key={category.id} 
                value={category.id}
                className="hover:bg-violet-500/10 hover:text-violet-500"
              >
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </motion.div>
  );

  const renderFieldTypeSelector = () => (
    <motion.div 
      variants={formVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4"
    >
      {fieldTypes.map((type, index) => {
        const Icon = type.icon;
        return (
          <motion.button
            key={type.value}
            variants={buttonVariants}
            whileHover="hover"
            transition={{ delay: index * 0.1 }}
            type="button"
            onClick={() => {
              setNewField(prev => ({ ...prev, type: type.value }));
              setShowFieldSelector(false);
            }}
            className={cn(
              "relative group p-6 rounded-xl border border-border/40",
              "bg-gradient-to-br from-background/50 to-background/10",
              "backdrop-blur-sm shadow-lg hover:shadow-xl",
              "flex flex-col items-center gap-4 text-center",
              "transition-all duration-300"
            )}
          >
            <div className={cn(
              "h-12 w-12 rounded-xl flex items-center justify-center",
              "bg-gradient-to-br",
              type.iconStyle
            )}>
              <Icon className="h-6 w-6 text-white" />
            </div>
            <div className="space-y-1">
              <h3 className="font-medium">{type.label}</h3>
              <p className="text-xs text-muted-foreground">{type.description}</p>
            </div>
          </motion.button>
        );
      })}
    </motion.div>
  );

  const renderAddField = () => (
    <motion.div
      variants={formVariants}
      initial="hidden"
      animate="visible"
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="mt-8"
    >
      {showFieldSelector ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Select Field Type</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowFieldSelector(false)}
              className="hover:bg-red-500/10 hover:text-red-500"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {renderFieldTypeSelector()}
        </div>
      ) : (
        <motion.div whileHover="hover" variants={buttonVariants}>
          <Button
            type="button"
            onClick={() => setShowFieldSelector(true)}
            variant="outline"
            className={cn(
              "w-full py-6 rounded-xl",
              "bg-gradient-to-br from-background/50 to-background/10",
              "backdrop-blur-sm border-border/40",
              "hover:border-violet-500/20 hover:text-violet-500",
              "transition-colors duration-300"
            )}
          >
            <Plus className="h-5 w-5 mr-2" />
            Add New Field
          </Button>
        </motion.div>
      )}
    </motion.div>
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {renderTitleInput()}
      
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {Object.keys(formData.fields).map(fieldName => (
            <motion.div
              key={fieldName}
              layout
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              {renderFieldInput(fieldName)}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {renderAddField()}

      <motion.div 
        variants={formVariants}
        initial="hidden"
        animate="visible"
        className="flex items-center justify-end gap-4 pt-4 border-t border-border/40"
      >
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className="hover:bg-red-500/10 hover:text-red-500"
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 text-white hover:opacity-90"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {isEditing ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>{isEditing ? 'Update Item' : 'Create Item'}</>
          )}
        </Button>
      </motion.div>
    </form>
  );
} 