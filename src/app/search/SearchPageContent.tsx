'use client';

import axios from 'axios';
import { TextInput, Select, Button } from 'flowbite-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import { PostType } from '@/types/Post';
import styles from '../../styles/components/SearchPage/SearchPage.module.scss';
import clsx from 'clsx';

export default function SearchPageContent() {
  const router = useRouter();
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    category: ''
  });
  const [posts, setPosts] = useState<PostType[]>([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const urlParams = new URLSearchParams(searchParams);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const sortFromUrl = urlParams.get('sort');
    const categoryFromUrl = urlParams.get('category');

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const { data } = await axios.post(
          `/api/post/get`,
          {
            limit: 9,
            order: sortFromUrl,
            category: categoryFromUrl,
            searchTerm: searchTermFromUrl
          }
        );

        setPosts(data.posts);
        setLoading(false);
        setShowMore(data.posts.length === 9);
      } catch (error) {
        setLoading(false);
        console.error(error);
      }
    };

    fetchPosts();
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.target.id === 'searchTerm') {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
    if (e.target.id === 'sort') {
      const order = e.target.value || 'desc';
      setSidebarData({ ...sidebarData, sort: order });
    }
    if (e.target.id === 'category') {
      setSidebarData({ ...sidebarData, category: e.target.value });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(searchParams);
    urlParams.set('searchTerm', sidebarData.searchTerm);
    urlParams.set('sort', sidebarData.sort);
    urlParams.set('category', sidebarData.category);
    const searchQuery = urlParams.toString();
    router.push(`/search?${searchQuery}`);
  };

  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const urlParams = new URLSearchParams(searchParams);
    urlParams.set('startIndex', numberOfPosts.toString());
    try {
      const { data } = await axios.post(
        `/api/post/get`,
        {
          limit: 9,
          order: sidebarData.sort,
          category: sidebarData.category,
          searchTerm: sidebarData.searchTerm,
          startIndex: numberOfPosts.toString(),
        }
      );
      setPosts([...posts, ...data.posts]);
      setShowMore(data.posts.length === 9);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='flex flex-col max-w-5xl mx-auto md:flex-row'>
      <div
        className={clsx(
          'border-b md:min-h-screen border-gray-500',
          styles['search-page__sidebar']
        )}
        aria-label="Search Filters"
      >
        <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
          <div className='flex items-center gap-2'>
            <label className='whitespace-nowrap font-semibold'>Search Term:</label>
            <TextInput
              placeholder='Search...'
              id='searchTerm'
              type='text'
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Sort:</label>
            <Select onChange={handleChange} id='sort'>
              <option value='desc'>Latest</option>
              <option value='asc'>Oldest</option>
            </Select>
          </div>
          <div className='flex items-center gap-2'>
            <label className='font-semibold'>Category:</label>
            <Select onChange={handleChange} id='category'>
              <option value=''>All categories</option>
              <option value='uncategorized'>Uncategorized</option>
              <option value='reactjs'>React.js</option>
              <option value='nextjs'>Next.js</option>
              <option value='javascript'>JavaScript</option>
            </Select>
          </div>
          <Button type='submit' outline gradientDuoTone='purpleToPink'>
            Apply Filters
          </Button>
        </form>
      </div>
      <div className='w-full'>
        <div
          className={clsx('flex flex-wrap gap-4', styles['search-page__results'])}
          aria-label="Search Results"
        >
          {!loading && posts.length === 0 && (
            <p className='text-xl text-gray-500'>No posts found.</p>
          )}
          {loading && <p className='text-xl text-gray-500'>Loading...</p>}
          {!loading &&
            posts.map((post) => <PostCard key={post._id} post={post} />)}
          {showMore && (
            <button
              onClick={handleShowMore}
              className='text-teal-500 text-lg hover:underline p-7 w-full'
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}