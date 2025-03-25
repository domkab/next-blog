import { useState, useMemo } from 'react';

export default function useTableSort<T>(
  data: T[],
  defaultSortField?: keyof T,
  defaultSortOrder: 'asc' | 'desc' = 'asc'
) {
  const [sortField, setSortField] = useState<keyof T | null>(defaultSortField ?? null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(defaultSortOrder);

  const sortedData = useMemo(() => {
    if (!sortField) return data;
    return [...data].sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortField, sortOrder]);

  const handleSort = (field: keyof T) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return { sortedData, sortField, sortOrder, handleSort };
}