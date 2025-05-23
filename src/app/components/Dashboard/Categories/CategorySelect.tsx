'use client';

import { useCategories } from '@/hooks/useCategories';
import { Select } from 'flowbite-react';

interface CategorySelectProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function CategorySelect({ value, onChange }: CategorySelectProps) {
  const { categories, loading } = useCategories();

  return (
    <Select onChange={onChange} value={value} disabled={loading}>
      <option value="">Select a category</option>
      {categories.map((cat) => (
        <option key={cat._id} value={cat.slug}>
          {cat.name}
        </option>
      ))}
    </Select>
  );
}