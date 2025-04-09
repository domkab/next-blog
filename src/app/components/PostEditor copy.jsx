'use client';

import dynamic from 'next/dynamic';
import React, { useRef, useEffect } from 'react';
import 'react-quill-new/dist/quill.snow.css';
import { setFormData } from '@/redux/slices/postFormSlice';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

const PostEditor = () => {
  console.log('rendering post editor')
  const dispatch = useDispatch();
  const { content, imageUploadProgress } = useSelector((state) => state.postForm);
  const quillRef = useRef(null);

  const handleContentChange = (value) => {
    dispatch(setFormData({ content: value }));
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

  // const imageHandler = () => {
  //   const input = document.createElement('input');
  //   input.setAttribute('type', 'file');
  //   input.setAttribute('accept', 'image/*');
  //   input.click();

  //   input.onchange = async () => {
  //     const file = input.files ? input.files[0] : null;
  //     if (file) {
  //       const slug = generateSlug(formData.title);
  //       await uploadImageToFirebase(
  //         file,
  //         'inline',
  //         slug,
  //         (progress) => console.log(progress),
  //         (error) => console.error(error),
  //         (url) => {
  //           const quill = quillRef.current?.getEditor();
  //           if (quill) {
  //             const range = quill.getSelection();
  //             quill.insertEmbed(range.index, 'image', url);
  //           }
  //         }
  //       );
  //     }
  //   };
  // };

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