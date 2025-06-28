import { SITE_NAME } from '@/lib/constants';
import dynamic from 'next/dynamic';

export const metadata = {
  title: `Privacy Controls | ${SITE_NAME}`,
  description:
    'Manage your CCPA privacy preferences. Opt out of the sale or sharing of your personal information used for personalized advertising.',
  robots: 'noindex, nofollow',
};

// Dynamically import the client component
const PrivacyControlsPage = dynamic(() => import('./PrivacyControlsPage'), {
  ssr: false,
});

export default function Page() {
  return <PrivacyControlsPage />;
}