import Link from 'next/link';
import RecentPosts from './components/RecentPosts';
import CallToAction from './components/CallToAction2';
import FeaturedPost from './components/FeaturedPost/FeaturedPost';

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
    <main className="flex flex-col justify-center items-center">
      <section className='w-full' aria-label="Featured Post">
        <FeaturedPost />
      </section>

      <section className="p-3 flex flex-col gap-8 py-7" aria-label="Recent Articles">
        <RecentPosts limit={9} />
        <Link
          href={'/search?category'}
          className="text-lg text-teal-500 hover:underline text-center"
        >
          View all posts
        </Link>
      </section>

      <section aria-label="Subscribe to Newsletter">
        <CallToAction />
      </section>
    </main>
  );
}
