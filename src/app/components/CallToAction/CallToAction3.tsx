'use client';

import { Button, Modal, TextInput } from 'flowbite-react';
import { useState } from 'react';
import Image from 'next/image';

export function CallToAction3() {
  const [openModal, setOpenModal] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async () => {
    setStatus('loading');
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus('success');
        setEmail('');
      } else {
        throw new Error('Failed to subscribe');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <div className='p-2 bg-amber-100 dark:bg-slate-700 mb-7 rounded-tl-3xl rounded-br-3xl shadow-sm'>
        <div className='flex flex-col sm:flex-row p-3 border-2 border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center'>
          <div className="flex-1 justify-center flex flex-col">
            <h2 className='text-2xl'>Stay ahead with the latest gadget insights.</h2>
            <p className='text-gray-500 my-2'>Join our newsletter and get updates right to your inbox — no spam, just tech that matters.</p>

            <Button gradientDuoTone='purpleToPink' className='w-full rounded-tl-xl rounded-bl-none' onClick={() => setOpenModal(true)}>
              Subscribe Now
            </Button>
          </div>

          <div className='flex-1 mt-6 sm:mt-0 sm:ml-6 flex justify-center'>
            <Image src="/images/cat-holding-letter-signup-wink-2.png" alt="Cat holding email" width={300} height={300} />
          </div>
        </div>
      </div>

      <Modal show={openModal} onClose={() => setOpenModal(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Subscribe to our Newsletter</h3>
            <TextInput
              type="email"
              placeholder="Your email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <Button onClick={handleSubmit} isProcessing={status === 'loading'}>
              {status === 'success' ? 'Subscribed!' : 'Subscribe'}
            </Button>
            {status === 'error' && <p className="text-red-500 text-sm">Failed to subscribe. Please try again.</p>}
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}