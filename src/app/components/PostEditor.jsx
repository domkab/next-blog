'use client';

import dynamic from 'next/dynamic';
import React, { useRef, useEffect } from 'react';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const PostEditor = ({ formData, setFormData, handleUploadImage, imageUploadProgress }) => {
  const quillRef = useRef(null);

  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files ? input.files[0] : null;
      if (file) {
        const slug = 'your-generated-slug';
        await uploadImageToFirebase(
          file,
          'inline',
          slug,
          (progress) => console.log(progress),
          (error) => console.error(error),
          (url) => {
            const quill = quillRef.current?.getEditor();
            if (quill) {
              const range = quill.getSelection();
              quill.insertEmbed(range.index, 'image', url);
            }
          }
        );
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

  useEffect(() => {
    if (quillRef.current) {
    }
  }, []);

  return (
    <div>
      <ReactQuill
        theme="snow"
        placeholder="Write something..."
        className="h-72 mb-12"
        value={formData.content}
        onChange={(value) => setFormData({ ...formData, content: value })}
        modules={modules}
        readOnly={!!imageUploadProgress}
        ref={(el) => {
          if (el) {
            quillRef.current = el;
          }
        }}
      />
    </div>
  );
};

export default PostEditor;