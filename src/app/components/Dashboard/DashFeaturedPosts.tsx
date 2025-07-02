'use client';

import { RootState } from '@/redux/store';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { uploadFeaturedImage } from '@/firebase/uploadFeaturedImage';
import { useAppDispatch } from '@/redux';
import { deleteFeaturedPost, fetchFeaturedPosts, saveFeaturedPost } from '@/redux/thunks/featuredPostThunks';
import { PostType } from '@/types/Post';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import {
  Button,
  Card,
  FileInput,
  Label,
  Select,
  Textarea,
} from 'flowbite-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { getImageUrl } from '@/utils/getImageUrl';

export default function FeaturedPostAdminPage() {
  const { user } = useUser();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [toast, setToast] = useState<{
    type: 'success' | 'error';
    message: string
  } | null>(null);
  const userMongoId = user?.publicMetadata?.userMongoId as string;
  const featuredPosts = useSelector((state: RootState) => state.featuredPost.featured);

  const [posts, setPosts] = useState<PostType[]>([]);
  const [selectedPostId, setSelectedPostId] = useState('');
  const [overrideSummary, setOverrideSummary] = useState('');
  const [overrideImage, setOverrideImage] = useState('');

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.post(
          `/api/post/get`,
          {
            userId: user?.publicMetadata?.userMongoId,
            isAdmin: user?.publicMetadata?.isAdmin
          }
        );

        setPosts(data.posts);
        await dispatch(fetchFeaturedPosts());
      } catch (error) {
        console.error(error);
      }
    };

    if (user?.publicMetadata?.userMongoId) {
      fetchPosts();
    }
  }, [dispatch, user?.publicMetadata?.userMongoId, user?.publicMetadata?.isAdmin]);

  const handleSave = async () => {
    if (!selectedPostId) return;

    await dispatch(
      saveFeaturedPost({
        postId: selectedPostId,
        overrideSummary,
        overrideImage,
        userMongoId,
      })
    );

    await dispatch(fetchFeaturedPosts());

    setSelectedPostId('');
    setOverrideSummary('');
    setOverrideImage('');
  };

  const handleDelete = async (postId: string) => {
    await dispatch(deleteFeaturedPost({ postId, userMongoId }));
    await dispatch(fetchFeaturedPosts());
  };

  const handleUploadOverrideImage = async (file: File) => {
    try {
      const post = getPostById(selectedPostId);
      if (!post?.slug) throw new Error('Slug not found for selected post.');

      const url = await uploadFeaturedImage(file, post.slug, (progress) =>
        console.log('Uploading override image:', progress + '%')
      );

      setOverrideImage(url);
      setToast({ type: 'success', message: 'Image uploaded successfully!' });
    } catch {
      setToast({ type: 'error', message: 'Upload failed. Please try again.' });
    }
  };

  const getPostById = (id: string) => posts.find((p) => p._id === id);

  return (
    <div className="w-[50%] max-w-7xl mx-auto p-6">

      {toast && (
        <div className="fixed top-4 right-4 z-50">
          <div
            className={
              `p-4 rounded-lg shadow-md text-white 
              ${toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`
            }
          >
            {toast.message}
          </div>
        </div>
      )}

      <h1 className="text-2xl font-bold mb-6">📝 Manage Featured Posts</h1>

      <div className="space-y-4 mb-10">
        <div>
          <Label htmlFor="postSelect" value="Choose a post" />
          <Select
            id="postSelect"
            required
            onChange={(e) => setSelectedPostId(e.target.value)}
            value={selectedPostId}
          >
            <option disabled value="">-- Select a post --</option>
            {posts.map((post) => (
              <option key={post._id} value={post._id}>
                {post.title}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="summary" value="Override summary (optional)" />
          <Textarea
            id="summary"
            placeholder="Write a short summary..."
            rows={3}
            value={overrideSummary}
            onChange={(e) => setOverrideSummary(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="image" value="Override image URL (optional)" />
          <FileInput
            accept='image/*'
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleUploadOverrideImage(file);
            }}
          />
        </div>

        <Button color="teal" onClick={handleSave}>
          Add Featured Post
        </Button>
      </div>

      {selectedPostId && (
        <div className="my-10">
          <h2 className="text-lg font-semibold mb-4">🖼 Preview Selected Post</h2>

          <Card>
            <div className="w-full h-40 relative mb-2">
              <Image
                src={getImageUrl(
                  overrideImage ||
                  getPostById(selectedPostId)?.images?.main?.url
                )}
                alt={getPostById(selectedPostId)?.title || 'Post image'}
                fill
                className="object-cover rounded-md"
              />
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="text-lg font-bold line-clamp-2">
                {getPostById(selectedPostId)?.title || 'Untitled'}
              </h3>

              <div className="
                flex justify-between text-sm 
              text-gray-600 dark:text-gray-300 italic"
              >
                <span>{getPostById(selectedPostId)?.category}</span>
                <span>
                  {getPostById(selectedPostId)?.createdAt &&
                    new Date(getPostById(selectedPostId)!.createdAt).toLocaleDateString()}
                </span>
              </div>

              {overrideSummary && (
                <p className="
                  text-sm text-gray-600 dark:text-gray-300 
                  italic mt-2 line-clamp-3"
                >
                  {overrideSummary}
                </p>
              )}
            </div>
          </Card>
        </div>
      )}

      <hr className="my-6" />

      <div>
        <h2 className="text-xl font-semibold mb-4">⭐ Current Featured Posts</h2>

        {featuredPosts.length === 0 ? (
          <p className="text-gray-500">No featured posts selected yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredPosts.map((f) => {
              const post = getPostById(f.post._id);
              return (
                <Card
                  key={f.post._id}
                  className="relative cursor-pointer hover:ring-2 hover:ring-teal-500 transition-all"
                >
                  <div className="w-full h-40 relative mb-2">
                    <Image
                      src={getImageUrl(f.overrideImage || post?.images?.main?.url)}
                      alt={post?.title || 'Post image'}
                      onClick={() => router.push(`/post/${post?.slug}`)}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-bold line-clamp-2">{post?.title || 'Untitled'}</h3>

                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 italic">
                      <span>{post?.category}</span>
                      <span>{post?.createdAt && new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>

                    <Button
                      size="xs"
                      color="failure"
                      onClick={() => { handleDelete(f.post._id) }}
                      className="mt-3 w-fit self-end"
                    >
                      Remove
                    </Button>

                    {f.overrideSummary && (
                      <p className="italic mt-2 line-clamp-3 text-sm text-gray-600 dark:text-gray-300">
                        {f.overrideSummary}
                      </p>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}