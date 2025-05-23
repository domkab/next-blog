'use client';

import { useEffect, useState } from 'react';
import { Button, TextInput, Select, Alert, Card } from 'flowbite-react';
import axios, { AxiosError } from 'axios';
import { generateSlug } from '@/utils/generateSlug';

interface Category {
  _id: string;
  name: string;
  slug: string;
  parent?: string | null;
}

export default function DashCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [parent, setParent] = useState<string | null>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage(null);
        setError(null);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [message, error]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/categories/get');
      setCategories(res.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      await axios.post('/api/categories/create', {
        name,
        slug,
        parent: parent || null,
        userMongoId: localStorage.getItem('userMongoId'),
      });

      setMessage('Category created successfully!');
      setName('');
      setSlug('');
      setParent('');
      fetchCategories();
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error('Error creating category:', axiosError);
      setError(
        axiosError.response?.data as string || 'Failed to create category'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setName(value);
    setSlug(generateSlug(value));
  };

  const handleUpdateCategory = async (cat: Category) => {
    try {
      await axios.put('/api/categories/update', {
        _id: cat._id,
        name: cat.name,
        slug: cat.slug,
        parent: cat.parent,
        userMongoId: localStorage.getItem('userMongoId'),
      });
      setEditingId(null);
      fetchCategories();
    } catch (error) {
      console.error('Failed to update category', error);
      alert('Update failed.');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      await axios.delete('/api/categories/delete', {
        data: {
          categoryId,
          userMongoId: localStorage.getItem('userMongoId'),
        }
      });
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Delete failed.');
    }
  };

  return (
    <div className="p-4 mx-auto w-full">
      <h2 className="text-2xl font-semibold mb-4">Manage Categories</h2>

      {message && <Alert color="success">{message}</Alert>}
      {error && <Alert color="failure">{error}</Alert>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg mb-6">
        <TextInput
          placeholder="Category Name"
          value={name}
          onChange={handleNameChange}
          required
        />

        <TextInput
          placeholder="Slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          helperText="Generated automatically, but you can customize if needed."
          required
        />

        <Select
          value={parent || ''}
          onChange={(e) => setParent(e.target.value || null)}
        >
          <option value="">No parent (top-level)</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </Select>

        <Button type="submit" isProcessing={loading}>Create Category</Button>
      </form>

      <div className="border-t pt-4 w-[80%]">
        <h3 className="text-lg font-medium mb-4 ">Existing Categories</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const parentName = categories.find(c => c._id === cat.parent)?.name || '—';

            return (
              <Card key={cat._id} className="w-full min-h-[300px] h-full flex flex-col justify-between">
                {editingId === cat._id ? (
                  <div className="flex flex-col gap-3 w-full space-y-3">
                    <TextInput
                      value={cat.name}
                      className='w-full'
                      onChange={(e) => {
                        const updated = categories.map(c =>
                          c._id === cat._id ? { ...c, name: e.target.value, slug: generateSlug(e.target.value) } : c
                        );
                        setCategories(updated);
                      }}
                    />
                    <TextInput
                      value={cat.slug}
                      className='w-full '
                      onChange={(e) => {
                        const updated = categories.map(c =>
                          c._id === cat._id ? { ...c, slug: e.target.value } : c
                        );
                        setCategories(updated);
                      }}
                    />
                    <Select
                      value={cat.parent || ''}
                      className='w-full'
                      onChange={(e) => {
                        const updated = categories.map(c =>
                          c._id === cat._id ? { ...c, parent: e.target.value || null } : c
                        );
                        setCategories(updated);
                      }}
                    >
                      <option value="">No parent</option>
                      {categories
                        .filter(c => c._id !== cat._id) // prevent self-reference
                        .map(c => (
                          <option key={c._id} value={c._id}>{c.name}</option>
                        ))}
                    </Select>
                    <div className="flex gap-2 mt-2">
                      <Button size="xs" onClick={() => handleUpdateCategory(cat)}>Save</Button>
                      <Button size="xs" color="gray" onClick={() => setEditingId(null)}>Cancel</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col mx-auto gap-1">
                    <h5 className="text-xl font-semibold">{cat.name}</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Slug: <span className="font-mono">{cat.slug}</span></p>
                    {cat.parent && (
                      <p className="text-sm text-gray-600 dark:text-gray-300">Subcategory of: <strong>{parentName}</strong></p>
                    )}
                    <div className="mt-4 flex gap-2">
                      <Button size="xs" onClick={() => setEditingId(cat._id)}>Edit</Button>
                      <Button size="xs" color="failure" onClick={() => handleDeleteCategory(cat._id)}>Delete</Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}