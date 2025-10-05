'use client';

import { usePathname } from 'next/navigation';
import HeaderWithSearchAndTheme from './HeaderWithSearchAndTheme';
import HeaderThemedWithoutLogin from './HeaderThemedWithoutLogin';

const useClientSideHeader = process.env.NEXT_PUBLIC_CLIENT_SIDE_HEADER === 'true';

export default function Header() {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith('/dashboard');

  if (isDashboard) {
    return <HeaderWithSearchAndTheme />;
  }

  return useClientSideHeader ? <HeaderThemedWithoutLogin /> : <HeaderWithSearchAndTheme />;
}