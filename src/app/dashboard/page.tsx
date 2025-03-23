'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import DashPosts from '../components/Dashboard/DashPosts';
import DashProfile from '../components/Dashboard/DashProfile';
import DashSidebar from '../components/Dashboard/DashSidebar';
import DashUsers from '../components/Dashboard/DashUsers';
import DashboardComponent from '../components/Dashboard/DashboardComponent';
export default function Dashboard() {
  const searchParams = useSearchParams();
  const [tab, setTab] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(searchParams);
    const tabFromUrl = urlParams.get('tab');

    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [searchParams]);

  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <div className='md:w-56'>
        <DashSidebar />
      </div>

      {tab === 'profile' && <DashProfile />}
      {tab === 'posts' && <DashPosts />}
      {tab === 'users' && <DashUsers />}
      {tab === 'dash' && <DashboardComponent />}
    </div>
  );
}