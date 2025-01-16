import React from 'react';
import { Search, Filter, LayoutGrid, List, X } from 'lucide-react';
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
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="space-y-4">
      <motion.div 
        className="flex flex-col md:flex-row items-stretch md:items-center gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search items..."
            className={cn(
              "pl-10 bg-background/50 backdrop-blur-sm border-border/40",
              "hover:border-violet-500/20 focus:border-violet-500/40",
              "transition-colors duration-300"
            )}
          />
        </div>

        {/* Category Filter */}
        <Select
          value={selectedCategory || "all"}
          onValueChange={(value) => onCategoryChange(value === "all" ? "" : value)}
        >
          <SelectTrigger 
            className={cn(
              "w-full md:w-[200px] bg-background/50 backdrop-blur-sm border-border/40",
              "hover:border-violet-500/20 focus:border-violet-500/40",
              "transition-colors duration-300"
            )}
          >
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent className="bg-background/95 backdrop-blur-sm border-border/40">
            <SelectItem value="all" className="hover:bg-violet-500/10 hover:text-violet-500">
              All Categories
            </SelectItem>
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
      </motion.div>

      {/* Active Filters */}
      <AnimatePresence mode="wait">
        {(selectedCategory || search) && (
          <motion.div 
            className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground p-4 rounded-xl border border-border/40 bg-background/50 backdrop-blur-sm"
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Filter className="h-4 w-4 text-violet-500" />
            <span>Active filters:</span>
            {selectedCategory && (
              <motion.div 
                className="flex items-center gap-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <span className="bg-violet-500/10 text-violet-500 px-3 py-1 rounded-full text-sm font-medium">
                  {categories.find(c => c.id === selectedCategory)?.name}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onCategoryChange("")}
                  className={cn(
                    "h-6 w-6 p-0 rounded-full",
                    "hover:bg-red-500/10 hover:text-red-500",
                    "transition-colors duration-200"
                  )}
                >
                  <X className="h-3 w-3" />
                </Button>
              </motion.div>
            )}
            {search && (
              <motion.div 
                className="flex items-center gap-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <span className="bg-violet-500/10 text-violet-500 px-3 py-1 rounded-full text-sm font-medium">
                  "{search}"
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSearchChange("")}
                  className={cn(
                    "h-6 w-6 p-0 rounded-full",
                    "hover:bg-red-500/10 hover:text-red-500",
                    "transition-colors duration-200"
                  )}
                >
                  <X className="h-3 w-3" />
                </Button>
              </motion.div>
            )}
            {(selectedCategory && search) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onCategoryChange("");
                    onSearchChange("");
                  }}
                  className={cn(
                    "h-7 ml-2 rounded-full",
                    "hover:bg-red-500/10 hover:text-red-500",
                    "transition-colors duration-200"
                  )}
                >
                  Clear All
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 