import React from 'react';
import { ItemCard } from './ItemCard';
import { ItemListHeader } from './ItemListHeader';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Package } from 'lucide-react';

const ITEMS_PER_PAGE = 9;

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

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
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <ItemListHeader
          search={search}
          onSearchChange={setSearch}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
        />
      </motion.div>

      <AnimatePresence mode="wait">
        {/* Items Grid/List */}
        <motion.div
          key={`${viewMode}-${currentPage}-${search}-${selectedCategory}`}
          variants={container}
          initial="hidden"
          animate="show"
          className={cn(
            "w-full",
            viewMode === 'grid' 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
              : "flex flex-col gap-4"
          )}
        >
          {paginatedItems.length > 0 ? (
            paginatedItems.map((item, index) => (
              <motion.div
                key={item.id}
                variants={item}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <ItemCard 
                  item={item}
                  viewMode={viewMode}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="col-span-full flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/10 to-cyan-500/10 flex items-center justify-center mb-4">
                <Package className="h-8 w-8 text-violet-500" />
              </div>
              <h3 className="text-xl font-semibold bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent mb-2">
                No items found
              </h3>
              <p className="text-muted-foreground max-w-sm">
                {search || selectedCategory 
                  ? "Try adjusting your filters or search terms"
                  : "Add your first item to get started"}
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-between pt-8 border-t border-border/40"
          >
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredItems.length)} of {filteredItems.length} items
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={cn(
                  "transition-colors",
                  "hover:bg-violet-500/10 hover:text-violet-500 hover:border-violet-500/20",
                  "disabled:opacity-50"
                )}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => (
                <Button
                  key={i + 1}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(i + 1)}
                  className={cn(
                    "transition-colors",
                    currentPage === i + 1
                      ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:opacity-90"
                      : "hover:bg-violet-500/10 hover:text-violet-500 hover:border-violet-500/20"
                  )}
                >
                  {i + 1}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className={cn(
                  "transition-colors",
                  "hover:bg-violet-500/10 hover:text-violet-500 hover:border-violet-500/20",
                  "disabled:opacity-50"
                )}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
