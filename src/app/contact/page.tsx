// import { SITE_TITLE } from '@/lib/constants';
import { Label, TextInput, Textarea, Button, } from 'flowbite-react';
import { FiMail } from 'react-icons/fi';

// Alert  add form handler for contact form

export default function ContactPage() {
  return (
    <main className="min-h-screen max-w-2xl mx-auto p-6 sm:p-12">
      <h1 className="flex items-center justify-center text-3xl font-bold mb-6 gap-2">
        Contact Us
        <FiMail className="text-teal-500" />
      </h1>
      <p className="text-center mb-8">
        Have a question, suggestion, or just want to say hi? Drop us a message and we’ll get back to you as soon as we can.
      </p>

      <form
        action="https://formspree.io/f/your-form-id"
        method="POST"
        className="flex flex-col gap-4"
      >
        <div>
          <Label htmlFor="name" value="Your name" />
          <TextInput id="name" name="name" required />
        </div>

        <div>
          <Label htmlFor="email" value="Your email" />
          <TextInput id="email" name="email" type="email" required />
        </div>

        <div>
          <Label htmlFor="message" value="Your message" />
          <Textarea id="message" name="message" rows={5} required />
        </div>

        <Button type="submit" gradientDuoTone="greenToBlue">
          Send Message
        </Button>
      </form>
    </main>
  );
}