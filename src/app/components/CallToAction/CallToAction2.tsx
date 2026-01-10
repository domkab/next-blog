import { Button } from 'flowbite-react';
import Image from 'next/image'
import Link from 'next/link'

export function CallToAction2() {
  return (
    <div className='flex flex-col sm:flex-row items-center justify-between p-6 border-2 border-teal-500 rounded-3xl bg-white dark:bg-slate-800 shadow-md'>
      <div className='flex-1 text-center sm:text-left'>
        <h2 className='text-2xl font-semibold text-gray-800 dark:text-white'>
          Stay ahead with the latest gadget insights.
        </h2>
        <p className='text-gray-600 dark:text-gray-300 my-2'>
          Join our newsletter and get updates right to your inbox — no spam, just tech that matters.
        </p>
        <Link href="/subscribe">
          <Button gradientDuoTone='purpleToPink' className='rounded-full mt-2'>
            Subscribe Now
          </Button>
        </Link>
      </div>
      <div className='flex-1 mt-6 sm:mt-0 sm:ml-6 flex justify-center'>
        <Image
          src="/cat-holding-letter-signup-wink.webp"
          alt="Cat holding email"
          width={300}
          height={300}
          className='rounded-xl'
        />
      </div>
    </div>
  )
}