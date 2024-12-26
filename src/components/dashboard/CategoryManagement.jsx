import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { Box, Button, TextField, Typography, List, ListItem, ListItemText, IconButton, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editCategory, setEditCategory] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editedName, setEditedName] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'categories'));
      const categoriesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCategories(categoriesData);
    } catch (error) {
      toast.error('Error fetching categories');
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      await addDoc(collection(db, 'categories'), {
        name: newCategory.trim()
      });
      setNewCategory('');
      fetchCategories();
      toast.success('Category added successfully');
    } catch (error) {
      toast.error('Error adding category');
    }
  };

  const handleEditClick = (category) => {
    setEditCategory(category);
    setEditedName(category.name);
    setOpenDialog(true);
  };

  const handleEditSave = async () => {
    if (!editedName.trim()) return;
    try {
      const categoryRef = doc(db, 'categories', editCategory.id);
      await updateDoc(categoryRef, {
        name: editedName.trim()
      });
      setOpenDialog(false);
      fetchCategories();
      toast.success('Category updated successfully');
    } catch (error) {
      toast.error('Error updating category');
    }
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteDoc(doc(db, 'categories', categoryId));
        fetchCategories();
        toast.success('Category deleted successfully');
      } catch (error) {
        toast.error('Error deleting category');
      }
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Category Management
      </Typography>
      
      {/* Add Category Form */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        <TextField
          fullWidth
          size="small"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Enter new category name"
        />
        <Button
          variant="contained"
          onClick={handleAddCategory}
          disabled={!newCategory.trim()}
        >
          Add
        </Button>
      </Box>

      {/* Categories List */}
      <List>
        {categories.map((category) => (
          <ListItem
            key={category.id}
            secondaryAction={
              <Box>
                <IconButton edge="end" onClick={() => handleEditClick(category)}>
                  <EditIcon />
                </IconButton>
                <IconButton edge="end" onClick={() => handleDelete(category.id)}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            }
          >
            <ListItemText primary={category.name} />
          </ListItem>
        ))}
      </List>

      {/* Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            label="Category Name"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleEditSave} disabled={!editedName.trim()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoryManagement;
