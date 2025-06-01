// import { SITE_TITLE } from '@/lib/constants';
import { Label, TextInput, Textarea, Button, } from 'flowbite-react';
import { FiMail } from 'react-icons/fi';

// Alert  add form handler for contact form

export default function ContactPage() {
  return (
    <main className="max-w-2xl mx-auto p-6 sm:p-12">
      <h1 className="flex items-center justify-center text-3xl font-bold mb-6 gap-2
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
          <Label htmlFor="name" value="Your name" />
          <TextInput
            id="name"
            name="name"
            required
          // className="border-0 border-b border-gray-400 bg-transparent rounded-none focus:ring-0 focus:border-teal-500 text-gray-800 dark:text-gray-100"
          />
        </div>

        <div>
          <Label htmlFor="email" value="Your email" />
          <TextInput
            id="email"
            name="email"
            type="email"
            required
          />
        </div>

        <div>
          <Label className='' htmlFor="message" value="Your message" />
          <Textarea
            id="message"
            name="message"
            rows={5}
            required
            className='mb-4'
          />
        </div>

        <Button
          type="submit"
          className='bg-white text-teal-600 border border-teal-500 
          hover:bg-teal-500 hover:text-white transition-all 
            duration-300 text-center p-2 rounded-md'
        >
          Send Message
        </Button>
      </form>
    </main>
  );
}