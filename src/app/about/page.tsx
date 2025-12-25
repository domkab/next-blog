import { CHARACTER_NAME, SITE_TITLE } from '@/lib/constants';
import { FiTarget, FiInfo, FiMail } from 'react-icons/fi';
import Link from 'next/link';
import styles from '../../styles/components/AboutPage/AboutPage.module.scss';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <main
      className={`${styles['about-page']} min-h-screen mx-auto`}
    >
      <section
        className={`${styles['about-page__container']}`}
      >
        <h2
          className={`${styles['about-page__title']} text-3xl font font-semibold text-center`}
        >
          All About Us
        </h2>

        <div className={styles['about-page__content']}>
          <p className={styles['about-page__paragraph']}>
            <strong>{SITE_TITLE}</strong> — a blog built for real people trying to make sense of modern tech.
            We write for folks who don’t live on tech forums, but still want smart,
            clear answers about the gadgets and tools shaping daily life.
          </p>

          <h3 className={`${styles['about-page__heading']} flex items-center gap-2 text-xl font-semibold mt-5`}>
            <FiMail className="text-teal-500" />
            Meet {CHARACTER_NAME}
          </h3>
          <p className={styles['about-page__paragraph']}>
            Curious, helpful, and just the right amount of nerdy, <strong>{CHARACTER_NAME}</strong> shares one short tip,
            review, or gadget roundup each week. Think of it as your tech-savvy friend in feline form.
          </p>
          <div style={{ position: 'relative', width: '100%', height: '350px' }}>
            <Image
              src="/images/cat-on-laptop-transparent-2-redacted.png"
              alt=""
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>

          <h3 className={`${styles['about-page__heading']} flex items-center gap-2 text-xl font-semibold mt-5`}>
            <FiTarget className="text-teal-500" />
            Our Mission
          </h3>
          <p className={styles['about-page__paragraph']}>
            Our mission is simple: help you feel more confident about the tech you use.
            No gatekeeping, no fluff — just practical insights, beginner-friendly how-tos,
            and honest reviews that answer the questions you’re actually asking.
          </p>

          <h3 className={`${styles['about-page__heading']} flex items-center gap-2 text-xl font-semibold mt-5`}>
            <FiInfo className="text-teal-500" />
            Why This Blog Exists
          </h3>
          <p className={styles['about-page__paragraph']}>
            We focus on long-tail topics — the stuff that big sites skip — so you get content that’s tailored, not templated.
            Whether you’re setting up a new smart speaker, picking your next smartwatch,
            or wondering if a gadget is worth the hype, we’re here to guide you through it.
          </p>
        </div>
      </section>

      <section className={
        `
        ${styles['about-page__content']} 
        ${styles['about-page__content--first']} 
        gap-6 my-0 sm:my-8 px-8 p-8
        `
      }>
        <h1 className="text-3xl font-bold lg:text-6xl">Welcome to {SITE_TITLE}</h1>

        <p className="text-sm sm:text-base">
          {SITE_TITLE} is your friendly home for smart, honest tech advice
          — built for everyday people, not power users.
          Whether you&apos;re setting up a new gadget, looking for no-fluff reviews,
          or just trying to make sense of your devices, you&apos;re in the right place.
        </p>

        <p className="text-sm sm:text-base">
          We publish simple guides, real-world reviews, and explainers that help you use tech more confidently
          — without the overwhelm.
          No jargon. No hype. Just helpful content that respects your time and gets to the point.
        </p>

        <Link
          href="/search"
          className="text-xs sm:text-sm text-teal-500 font-bold hover:underline text-center"
        >
          View all posts
        </Link>

        <div className={`${styles['about-page__contact-card']}`}>
          <Image
            src="/images/blog-desktop-1.png"
            alt="Illustration of a desktop with tech content"
            width={400}
            height={450}
            className={`${styles['about-page__content-image']} rounded-lg border shadow-lg`}
          />

          <div className="mt-5 text-center">
            <h3 className="flex items-center justify-center text-x mb-2 gap-2">
              Got feedback or want to collaborate?
              <FiMail className="text-teal-500" />
            </h3>
            <Link
              href="/contact"
              className="inline-block px-4 py-2 mt-5 bg-teal-500 hover:bg-teal-600 text-white rounded-md font-medium transition"
            >
              Contact Us
            </Link>
          </div>
        </div>

      </section>
    </main >
  )
}
