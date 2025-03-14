// import CallToAction from '@/app/components/CallToAction';
import CallToAction from '@/app/components/CallToAction';
import axios from 'axios';
import { Button } from 'flowbite-react';
import Link from 'next/link';
import Image from 'next/image';

interface PostPageProps {
  params: {
    slug: Promise<{ slug: string }>;
  };
}

export default async function PostPagePostPage({ params }: PostPageProps) {
  let post = null;

  console.log('post: ', post);
  const { slug } = await params;

  try {
    const { data } = await axios.post(
      `${process.env.URL}api/post/get`,
      { slug },
      { headers: { 'Cache-control': 'no-store' } }
    )

    console.log(data);
    post = data.posts[0];
    console.log('post from data:', post);

  } catch (error) {
    console.error('Error fetching post:', error);
    post = { title: 'Failed to load post' }
  }

  if (!post || post.title === 'Failed to load post') {
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
      <div
      >
        <Image
          src={post && post.image}
          alt={post && post.title}
          width={800}
          height={400}
          className='mt-10 p-3 max-h-[600px] w-full object-cover'
        />
      </div>
      <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs'>
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className='italic'>
          {post && (post?.content?.length / 1000).toFixed(0)} mins read
        </span>
      </div>
      <div
        className='p-3 max-w-2xl mx-auto w-full post-content'
        dangerouslySetInnerHTML={{ __html: post?.content }}
      ></div>
      <div className='max-w-4xl mx-auto w-full'>
        <CallToAction />
      </div>
    </main>
  );
}
