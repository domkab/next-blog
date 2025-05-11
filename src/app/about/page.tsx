import { CHARACTER_NAME, SITE_TITLE } from '@/lib/constants';
import { FiSmile, FiTarget, FiInfo, FiMail, FiTrendingUp } from 'react-icons/fi';
import Link from 'next/link';
import styles from '../../styles/AboutPage.module.scss';
import Image from 'next/image';

export default function AboutPage() {
  return (
    <main
      className={`${styles['about-page']} min-h-screen mx-auto max-w-7xl`}
    >
      <section className={`${styles['about-page__content']} gap-6 max-w-6xl my-0 sm:my-8 px-8 p-8`}>
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
          className="text-xs sm:text-sm text-teal-500 font-bold hover:underline"
        >
          View all posts
        </Link>

        <Image
          src="/blog-desktop-1.png"
          alt="Illustration of a desktop with tech content"
          width={800}
          height={450}
          className="rounded-lg border shadow-lg"
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
      </section>

      <section
        className={`${styles['about-page__container']} max-w-2xl text-center`}
      >
        <h2
          className={`${styles['about-page__title']} text-3xl font font-semibold text-center my-7`}
        >
          About {SITE_TITLE}
        </h2>

        <div className={styles['about-page__content']}>
          <h3 className={`${styles['about-page__heading']} flex items-center gap-2 text-xl font-semibold mt-5`}>
            <FiSmile className="text-teal-500" />
            About Us
          </h3>

          <p className={styles['about-page__paragraph']}>
            Welcome to <strong>{SITE_TITLE}</strong> — a blog built for real people trying to make sense of modern tech.
            We write for folks who don’t live on tech forums, but still want smart,
            clear answers about the gadgets and tools shaping daily life.
          </p>

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
              src="/cat-on-laptop-transparent-2-redacted.png"
              alt=""
              fill
              style={{ objectFit: 'contain' }}
            />
          </div>

          <h3 className={`
            ${styles['about-page__heading']} 
            ${styles['about-page__heading--last']} 
            flex items-center gap-2 text-xl font-semibold`}
          >
            <FiTrendingUp className="text-teal-500" />
            What’s Next ?
          </h3>

          <p className={`{${styles['about-page__paragraph']}} ${styles['about-page__paragraph--next']}`}>
            {SITE_TITLE} is still growing, and we&apos;re just getting started.
            As we expand, you&apos;ll see more practical guides, smarter recommendations,
            and helpful content shaped by what real users actually need.
            But no matter how far we go, our mission stays the same: to help you make better tech decisions
            — clearly, confidently, and without the noise.
          </p>
        </div>
      </section>
    </main >
  )
}
