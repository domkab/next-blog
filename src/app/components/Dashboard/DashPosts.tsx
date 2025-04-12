
import { Button, Checkbox, Modal, Table } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import axios from 'axios';
import { HiChevronUpDown } from 'react-icons/hi2';
import { PostType } from '@/types/Post';

type SortablePostField = 'title' | 'updatedAt' | 'category';

export default function DashPosts() {
  const { user } = useUser();
  const [userPosts, setUserPosts] = useState<PostType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState('');

  const [sortField, setSortField] = useState<SortablePostField | ''>('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_URL}/api/post/get`,
          {
            userId: user?.publicMetadata?.userMongoId,
          }
        );

        setUserPosts(data.posts)

      } catch (error) {
        console.error(error);
      }
    }
    fetchPosts();
  }, [user?.publicMetadata?.isAdmin, user?.publicMetadata?.userMongoId])

  const handleDeletePost = async () => {
    setShowModal(false);

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_URL}/api/post/delete`,
        {
          data: {
            postId: postIdToDelete,
            userId: user?.publicMetadata.userMongoId,
          }
        }
      )

      const newPosts = userPosts.filter(
        (post) => post._id !== postIdToDelete
      )

      setUserPosts(newPosts)
      setPostIdToDelete('');

    } catch (error) {
      console.error(error)
    }
  }

  const handleSort = (field: SortablePostField | '') => {
    let order = 'asc';
    if (sortField === field && sortOrder === 'asc') {
      order = 'desc';
    }
    setSortField(field);
    setSortOrder(order);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = userPosts.map((post) => post._id);
      setSelectedPosts(allIds);
    } else {
      setSelectedPosts([]);
    }
  };

  const handleSelectRow = (postId: string) => {
    if (selectedPosts.includes(postId)) {
      setSelectedPosts(selectedPosts.filter((id) => id !== postId));
    } else {
      setSelectedPosts([...selectedPosts, postId]);
    }
  };

  const sortedPosts = [...userPosts];

  if (sortField) {
    sortedPosts.sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;

      return 0;
    });
  }

  if (!user?.publicMetadata?.isAdmin) {
    return (
      <div className='flex flex-col items-center justify-center h-full w-full py-7'>
        <h1 className='text-2xl font-semibold'>You are not an admin!</h1>
      </div>
    );
  }

  return (

    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {user?.publicMetadata?.isAdmin && userPosts.length > 0 ? (

        <>
          <Link href="/dashboard/create-post">
            <Button className="mb-5">Create Post</Button>
          </Link>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>
                <Checkbox
                  onChange={handleSelectAll}
                  checked={selectedPosts.length === userPosts.length}
                />
              </Table.HeadCell>
              <Table.HeadCell
                className="cursor-pointer"
                onClick={() => handleSort('updatedAt')}
              >
                Date updated <HiChevronUpDown className="inline ml-2" />
              </Table.HeadCell>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell
                className="cursor-pointer"
                onClick={() => handleSort('title')}
              >
                Post title <HiChevronUpDown className="inline ml-2" />
              </Table.HeadCell>
              <Table.HeadCell
                className="cursor-pointer"
                onClick={() => handleSort('category')}
              >
                Category <HiChevronUpDown className="inline ml-2" />
              </Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>Edit</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {sortedPosts.map((post) => (
                <Table.Row
                  key={post._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>
                    <Checkbox
                      checked={selectedPosts.includes(post._id)}
                      onChange={() => handleSelectRow(post._id)}
                    />
                  </Table.Cell>
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link href={`/post/${post.slug}`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.images.main.url}
                        alt={post.title}
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="font-medium text-gray-900 dark:text-white"
                      href={`/post/${post.slug}`}
                    >
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    <span
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                      onClick={() => {
                        setShowModal(true);
                        setPostIdToDelete(post._id);
                      }}
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="text-teal-500 hover:underline"
                      href={`/dashboard/update-post/${post._id}`}
                    >
                      Edit
                    </Link>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </>
      ) : (
        <p>You have no posts yet!</p>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => handleDeletePost()}>
                Yes, I&apos;m sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
