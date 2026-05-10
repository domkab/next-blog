"use client";

import CategorySelect from "@/app/components/Dashboard/Categories/CategorySelect";
import InlineImageEditor from "@/app/components/PostEditor/InlineImageEditor";
import PostEditor from "@/app/components/PostEditor/PostEditor";
import Image from "next/image";
import { setFormData } from "@/redux/slices/postFormSlice";
import { useUser } from "@clerk/nextjs";
import axios from "axios";
import { Alert, Button, FileInput, TextInput } from "flowbite-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { getImageUrl } from "@/utils/getImageUrl";
import { generateSlug } from "@/utils/generateSlug";
import { DeleteMainImageButton } from "@/app/components/Dashboard/DeleteImage/DeleteMainImageButton";
import { usePostFormHandlers } from "@/hooks/usePostFormHandlers";

export default function UpdatePost() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishSuccess, setPublishSuccess] = useState<string | null>(null);
  const [isPostLoading, setIsPostLoading] = useState(true);
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const {
    dispatch,
    file,
    // clearSelectedFile,
    latestContentRef,
    title,
    description,
    content,
    category,
    mainImage,
    inlineImages,
    imageUploadProgress,
    imageUploadError,
    handleTitleChange,
    handleDescriptionChange,
    handleCategoryChange,
    handleMainImageMetaChange,
    handleMainImageUpload,
    handleInlineImageUpload,
    handleFileChange,
  } = usePostFormHandlers();

  const slug = generateSlug(title);

  const router = useRouter();
  const pathname = usePathname();
  const postId = pathname.split("/").pop() || "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const latestContent = latestContentRef.current?.trim();

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
      postId,
      isAdmin: user?.publicMetadata?.isAdmin,
      status,
    };

    console.log(payload);

    try {
      const { data, status } = await axios.put("/api/post/update", payload, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("payload on submit:", payload);

      if (status !== 200) {
        setPublishError(data.message);
        return;
      }

      localStorage.setItem("publishSuccess", "Post published successfully!");
      setPublishSuccess("Post published successfully!");

      router.push(`/post/${data.slug}`);
    } catch (error: unknown) {
      setPublishError(`Something went wrong: ${error}`);
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await axios.post(
          "/api/post/get",
          {
            postId,
            userId: user?.publicMetadata?.userMongoId,
            isAdmin: user?.publicMetadata?.isAdmin,
          },
          {
            headers: { "Content-Type": "application/json" },
          },
        );

        dispatch(setFormData(data.posts[0]));
        latestContentRef.current = data.posts[0].content;

        console.log("raw data posts:", data.posts[0]);
      } catch (error) {
        console.error(error);
      }
    };

    if (isSignedIn && user?.publicMetadata?.isAdmin) {
      fetchPost().finally(() => setIsPostLoading(false));
    }
  }, [
    postId,
    user?.publicMetadata?.isAdmin,
    isSignedIn,
    dispatch,
    user?.publicMetadata?.userMongoId,
  ]);

  // debug
  // useEffect(() => {
  //   console.log("form data in update:", formData);
  // }, [formData]);

  if (!isLoaded) return null;

  if (!(isSignedIn && user.publicMetadata.isAdmin)) {
    return (
      <h1 className="text-center text-3xl my-7 font-semibold min-h-screen">
        You need to be an admin to update a post
      </h1>
    );
  }

  return (
    <div className="p-3 min-h-screen">
      {publishSuccess && <Alert color="success">{publishSuccess}</Alert>}

      {publishError && <Alert color="failure">{publishError}</Alert>}

      <Link href="/dashboard?tab=posts">
        <Button>Back to Posts</Button>
      </Link>

      <h1 className="text-center text-3xl my-7 font-semibold">Update a post</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            value={title}
            className="flex-1"
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

              <div className="delete-main-img absolute top-1 right-1 z-10">
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
          {isPostLoading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-24 h-24">
                <CircularProgressbar value={100} text="Loading post..." />
              </div>
            </div>
          ) : (
            <>
              <PostEditor
                initialValue={content}
                imageUploadProgress={imageUploadProgress}
                handleUploadImage={handleInlineImageUpload}
                onContentChange={html => {
                  latestContentRef.current = html;
                }}
                postId={postId}
              />

              <InlineImageEditor />

              <div className="flex gap-4 justify-center">
                <Button
                  type="submit"
                  className="min-w-52 w-full"
                  gradientDuoTone="purpleToPink"
                  onClick={() => setStatus("published")}
                  disabled={!!imageUploadProgress}
                >
                  Publish
                </Button>

                <Button
                  type="submit"
                  gradientDuoTone="tealToLime"
                  className="min-w-52 w-full"
                  onClick={() => setStatus("draft")}
                  disabled={!!imageUploadProgress}
                >
                  Save Draft
                </Button>
              </div>
            </>
          )}
        </>
      </form>
    </div>
  );
}
