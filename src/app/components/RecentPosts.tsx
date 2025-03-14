import axios from 'axios';
import PostCard from './PostCard';
import { PostType } from '../../types/post';

interface recentPageProps {
  limit: number;
}

export default async function RecentPosts({ limit }: recentPageProps) {
  let recentPosts = null;

  try {
    const { data } = await axios.post(
      `${process.env.URL}api/post/get`,
      { limit: 3, order: 'desc' },
      { headers: { 'Cache-control': 'no-store' } }
    )

    recentPosts = data.posts;

  } catch (error) {
    console.log('Error getting post:', error);
  }
  return (
    <div className='recent-posts flex flex-col justify-center items-center mb-5'>
      <h1 className='recent-posts__title text-xl mt-5'>Recent articles</h1>
      <div className="flex flex-wrap gap-5 mt-5 justify-center">
        {recentPosts && recentPosts.map((post: PostType) => <PostCard key={post._id} post={post} limit={limit} />)}
      </div>
    </div>
  )
}
