import Link from "next/link";
import Image from "next/image";
import clsx from 'clsx';

type LogoProps = {
  width?: number;
  height?: number;
  className?: string;
};

export default function Logo({ width = 80, height = 60, className }: LogoProps) {
  return (
    <Link href="/" className="flex items-center">
      <Image
        src="/images/pixel-tech-blog-logo-outfit.svg"
        alt="Pixel Tech Blog Logo"
        width={width}
        height={height}
        className={clsx(className, "dark:brightness-0 dark:invert")}
        priority
      />
    </Link>
  );
}
