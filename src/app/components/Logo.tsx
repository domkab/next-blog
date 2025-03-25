import Link from 'next/link';

export default function Logo() {
  return (
    <Link
      href="/"
      className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
    >
      <span
        className="
      px-2 py-1 bg-gradient-to-r from-red-500 to-yellow-500
      rounded-lg text-white
      "
      >
        Consumer&apos;s
      </span>
      Prices
    </Link>
  )
}
