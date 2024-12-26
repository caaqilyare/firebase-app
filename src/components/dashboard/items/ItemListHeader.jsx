import React from 'react';
import { Search, Filter, LayoutGrid, List } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ItemListHeader({ 
  search, 
  onSearchChange, 
  selectedCategory,
  onCategoryChange,
  categories,
  viewMode,
  onViewModeChange 
}) {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex items-center gap-4">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search items..."
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        <Select
          value={selectedCategory || "all"}
          onValueChange={(value) => onCategoryChange(value === "all" ? "" : value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters */}
      {(selectedCategory || search) && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Filter className="h-4 w-4" />
          <span>Filters:</span>
          {selectedCategory && (
            <div className="flex items-center gap-2">
              <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                Category: {categories.find(c => c.id === selectedCategory)?.name}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onCategoryChange("")}
                className="h-6 px-2 hover:bg-destructive/10"
              >
                ×
              </Button>
            </div>
          )}
          {search && (
            <div className="flex items-center gap-2">
              <span className="bg-primary/10 text-primary px-2 py-1 rounded">
                Search: {search}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onSearchChange("")}
                className="h-6 px-2 hover:bg-destructive/10"
              >
                ×
              </Button>
            </div>
          )}
          {(selectedCategory && search) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onCategoryChange("");
                onSearchChange("");
              }}
              className="ml-2 h-6"
            >
              Clear All
            </Button>
          )}
        </div>
      )}
    </div>
  );
} 