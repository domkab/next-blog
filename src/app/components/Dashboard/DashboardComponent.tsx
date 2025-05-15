'use client';

import { useEffect, useState } from 'react';
import {
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from 'react-icons/hi';
import { Button, Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from 'flowbite-react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import axios from 'axios';
import { DBUser } from '@/types/DBUser';
import { PostType } from '@/types/Post';

export default function DashboardComp() {
  const [users, setUsers] = useState<DBUser[]>([]);
  const [posts, setPosts] = useState<PostType[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const { user } = useUser();

  useEffect(() => {
    const controller = new AbortController();

    const fetchUsers = async () => {
      try {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_URL}/api/user/get`,
          { limit: 5 },
          { signal: controller.signal }
        );

        setUsers(data.users);
        setTotalUsers(data.totalUsers);
        setLastMonthUsers(data.lastMonthUsers);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          if (axios.isCancel(error)) {
            console.log('User request canceled:', error.message);
          } else {
            console.error(error);
          }
        } else {
          console.log('An unexpected error occurred:', error);
        }
      }
    };

    const fetchPosts = async () => {
      try {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_URL}/api/post/get`,
          { limit: 5 },
          { signal: controller.signal }
        );

        setPosts(data.posts);
        setTotalPosts(data.totalPosts);
        setLastMonthPosts(data.lastMonthPosts);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          if (axios.isCancel(error)) {
            console.log('Post request canceled:', error.message);
          } else {
            console.error(error);
          }
        } else {
          console.error('An unexpected error occurred:', error);
        }
      }
    };

    if (user?.publicMetadata?.isAdmin) {
      fetchUsers();
      fetchPosts();
    }

    return () => controller.abort();
  }, [user]);

  return (
    <div className='p-3 md:mx-auto'>
      <div className='flex-wrap flex gap-4 justify-center'>
        <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
          <div className='flex justify-between'>
            <div className=''>
              <h3 className='text-gray-500 text-md uppercase'>Total Users</h3>
              <p className='text-2xl'>{totalUsers}</p>
            </div>
            <HiOutlineUserGroup className='bg-teal-600  text-white rounded-full text-5xl p-3 shadow-lg' />
          </div>
          <div className='flex  gap-2 text-sm'>
            <span className='text-green-500 flex items-center'>
              <HiArrowNarrowUp />
              {lastMonthUsers}
            </span>
            <div className='text-gray-500'>Last month</div>
          </div>
        </div>

        <div className='flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md'>
          <div className='flex justify-between'>
            <div className=''>
              <h3 className='text-gray-500 text-md uppercase'>Total Posts</h3>
              <p className='text-2xl'>{totalPosts}</p>
            </div>
            <HiDocumentText className='bg-lime-600  text-white rounded-full text-5xl p-3 shadow-lg' />
          </div>
          <div className='flex  gap-2 text-sm'>
            <span className='text-green-500 flex items-center'>
              <HiArrowNarrowUp />
              {lastMonthPosts}
            </span>
            <div className='text-gray-500'>Last month</div>
          </div>
        </div>
      </div>
      <div className='flex flex-wrap gap-4 py-3 mx-auto justify-center'>
        <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
          <div className='flex justify-between  p-3 text-sm font-semibold'>
            <h1 className='text-center p-2'>Recent users</h1>
            <Button outline gradientDuoTone='purpleToPink'>
              <Link href={'/dashboard?tab=users'}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <TableHead>
              <TableHeadCell>User image</TableHeadCell>
              <TableHeadCell>Username</TableHeadCell>
            </TableHead>
            {users &&
              users.map((user) => (
                <TableBody key={user._id} className='divide-y'>
                  <TableRow className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <TableCell>
                      {/*eslint-disable-next-line @next/next/no-img-element*/}
                      <img
                        src={user.profilePicture}
                        alt='user'
                        className='w-10 h-10 rounded-full bg-gray-500'
                      />
                    </TableCell>
                    <TableCell>{user.username}</TableCell>
                  </TableRow>
                </TableBody>
              ))}
          </Table>
        </div>

        <div className='flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800'>
          <div className='flex justify-between  p-3 text-sm font-semibold'>
            <h1 className='text-center p-2'>Recent posts</h1>
            <Button outline gradientDuoTone='purpleToPink'>
              <Link href={'/dashboard?tab=posts'}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <TableHead>
              <TableHeadCell>Post image</TableHeadCell>
              <TableHeadCell>Post Title</TableHeadCell>
              <TableHeadCell>Category</TableHeadCell>
            </TableHead>
            {posts &&
              posts.map((post) => (
                <TableBody key={post._id} className='divide-y'>
                  <TableRow className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                    <TableCell>
                      {/*eslint-disable-next-line @next/next/no-img-element*/}
                      <img
                        src={post.images.main.url}
                        alt='user'
                        className='w-14 h-10 rounded-md bg-gray-500'
                      />
                    </TableCell>
                    <TableCell className='w-96'>{post.title}</TableCell>
                    <TableCell className='w-5'>{post.category}</TableCell>
                  </TableRow>
                </TableBody>
              ))}
          </Table>
        </div>
      </div>
    </div>
  );
}