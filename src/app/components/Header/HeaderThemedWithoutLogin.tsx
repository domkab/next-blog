"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { AiOutlineClose, AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";

import Logo from "../Logo";
import styles from "./HeaderCS.module.scss";
import { useIsTabletOnly } from "@/hooks/useBreakPoint";

type NavItem = {
  href: string;
  label: string;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/search", label: "Search" },
];

export default function HeaderThemedWithoutLogin() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, setTheme } = useTheme();
  const isTabletOnly = useIsTabletOnly();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const activeHref = useMemo(() => {
    // If you later add nested routes, you can make this smarter.
    return pathname;
  }, [pathname]);

  useEffect(() => {
    // Sync input with URL ?searchTerm=
    const urlParams = new URLSearchParams(searchParams.toString());
    const searchTermFromUrl = urlParams.get("searchTerm") ?? "";
    setSearchTerm(searchTermFromUrl);
  }, [searchParams]);

  useEffect(() => {
    // Close mobile menu on navigation
    setIsMenuOpen(false);
  }, [pathname]);

  const pushSearch = (nextTerm: string) => {
    const urlParams = new URLSearchParams(searchParams.toString());

    const trimmed = nextTerm.trim();
    if (trimmed) urlParams.set("searchTerm", trimmed);
    else urlParams.delete("searchTerm");

    const qs = urlParams.toString();
    router.push(qs ? `/search?${qs}` : "/search");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    pushSearch(searchTerm);
  };

  const handleMobileSearchClick = () => {
    router.push("/search");
    setIsMenuOpen(false);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <header className={styles.header}>
      <div className={styles.header__inner}>
        <div className={styles.header__left}>
          <Logo />
        </div>

        <form
          onSubmit={handleSubmit}
          className={styles.header__search}
          role="search"
        >
          <label className={styles.header__srOnly} htmlFor="site-search">
            Search
          </label>

          <input
            id="site-search"
            type="search"
            placeholder="Search…"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className={styles.header__searchInput}
          />

          <button
            type="submit"
            className={styles.header__iconButton}
            aria-label="Search"
          >
            <AiOutlineSearch size={20} />
          </button>
        </form>

        <nav className={styles.header__nav} aria-label="Primary">
          <ul className={styles.header__navList}>
            {NAV_ITEMS.map(item => {
              const isActive = activeHref === item.href;

              return (
                <li key={item.href} className={styles.header__navItem}>
                  <Link
                    href={item.href}
                    className={clsx(
                      styles.header__link,
                      isActive && styles["header__link--active"],
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}

            {!isTabletOnly && (
              <li
                className={clsx(
                  styles.header__navItem,
                  styles.header__navItemTheme,
                )}
              >
                <button
                  type="button"
                  onClick={toggleTheme}
                  className={styles.header__pillButton}
                  aria-label="Toggle theme"
                >
                  {theme === "light" ? <FaSun /> : <FaMoon />}
                </button>
              </li>
            )}
          </ul>
        </nav>

        <div className={styles.header__actions}>
          {isTabletOnly && (
            <li
              className={clsx(
                styles.header__navItem,
                styles.header__navItemTheme,
              )}
            >
              <button
                type="button"
                onClick={toggleTheme}
                className={styles.header__pillButton}
                aria-label="Toggle theme"
              >
                {theme === "light" ? <FaSun /> : <FaMoon />}
              </button>
            </li>
          )}

          <button
            type="button"
            onClick={() => setIsMenuOpen(v => !v)}
            className={clsx(
              styles.header__burger,
              isMenuOpen && styles["header__burger--open"],
            )}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
          >
            {isMenuOpen ? (
              <AiOutlineClose size={22} />
            ) : (
              <>
                <span className={styles.header__burgerBar} />
                <span className={styles.header__burgerBar} />
                <span className={styles.header__burgerBar} />
              </>
            )}
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={clsx(
          styles.header__mobile,
          isMenuOpen && styles["header__mobile--open"],
        )}
      >
        <ul className={styles.header__mobileList}>
          {NAV_ITEMS.map(item => {
            const isActive = activeHref === item.href;

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={clsx(
                    styles.header__mobileLink,
                    isActive && styles["header__mobileLink--active"],
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className={styles.header__mobileMenuButtons}>
          <button
            type="button"
            onClick={handleMobileSearchClick}
            className={styles.header__mobileSearchBtn}
          >
            <AiOutlineSearch size={20} />
            <span>Search</span>
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className={styles.header__mobileThemeBtn}
          >
            {theme === "light" ? <FaSun /> : <FaMoon />}
            <span>Theme</span>
          </button>
        </div>
      </div>
    </header>
  );
}
