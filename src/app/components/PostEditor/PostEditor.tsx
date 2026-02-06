/* @ts-nocheck */
'use client';

import React, {
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';
import { useDispatch } from 'react-redux';
import {
  addInlineImage,
  PostFormState,
} from '@/redux/slices/postFormSlice';
import { v4 as uuidv4 } from 'uuid';
import type ReactQuillType from 'react-quill-new';
import QuillNoSSRWrapper from './QuillNoSSRWrapper';
import 'react-quill-new/dist/quill.snow.css';
import styles from './PostEditor.module.scss';

interface PostEditorProps {
  formData: PostFormState;
  setFormData: (data: Partial<PostFormState>) => void;
  imageUploadProgress: string | null;
  handleUploadImage: (file: File) => Promise<string>;
  onContentChange: (html: string) => void;
}

const PostEditor: React.FC<PostEditorProps> = ({
  formData,
  setFormData,
  imageUploadProgress,
  handleUploadImage,
  onContentChange,
}) => {
  const [localValue, setLocalValue] = useState(formData.content ?? '');
  const quillRef = useRef<ReactQuillType | null>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    setLocalValue(formData.content ?? '');
  }, [formData.content]);

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
    <div className={styles['post-editor']}>
      <QuillNoSSRWrapper
        key={formData.slug}
        ref={quillRef}
        // value={formData.content}
        // onChange={handleContentChange}
        value={localValue}
        onChange={(localValue: string) => {
          setLocalValue(localValue);
          onContentChange?.(localValue);
        }}
        onBlur={() => setFormData({ content: localValue })}
        modules={modules}
        readOnly={Boolean(imageUploadProgress)}
        theme="snow"
        placeholder="Write something…"
        className="mb-12"
      />
    </div>
  );
};

export default PostEditor;