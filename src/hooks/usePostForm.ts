'use client';

import { useState } from 'react';
import { FormData } from '@/types/FormData';
import { uploadImageToFirebase } from '@/utils/uploadImageToFirebase';

const generateSlug = (text: string): string =>
  text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

// type UploadTarget = 'main' | 'inline';

export default function usePostForm(initialFormData: FormData) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [file, setFile] = useState<null | File>(null);
  const [imageUploadProgress, setImageUploadProgress] = useState<string | null>(null);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);

  /**
   * Uploads an image to Firebase Storage.
   * @param target - Determines whether the upload is for the main image or for an inline image (e.g., in the editor).
   * If 'main', it will update formData.image.
   * If 'inline', you could call a callback with the URL to insert into the editor.
   */
  const handleUploadImage = async (
    target: 'main' | 'inline',
    onSuccessInline?: (url: string) => void
  ) => {
    if (!formData.title || !file) {
      setImageUploadError('Please create a post title and upload an image first!');
      return;
    }

    const slug = generateSlug(formData.title);
    await uploadImageToFirebase(
      file,
      target,
      slug,
      (progress) => setImageUploadProgress(progress),
      (error) => setImageUploadError(error),
      (url) => {
        setImageUploadProgress(null);
        setImageUploadError(null);
        if (target === 'main') {
          setFormData((prev) => ({ ...prev, image: url }));
        } else if (target === 'inline' && onSuccessInline) {
          onSuccessInline(url);
        }
      }
    );
  };

  return {
    formData,
    setFormData,
    setFile,
    imageUploadProgress,
    imageUploadError,
    handleUploadImage,
  };
}