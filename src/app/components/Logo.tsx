import Link from 'next/link';
import Image from 'next/image';

type LogoProps = {
  width?: number;
  height?: number;
};

export default function Logo({ width = 80, height = 64 }: LogoProps) {
  return (
    <Link href="/" className="flex items-center max-h-[30px]">
      <Image
        src="/images/pixel-tech-blog-logo-outfit.svg"
        alt="Pixel Tech Blog Logo"
        width={width}
        height={height}
        className="dark:brightness-0 dark:invert"
        priority
      />
    </Link>
  );
}