'use client';

import { Button, TextInput } from 'flowbite-react';
import { useState } from 'react';
import confetti from 'canvas-confetti';
import Image from 'next/image';

export function EmailSubscribeWithImage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
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

    await new Promise(resolve => setTimeout(resolve, 1000));

    setStatus('success');
    setEmail('');

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    setTimeout(() => {
      setStatus('idle');
    }, 2000);
  };

  return (
    <div className="p-2 bg-amber-100 dark:bg-slate-700 mb-7 rounded-tl-3xl rounded-br-3xl shadow-sm">
      <div className="flex flex-col sm:flex-row p-3 border-2 border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center">
        <div className="flex-1 justify-center flex flex-col items-center sm:items-start px-4 space-y-4">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Join Our Gadget Newsletter
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 max-w-md">
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
              theme={{
                field: {
                  input: {
                    base: 'block w-full border disabled:cursor-not-allowed disabled:opacity-50',
                    colors: {
                      failure:
                        'bg-red-50 border-red-500 text-red-900 placeholder-red-700 dark:bg-gray-900 dark:text-red-100 dark:placeholder-gray-300',
                    },
                  },
                },
              }}
            />
          </div>

          <Button
            onClick={handleSubmit}
            isProcessing={status === 'loading'}
            disabled={status === 'success'}
            className="w-full max-w-sm"
          >
            {status === 'success' ? 'Subscribed!' : 'Subscribe'}
          </Button>
        </div>

        <div className="flex-1 mt-6 sm:mt-0 sm:ml-6 flex justify-center">
          <Image
            src="/images/cat-holding-letter-signup-wink-2.png"
            alt="Cat holding email"
            width={300}
            height={300}
          />
        </div>
      </div>
    </div>
  );
}