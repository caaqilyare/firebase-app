import React from 'react';
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Pencil, Trash2, MoreHorizontal, Calendar, Tag } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { formatDistanceToNow } from 'date-fns';
import { categoryIcons } from '../../lib/icons';

const ItemCard = ({ item, onEdit, onDelete, category }) => {
  const IconComponent = categoryIcons[category?.icon || 'Folder'];
  const createdAt = new Date(item.createdAt);
  
  // Function to get a color for a value based on its type
  const getValueColor = (value, type) => {
    if (type === 'number') {
      return value > 0 ? 'text-green-500' : value < 0 ? 'text-red-500' : 'text-muted-foreground';
    }
    return 'text-foreground';
  };

  // Function to format field value based on type
  const formatFieldValue = (value, type) => {
    if (value === undefined || value === null) return '-';
    
    switch (type) {
      case 'number':
        return new Intl.NumberFormat().format(value);
      case 'date':
        return new Date(value).toLocaleDateString();
      case 'boolean':
        return value ? 'Yes' : 'No';
      default:
        return value.toString();
    }
  };

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      {/* Header Section */}
      <div className="flex items-start justify-between p-4">
        <div className="flex items-start space-x-4">
          <div className="rounded-lg bg-primary/10 p-2 dark:bg-primary/20">
            {IconComponent && <IconComponent className="h-5 w-5 text-primary" />}
          </div>
          <div>
            <h3 className="font-semibold leading-none tracking-tight">
              {item.name}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>
                {formatDistanceToNow(createdAt, { addSuffix: true })}
              </span>
            </div>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onEdit(item)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDelete(item.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Content Section */}
      <div className="border-t px-4 py-3">
        <div className="grid gap-2">
          {category?.fields?.map((field, index) => {
            const value = item[field.name];
            if (!value && value !== 0) return null;
            
            return (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-muted-foreground">{field.name}</span>
                <span className={getValueColor(value, field.type)}>
                  {formatFieldValue(value, field.type)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Section */}
      <div className="border-t px-4 py-3">
        <div className="flex items-center space-x-2">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <div className="flex flex-wrap gap-2">
            {item.tags?.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-secondary/50"
              >
                {tag}
              </Badge>
            ))}
            {!item.tags?.length && (
              <span className="text-sm text-muted-foreground">No tags</span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ItemCard;
