'use client';

import axios from 'axios';
import { TextInput, Select, Button } from 'flowbite-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import { PostType } from '@/types/Post';
import styles from '../../styles/components/SearchPage/SearchPage.module.scss';
import clsx from 'clsx';
import SimpleOverlayLoader from '../components/SimpleOverlayLoader/SimpleOverlayLoader';
import { useCategories } from '@/hooks/useCategories';

export default function SearchPageContent() {
  const { categories, loading: categoriesLoading } = useCategories();

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
    <div
      className={clsx(
        'flex flex-col md:flex-row', styles['search-page']
      )}
    >
      <div
        aria-label="Search Filters"
        className={clsx(
          'border-b md:min-h-screen border-gray-500', styles['search-page__sidebar']
        )}
      >
        <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
          <div className='flex items-center gap-2'>
            <label className={clsx('font-semibold whitespace-nowrap', [styles['search-page__label']])}>
              Search Term:
            </label>
            <TextInput
              placeholder=''
              id='searchTerm'
              type='text'
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>

          <div className='flex items-center gap-2'>
            <label className={clsx('font-semibold whitespace-nowrap', [styles['search-page__label']])}>
              Sort:
            </label>
            <Select onChange={handleChange} id='sort'>
              <option value='desc'>Latest</option>
              <option value='asc'>Oldest</option>
            </Select>
          </div>

          <div className='flex items-center gap-2'>
            <label className={clsx('font-semibold whitespace-nowrap', [styles['search-page__label']])}>
              Category:
            </label>
            <Select
              onChange={handleChange}
              id="category"
              className={styles['search-page__select']}
            >
              <option value="">All categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </Select>
          </div>
          <Button type='submit' outline gradientDuoTone='purpleToPink'>
            Apply Filters
          </Button>
        </form>
      </div>

      <div className="w-full">
        <div className={styles['search-page__resultsWrap']}>
          <div
            className={clsx('flex flex-wrap gap-4', styles['search-page__results'])}
            aria-label="Search Results"
            aria-busy={loading}
          >
            {/* Keep posts rendered even while loading to avoid collapse */}
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}

            {/* Empty state that still keeps layout */}
            {!loading && posts.length === 0 && (
              <div className={styles['search-page__empty']}>
                <p className={styles['search-page__emptyText']}>No posts found.</p>
              </div>
            )}

            {!loading && showMore && posts.length > 0 && (
              <button
                onClick={handleShowMore}
                className="text-teal-500 text-lg hover:underline p-7 w-full"
              >
                Show More
              </button>
            )}
          </div>

          <SimpleOverlayLoader isLoading={loading} />
        </div>
      </div>
    </div>
  );
}