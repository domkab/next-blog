import { contactMetadata } from '@/lib/metadata/contact';
import styles from '@/styles/components/AboutPage/AboutPage.module.scss'
import { clsx } from 'clsx';
import { Label, TextInput, Textarea, Button, } from 'flowbite-react';
import { FiMail } from 'react-icons/fi';

// Alert  add form handler for contact form

export const metadata = contactMetadata

export default function ContactPage() {
  return (
    <main className="flex-1 max-w-2xl mx-auto p-6 sm:p-12">
      <h1 className="flex items-center justify-center text-3xl font-bold mb-6 gap-3
        text-gray-800 dark:text-gray-300"
      >
        Contact Us
        <FiMail className="text-teal-500" />
      </h1>
      <p className="text-gray-600 dark:text-gray-300 text-center mb-8">
        Have a question, suggestion, or just want to say hi? Drop us a message and we’ll get back to you as soon as we can.
      </p>

      <form
        action="https://formspree.io/f/mnndyryb"
        method="POST"
        className="flex flex-col gap-4"
      >
        <input type="hidden" name="_next" value={`${process.env.NEXT_PUBLIC_SITE_URL}/thank-you`} />
        <div>
          <Label htmlFor="name" value="Your name" className='' />
          <TextInput
            id="name"
            name="name"
            required
            className='mt-2'
          />
        </div>

        <div>
          <Label htmlFor="email" value="Your email" />
          <TextInput
            id="email"
            name="email"
            type="email"
            required
            className='mt-2'
          />
        </div>

        <div>
          <Label className='' htmlFor="message" value="Your message" />
          <Textarea
            id="message"
            name="message"
            rows={5}
            required
            className='mb-4 mt-2'
          />
        </div>

        <Button
          type="submit"
          className={clsx(
            'bg-white text-teal-600 border border-teal-500',
            'hover:bg-teal-500 hover:text-white transition-all duration-300',
            'text-center p-2 rounded-md',
            // disabled styles (light)
            'disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-teal-600',
            // disabled styles (dark)
            'dark:bg-gray-900 dark:text-teal-300 dark:border-teal-700',
            'dark:hover:bg-teal-600 dark:hover:text-white',
            'dark:disabled:bg-gray-800 dark:disabled:text-gray-400 dark:disabled:border-gray-700',
            'dark:disabled:hover:bg-gray-800 dark:disabled:hover:text-gray-400'
          )}
        >
          Send Message
        </Button>

        {/* <Button type="submit" className={styles.submitBtn}>
          Send Message
        </Button> */}
      </form>
    </main>
  );
}