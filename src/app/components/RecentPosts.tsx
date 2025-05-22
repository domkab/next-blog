import PostCard from './PostCard';
import { PostType } from '../../types/Post';
import { getRecentPosts } from '@/lib/services/postService';

interface recentPageProps {
  limit: number;
}

export default async function RecentPosts({ limit }: recentPageProps) {
  const recentPosts = await getRecentPosts(limit);

  return (
    <div className='recent-posts flex flex-col justify-center items-center mb-5'>
      <h1 className='recent-posts__title text-xl mt-5'>Recent articles</h1>
      <div className="flex flex-wrap gap-5 mt-5 justify-center">
        {recentPosts &&
          recentPosts.map((post: PostType) =>
            <PostCard key={post._id} post={post} limit={limit} />)
        }
      </div>
    </div>
  )
}
