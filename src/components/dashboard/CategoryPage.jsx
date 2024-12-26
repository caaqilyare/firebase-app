import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { Search, Plus, Package, Tags, FolderTree } from "lucide-react";
import { Separator } from "../ui/separator";
import CategoryManager from './CategoryManager';
import { useCategories } from '../../hooks/useCategories';

const CategoryPage = () => {
  const { categories, addCategory, updateCategory, deleteCategory } = useCategories();

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                Categories
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Manage your categories and their fields
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search categories..."
                  className="h-9 w-[150px] lg:w-[250px] rounded-md border border-input bg-background px-8 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              <Separator orientation="vertical" className="h-8" />
              <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-purple-100 dark:hover:bg-purple-900 transition-colors">
                <Package className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-pink-100 dark:hover:bg-pink-900 transition-colors">
                <Tags className="h-4 w-4 text-pink-600 dark:text-pink-400" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors">
                <FolderTree className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </Button>
              <Button 
                className="bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 hover:opacity-90"
                onClick={() => {}}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Category
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <CategoryManager
            categories={categories}
            onAddCategory={addCategory}
            onUpdateCategory={updateCategory}
            onDeleteCategory={deleteCategory}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryPage;
