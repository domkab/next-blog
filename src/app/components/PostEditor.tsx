'use client';

import dynamic from 'next/dynamic';
import React from 'react';
import 'react-quill-new/dist/quill.snow.css';
import { PostFormState } from '@/redux/slices/postFormSlice';
import { uploadPostImage, useAppDispatch } from '@/redux';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

interface PostEditorProps {
  formData: PostFormState;
  setFormData: (data: Partial<PostFormState>) => void;
  imageUploadProgress: string | null;
  handleUploadImage: (file: File, target: 'main' | 'inline') => void;
}

const PostEditor: React.FC<PostEditorProps> = ({
  formData,
  setFormData,
  imageUploadProgress,
  handleUploadImage,
}) => {
  console.log('rendering post editor')
  const { content } = formData;
  const dispatch = useAppDispatch();

  const handleContentChange = (value: string) => {
    setFormData({ content: value });
  };

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = () => {
      const file = input.files?.[0];
      if (file) {
        dispatch(uploadPostImage({ file, target: 'inline' })); //do we need this duplicate logic
        handleUploadImage(file, 'inline');
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