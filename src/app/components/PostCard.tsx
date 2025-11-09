import Link from 'next/link';
import { PostType } from '@/types/Post';
import Image from 'next/image';
import { getImageUrl } from '@/utils/getImageUrl';

type PostCardProps = {
  post: PostType;
  limit?: number;
};

export default function PostCard({ post }: PostCardProps) {
  return (
    <div className='group relative w-full border md:min-w-[320px] border-teal-500 hover:border-2 h-[420px] overflow-hidden rounded-lg sm:w-full transition-all'>
      <Link href={`/post/${post.slug}`}>
        <div className="relative w-full h-[260px] group-hover:h-[200px] transition-all duration-300">
          <Image
            src={getImageUrl(post.images.main.url)}
            alt="post cover"
            fill
            unoptimized
            priority
            className="object-cover z-20"
          />
        </div>
      </Link>

      <div className='p-3 flex flex-col gap-2'>
        <p className='text-lg font-semibold line-clamp-2'>{post.title}</p>

        <div className="flex justify-between mb-3">
          <span className='italic text-sm/4'>{post.category}</span>
          <span className='italic text-sm/4'>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        </div>

        <p className='text-sm'>{post.description}</p>
        <Link
          href={`/post/${post.slug}`}
          className='z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2'
        >
          Read article
        </Link>
      </div>
    </div>
  );
}