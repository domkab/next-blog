import CallToAction from '@/app/components/CallToAction';
import axios from 'axios';
import { Button } from 'flowbite-react';
import Link from 'next/link';
import Image from 'next/image';
import RecentPosts from '@/app/components/RecentPosts';
import { PostType } from '@/types/Post';
import PostContent from '@/app/components/Post/PostContent';
import styles from '../../components/Post/PostContent.module.scss';

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const controller = new AbortController();
  const post: PostType | null = await (async () => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/api/post/get`,
        { slug },
        {
          headers: { 'Cache-control': 'no-store' },
          signal: controller.signal,
        }
      );

      return data.posts[0];
    } catch (error: unknown) {
      if (axios.isCancel(error)) {
        console.log('Request canceled', error.message);
      } else {
        console.error('Error fetching post:', error);
      }

      return null;
    }
  })();

  console.log('Post fetched:', post);

  if (!post) {
    return (
      <main className='p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
        <h2 className='text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>
          Post not found
        </h2>
      </main>
    );
  }

  return (
    <main className='post p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      <h1 className='post__title text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>
        {post && post.title}
      </h1>
      <Link
        href={`/search?category=${post && post.category}`}
        className='self-center mt-5'
      >
        <Button color='gray' pill size='xs'>
          {post && post.category}
        </Button>
      </Link>
      <div>
        {post.images.main.url && (
          <figure className={styles['post-content__figure']}>
            <Image
              src={post.images.main.url}
              alt={post.images.main.meta?.description || "Main Image"}
              width={800}
              height={450}
              className={styles['post-content__image']}
            />
            {(post.images.main.meta?.description || post.images.main.meta?.author) && (
              <figcaption className={styles['post-content__caption']}>
                {post.images.main.meta?.author
                  ? `${post.images.main.meta?.description} — ${post.images.main.meta?.author}`
                  : post.images.main.meta?.description}
              </figcaption>
            )}
          </figure>
        )}
      </div>
      <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'>
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className='italic'>
          {post && (post?.content?.length / 1000).toFixed(0)} mins read
        </span>
      </div>

      <div className='p-3 max-w-2xl mx-auto w-full'>
        <PostContent post={post} />
      </div>

      <div className='max-w-4xl mx-auto w-full'>
        <CallToAction />
      </div>

      <RecentPosts limit={3} />
    </main>
  );
}
