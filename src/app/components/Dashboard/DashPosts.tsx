import {
  Button,
  Checkbox,
  Modal,
  ModalBody,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import axios from "axios";
import { HiChevronUpDown } from "react-icons/hi2";
import { PostType } from "@/types/Post";
import Image from "next/image";
import { getImageUrl } from "@/utils/getImageUrl";

type SortablePostField = "title" | "updatedAt" | "category";

export default function DashPosts() {
  const { user } = useUser();
  const [userPosts, setUserPosts] = useState<PostType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState("");

  const [sortField, setSortField] = useState<SortablePostField | "">("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await axios.post(`/api/post/get`, {
          userId: user?.publicMetadata?.userMongoId,
          isAdmin: user?.publicMetadata?.isAdmin, // render all posts if admin
        });

        setUserPosts(data.posts);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPosts();
  }, [user?.publicMetadata?.isAdmin, user?.publicMetadata?.userMongoId]);

  const handleDeletePost = async () => {
    setShowModal(false);

    try {
      await axios.delete(`/api/post/delete`, {
        data: {
          postId: postIdToDelete,
          userId: user?.publicMetadata.userMongoId,
        },
      });

      const newPosts = userPosts.filter(post => post._id !== postIdToDelete);

      setUserPosts(newPosts);
      setPostIdToDelete("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteSelectedPosts = async () => {
    if (selectedPosts.length === 0) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedPosts.length} post(s)?`,
    );
    if (!confirmed) return;

    try {
      await axios.delete(`/api/post/delete`, {
        data: {
          postIds: selectedPosts,
          userMongoId: user?.publicMetadata.userMongoId,
        },
      });

      setUserPosts(prev =>
        prev.filter(post => !selectedPosts.includes(post._id)),
      );
      setSelectedPosts([]);
    } catch (error) {
      console.error("Bulk delete failed:", error);
    }
  };

  const handleSort = (field: SortablePostField | "") => {
    let order = "asc";
    if (sortField === field && sortOrder === "asc") {
      order = "desc";
    }
    setSortField(field);
    setSortOrder(order);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = userPosts.map(post => post._id);
      setSelectedPosts(allIds);
    } else {
      setSelectedPosts([]);
    }
  };

  const handleSelectRow = (postId: string) => {
    if (selectedPosts.includes(postId)) {
      setSelectedPosts(selectedPosts.filter(id => id !== postId));
    } else {
      setSelectedPosts([...selectedPosts, postId]);
    }
  };

  const sortedPosts = [...userPosts];

  if (sortField) {
    sortedPosts.sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;

      return 0;
    });
  }

  if (!user?.publicMetadata?.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full py-7">
        <h1 className="text-2xl font-semibold">You are not an admin!</h1>
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

          {selectedPosts.length > 0 && (
            <Button
              color="failure"
              className="mb-5 ml-3"
              onClick={handleDeleteSelectedPosts}
            >
              Delete Selected ({selectedPosts.length})
            </Button>
          )}

          <Table hoverable className="shadow-md">
            <TableHead>
              <TableHeadCell>
                <Checkbox
                  onChange={handleSelectAll}
                  checked={selectedPosts.length === userPosts.length}
                />
              </TableHeadCell>
              <TableHeadCell
                className="cursor-pointer"
                onClick={() => handleSort("updatedAt")}
              >
                Date updated <HiChevronUpDown className="inline ml-2" />
              </TableHeadCell>
              <TableHeadCell>Post image</TableHeadCell>
              <TableHeadCell
                className="cursor-pointer"
                onClick={() => handleSort("title")}
              >
                Post title <HiChevronUpDown className="inline ml-2" />
              </TableHeadCell>
              <TableHeadCell
                className="cursor-pointer"
                onClick={() => handleSort("category")}
              >
                Category <HiChevronUpDown className="inline ml-2" />
              </TableHeadCell>
              <TableHeadCell>Delete</TableHeadCell>
              <TableHeadCell>Edit</TableHeadCell>
            </TableHead>
            <TableBody className="divide-y">
              {sortedPosts.map(post => (
                <TableRow
                  key={post._id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedPosts.includes(post._id)}
                      onChange={() => handleSelectRow(post._id)}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Link href={`/post/${post.slug}`}>
                      <Image
                        src={getImageUrl(post.images.main.url)}
                        alt={post.title}
                        width={80}
                        height={40}
                        unoptimized
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link
                      className="font-medium text-gray-900 dark:text-white"
                      href={`/post/${post.slug}`}
                    >
                      {post.title}
                    </Link>
                  </TableCell>
                  <TableCell>{post.category}</TableCell>
                  <TableCell>
                    <span
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                      onClick={() => {
                        setShowModal(true);
                        setPostIdToDelete(post._id);
                      }}
                    >
                      Delete
                    </span>
                  </TableCell>
                  <TableCell>
                    <Link
                      className="text-teal-500 hover:underline"
                      href={`/dashboard/update-post/${post._id}`}
                    >
                      Edit
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full w-full py-7">
          <p>You have no posts yet!</p>
          <Link href="/dashboard/create-post">
            <Button className="mb-5">Create Post</Button>
          </Link>
        </div>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <ModalHeader />
        <ModalBody>
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
        </ModalBody>
      </Modal>
    </div>
  );
}
