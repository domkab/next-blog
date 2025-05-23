'use client';

import { Sidebar, SidebarItem, SidebarItemGroup, SidebarItems } from 'flowbite-react';
import {
  HiUser,
  HiArrowSmRight,
  HiDocumentText,
  HiOutlineUserGroup,
  HiChartPie,
  HiStar,
} from 'react-icons/hi';
import { FiFolder } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SignOutButton } from '@clerk/nextjs';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

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
      className="w-full mdW56"
    >
      <SidebarItems className="flex flex-col gap-1">
        <SidebarItemGroup className='flex flex-col gap-1'>
          {isAdmin && (
            <Link href='/dashboard?tab=dash'>
              <SidebarItem
                active={tab === 'dash' || !tab}
                icon={HiChartPie}
                as='div'
              >
                Dashboard
              </SidebarItem>
            </Link>
          )}

          <Link href='/dashboard?tab=profile'>
            <SidebarItem
              active={tab === 'profile'}
              icon={HiUser}
              label={isAdmin ? 'Admin' : 'User'}
              labelColor='dark'
              as='div'
            >
              Profile
            </SidebarItem>
          </Link>

          {isAdmin && (
            <Link href='/dashboard?tab=posts'>
              <SidebarItem
                active={tab === 'posts'}
                icon={HiDocumentText}
                as='div'
              >
                Posts
              </SidebarItem>
            </Link>
          )}

          {isAdmin && (
            <Link href='/dashboard?tab=featured-posts'>
              <SidebarItem
                active={tab === 'featured-posts'}
                icon={HiStar}
                as='div'
              >
                Featured Posts
              </SidebarItem>
            </Link>
          )}

          {isAdmin && (
            <Link href='/dashboard?tab=categories'>
              <SidebarItem
                active={tab === 'categories'}
                icon={FiFolder}
                as='div'
              >
                Categories
              </SidebarItem>
            </Link>
          )}

          {isAdmin && (
            <Link href='/dashboard?tab=users'>
              <SidebarItem
                active={tab === 'users'}
                icon={HiOutlineUserGroup}
                as='div'
              >
                Users
              </SidebarItem>
            </Link>
          )}

          <SidebarItem icon={HiArrowSmRight} className='cursor-pointer'>
            <SignOutButton />
          </SidebarItem>

        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );

}
