'use client';

import { useState } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '@/firebase';
import { FormData } from '@/types/FormData';

const generateSlug = (text: string): string =>
  text
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

type UploadTarget = 'main' | 'inline';

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
    target: UploadTarget = 'main',
    onSuccessInline?: (url: string) => void
  ) => {
    try {
      if (!formData.title) {
        setImageUploadError('Please create a post title first!');
        return;
      }

      if (!file) {
        setImageUploadError('Please upload an image!');
        return;
      }

      setImageUploadError(null);
      const storage = getStorage(app);
      const slug = generateSlug(formData.title);
      const folderPath = `posts/${slug}`;
      const prefix = target === 'main' ? 'main' : 'inline';
      const fileName = `${prefix}-${new Date().getTime()}-${file.name}`;
      const storageRef = ref(storage, `${folderPath}/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError(`Image upload failed: ${error}`);
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);

            if (target === 'main') {
              setFormData((prev) => ({ ...prev, image: downloadURL }));
            } else if (target === 'inline' && onSuccessInline) {
              onSuccessInline(downloadURL);
            }
          });
        }
      );
    } catch (error) {
      setImageUploadError('Image upload failed');
      setImageUploadProgress(null);
      console.error(error);
    }
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