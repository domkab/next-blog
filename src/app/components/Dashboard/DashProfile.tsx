'use client';

import { UserProfile } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import { useTheme } from 'next-themes';
import styles from './DashProfile.module.scss'

export default function DashProfile() {
  const { theme } = useTheme();
  return (
    <div className={`${styles} flex justify-center items-center w-full mt-5 mb-5`}>
      <div className="w-full max-w-screen-xl px-4">
        <UserProfile
          appearance={{
            baseTheme: theme === 'light' ? undefined : dark,
          }}
          routing="hash"
        />
      </div>
    </div>
  );
}