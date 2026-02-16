"use client";

import CategorySelect from "@/app/components/Dashboard/Categories/CategorySelect";
import InlineImageEditor from "@/app/components/PostEditor/InlineImageEditor";
import PostEditor from "@/app/components/PostEditor/PostEditor";
import Image from "next/image";
import { uploadPostImage, useAppDispatch, useAppSelector } from "@/redux";
import { setFormData } from "@/redux/slices/postFormSlice";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { Alert, Button, FileInput, TextInput } from "flowbite-react";
import Link from "next/link";
import { useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "react-quill-new/dist/quill.snow.css";
import { getImageUrl } from "@/utils/getImageUrl";
import { DeleteMainImageButton } from "@/app/components/Dashboard/DeleteImage/DeleteMainImageButton";
import { generateSlug } from "@/utils/generateSlug";
import { useRef } from "react";

export default function CreatePostPage() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishSuccess, setPublishSuccess] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const dispatch = useAppDispatch();
  const formData = useAppSelector(state => state.postForm);
  const inlineImages = useAppSelector(state => state.postForm.images.inline);
  const imageUploadProgress = useAppSelector(
    state => state.postForm.imageUploadProgress,
  );
  const imageUploadError = useAppSelector(
    state => state.postForm.imageUploadError,
  );
  const slug = generateSlug(formData.title);
  const latestContentRef = useRef(formData.content || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const latestContent = latestContentRef.current;
    const payload = {
      ...formData,
      content:
        latestContent && latestContent.length > 0
          ? latestContent
          : formData.content,
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

      // setTimeout(() => window.location.reload(), 2000);
    } catch (error: unknown) {
      setPublishError(`Something went wrong: ${error}`);
    }
  };
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFormData({ title: e.target.value }));
  };
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setFormData({ description: e.target.value }));
  };
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(setFormData({ category: e.target.value }));
  };
  const handleMainImageUpload = (file: File) => {
    if (file) {
      dispatch(uploadPostImage({ file, target: "main" }));
    }
  };

  const handleInlineImageUpload = async (file: File): Promise<string> => {
    try {
      const resultAction = await dispatch(
        uploadPostImage({ file, target: "inline" }),
      );

      if (uploadPostImage.fulfilled.match(resultAction)) {
        const imageUrl = resultAction.payload.url;
        return imageUrl;
      } else {
        throw new Error("Image upload failed");
      }
    } catch (err) {
      throw new Error(`Inline image upload failed: ${err}`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
  };

  if (!isLoaded || !user) return null;

  if (!(isSignedIn && user.publicMetadata.isAdmin)) {
    return (
      <h1 className="text-center text-3xl my-7 font-semibold min-h-screen">
        You need to be an admin to update a post
      </h1>
    );
  }

  return (
    <div className="p-3 mx-10 min-h-screen">
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
            value={formData.title}
            onChange={handleTitleChange}
          />

          <CategorySelect
            value={formData.category}
            onChange={handleCategoryChange}
          />
        </div>

        <div className="description flex flex-col gap-4 sm:flex-row ">
          <TextInput
            type="text"
            placeholder="Description"
            id="description"
            className="flex-1"
            value={formData.description}
            onChange={handleDescriptionChange}
            maxLength={187}
          />
        </div>

        <div
          className="
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

        {formData.images.main.url && (
          <>
            <div
              style={{ position: "relative", width: "100%", height: "400px" }}
            >
              <Image
                src={getImageUrl(formData.images.main.url)}
                alt={formData.images.main.meta?.description || "Uploaded image"}
                fill
                className="object-cover"
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
                            meta: {
                              author: "",
                              description: "",
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
                  value={formData.images.main.meta?.author || ""}
                  onChange={e =>
                    dispatch(
                      setFormData({
                        images: {
                          ...formData.images,
                          main: {
                            ...formData.images.main,
                            meta: {
                              ...formData.images.main.meta,
                              author: e.target.value,
                            },
                          },
                        },
                      }),
                    )
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
                  value={formData.images.main.meta?.description || ""}
                  onChange={e =>
                    dispatch(
                      setFormData({
                        images: {
                          ...formData.images,
                          main: {
                            ...formData.images.main,
                            meta: {
                              ...formData.images.main.meta,
                              description: e.target.value,
                            },
                          },
                        },
                      }),
                    )
                  }
                />
              </div>
            </div>
          </>
        )}

        <PostEditor
          formData={formData}
          setFormData={data => dispatch(setFormData(data))}
          imageUploadProgress={imageUploadProgress}
          handleUploadImage={handleInlineImageUpload}
          onContentChange={html => {
            latestContentRef.current = html;
          }}
        />

        <InlineImageEditor />

        <Button type="submit" gradientDuoTone="purpleToPink">
          Publish
        </Button>
      </form>
    </div>
  );
}
