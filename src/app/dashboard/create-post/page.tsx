"use client";

import CategorySelect from "@/app/components/Dashboard/Categories/CategorySelect";
import InlineImageEditor from "@/app/components/PostEditor/InlineImageEditor";
import PostEditor from "@/app/components/PostEditor/PostEditor";
import Image from "next/image";
import { uploadPostImage, useAppDispatch, useAppSelector } from "@/redux";
import {
  setFormData,
  resetForm,
  updateMainImageMeta,
} from "@/redux/slices/postFormSlice";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { Alert, Button, FileInput, TextInput } from "flowbite-react";
import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { getImageUrl } from "@/utils/getImageUrl";
import { DeleteMainImageButton } from "@/app/components/Dashboard/DeleteImage/DeleteMainImageButton";
import { generateSlug } from "@/utils/generateSlug";
import { useRef } from "react";

export interface UploadImageResult {
  url: string;
  storagePath: string;
  provider: "firebase";
}

export default function CreatePostPage() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishSuccess, setPublishSuccess] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const dispatch = useAppDispatch();

  const title = useAppSelector(state => state.postForm.title);
  const description = useAppSelector(state => state.postForm.description);
  const content = useAppSelector(state => state.postForm.content);
  const category = useAppSelector(state => state.postForm.category);
  const mainImage = useAppSelector(state => state.postForm.images.main);
  const inlineImages = useAppSelector(state => state.postForm.images.inline);

  const imageUploadProgress = useAppSelector(
    state => state.postForm.imageUploadProgress,
  );
  const imageUploadError = useAppSelector(
    state => state.postForm.imageUploadError,
  );
  const slug = generateSlug(title);
  const latestContentRef = useRef("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const latestContent = latestContentRef.current;
    const payload = {
      title,
      description,
      content:
        latestContent && latestContent.length > 0 ? latestContent : content,
      slug,
      category,
      images: {
        main: mainImage,
        inline: inlineImages,
      },
      userMongoId: user?.publicMetadata.userMongoId,
      isAdmin: user?.publicMetadata?.isAdmin,
    };

    try {
      const { data, status } = await axios.post("/api/post/create", payload, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("form data in submit:", data);

      if (status !== 200) {
        setPublishError(data.message);

        return;
      }

      localStorage.setItem("publishSuccess", "Post published successfully!");
      setPublishSuccess("Post published successfully!");
      dispatch(resetForm());
    } catch (error: unknown) {
      setPublishError(`Something went wrong: ${error}`);
    }
  };

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setFormData({ title: e.target.value }));
    },

    [dispatch],
  );

  const handleDescriptionChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(setFormData({ description: e.target.value }));
    },

    [dispatch],
  );

  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      dispatch(setFormData({ category: e.target.value }));
    },

    [dispatch],
  );

  const handleMainImageMetaChange = useCallback(
    (field: "author" | "description" | "altText", value: string) => {
      dispatch(
        updateMainImageMeta({
          meta: {
            [field]: value,
          },
        }),
      );
    },
    [dispatch],
  );

  const handleMainImageUpload = useCallback(
    async (file: File) => {
      if (!file) return;

      const resultAction = await dispatch(
        uploadPostImage({ file, target: "main" }),
      );

      if (uploadPostImage.fulfilled.match(resultAction)) {
        console.log("main image uploaded", resultAction.payload);
      } else {
        console.error("Main image upload failed");
      }
    },

    [dispatch],
  );

  const handleInlineImageUpload = useCallback(
    async (file: File): Promise<UploadImageResult> => {
      const resultAction = await dispatch(
        uploadPostImage({ file, target: "inline" }),
      );

      if (uploadPostImage.fulfilled.match(resultAction)) {
        return resultAction.payload;
      }

      throw new Error("Inline image upload failed");
    },
    [dispatch],
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  // debug
  // useEffect(() => {
  //   console.log("form data in create:", formData);
  // }, [formData]);

  useLayoutEffect(() => {
    dispatch(resetForm());

    latestContentRef.current = "";

    setFile(null);
    setPublishError(null);
    setPublishSuccess(null);

    return () => {
      dispatch(resetForm());
    };
  }, [dispatch]);

  if (!isLoaded || !user) return null;

  if (!(isSignedIn && user.publicMetadata.isAdmin)) {
    return (
      <h1 className="text-center text-3xl my-7 font-semibold min-h-screen">
        You need to be an admin to update a post
      </h1>
    );
  }

  // pacheckinti cia kaip del debug
  // console.log("formData in create:", formData);

  return (
    <div className="p-3 min-h-screen">
      {publishSuccess && <Alert color="success">{publishSuccess}</Alert>}

      {publishError && <Alert color="failure">{publishError}</Alert>}

      <Link href="/dashboard?tab=posts">
        <Button>Back to Posts</Button>
      </Link>

      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            id="title"
            className="flex-1"
            value={title}
            onChange={handleTitleChange}
          />

          <CategorySelect value={category} onChange={handleCategoryChange} />
        </div>

        <div className="description flex flex-col gap-4 sm:flex-row ">
          <TextInput
            type="text"
            placeholder="Description"
            id="description"
            className="flex-1"
            value={description}
            onChange={handleDescriptionChange}
            maxLength={187}
          />
        </div>

        <div
          className="
          max-w-2xl w-full mx-auto
          flex gap-4 items-center justify-between border-4 
          border-teal-500 border-dotted p-3"
        >
          <FileInput accept="image/*" onChange={handleFileChange} />

          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={() => {
              if (file) {
                handleMainImageUpload(file);
              } else {
                alert("No file selected");
              }
            }}
            disabled={!!imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className="w-16 h-16">
                <CircularProgressbar
                  value={Number(imageUploadProgress)}
                  text={`${imageUploadProgress || 0}%`}
                />
              </div>
            ) : (
              "Upload Image"
            )}
          </Button>
        </div>

        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {mainImage.url && (
          <>
            <div
              style={{ position: "relative", width: "100%", height: "400px" }}
            >
              <Image
                src={getImageUrl(mainImage.url)}
                alt={
                  mainImage.meta?.altText ||
                  mainImage.meta?.description ||
                  "Uploaded image"
                }
                fill
                unoptimized
                className="object-cover mx-auto max-w-2xl"
              />

              <div className="absolute top-1 right-1 z-10">
                <DeleteMainImageButton
                  slug={slug}
                  onSuccess={() => {
                    dispatch(
                      setFormData({
                        images: {
                          main: {
                            url: "",
                            storagePath: "",
                            provider: undefined,
                            meta: {
                              author: "",
                              description: "",
                              altText: "",
                            },
                          },
                          inline: inlineImages,
                        },
                      }),
                    );
                  }}
                />
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-6">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="main-image-author"
                  className="text-sm font-medium"
                >
                  Image Author
                </label>

                <TextInput
                  id="main-image-author"
                  type="text"
                  placeholder="Author"
                  value={mainImage.meta?.author || ""}
                  onChange={e =>
                    handleMainImageMetaChange("author", e.target.value)
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="main-image-description"
                  className="text-sm font-medium"
                >
                  Image Description
                </label>

                <TextInput
                  id="main-image-description"
                  type="text"
                  placeholder="Description"
                  value={mainImage.meta?.description || ""}
                  onChange={e =>
                    handleMainImageMetaChange("description", e.target.value)
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="main-image-alt-text"
                  className="text-sm font-medium"
                >
                  Image Alt Text
                </label>

                <TextInput
                  id="main-image-alt-text"
                  type="text"
                  placeholder="Alt text"
                  value={mainImage.meta?.altText || ""}
                  onChange={e =>
                    handleMainImageMetaChange("altText", e.target.value)
                  }
                />
              </div>
            </div>
          </>
        )}

        <>
          <PostEditor
            initialValue=""
            imageUploadProgress={imageUploadProgress}
            handleUploadImage={handleInlineImageUpload}
            onContentChange={html => {
              latestContentRef.current = html;
            }}
            postId="new-post"
          />

          <InlineImageEditor />

          <Button
            type="submit"
            gradientDuoTone="purpleToPink"
            disabled={!!imageUploadProgress}
          >
            Publish
          </Button>
        </>
      </form>
    </div>
  );
}
