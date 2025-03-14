"use client"

import { app } from '@/firebase';
import { useUser } from '@clerk/nextjs';
import { Alert, Button, FileInput, Select, TextInput } from 'flowbite-react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

import { FormData, PostCategory } from '@/types';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import axios from 'axios';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable
} from 'firebase/storage';

export default function CreatePostPage() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [file, setFile] = useState<null | File>(null);
  const [imageUploadProgress, setImageUploadProgress] = useState<string | null>(null);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({ title: '', content: '', category: '' });
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishSuccess, setPublishSuccess] = useState<string | null>(null);

  if (publishError) {
    console.log(publishError);
  }

  const handleUploadImage = async () => {
    try {
      if (!file) {
        setImageUploadError('Please upload an image!');
        return;
      };

      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError(`Image upload failed: ${error}`);
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError('Image upload failed');
      setImageUploadProgress(null);
      console.log(error);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const controller = new AbortController();
    try {
      const { data, status } = await axios.post('/api/post/create', {
        ...formData,
        userMongoId: user?.publicMetadata.userMongoId,
      }, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (status !== 200) {
        setPublishError(data.message);
        return;
      }

      localStorage.setItem('publishSuccess', 'Post published successfully!');

      setTimeout(() => {
        window.location.reload();
      }, 2000)

      setFile(null);
      setPublishSuccess('Post published successfully!');

    } catch (error: unknown) {
      if (axios.isCancel(error)) {
        console.log('Request canceled', error.message);
      } else {
        setPublishError(`Something went wrong: ${error}`);
      }
    }
  }

  if (!isLoaded || !user) {
    return null;
  }

  if (isSignedIn && user.publicMetadata.isAdmin) {
    return (
      <div className="p-3 max-w-3xl mx-auto min-h-screen">
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
  } else {
    return (
      <h1 className='text-center text-3xl my-7 font-semibold'>
        You are not authorized to view this page
      </h1>
    )
  }
}
