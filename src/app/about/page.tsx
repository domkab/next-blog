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
