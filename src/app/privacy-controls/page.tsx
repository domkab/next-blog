// src/app/privacy-controls/page.tsx
'use client';

import { SITE_NAME } from '@/lib/constants';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export const metadata = {
  title: `Privacy Controls | ${SITE_NAME}`,
  description:
    'Manage your CCPA privacy preferences. Opt out of the sale or sharing of your personal information used for personalized advertising.',
  robots: 'noindex, nofollow',
};

export default function PrivacyControlsPage() {
  const [optedOut, setOptedOut] = useState(false);

  /* read cookie once on mount */
  useEffect(() => {
    setOptedOut(document.cookie.includes('ccpa_optout=1'));
  }, []);

  const toggle = () => {
    if (optedOut) {
      // user OPTS-IN again -------------
      document.cookie =
        'ccpa_optout=1; Max-Age=0; path=/; SameSite=Lax';
      window.gtag?.('set', 'ads_data_redaction', false);
    } else {
      // user OPTS-OUT ------------------
      document.cookie =
        'ccpa_optout=1; Max-Age=31536000; path=/; SameSite=Lax';
      window.gtag?.('set', 'ads_data_redaction', true);
    }
    setOptedOut(!optedOut);
  };

  return (
    <main className="max-w-xl mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold">Privacy Controls</h1>

      <p>
        Under California Consumer Privacy laws (CCPA / CPRA) you may opt
        out of the <em>“sale or sharing”</em> of your personal
        information used for advertising. Toggle your preference below.
      </p>

      <button
        onClick={toggle}
        className={`px-6 py-3 rounded text-white ${optedOut ? 'bg-slate-500' : 'bg-teal-600'
          }`}
      >
        {optedOut
          ? 'Opt-out is ACTIVE  –  Click to enable ads'
          : 'Click to opt-out of personalised ads'}
      </button>

      {/* ↩︎ Back-to-home link */}
      <Link
        href="/"
        className="ml-4 inline-block mt-4 text-teal-600 hover:underline"
      >
        ← Back to Home
      </Link>

      <p className="text-sm text-gray-500">
        Your choice is stored in a cookie for one year. You can revisit
        this page at any time to change it.
      </p>
    </main>
  );
}