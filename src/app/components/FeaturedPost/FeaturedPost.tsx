import Link from 'next/link';

export default function FeaturedPost() {
  return (
    <>
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-4">Featured Post</h2>

        <Link href="/post/sample-slug" className="block ">
          <article className="flex flex-col bg-white dark:bg-slate-800 rounded-lg shadow-md border border-teal-300 hover:shadow-lg hover:translate-y-[-1px] transition-all duration-300">
            <div className="w-full h-64 md:h-96 bg-gray-200">
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                Image Placeholder
              </div>
            </div>

            <div className="p-4 flex flex-col gap-2">
              <h3 className="text-xl font-bold mb-2">Post Title Goes Here</h3>

              <div className="flex justify-between">
                <span className='italic text-sm/4'>category</span>
                <span className='italic text-sm/4'>release date</span>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                Short summary or excerpt from the post to give users a preview of the content.
              </p>

              <span className="text-teal-500 hover:underline cursor-pointer flex items-center gap-1 w-fit">
                Read article →
              </span>
            </div>
          </article>
        </Link>
      </div>
    </>
  );
}