import Link from 'next/link';
import RecentPosts from './components/RecentPosts/RecentPosts';
import FeaturedPost from './components/FeaturedPost/FeaturedPost';
import { EmailSubscribeWModal } from './components/CallToAction/EmailSubscribeWModal';
// import FeaturedPostConsistent from './components/FeaturedPost/FeaturedPostConsistent';

export const revalidate = 120;

export default async function Home() {
  return (
    <main className="flex flex-col items-stretch max-w-5xl mx-auto w-full">
      <section className='w-full' aria-label="Featured Post">
        <FeaturedPost />
      </section>

      <section className="w-full pt-6 px-4 mx-auto" aria-label="Recent Articles">
        <RecentPosts limit={9} />
        <Link
          href="/search?category"
          className="block mt-4 text-lg text-teal-500 hover:underline text-center"
        >
          View all posts
        </Link>
      </section>

      <section className='p-4' aria-label="Subscribe to Newsletter">
        <EmailSubscribeWModal />
      </section>
    </main>
  );
}
