'use client';

import Logo from '../Logo';

export default function HeaderClientSide() {
  return (
    <header className="flex justify-between items-center border-b p-4">
      <h1 className="text-lg font-semibold">Public Site</h1>
      <Logo />
    </header>
  );
}