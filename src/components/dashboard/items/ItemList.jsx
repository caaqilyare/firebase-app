import React from 'react';
import { ItemCard } from './ItemCard';
import { ItemListHeader } from './ItemListHeader';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 9;

export function ItemList({ 
  items, 
  categories,
  viewMode = 'grid', 
  onViewModeChange,
  onEdit, 
  onDelete 
}) {
  const [search, setSearch] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('');
  const [currentPage, setCurrentPage] = React.useState(1);

  // Filter items based on search and category
  const filteredItems = items.filter(item => {
    const matchesSearch = search.toLowerCase() === '' || 
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      Object.entries(item.fields || {}).some(([key, value]) => 
        key.toLowerCase().includes(search.toLowerCase()) ||
        value.toLowerCase().includes(search.toLowerCase())
      );

    const matchesCategory = selectedCategory === '' || 
      item.categoryId === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedItems = filteredItems.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedCategory]);

  return (
    <div className="space-y-6">
      <ItemListHeader
        search={search}
        onSearchChange={setSearch}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
      />

      {/* Items Grid/List */}
      <div className={cn(
        "w-full",
        viewMode === 'grid' 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" 
          : "flex flex-col gap-4"
      )}>
        {paginatedItems.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <ItemCard 
              item={item}
              viewMode={viewMode}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-muted-foreground">
            Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredItems.length)} of {filteredItems.length} items
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i + 1}
                variant={currentPage === i + 1 ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No items found</p>
        </div>
      )}
    </div>
  );
}
