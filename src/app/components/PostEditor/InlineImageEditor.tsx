'use client';

import React, { ChangeEvent, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/redux/store';
import {
  updateInlineImageMeta,
  removeInlineImage,
  ImageMeta,
} from '@/redux/slices/postFormSlice';

import { Button, Label, TextInput } from 'flowbite-react';
import Image from 'next/image';
import axios from 'axios';
import { getImageUrl } from '@/utils/getImageUrl';

const InlineImageEditor: React.FC = () => {
  const dispatch = useDispatch();
  const inlineImages = useSelector(
    (state: RootState) => state.postForm.images.inline,
  );

  const handleMetaChange = (
    id: string,
    field: keyof ImageMeta,
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    dispatch(
      updateInlineImageMeta({
        id,
        meta: { [field]: e.target.value },
      }),
    );
  };

  const handleDeleteInlineImage = async (id: string) => {
    const img = inlineImages.find((img) => img.id === id);
    if (!img?.url) return;

    try {
      await axios.delete('/api/image/delete', {
        data: { url: img.url },
        headers: { 'Content-Type': 'application/json' },
      });

      dispatch(removeInlineImage(id));
    } catch (err) {
      console.error('Failed to delete image via API:', err);
    }
  };

  return (
    <section className="space-y-6 mt-6">
      {inlineImages.map(({ id, url, meta }) => (
        <article
          key={id}
          className="flex flex-col sm:flex-row gap-6 border border-gray-200 dark:border-gray-700 rounded-md p-4"
        >
          <Image
            src={getImageUrl(url)}
            alt={meta?.description ?? `inline image ${id}`}
            width={128}
            height={128}
            className="w-32 h-32 object-cover rounded shadow-md"
          />

          <div className="flex-1 grid gap-4">
            <div>
              <Label htmlFor={`author-${id}`} value="Author" />
              <TextInput
                id={`author-${id}`}
                value={meta?.author ?? ''}
                onChange={(e) => handleMetaChange(id, 'author', e)}
                className="text-gray-600 dark:text-gray-300"
              />
            </div>

            <div>
              <Label htmlFor={`desc-${id}`} value="Description" />
              <TextInput
                id={`desc-${id}`}
                value={meta?.description ?? ''}
                onChange={(e) => handleMetaChange(id, 'description', e)}
                className="text-gray-600 dark:text-gray-300"
              />
            </div>

            <Button
              color="failure"
              size="xs"
              onClick={() => handleDeleteInlineImage(id)}
              className="w-fit"
            >
              Delete
            </Button>
          </div>
        </article>
      ))}
    </section>
  );
};

export default memo(InlineImageEditor);