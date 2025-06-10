import { getFeaturedPosts } from '@/lib/services/postService';
import Link from 'next/link';
import Image from 'next/image';

//  experiment version with consistent design = button + hover effect

export default async function FeaturedPost() {
  const featured = await getFeaturedPosts();
  const first = featured[0];

  if (!first) return null;

  const { post, overrideImage, overrideSummary } = first;

  return (
    <div className="max-w-7xl mx-auto px-4">
      <h2 className="text-2xl font-semibold mb-4">Featured Post</h2>

      <div className="flex flex-col bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden w-full border border-teal-500">

        {/* Image Section */}
        <div className="w-full h-64 md:h-96 relative">
          <Image
            src={overrideImage || post.images?.main?.url || '/placeholder.jpg'}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Text Section */}
        <div className="w-full p-4 flex flex-col gap-2">
          <h3 className="text-xl font-bold mb-2">{post.title}</h3>

          <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 italic">
            {post.category && (
              <span>{post.category}</span>
            )}
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            {overrideSummary || post.description}
          </p>

          <Link
            href={`/post/${post.slug}`}
            className="mt-2 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md"
          >
            Read article
          </Link>
        </div>
      </div>
    </div>
  );
}