import Link from 'next/link';
import RecentPosts from './components/RecentPosts/RecentPosts';
import FeaturedPost from './components/FeaturedPost/FeaturedPost';
import { EmailSubscribeWModal } from './components/CallToAction/EmailSubscribeWModal';
import clsx from 'clsx';
import styles from '@/app/page.module.scss';
// import FeaturedPostConsistent from './components/FeaturedPost/FeaturedPostConsistent';

export const revalidate = 240;

export default async function Home() {
  return (
    <main
      className={clsx(
        styles.home,
        'flex flex-col items-stretch max-w-5xl mx-auto w-full'
      )}
    >
      <section className='w-full' aria-label="Featured Post">
        <FeaturedPost />
      </section>

      <section aria-label="Recent Articles" className={clsx(styles.home__recentPostsSection, 'w-full md:px-0 mx-auto')}>
        <RecentPosts limit={9} />
        <Link
          href="/search?category"
          className="block mt-4 text-lg text-teal-500 hover:underline text-center"
        >
          View all posts
        </Link>
      </section>

      <section className='' aria-label="Subscribe to Newsletter">
        <EmailSubscribeWModal />
      </section>
    </main>
  );
}
