/* @ts-nocheck */
"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { registerQuillSmartLink } from "@/utils/registerQuillSmartLink";
import { useDispatch } from "react-redux";
import { addInlineImage, PostFormState } from "@/redux/slices/postFormSlice";
import { v4 as uuidv4 } from "uuid";
import type ReactQuillType from "react-quill-new";
import QuillNoSSRWrapper from "./QuillNoSSRWrapper";
import "react-quill-new/dist/quill.snow.css";
import styles from "./PostEditor.module.scss";

interface UploadImageResult {
  url: string;
  storagePath: string;
  provider: "firebase";
}

interface PostEditorProps {
  initialValue: string;
  imageUploadProgress: string | null;
  handleUploadImage: (file: File) => Promise<UploadImageResult>;
  onContentChange: (html: string) => void;
  postId: string;
}

const FORMATS = [
  "header",
  "bold",
  "italic",
  "underline",
  "link",
  "image",
  "list",
];

const PostEditor: React.FC<PostEditorProps> = ({
  initialValue,
  imageUploadProgress,
  handleUploadImage,
  onContentChange,
  postId,
}) => {
  const [localValue, setLocalValue] = useState(initialValue ?? "");
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
        const uploadedImage = await handleUploadImage(file);
        const imageId = uuidv4();

        dispatch(
          addInlineImage({
            id: imageId,
            url: uploadedImage.url,
            storagePath: uploadedImage.storagePath,
            provider: uploadedImage.provider,
            meta: { author: "", description: "", altText: "" },
          }),
        );

        const quill = quillRef.current?.getEditor();
        if (!quill) return;
        const range = quill.getSelection(true);
        if (!range) return;

        quill.insertEmbed(range.index, "image", uploadedImage.url, "user");
        quill.formatText(range.index, 1, { imageId });
        quill.setSelection(range.index + 1);

        const nextHtml = quill.root.innerHTML;
        setLocalValue(nextHtml);
        onContentChange(nextHtml);
      } catch (err) {
        console.error("Image upload failed", err);
      }
    };
  }, [handleUploadImage, dispatch]);

  useEffect(() => {
    setLocalValue(initialValue ?? "");
  }, [initialValue, postId]);

  // added dynamic import to ensure CSR only.
  useEffect(() => {
    registerQuillSmartLink();
  }, []);

  const modules = useMemo(
    () => ({
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
    }),
    [imageHandler],
  );

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
            formats={FORMATS}
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

export default React.memo(PostEditor);
