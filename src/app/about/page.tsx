import styles from '../../styles/AboutPage.module.scss';

export default function AboutPage() {
  return (
    <main
      className={`${styles['about-page']} 
      min-h-screen flex items-center justify-center
      `
      }
    >

      <section
        className={`${styles['about-page__container']} 
        max-w-2xl mx-auto p-3 text-center
        `
        }
      >

        <h1
          className={`${styles['about-page__title']} 
          text-3xl font font-semibold text-center my-7
          `
          }
        >
          About Consumer Review
        </h1>

        <div className={styles['about-page__content']}>
          <p className={styles['about-page__paragraph']}>
            Welcome to <strong>Consumer Review</strong>—your go-to destination
            for cutting-edge technology insights and expert opinions. Our mission
            is to distill the noise from countless sources across the web into
            clear, digestible, and data-backed reviews that empower your buying
            decisions.
          </p>

          <p className={styles['about-page__paragraph']}>
            We gather information from trusted aggregators like The Verge,
            Engadget, and PCMag, pairing it with real-time trend analysis from
            tools such as Google Trends and SEMrush. The result? A curated blend
            of articles, guides, and “best of” lists that spotlight exactly what’s
            hot—and what’s worth your time.
          </p>

          <p className={styles['about-page__paragraph']}>
            Behind the scenes, we’re building a comprehensive price comparison
            platform that will seamlessly connect with our blog. Think of it as
            the next logical step after you read our expert takes and curated
            reviews—one that helps you find the most competitive deals out there.
          </p>

          <p className={styles['about-page__paragraph']}>
            Our commitment to <em>quality content</em> and thorough research is
            fueled by a deep respect for our readers. We believe in fostering an
            environment of trust, where honesty and transparency guide everything
            from our affiliate partnerships to our editorial choices.
          </p>

          <p className={styles['about-page__paragraph']}>
            Ultimately, our journey doesn’t end with product reviews and
            comparisons. With a roadmap toward building a premium SaaS tool,
            we aim to support consumers and businesses alike through in-depth
            analytics, real-time insights, and cutting-edge data services.
            Whether you’re a casual shopper, a tech aficionado, or a forward-thinking
            entrepreneur, Consumer Review is here to inspire confident, well-informed
            decisions—one post at a time.
          </p>
        </div>

      </section>
    </main >
  )
}



export function AboutPageOld() {
  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='max-w-2xl mx-auto p-3 text-center'>
        <div>
          <h1 className='text-3xl font font-semibold text-center my-7'>
            About Sahand&apos;s Blog
          </h1>
          <div className='text-md text-gray-500 flex flex-col gap-6'>
            <p>
              Welcome to Sahand&apos;s Blog! Created by Sahand Ghavidel, this blog
              serves as a personal platform to share his insights and ideas with
              the world. Sahand is an enthusiastic developer who enjoys writing
              about technology, coding, and a variety of related topics.
            </p>

            <p>
              On this blog, you&apos;ll discover weekly articles and tutorials
              covering a range of topics including web development, software
              engineering, and programming languages. Sahand is continually
              learning and exploring new technologies, so make sure to visit
              frequently for the latest updates!
            </p>

            <p>
              This website is created using Next.js and{' '}
              <a
                href='https://go.clerk.com/fgJHKlt'
                target='_blank'
                className='text-teal-500 hover:underline'
              >
                Clerk
              </a>
              .
            </p>

            <p>
              We invite you to comment on our posts and interact with other
              readers. You can like and reply to others&apos; comments as well. We
              believe that a community of learners can support each other&apos;s
              growth and development.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}