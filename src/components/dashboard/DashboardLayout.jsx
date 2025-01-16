import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useItems } from "../../hooks/useItems";
import { useCategories } from "../../hooks/useCategories";
import { ItemList } from "./items/ItemList";
import CategoryManager from "./categories/CategoryManager";
import DashboardOverview from "./DashboardOverview";
import { Button } from "../ui/button";
import { Plus, Grid2X2, List, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { AddItemForm } from "./AddItemForm";
import { toast } from "sonner";
import Header from "./Header";
import { cn } from "../../lib/utils";
import { AddCategoryDialog } from './categories/AddCategoryDialog';
import { motion, AnimatePresence } from "framer-motion";

function DashboardLayout() {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();
  const { items, addItem, updateItem, deleteItem } = useItems();
  const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditingItem, setIsEditingItem] = useState(false);

  const handleAddItem = async (newItem) => {
    try {
      await addItem(newItem);
      setIsAddItemDialogOpen(false);
      toast.success('Item added successfully');
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error('Failed to add item');
    }
  };

  const handleEditItem = async (item) => {
    setIsEditingItem(true);
    try {
      if (!item?.id) {
        throw new Error('Item ID is required for update');
      }

      const { id, ...itemData } = item;
      const updatedItem = await updateItem(id, itemData);
      toast.success('Item updated successfully');
      setIsEditingItem(false);
      return updatedItem;
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Failed to update item');
      setIsEditingItem(false);
      throw error;
    }
  };

  const handleAddCategory = async (categoryData) => {
    try {
      setIsAddingCategory(true);
      await addCategory(categoryData);
      setIsAddCategoryDialogOpen(false);
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
    } finally {
      setIsAddingCategory(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background via-background/95 to-background/90">
      <Header />
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 container mx-auto py-4 md:py-8 px-4 md:px-8 max-w-7xl"
      >
        <motion.div 
          className="relative mb-8"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="rounded-3xl overflow-hidden shadow-2xl">
            <div className="relative p-8 md:p-12 bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-cyan-500/10 backdrop-blur-sm border border-white/10">
              <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 via-fuchsia-500/5 to-cyan-500/5 animate-gradient" />
              <motion.div 
                className="relative"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-6 w-6 text-fuchsia-500" />
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
                    Welcome back!
                  </h2>
                </div>
                <p className="text-muted-foreground mt-2 max-w-2xl text-lg">
                  Manage your items and categories with ease. Keep track of everything in one place.
                </p>
                <motion.div 
                  className="flex items-center gap-4 mt-8"
                  whileHover={{ scale: 1.02 }}
                >
                  <Button 
                    onClick={() => setIsAddItemDialogOpen(true)} 
                    size="lg"
                    className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 hover:opacity-90 shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Add New Item
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-md pb-4 border-b border-border/40">
            <TabsList className="w-full justify-start overflow-x-auto bg-background/50 p-1">
              <TabsTrigger value="overview" className="flex-1 md:flex-none data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500/20 data-[state=active]:to-cyan-500/20">
                Overview
              </TabsTrigger>
              <TabsTrigger value="items" className="flex-1 md:flex-none data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500/20 data-[state=active]:to-cyan-500/20">
                <div className="flex items-center gap-2">
                  Items
                  <div className="hidden md:flex items-center bg-background/40 backdrop-blur-sm rounded-lg p-1 gap-1 ml-2">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className={cn(
                        "h-7 w-7 p-0 rounded-md transition-all duration-200",
                        viewMode === 'grid' 
                          ? "bg-white/90 text-foreground shadow-md" 
                          : "hover:bg-white/20 text-muted-foreground"
                      )}
                    >
                      <Grid2X2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className={cn(
                        "h-7 w-7 p-0 rounded-md transition-all duration-200",
                        viewMode === 'list' 
                          ? "bg-white/90 text-foreground shadow-md" 
                          : "hover:bg-white/20 text-muted-foreground"
                      )}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsTrigger>
              <TabsTrigger value="categories" className="flex-1 md:flex-none data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500/20 data-[state=active]:to-cyan-500/20">
                Categories
              </TabsTrigger>
            </TabsList>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <TabsContent value="overview" className="space-y-4">
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                  <DashboardOverview items={items} categories={categories} />
                </div>
              </TabsContent>

              <TabsContent value="items">
                <ItemList
                  items={items}
                  categories={categories}
                  onEdit={handleEditItem}
                  onDelete={deleteItem}
                  viewMode={viewMode}
                  isLoading={isEditingItem}
                />
              </TabsContent>

              <TabsContent value="categories">
                <CategoryManager
                  categories={categories}
                  onAdd={() => setIsAddCategoryDialogOpen(true)}
                  onEdit={updateCategory}
                  onDelete={deleteCategory}
                />
              </TabsContent>
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </motion.main>

      <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-violet-500 via-fuchsia-500 to-cyan-500 bg-clip-text text-transparent flex items-center gap-2">
              <Plus className="h-6 w-6" />
              Add New Item
            </DialogTitle>
            <DialogDescription className="text-lg">
              Fill in the details below to create a new item
            </DialogDescription>
          </DialogHeader>

          <AddItemForm
            categories={categories}
            onSubmit={handleAddItem}
            onCancel={() => setIsAddItemDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <AddCategoryDialog
        open={isAddCategoryDialogOpen}
        onOpenChange={setIsAddCategoryDialogOpen}
        onSubmit={handleAddCategory}
        isSubmitting={isAddingCategory}
      />
    </div>
  );
}

export default DashboardLayout;
