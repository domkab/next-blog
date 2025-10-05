'use client';

import { Button, Navbar, NavbarCollapse, NavbarLink, NavbarToggle, TextInput } from 'flowbite-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AiOutlineSearch } from 'react-icons/ai';
import {
  FaMoon,
  FaSun
} from 'react-icons/fa';
import Logo from '../Logo';
import clsx from 'clsx';
import styles from './Header.module.scss';

export default function HeaderThemedWithoutLogin() {
  const path = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const searchParams = useSearchParams();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(searchParams.toString());
    urlParams.set('searchTerm', searchTerm);
    router.push(`/search?${urlParams.toString()}`);
  };

  const handleMobileSearch = () => {
    router.push(`/search`);
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(searchParams.toString());
    const searchTermFromUrl = urlParams.get('searchTerm');

    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [searchParams]);

  return (
    <Navbar className={clsx(
      styles, 'header',
      'border-b-2',
      '!p-0 !px-0 !py-0 !m-0 border-b-2'
    )}>
      <Logo />

      <form onSubmit={handleSubmit} className="hidden lg:block">
        <div className="relative">
          <TextInput
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10 relative"
          />
          <button
            className="absolute inset-y-0 right-12 flex items-center p-2 hover:scale-105 transition-transform duration-150"
            type="submit"
          >
            <AiOutlineSearch />
          </button>
        </div>
      </form>

      <Button
        className="w-12 h-10 lg:hidden" color="gray" pill
        onClick={handleMobileSearch}
      >
        <AiOutlineSearch />
      </Button>

      <div className="flex gap-2 md:order-2">
        <Button
          className="w-12 h-10 hidden sm:inline"
          color="gray"
          pill
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        >
          {theme === 'light' ? <FaSun /> : <FaMoon />}
        </Button>
        <NavbarToggle />
      </div>

      <NavbarCollapse>
        <Link href='/'>
          <NavbarLink active={path === '/'} as={'div'}>
            Home
          </NavbarLink>
        </Link>

        <Link href='/about'>
          <NavbarLink active={path === '/about'} as={'div'}>
            About
          </NavbarLink>
        </Link>

        <Link href='/search'>
          <NavbarLink active={path === '/search'} as={'div'}>
            Search
          </NavbarLink>
        </Link>
      </NavbarCollapse>
    </Navbar>
  );
}
