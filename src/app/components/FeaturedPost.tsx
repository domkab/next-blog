export default function FeaturedPost() {
  return (
    <>
      <div className="max-w-7xl max-w-7xl mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-4">Featured Post</h2>

        <div className="flex flex-col bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
          {/* Image Section */}
          <div className="w-full h-64 md:h-96 bg-gray-200">
            {/* Replace with <Image /> when ready */}
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              Image Placeholder
            </div>
          </div>

          {/* Text Content Section */}
          <div className="w-full p-4 flex flex-col justify-between">
            <h3 className="text-xl font-bold mb-2">Post Title Goes Here</h3>

            <div className="flex justify-between mb-3">
              <span className='italic text-sm/4'>category</span>
              <span className='italic text-sm/4'>release date</span>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Short summary or excerpt from the post to give users a preview of the content. Keep it concise and compelling.
            </p>
            <a
              href="/post/sample-slug"
              className="text-teal-500 hover:underline text-sm font-medium self-start"
            >
              Read More →
            </a>
          </div>
        </div>
      </div>
    </>
  );
}