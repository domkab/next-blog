/* @ts-nocheck */
'use client';

import React, { useCallback, useRef } from 'react';
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

const PostEditor: React.FC<PostEditorProps> = ({
  formData,
  setFormData,
  imageUploadProgress,
  handleUploadImage,
}) => {
  const quillRef = useRef<ReactQuillType | null>(null);
  const dispatch = useDispatch();

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
        const imageUrl = await handleUploadImage(file);
        const imageId = uuidv4();

        dispatch(
          addInlineImage({
            id: imageId,
            url: imageUrl,
            meta: { author: '', description: '' },
          }),
        );

        const quill = quillRef.current?.getEditor();
        if (!quill) return;

        const range = quill.getSelection(true);
        quill.insertEmbed(range?.index ?? 0, 'image', imageUrl, 'user');
        quill.formatText(range?.index ?? 0, 1, { imageId });
        quill.setSelection((range?.index ?? 0) + 1);

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
      readOnly={Boolean(imageUploadProgress)}
      theme="snow"
      placeholder="Write something…"
      className="mb-12"
    />
  );
};

export default PostEditor;