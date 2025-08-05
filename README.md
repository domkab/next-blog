# next-blog
next-blog with dash for my data driven project

mock geo for eu countries
http://localhost:3000/?mockGeo=lt

theme Component - can be used if we want to have a theme light/dark on our app
use ENV variables to toggle: NEXT_PUBLIC_USE_THEME


text gray dark:text-gray we can use that combo for dark light mode text colours

      for h1: text-gray-800 dark:text-gray-300
      for p: text-gray-600 dark:text-gray-300



      <h1 className="text-4xl font-bold mb-3 text-gray-800 dark:text-gray-300">
        🐱💨 Well, this page ran off chasing a red dot.
      </h1>

      <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
        Looks like we couldn’t find what you were looking for.
        <br />
        Maybe head back home or tell Pixel what went wrong — he’ll paw through the code himself.
      </p>

2025-05-14 - PostCard: max 20 words short description, height 420px on mobile

  variables:

      for h1: text-gray-800 dark:text-gray-300
      for p: text-gray-600 dark:text-gray-300
      .max-w-7xl - max-width 1200px


updating packgaes:

npx npm-check-updates --reject tailwindcss,flowbite-react

then:

npx npm-check-updates --reject tailwindcss,flowbite-react -u

finally:

npm i


# how to run gh actions secret variables migration:

  run from root folder of the project

  If your production env file is env.production:

    chmod +x upload-secrets.sh (optional if not already)
    ./scripts/upload-secrets-gh.sh env.production

  (If you don’t pass a file, it defaults to .env)