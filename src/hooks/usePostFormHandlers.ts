// src/hooks/usePostFormHandlers.ts
import { useCallback, useRef, useState } from "react";
import { uploadPostImage, useAppDispatch, useAppSelector } from "@/redux";
import { setFormData, updateMainImageMeta } from "@/redux/slices/postFormSlice";

export interface UploadImageResult {
  url: string;
  storagePath: string;
  provider: "firebase";
}

export const usePostFormHandlers = () => {
  const dispatch = useAppDispatch();
  const [file, setFile] = useState<File | null>(null);

  const title = useAppSelector(state => state.postForm.title);
  const description = useAppSelector(state => state.postForm.description);
  const content = useAppSelector(state => state.postForm.content);
  const category = useAppSelector(state => state.postForm.category);
  const mainImage = useAppSelector(state => state.postForm.images.main);
  const inlineImages = useAppSelector(state => state.postForm.images.inline);
  const imageUploadProgress = useAppSelector(
    state => state.postForm.imageUploadProgress,
  );
  const imageUploadError = useAppSelector(
    state => state.postForm.imageUploadError,
  );

  const latestContentRef = useRef(content || "");

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setFormData({ title: e.target.value }));
    },
    [dispatch],
  );

  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setFormData({ description: e.target.value }));
    },
    [dispatch],
  );

  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(setFormData({ category: e.target.value }));
    },
    [dispatch],
  );

  const handleMainImageMetaChange = useCallback(
    (field: "author" | "description" | "altText", value: string) => {
      dispatch(
        updateMainImageMeta({
          meta: { [field]: value },
        }),
      );
    },
    [dispatch],
  );

  const handleMainImageUpload = useCallback(
    async (file: File) => {
      const resultAction = await dispatch(
        uploadPostImage({ file, target: "main" }),
      );

      if (!uploadPostImage.fulfilled.match(resultAction)) {
        throw new Error("Main image upload failed");
      }

      return resultAction.payload;
    },
    [dispatch],
  );

  const handleInlineImageUpload = useCallback(
    async (file: File): Promise<UploadImageResult> => {
      const resultAction = await dispatch(
        uploadPostImage({ file, target: "inline" }),
      );

      if (uploadPostImage.fulfilled.match(resultAction)) {
        return resultAction.payload;
      }

      throw new Error("Inline image upload failed");
    },
    [dispatch],
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFile(e.target.files?.[0] || null);
    },
    [],
  );

  const clearSelectedFile = useCallback(() => {
    setFile(null);
  }, []);

  return {
    dispatch,

    file,
    clearSelectedFile,
    latestContentRef,

    title,
    description,
    content,
    category,
    mainImage,
    inlineImages,
    imageUploadProgress,
    imageUploadError,

    handleTitleChange,
    handleDescriptionChange,
    handleCategoryChange,
    handleMainImageMetaChange,
    handleMainImageUpload,
    handleInlineImageUpload,
    handleFileChange,
  };
};
