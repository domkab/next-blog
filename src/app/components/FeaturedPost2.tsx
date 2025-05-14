

import Link from 'next/link';

export default function FeaturedPost() {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-4">Featured Post</h2>

        <div className="group relative flex flex-col bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden w-full border border-teal-500 hover:border-2 transition-all duration-300">

          {/* Image Section with hover shrink effect */}
          <div className="relative w-full h-64 md:h-96 group-hover:h-64 transition-all duration-300 bg-gray-200">
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              Image Placeholder
            </div>
          </div>

          {/* Text Section */}
          <div className="w-full p-4 flex flex-col gap-2">
            <h3 className="text-xl font-bold mb-2">Post Title Goes Here</h3>

            <div className="flex justify-between">
              <span className='italic text-sm/4'>category</span>
              <span className='italic text-sm/4'>release date</span>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Short summary or excerpt from the post to give users a preview of the content. Keep it concise and compelling.
            </p>

            {/* Hover-animated Read More link */}
            <Link
              href="/post/sample-slug"
              className="z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-4"
            >
              Read article
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}