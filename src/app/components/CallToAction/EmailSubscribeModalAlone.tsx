// EmailSubscribeModalAlone.tsx
'use client';

import { Button, Modal, TextInput } from 'flowbite-react';
import { useState } from 'react';
import confetti from 'canvas-confetti';
import Image from 'next/image';
import axios from 'axios';
import type { AxiosError } from 'axios';

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function EmailSubscribeModalAlone({ open, onClose }: Props) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email.trim()) {
      setErrorMessage('Email is required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setStatus('loading');
    setErrorMessage(null);

    try {
      await axios.post('/api/newsletter', { email });

      console.log('Submitting to MailerLite:', { email, name: 'optional' });

      setStatus('success');
      setEmail('');

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      setTimeout(() => {
        onClose();
        setStatus('idle');
      }, 2000);
    } catch (err: unknown) {
      const error = err as AxiosError<{ error: string }>;
      setStatus('error');
      setErrorMessage(error?.response?.data?.error || 'Network error, please try again');
    }
  };

  return (
    <Modal show={open} onClose={onClose} popup>
      <Modal.Header />
      <Modal.Body>
        <div className="flex flex-col sm:flex-row p-3 items-center text-center space-y-6 sm:space-y-0 sm:space-x-6">
          <div className="flex-1 justify-center flex flex-col items-center sm:items-start">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Join Our Gadget Newsletter
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 max-w-md mb-3">
              Stay updated with the latest in tech, gadgets, and reviews. No spam, just value.
            </p>
            <div className="w-full max-w-sm">
              <TextInput
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => {
                  setEmail(e.target.value);
                  setErrorMessage(null);
                }}
                color={errorMessage ? 'failure' : undefined}
                helperText={
                  errorMessage ? (
                    <span className="text-red-500 text-sm">{errorMessage}</span>
                  ) : undefined
                }
                required
                shadow
              />
            </div>
            <Button
              onClick={handleSubmit}
              isProcessing={status === 'loading'}
              disabled={status === 'success'}
              className="w-full max-w-sm mt-3"
            >
              {status === 'success' ? 'Subscribed!' : 'Subscribe'}
            </Button>
          </div>
          <div className="flex-1 mt-6 sm:mt-0 flex justify-center">
            <Image
              src="/images/cat-holding-letter-signup-wink-2.png"
              alt="Cat holding email"
              width={300}
              height={300}
            />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}