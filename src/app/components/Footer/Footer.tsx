'use client';

import { usePathname } from 'next/navigation';
import FooterDashboard from './FooterDashboard';
import FooterClientSide from './FooterClientSide';

const useClientSideFooter = process.env.NEXT_PUBLIC_CLIENT_SIDE_FOOTER === 'true';

export default function Footer() {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');

  if (isDashboard) {
    return <FooterDashboard />;
  }

  return useClientSideFooter ? <FooterClientSide /> : <FooterDashboard />;
}