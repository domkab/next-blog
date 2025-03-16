import axios from 'axios';
import PostCard from './PostCard';
import { PostType } from '../../types/post';

interface recentPageProps {
  limit: number;
}

export default async function RecentPosts({ limit }: recentPageProps) {
  let recentPosts = null;

  const controller = new AbortController();
  try {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_URL}api/post/get`,
      { limit: 9, order: 'desc' },
      {
        headers: { 'Cache-control': 'no-store' },
        signal: controller.signal
      },
    )

    recentPosts = data.posts;

  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('Request canceled,', error.message);
    }

    console.log('Error getting post:', error);
  }
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
