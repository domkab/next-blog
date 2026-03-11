/* @ts-nocheck */
"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { registerQuillSmartLink } from "@/utils/registerQuillSmartLink";
import { useDispatch } from "react-redux";
import { addInlineImage, PostFormState } from "@/redux/slices/postFormSlice";
import { v4 as uuidv4 } from "uuid";
import type ReactQuillType from "react-quill-new";
import QuillNoSSRWrapper from "./QuillNoSSRWrapper";
import "react-quill-new/dist/quill.snow.css";
import styles from "./PostEditor.module.scss";

interface PostEditorProps {
  formData: PostFormState;
  setFormData: (data: Partial<PostFormState>) => void;
  imageUploadProgress: string | null;
  handleUploadImage: (file: File) => Promise<string>;
  onContentChange: (html: string) => void;
  postId: string;
}

const PostEditor: React.FC<PostEditorProps> = ({
  formData,
  setFormData,
  imageUploadProgress,
  handleUploadImage,
  onContentChange,
  postId,
}) => {
  const [localValue, setLocalValue] = useState(formData.content ?? "");
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const quillRef = useRef<ReactQuillType | null>(null);
  const dispatch = useDispatch();

  const imageHandler = useCallback(() => {
    if (typeof window === "undefined") return;

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
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
            meta: { author: "", description: "", altText: "" },
          }),
        );

        const quill = quillRef.current?.getEditor();
        if (!quill) return;

        const range = quill.getSelection(true);
        if (!range) return;

        quill.insertEmbed(range.index, "image", imagePath, "user");
        quill.formatText(range.index, 1, { imageId });
        quill.setSelection(range.index + 1);

        setFormData({ content: quill.root.innerHTML });
      } catch (err) {
        console.error("Image upload failed", err);
      }
    };
  }, [handleUploadImage, dispatch, setFormData]);

  // added dynamic import to ensure CSR only.
  useEffect(() => {
    registerQuillSmartLink();
  }, []);

  const modules = {
    toolbar: {
      container: [
        [{ header: [2, 3, 4, false] }],
        ["bold", "italic", "underline"],
        ["link", "image"],
        [{ list: "ordered" }, { list: "bullet" }],
        ["clean"],
      ],
      handlers: { image: imageHandler },
    },
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "link",
    "image",
    "list",
  ];

  return (
    <div className={styles["post-editor"]}>
      <div className={styles["view-toggle"]} aria-label="Editor width preview">
        <button
          type="button"
          className={`${styles["view-toggle__btn"]} ${
            viewMode === "mobile" ? styles["view-toggle__btn--active"] : ""
          }`}
          onClick={() => setViewMode("mobile")}
        >
          Mobile
        </button>
        <button
          type="button"
          className={`${styles["view-toggle__btn"]} ${
            viewMode === "desktop" ? styles["view-toggle__btn--active"] : ""
          }`}
          onClick={() => setViewMode("desktop")}
        >
          Desktop
        </button>
      </div>

      <div className={styles["editor-shell"]}>
        <div className={styles["editor-frame"]} data-view={viewMode}>
          <QuillNoSSRWrapper
            key={postId}
            ref={quillRef}
            value={localValue}
            onChange={(localValue: string) => {
              setLocalValue(localValue);
              onContentChange?.(localValue);
            }}
            modules={modules}
            formats={formats}
            readOnly={false}
            theme="snow"
            placeholder="Write something…"
            className={styles.quill}
          />
        </div>
      </div>
    </div>
  );
};

export default PostEditor;
