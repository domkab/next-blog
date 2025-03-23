'use client';

import { useState } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { app } from '@/firebase';
import { FormData } from '@/types/FormData';

export default function usePostForm(initialFormData: FormData) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [file, setFile] = useState<null | File>(null);
  const [imageUploadProgress, setImageUploadProgress] = useState<string | null>(null);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError('Please upload an image!');
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
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
            setFormData((prev) => ({ ...prev, image: downloadURL }));
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