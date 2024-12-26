import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useItems } from "../../hooks/useItems";
import { useCategories } from "../../hooks/useCategories";
import { ItemList } from "./items/ItemList";
import CategoryManager from "./categories/CategoryManager";
import DashboardOverview from "./DashboardOverview";
import { Button } from "../ui/button";
import { Plus, Grid2X2, List } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { AddItemForm } from "./AddItemForm";
import { toast } from "sonner";
import Header from "./Header";
import { cn } from "../../lib/utils";
import { AddCategoryDialog } from './categories/AddCategoryDialog';

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
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 container mx-auto py-4 md:py-8 px-4 md:px-8 max-w-7xl">
        <div className="relative mb-8">
          <div className="rounded-2xl overflow-hidden">
            <div className="relative p-8 bg-gradient-to-r from-purple-600/10 via-pink-600/10 to-blue-600/10 backdrop-blur-sm border">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-pink-600/5 to-blue-600/5 animate-gradient" />
              <div className="relative">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                  Welcome back!
                </h2>
                <p className="text-muted-foreground mt-2 max-w-2xl">
                  Manage your items and categories with ease. Keep track of everything in one place.
                </p>
                <div className="flex items-center gap-4 mt-6">
                  <Button 
                    onClick={() => setIsAddItemDialogOpen(true)} 
                    className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:opacity-90"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm pb-4">
            <TabsList className="w-full justify-start overflow-x-auto">
              <TabsTrigger value="overview" className="flex-1 md:flex-none">
                Overview
              </TabsTrigger>
              <TabsTrigger value="items" className="flex-1 md:flex-none">
                <div className="flex items-center gap-2">
                  Items
                  <div className="hidden md:flex items-center bg-muted/30 backdrop-blur-sm rounded-lg p-1 gap-1 ml-2">
                    <Button
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('grid')}
                      className={cn(
                        "h-6 w-6 p-0 rounded-md transition-colors",
                        viewMode === 'grid' 
                          ? "bg-background text-foreground shadow-sm" 
                          : "hover:bg-background/50 text-muted-foreground"
                      )}
                    >
                      <Grid2X2 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => setViewMode('list')}
                      className={cn(
                        "h-6 w-6 p-0 rounded-md transition-colors",
                        viewMode === 'list' 
                          ? "bg-background text-foreground shadow-sm" 
                          : "hover:bg-background/50 text-muted-foreground"
                      )}
                    >
                      <List className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </TabsTrigger>
              <TabsTrigger value="categories" className="flex-1 md:flex-none">
                Categories
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
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
        </Tabs>
      </main>

      <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
              Add New Item
            </DialogTitle>
            <DialogDescription>
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
