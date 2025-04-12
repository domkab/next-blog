'use client';

import PostEditor from '@/app/components/PostEditor';
import usePostForm from '@/hooks/usePostForm';
import { PostCategory } from '@/types/Post';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import 'react-quill-new/dist/quill.snow.css';

export default function UpdatePost() {
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const postId = pathname.split('/').pop() || '';

  const {
    formData,
    setFormData,
    setFile,
    imageUploadProgress,
    imageUploadError,
    handleUploadImage,
  } = usePostForm(
    {
      title: '',
      content: '',
      category: '',
      slug: '',
      images: {
        main: {
          url: '',
        },
        inline: [],
      },
    }
  );

  useEffect(() => {
    console.log('in use effect form data:', formData);
  }, [formData])


  const [publishError, setPublishError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await axios.post(
          '/api/post/get',
          { postId },
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );

        setFormData(data.posts[0]);

        console.log('raw data posts:', data.posts[0]);
      } catch (error) {
        console.error(error);
      }
    };

    if (isSignedIn && user?.publicMetadata?.isAdmin) {
      fetchPost();
    }

  }, [postId, user?.publicMetadata?.isAdmin, isSignedIn, setFormData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        '/api/post/update',
        {
          ...formData,
          userMongoId: user?.publicMetadata.userMongoId,
          postId,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      console.log('form data on submit:', formData);

      router.push(`/post/${data.slug}`);
    } catch (error) {
      console.error('Error updating Post:', error);
      setPublishError('Something went wrong');
    }
  };


  if (!isLoaded) return null;
  if (!(isSignedIn && user.publicMetadata.isAdmin)) {
    return (
      <h1 className="text-center text-3xl my-7 font-semibold min-h-screen">
        You need to be an admin to update a post
      </h1>
    );
  }

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <Link href="/dashboard?tab=posts">
        <Button>Back to Posts</Button>
      </Link>
      <h1 className="text-center text-3xl my-7 font-semibold">Update a post</h1>
      {publishError && <Alert color="failure">{publishError}</Alert>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            value={formData.title}
            className="flex-1"
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <Select
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            value={formData.category}
          >
            <option value={PostCategory.Uncategorized}>Select a category</option>
            <option value={PostCategory.JavaScript}>JavaScript</option>
            <option value={PostCategory.ReactJS}>React.js</option>
            <option value={PostCategory.NextJS}>Next.js</option>
          </Select>
        </div>

        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            accept="image/*"
            onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
          />
          <Button
            type="button"
            gradientDuoTone="purpleToBlue"
            size="sm"
            outline
            onClick={() => handleUploadImage('main')}
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
              'Upload Image'
            )}
          </Button>
        </div>

        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {formData.images && formData.images.main && formData.images.main.url && (
          <img src={formData.images.main.url} alt="upload" className="w-full h-72 object-cover" />
        )}
        <PostEditor
          formData={formData}
          setFormData={setFormData}
          imageUploadProgress={imageUploadProgress}
          handleUploadImage={handleUploadImage} // Ensure this is provided
        />
        <Button type="submit" gradientDuoTone="purpleToPink">
          Update
        </Button>
      </form>
    </div>
  );
}