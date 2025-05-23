import { useEffect, useState } from 'react';
import axios from 'axios';
import { Category } from '@/types/Category';


export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get('/api/categories/get');
        setCategories(res.data.categories);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return { categories, loading };
}