import { CHARACTER_NAME, SITE_TITLE } from "@/lib/constants";
import { FiTarget, FiInfo, FiMail, FiSmile } from "react-icons/fi";
import Link from "next/link";
import styles from "./AboutPage.module.scss";
import Image from "next/image";
import { aboutMetadata } from "@/lib/metadata/about";

export const metadata = aboutMetadata;

export default function AboutPage() {
  return (
    <main className={`${styles["about-page"]} min-h-screen mx-auto`}>
      <section
        className={`
        ${styles["about-page__content"]} 
        ${styles["about-page__content--first"]} 
        gap-6 my-0 sm:my-8
        `}
      >
        <h1 className="text-3xl font-bold lg:text-6xl">
          Welcome to {SITE_TITLE}
        </h1>

        <p className="text-sm sm:text-base">
          {SITE_TITLE} is built for people who want straightforward tech advice
          without getting buried in specs, hype, or jargon. We focus on
          practical buying guides, clear comparisons, and real-world
          explanations that help you make smarter decisions.
        </p>

        <p className="text-sm sm:text-base">
          Whether you&apos;re choosing a new laptop, figuring out how much RAM
          you actually need, or trying to understand what makes one device feel
          better than another, you&apos;ll find content here that respects your
          time and gets to the point.
        </p>

        <Link
          href="/search"
          className="text-base text-teal-500 font-bold hover:underline text-center"
        >
          View all posts
        </Link>

        <div className={`${styles["about-page__contact-card"]}`}>
          <Image
            src="/images/blog-desktop-1.webp"
            alt="Illustration of a desktop with tech content"
            width={400}
            height={450}
            className={`${styles["about-page__content-image"]} rounded-lg border shadow-lg`}
          />

          <div
            className={
              `${styles["about-page__contact-section--desktop"]} mt-5 text-center`
            }
          >
            <p className="flex items-center justify-center text-x mb-2 gap-2">
              Got feedback or want to collaborate?
              <FiMail className="text-teal-500" />
            </p>

            <Link
              href="/contact"
              className={
                "inline-block px-4 py-2 mt-5 bg-teal-500 hover:bg-teal-600 text-white rounded-md font-medium transition"
              }
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <section className={`${styles["about-page__container"]}`}>
        <div className={styles["about-page__content"]}>
          <h2
            className={`${styles["about-page__heading"]} 
              flex items-center gap-2 text-xl font-semibold mt-5`}
          >
            <FiSmile className="text-teal-500" />
            Meet {CHARACTER_NAME}
          </h2>

          <p className={styles["about-page__paragraph"]}>
            <strong>{CHARACTER_NAME}</strong> is the friendly face of{" "}
            {SITE_TITLE} — a small bit of personality behind a blog built to
            make tech feel clearer, calmer, and easier to navigate.
          </p>

          <div style={{ position: "relative", width: "100%", height: "350px" }}>
            <Image
              src="/images/cat-on-laptop.webp"
              alt="Pixel Tech cat mascot sitting with a laptop"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>

          <h2
            className={`${styles["about-page__heading"]} flex items-center gap-2 text-xl font-semibold mt-5`}
          >
            <FiTarget className="text-teal-500" />
            Our Mission
          </h2>

          <p className={styles["about-page__paragraph"]}>
            Our mission is simple: help you feel more confident when choosing
            and using tech. No gatekeeping, no fluff — just practical advice,
            clear explanations, and honest guidance for everyday buyers.
          </p>

          <h2
            className={`${styles["about-page__heading"]} flex items-center gap-2 text-xl font-semibold mt-5`}
          >
            <FiInfo className="text-teal-500" />
            Why This Blog Exists
          </h2>

          <p className={styles["about-page__paragraph"]}>
            A lot of tech content is either too technical or too salesy.{" "}
            {SITE_TITLE}
            exists to make things simpler — especially when you are trying to
            compare laptops, understand what specs actually matter, or avoid
            paying more for features you will never use.
          </p>

          <div
            className={`${styles["about-page__contact-section--mobile"]} mt-5 text-center`}
          >
            <p className="flex items-center justify-center text-x mb-2 gap-2">
              Got feedback or want to collaborate?
              <FiMail className="text-teal-500" />
            </p>

            <Link
              href="/contact"
              className={
                "inline-block px-4 py-2 mt-5 bg-teal-500 hover:bg-teal-600 text-white rounded-md font-medium transition"
              }
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
