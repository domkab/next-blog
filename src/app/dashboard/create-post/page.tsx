"use client"

import { useUser } from '@clerk/nextjs';
import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import 'react-quill-new/dist/quill.snow.css';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import axios from 'axios';
import Link from 'next/link';
import usePostForm from '@/app/hooks/usePostForm';
import { PostCategory } from '@/app/types/PostCategory';
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

export default function CreatePostPage() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishSuccess, setPublishSuccess] = useState<string | null>(null);

  const {
    formData,
    setFormData,
    setFile,
    imageUploadProgress,
    imageUploadError,
    handleUploadImage,
  } = usePostForm({ title: '', content: '', category: '', image: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, status } = await axios.post(
        '/api/post/create',
        {
          ...formData,
          userMongoId: user?.publicMetadata.userMongoId,
        },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );

      if (status !== 200) {
        setPublishError(data.message);
        return;
      }

      localStorage.setItem('publishSuccess', 'Post published successfully!');
      setPublishSuccess('Post published successfully!');
      // Optionally redirect after a short delay
      setTimeout(() => window.location.reload(), 2000);
    } catch (error: unknown) {
      setPublishError(`Something went wrong: ${error}`);
    }
  };

  if (!isLoaded || !user) return null;
  if (!(isSignedIn && user.publicMetadata.isAdmin))
    return (
      <h1 className="text-center text-3xl my-7 font-semibold">
        You are not authorized to view this page
      </h1>
    );

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <Link href="/dashboard?tab=posts">
        <Button>Back to Posts</Button>
      </Link>
      <h1 className='text-center text-3xl my-7 font-semibold'>
        Create a post
      </h1>

      {publishSuccess && (
        <Alert color='success'>{publishSuccess}</Alert>
      )}
      {publishError && (
        <Alert color='failure'>{publishError}</Alert>
      )}

      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type='text'
            placeholder='Title'
            id='title'
            className='flex-1'
            value={formData.title}
            onChange={(e) => {
              setFormData({ ...formData, title: e.target.value })
            }}
          />

          <Select
            onChange={(e) => {
              setFormData({ ...formData, category: e.target.value })
            }}
            defaultValue={PostCategory.Uncategorized}
          >
            <option value={PostCategory.Uncategorized}>Select a category</option>
            <option value={PostCategory.JavaScript}>JavaScript</option>
            <option value={PostCategory.ReactJS}>React.js</option>
            <option value={PostCategory.NextJS}>next.js</option>
          </Select>
        </div>

        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            accept='image/*'
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setFile(e.target.files[0])
              }
            }}
          />

          <Button
            type='button'
            gradientDuoTone='purpleToBlue'
            size='sm'
            outline
            onClick={handleUploadImage}
            disabled={!!imageUploadProgress}
          >
            {imageUploadProgress ? (
              <div className='w-16 h-16'>
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

        {imageUploadError && (
          <Alert color='failure'>{imageUploadError}</Alert>
        )}

        {formData.image && (
          <div style={{ position: 'relative', width: '100%', height: '400px' }}>
            <Image
              src={formData.image}
              alt="Uploaded image"
              fill
              className="object-cover"
            />
          </div>
        )}

        <ReactQuill
          theme='snow'
          placeholder='Write something...'
          className='h-72 mb-12'
          onChange={(value) => {
            setFormData({ ...formData, content: value })
          }}
          value={formData.content}
          readOnly={!!imageUploadProgress}
        />

        <Button type='submit' gradientDuoTone='purpleToPink'>
          Publish
        </Button>
      </form>
    </div>
  )
}
