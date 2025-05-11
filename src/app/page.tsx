import Link from 'next/link';
import CallToAction from './components/CallToAction';
import RecentPosts from './components/RecentPosts';
// import axios from 'axios';

export default async function Home() {
  // let posts = null;

  // const controller = new AbortController();

  // try {
  //   const { data } = await axios.post(
  //     `${process.env.NEXT_PUBLIC_URL}/api/post/get`,
  //     { limit: 9, order: 'desc' },
  //     {
  //       headers: { 'Cache-control': 'no-store' },
  //       signal: controller.signal
  //     },

  //   )
    
  // } catch (error) {
  //   if (axios.isCancel(error)) {
  //     console.log('Request canceled,', error.message);
  //   }

  //   console.log('Error getting post:', error);
  // }

  return (
    <div className='flex flex-col justify-center items-center'>
      <div className='p-3 bg-amber-100 dark:bg-slate-700'>
        <CallToAction />
      </div>
      <div className='p-3 flex flex-col gap-8 py-7'>
        <RecentPosts limit={9} />
        <Link
          href={'/search?category=null'}
          className='text-lg text-teal-500 hover:underline text-center'
        >
          View all posts
        </Link>
      </div>
    </div>
  );
}