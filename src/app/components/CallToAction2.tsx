import { Button } from 'flowbite-react';
import Image from 'next/image'
import Link from 'next/link'

export default function CallToAction() {
  return (
    <div className='p-2 bg-amber-100 dark:bg-slate-700 mt-4 rounded-tl-3xl rounded-br-3xl shadow-sm'>
      <div className='flex flex-col sm:flex-row p-3 border-2 border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center'>
        <div className="flex-1 justify-center flex flex-col">
          <h2 className='text-2xl'>
            Stay ahead with the latest gadget insights.
          </h2>

          <p className='text-gray-500 my-2'>
            Join our newsletter and get updates right to your inbox — no spam, just tech that matters.
          </p>

          <Link className='flex justify-center max-w-full' href="/subscribe" rel='noopener noreferrer'>
            <Button gradientDuoTone='purpleToPink' className='w-full rounded-tl-xl rounded-bl-none'>
              Subscribe Now
            </Button>
          </Link>
        </div>

        <div className='flex-1 mt-6 sm:mt-0 sm:ml-6 flex justify-center'>
          <div style={{ position: 'relative', height: '300px' }}>
            <Image
              src="/images/cat-holding-letter-signup-wink-2.png"
              alt="Cat holding email"
              width={300}
              height={300}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// export function CallToAction2() {
//   return (
//     <div className='flex flex-col sm:flex-row items-center justify-between p-6 border-2 border-teal-500 rounded-3xl bg-white dark:bg-slate-800 shadow-md'>
//       <div className='flex-1 text-center sm:text-left'>
//         <h2 className='text-2xl font-semibold text-gray-800 dark:text-white'>
//           Stay ahead with the latest gadget insights.
//         </h2>
//         <p className='text-gray-600 dark:text-gray-300 my-2'>
//           Join our newsletter and get updates right to your inbox — no spam, just tech that matters.
//         </p>
//         <Link href="/subscribe">
//           <Button gradientDuoTone='purpleToPink' className='rounded-full mt-2'>
//             Subscribe Now
//           </Button>
//         </Link>
//       </div>
//       <div className='flex-1 mt-6 sm:mt-0 sm:ml-6 flex justify-center'>
//         <Image
//           src="/cat-holding-letter-signup-wink.png"
//           alt="Cat holding email"
//           width={300}
//           height={300}
//           className='rounded-xl'
//         />
//       </div>
//     </div>
//   )
// }