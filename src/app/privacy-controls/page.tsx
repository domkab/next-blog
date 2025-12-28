import PrivacyControlsPage from './PrivacyControlsPage';
import { privacyControlsMetadata } from '@/lib/metadata/privacy-controls';

export const metadata = privacyControlsMetadata;

export default function Page() {
  return <PrivacyControlsPage />;
}