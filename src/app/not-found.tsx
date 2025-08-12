import Link from 'next/link';
import Image from 'next/image';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start text-center p-6">
      <div className="relative w-48 h-48 mb-6">
        <Image
          src="/images/cat-sad-404-2.png"
          alt="Confused Pixel the Cat"
          fill
          className="object-contain"
          priority
        />
      </div>

      <h1 className="text-4xl font-bold mb-3 text-gray-800 dark:text-gray-300">
        🐱💨 Well, this page ran off chasing a red dot.
      </h1>

      <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
        Looks like we couldn’t find what you were looking for.
        <br />
        Maybe head back home or tell Pixel what went wrong — he’ll paw through the code himself.
      </p>

      <div className="flex gap-4">
        <Link
          href="/"
          className='bg-teal-500 text-white border border-teal-500 
            hover:text-teal-500 hover:bg-white 
            transition-all duration-300 text-center p-2 rounded-md m-2'
        >
          Back to Homepage
        </Link>
        <Link
          href="/contact"
          className='bg-white text-teal-600 border border-teal-500 
          hover:bg-teal-500 
          hover:text-white transition-all duration-300 
            text-center p-2 rounded-md m-2'
        >
          Report a Problem
        </Link>
      </div>
    </div>
  );
}