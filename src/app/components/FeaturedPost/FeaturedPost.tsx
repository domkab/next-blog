import { getFeaturedPosts } from '@/lib/services/postService';
import LinkTracker from '../Tracking/LinkTracker';
import SecuredImage from '../SecureImage';

export const revalidate = Number(process.env.CACHE_REVALIDATION_INTERVAL) || 120;

export default async function FeaturedPost() {
  const featured = await getFeaturedPosts();
  const first = featured[0];

  if (!first) return null;

  const { post, overrideImage, overrideSummary } = first;

  return (
    <div className="max-w-7xl mx-auto px-4">
      <h2 className="text-2xl font-semibold mb-4">Featured Post</h2>

      <LinkTracker
        href={`/post/${post.slug}`}
        eventName="featured_post_click"
        eventData={{
          slug: post.slug,
          title: post.title,
          category: post.category || 'uncategorized',
        }}
        className="block"
      >
        <article className="
          flex flex-col bg-white dark:bg-slate-800 rounded-lg shadow-md border border-teal-300 
          hover:shadow-lg hover:translate-y-[-1px] transition-all duration-300
        ">
          <div className="w-full h-64 md:h-96 relative">
            <SecuredImage
              path={overrideImage || post.images?.main?.url}
              alt={post.title}
              fill
              unoptimized
              className="object-cover rounded-t-lg"
            />
          </div>

          <div className="p-4 flex flex-col gap-2">
            <h3 className="text-xl font-bold mb-2">{post.title}</h3>

            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 italic">
              {post.category && <span>{post.category}</span>}
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              {overrideSummary || post.description}
            </p>

            <span className="text-teal-500 hover:underline cursor-pointer flex items-center gap-1 w-fit">
              Read article →
            </span>
          </div>
        </article>
      </LinkTracker>
    </div>
  );
}