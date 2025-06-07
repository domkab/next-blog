import Link from 'next/link';
import RecentPosts from './components/RecentPosts';
import FeaturedPost from './components/FeaturedPost/FeaturedPost';
import { EmailSubscribeWModal } from './components/CallToAction/EmailSubscribeWModal';

export const revalidate = 120;

export default async function Home() {
  return (
    <main className="flex flex-col justify-center items-center">
      <section className='w-full' aria-label="Featured Post">
        <FeaturedPost />
      </section>

      <section className="p-3 flex flex-col gap-8 pt-7" aria-label="Recent Articles">
        <RecentPosts limit={9} />
        <Link
          href={'/search?category'}
          className="text-lg text-teal-500 hover:underline text-center"
        >
          View all posts
        </Link>
      </section>

      <section aria-label="Subscribe to Newsletter">
        <EmailSubscribeWModal />
      </section>
    </main>
  );
}
