/* @ts-nocheck */
'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import {
  addInlineImage,
  PostFormState,
} from '@/redux/slices/postFormSlice';
import { v4 as uuidv4 } from 'uuid';
import type ReactQuillType from 'react-quill-new';
import QuillNoSSRWrapper from './QuillNoSSRWrapper';
import 'react-quill-new/dist/quill.snow.css';

interface PostEditorProps {
  formData: PostFormState;
  setFormData: (data: Partial<PostFormState>) => void;
  imageUploadProgress: string | null;
  handleUploadImage: (file: File) => Promise<string>;
}

const enhanceEditorPreviewWithSignedImages = async (editorElement: HTMLElement) => {
  const imgs = editorElement.querySelectorAll('img[src^="posts/"]');
  for (const img of imgs) {
    const path = img.getAttribute('src');
    if (!path) continue;

    try {
      const res = await fetch(`/api/image/image-url?path=${encodeURIComponent(path)}`);
      const { url: signedUrl } = await res.json();
      if (signedUrl) {
        img.setAttribute('src', signedUrl);
      }
    } catch (err) {
      console.error('Failed to enhance image preview:', err);
    }
  }
};

const PostEditor: React.FC<PostEditorProps> = ({
  formData,
  setFormData,
  handleUploadImage,
}) => {
  const quillRef = useRef<ReactQuillType | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const editorEl = document.querySelector('.ql-editor');
    if (editorEl && formData.content.includes('<img')) {
      enhanceEditorPreviewWithSignedImages(editorEl as HTMLElement);
    }
  }, [formData.content]);

  const handleContentChange = useCallback(
    (value: string) => setFormData({ content: value }),
    [setFormData],
  );

  const imageHandler = useCallback(() => {
    if (typeof window === 'undefined') return;

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      try {
        const imagePath = await handleUploadImage(file);
        const imageId = uuidv4();

        dispatch(
          addInlineImage({
            id: imageId,
            url: imagePath,
            meta: { author: '', description: '' },
          }),
        );

        const quill = quillRef.current?.getEditor();
        if (!quill) return;

        const range = quill.getSelection(true);
        if (!range) return;

        quill.insertEmbed(range.index, 'image', imagePath, 'user');
        quill.formatText(range.index, 1, { imageId });
        quill.setSelection(range.index + 1);

        const res = await fetch(`/api/image/image-url?path=${encodeURIComponent(imagePath)}`);
        const { url: signedUrl } = await res.json();

        const insertedImage = quill.root.querySelector(`img[src="${imagePath}"]`) as HTMLImageElement;
        if (insertedImage) {
          insertedImage.setAttribute('src', signedUrl);
        }

        setFormData({ content: quill.root.innerHTML });


      } catch (err) {
        console.error('Image upload failed', err);
      }
    };
  }, [handleUploadImage, dispatch, setFormData]);

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, false] }],
        ['bold', 'italic', 'underline'],
        ['link', 'image'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['clean'],
      ],
      handlers: { image: imageHandler },
    },
  };

  return (
    <QuillNoSSRWrapper
      ref={quillRef}
      value={formData.content}
      onChange={handleContentChange}
      modules={modules}
      theme="snow"
      placeholder="Write something…"
      className="mb-12"
    />
  );
};

export default PostEditor;