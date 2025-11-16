import PostCard from '../PostCard';
import { PostType } from '../../../types/Post';
import { getRecentPosts } from '@/lib/services/postService';
import styles from './RecentPosts.module.scss';
import { clsx } from 'clsx';

interface recentPageProps {
  limit: number;
}

export default async function RecentPosts({ limit }: recentPageProps) {
  const recentPosts = await getRecentPosts(limit);

  return (
    <div className={clsx(styles['recent-posts'],
      'flex flex-col justify-center items-center mb-5'
    )}
    >
      <h1 className='recent-posts__title text-xl mb-6 md:mb-8'>Recent articles</h1>
      <div
        className={clsx(styles['recent-posts__grid'], 'w-full'
        )}
      >
        {recentPosts &&
          recentPosts.map((post: PostType) =>
            <PostCard key={post._id} post={post} limit={limit} />)
        }
      </div>
    </div>
  )
}
