'use client';

import { useRouter } from 'next/navigation';
import NProgress from 'nprogress';
import { MouseEvent } from 'react';

type SmartLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export default function SmartLink({ href, children, className }: SmartLinkProps) {
  const router = useRouter();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    NProgress.start();
    router.push(href);
  };

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}

//  currently not used