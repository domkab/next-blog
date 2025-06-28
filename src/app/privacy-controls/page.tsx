import { SITE_NAME } from '@/lib/constants';
import PrivacyControlsPage from './PrivacyControlsPage';

export const metadata = {
  title: `Privacy Controls | ${SITE_NAME}`,
  description:
    'Manage your CCPA privacy preferences. Opt out of the sale or sharing of your personal information used for personalized advertising.',
  robots: 'noindex, nofollow',
};

export default function Page() {
  return <PrivacyControlsPage />;
}