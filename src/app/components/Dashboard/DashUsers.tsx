'use client';

import { Table } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import { DBUser } from '@/types';
import useTableSort from '@/app/hooks/useTableSort';
import { HiChevronUpDown } from 'react-icons/hi2';

export default function DashUsers() {
  const { user, isLoaded } = useUser();
  const [users, setUsers] = useState<DBUser[]>([]);

  // Use custom hook for sorting users
  const { sortedData: sortedUsers, handleSort } = useTableSort<DBUser>(users);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.post(
          '/api/user/get',
          {
            userMongoId: user?.publicMetadata?.userMongoId,
          },
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
        setUsers(data.users);
      } catch (error) {
        console.error(error);
      }
    };
    if (user?.publicMetadata?.isAdmin) {
      fetchUsers();
    }
  }, [user?.publicMetadata?.isAdmin, user?.publicMetadata?.userMongoId]);

  if (!user?.publicMetadata?.isAdmin && isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full py-7">
        <h1 className="text-2xl font-semibold">You are not an admin!</h1>
      </div>
    );
  }
  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {user?.publicMetadata?.isAdmin && users.length > 0 ? (
        <Table hoverable className="shadow-md">
          <Table.Head>
            <Table.HeadCell onClick={() => handleSort('createdAt')} className="cursor-pointer">
              Date created <HiChevronUpDown className="inline ml-2" />
            </Table.HeadCell>
            <Table.HeadCell> User image</Table.HeadCell>
            <Table.HeadCell>Username</Table.HeadCell>
            <Table.HeadCell onClick={() => handleSort('email')} className="cursor-pointer">
              Email <HiChevronUpDown className="inline ml-2" />
            </Table.HeadCell>
            <Table.HeadCell onClick={() => handleSort('isAdmin')} className="cursor-pointer">
              Admin <HiChevronUpDown className="inline ml-2" />
            </Table.HeadCell>
          </Table.Head>
          {sortedUsers.map((user) => (
            <Table.Body key={user._id} className="divide-y">
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
                <Table.Cell>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user.profilePicture}
                    alt={user.username}
                    className="w-10 h-10 object-cover bg-gray-500 rounded-full"
                  />
                </Table.Cell>
                <Table.Cell>{user.username}</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>
                  {user.isAdmin ? <FaCheck className="text-green-500" /> : <FaTimes className="text-red-500" />}
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          ))}
        </Table>
      ) : (
        <p>You have no users yet!</p>
      )}
    </div>
  );
}