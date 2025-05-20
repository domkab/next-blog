'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Image from 'next/image';
import {
  addFeaturedPost,
  removeFeaturedPost,
} from '@/redux/slices/featuredPostSlice';

import {
  Button,
  Label,
  Select,
  Textarea,
  TextInput,
  Card,
} from 'flowbite-react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { PostType } from '@/types/Post';

export default function FeaturedPostAdminPage() {
  const { user } = useUser();
  const dispatch = useDispatch();
  const featured = useSelector((state: RootState) => state.featuredPost.featured);

  const [posts, setPosts] = useState<PostType[]>([]);
  const [selectedPostId, setSelectedPostId] = useState('');
  const [overrideSummary, setOverrideSummary] = useState('');
  const [overrideImage, setOverrideImage] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.post(
          `/api/post/get`,
          {
            userId: user?.publicMetadata?.userMongoId,
          }
        );

        setPosts(data.posts)

      } catch (error) {
        console.error(error);
      }
    }
    fetchPosts();
  }, [user?.publicMetadata?.isAdmin, user?.publicMetadata?.userMongoId])

  const handleSave = () => {
    if (!selectedPostId) return;

    dispatch(
      addFeaturedPost({
        postId: selectedPostId,
        overrideSummary: overrideSummary.trim() || undefined,
        overrideImage: overrideImage.trim() || undefined,
      })
    );

    setSelectedPostId('');
    setOverrideSummary('');
    setOverrideImage('');
  };

  const getPostById = (id: string) => posts.find((p) => p._id === id);

  return (
    <div className="max-w-5xl mx-auto p-6">
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
          <TextInput
            id="image"
            type="text"
            placeholder="https://..."
            value={overrideImage}
            onChange={(e) => setOverrideImage(e.target.value)}
          />
        </div>

        <Button color="teal" onClick={handleSave}>
          Add Featured Post
        </Button>
      </div>

      <hr className="my-6" />

      <div>
        <h2 className="text-xl font-semibold mb-4">⭐ Current Featured Posts</h2>

        {featured.length === 0 ? (
          <p className="text-gray-500">No featured posts selected yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map((f) => {
              const post = getPostById(f.postId);
              return (
                <Card key={f.postId} className="relative">
                  <div className="w-full h-40 relative mb-2">
                    <Image
                      src={f.overrideImage || post?.images?.main?.url || '/placeholder.jpg'}
                      alt={post?.title || 'Post image'}
                      fill
                      className="object-cover rounded-md"
                      unoptimized
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-bold line-clamp-2">{post?.title || 'Untitled'}</h3>

                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 italic">
                      <span>{post?.category}</span>
                      <span>{post?.createdAt && new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>

                    {f.overrideSummary && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 italic mt-2 line-clamp-3">{f.overrideSummary}</p>
                    )}

                    <Button
                      size="xs"
                      color="failure"
                      onClick={() => dispatch(removeFeaturedPost(f.postId))}
                      className="mt-3 w-fit self-end"
                    >
                      Remove
                    </Button>
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