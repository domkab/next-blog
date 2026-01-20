import { Button } from 'flowbite-react';
import Link from 'next/link';
import RecentPosts from '@/app/components/RecentPosts/RecentPosts';
import PostContent from '@/app/components/Post/PostContent';
import styles from '../../components/Post/PostContent.module.scss';
import NotFound from '@/app/not-found';
import { getPostBySlug } from '@/lib/services/postService';
import Image from 'next/image';
import { EmailSubscribeWModal } from '@/app/components/CallToAction/EmailSubscribeWModal';
import { getImageUrl } from '@/utils/getImageUrl';
import { labelFromSlug } from '@/utils/generateSlug';

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  console.log('Post fetched:', post);

  if (!post) {
    return <NotFound />;
  }

  return (
    <main className='post p-3 flex flex-col max-w-6xl mx-auto min-h-screen'>
      <h1 className='post__title text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl'>
        {post && post.title}
      </h1>
      <Link
        href={`/search?category=${post && post.category}`}
        className='self-center my-5'
      >
        <Button color='gray' pill size='xs'>
          {post && labelFromSlug(post.category)}
        </Button>
      </Link>
      <div>
        {post.images.main.url && (
          <figure className={styles['post-content__figure']}>
            <Image
              src={getImageUrl(post.images.main.url)}
              alt={post.images.main.meta?.description || "Main Image"}
              width={800}
              height={450}
              unoptimized
              className={styles['post-content__image']}
            />

            {(post.images.main.meta?.description || post.images.main.meta?.author) && (
              <figcaption className={`${styles['post-content__caption']} text-gray-600 dark:text-gray-300`}>
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

      <RecentPosts limit={3} />
      <EmailSubscribeWModal />
    </main>
  );
}
