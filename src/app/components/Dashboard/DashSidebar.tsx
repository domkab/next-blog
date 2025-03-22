'use client';

import { Sidebar } from 'flowbite-react';
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiChartPie,
} from 'react-icons/hi';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SignOutButton } from '@clerk/nextjs';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import styles from './Sidebar.module.scss';

type PublicMetadata = {
  isAdmin?: boolean;
};

export default function DashSidebar() {
  const [tab, setTab] = useState<string>('');
  const searchParams = useSearchParams();
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    const urlParams = new URLSearchParams(searchParams);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [searchParams]);

  if (!isSignedIn) {
    return null;
  }

  const publicMetadata = user?.publicMetadata as PublicMetadata;
  const isAdmin = publicMetadata?.isAdmin;

  return (
    <Sidebar
      className={`${styles.sidebarOverride} w-full mdW56`}
    >
      <Sidebar.Items className={`${styles.sidebarItems} flex flex-col gap-1`}>
        <Sidebar.ItemGroup className='flex flex-col gap-1'>
          {isAdmin && (
            <Link href='/dashboard?tab=dash'>
              <Sidebar.Item
                active={tab === 'dash' || !tab}
                icon={HiChartPie}
                as='div'
              >
                Dashboard
              </Sidebar.Item>
            </Link>
          )}

          <Link href='/dashboard?tab=profile'>
            <Sidebar.Item
              active={tab === 'profile'}
              icon={HiUser}
              label={isAdmin ? 'Admin' : 'User'}
              labelColor='dark'
              as='div'
            >
              Profile
            </Sidebar.Item>
          </Link>

          {isAdmin && (
            <Link href='/dashboard?tab=posts'>
              <Sidebar.Item
                active={tab === 'posts'}
                icon={HiDocumentText}
                as='div'
              >
                Posts
              </Sidebar.Item>
            </Link>
          )}

          {isAdmin && (
            <Link href='/dashboard?tab=users'>
              <Sidebar.Item
                active={tab === 'users'}
                icon={HiOutlineUserGroup}
                as='div'
              >
                Users
              </Sidebar.Item>
            </Link>
          )}

          <Sidebar.Item icon={HiArrowSmRight} className='cursor-pointer'>
            <SignOutButton />
          </Sidebar.Item>

        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>

  )

}
