'use client';

import Link from 'next/link';
import Logo from '../Logo';

export default function FooterClientSide() {
  return (
    <footer>
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <Logo />
            <p className="mt-4 text-sm max-w-sm">
              Bringing transparency to consumer pricing.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 text-sm">
            <div>
              <h3 className="font-semibold mb-3">Blog</h3>
              <ul className="space-y-2">
                <li><Link href="/">Home</Link></li>
                <li><Link href="/about">About Us</Link></li>
                <li><Link href="/contact">Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="/privacy-policy">Privacy Policy</Link></li>
                <li><Link href="/terms-conditions">Terms & Conditions</Link></li>
                <li><Link href="/privacy-controls">Do Not Sell My Info</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 text-sm text-center">
          <p>© {new Date().getFullYear()} Consumer’s Prices. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}