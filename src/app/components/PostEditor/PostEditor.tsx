/* eslint-disable @typescript-eslint/no-explicit-any */
/* @ts-nocheck */
'use client';

import dynamic from 'next/dynamic';
import React, { useRef } from 'react';
import 'react-quill-new/dist/quill.snow.css';
import { PostFormState } from '@/redux/slices/postFormSlice';
import type ReactQuillType from 'react-quill-new';

const FallbackQuill: React.FC = () => null;
FallbackQuill.displayName = 'FallbackQuill';
let ReactQuill: React.ForwardRefExoticComponent<any>;

if (typeof window !== 'undefined') {
  ReactQuill = dynamic(async () => {
    const { default: Quill } = await import('quill');
    const { default: CustomImageBlot } = await import('./CustomImageBlot');
    Quill.register(CustomImageBlot);

    const mod = await import('react-quill-new');
    return mod.default;
  }, { ssr: false }) as unknown as React.ForwardRefExoticComponent<any>;
} else {
  ReactQuill = FallbackQuill as unknown as React.ForwardRefExoticComponent<any>;
}

interface PostEditorProps {
  formData: PostFormState;
  setFormData: (data: Partial<PostFormState>) => void;
  imageUploadProgress: string | null;
  handleUploadImage: (file: File) => Promise<string>; // returns image URL
}

const PostEditor: React.FC<PostEditorProps> = ({
  formData,
  setFormData,
  imageUploadProgress,
  handleUploadImage,
}) => {
  const { content } = formData;
  const quillRef = useRef<ReactQuillType | null>(null);

  const handleContentChange = (value: string) => {
    setFormData({ content: value });
  };

  const imageHandler = async () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        try {
          // For now, we can hardcode sample metadata or trigger a modal.
          const metadata = {
            author: 'John Doe',
            link: 'https://example.com',
            license: 'CC BY-SA'
          };

          const imageUrl = await handleUploadImage(file);

          const quill = quillRef.current?.getEditor();
          if (quill) {
            const range = quill.getSelection(true);
            if (range) {
              quill.insertEmbed(range.index, 'customImage', { url: imageUrl, meta: metadata });
              quill.setSelection(range.index + 1);
              const html = quill.root.innerHTML;
              setFormData({ content: html });
            }
          }
        } catch (error) {
          console.error('Image upload failed:', error);
        }
      }
    };
  };

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, 3, false] }],
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image', 'code-block'],
        ['clean'],
      ],
      handlers: {
        image: imageHandler,
      },
    },
  };

  return (
    <div>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        placeholder="Write something..."
        className="h-72 mb-12"
        value={content}
        onChange={handleContentChange}
        modules={modules}
        readOnly={!!imageUploadProgress}
      />
    </div>
  );
};

export default PostEditor;