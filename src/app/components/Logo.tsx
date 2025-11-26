import Link from 'next/link';
import Image from 'next/image';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center max-h-[30px]">
      <Image
        src="/images/pixel-tech-blog-logo-outfit.svg"
        alt="Pixel Tech Blog Logo"
        width={130}
        height={64}
        className="dark:invert"
        priority
      />
    </Link>
  );
}