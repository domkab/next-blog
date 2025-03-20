import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';
import { Button } from 'flowbite-react';
import { FaHome } from 'react-icons/fa';

export default function SignInPage() {
  return (
    <div className="flex items-center flex-col p-3 m-auto">
      <Link href="/" passHref>
        <Button color='transparent' className="mb-4">
          <FaHome size={20} className="mr-2" />
          Home
        </Button>
      </Link>
      <div className="max-w-md">
        <SignIn />
      </div>
    </div>
  );
}