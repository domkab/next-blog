'use client';

import dynamic from 'next/dynamic';
import React from "react";
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });
import { FormData } from '@/types/FormData'; 
import "react-quill-new/dist/quill.snow.css";

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image", "code-block"],
    ["clean"],
  ],
};

interface EditorProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  imageUploadProgress?: string | number | null;
}

const PostEditor = ({ formData, setFormData, imageUploadProgress }: EditorProps) => {
  return (
    <ReactQuill
      theme="snow"
      placeholder="Write something..."
      className="h-72 mb-12"
      value={formData.content}
      onChange={(value) => setFormData({ ...formData, content: value })}
      modules={modules}
      readOnly={!!imageUploadProgress}
    />
  );
};

export default PostEditor;