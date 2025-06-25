'use client';

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';

export default function AppBar() {
  return (
    <header className="w-full flex items-center justify-between px-6 py-4 border-b bg-white dark:bg-zinc-900 shadow-sm sticky top-0 z-10">
      {/* Logo */}
      <h1 className="text-2xl font-bold text-primary tracking-tight">⚡ Bolt</h1>

      {/* Auth buttons */}
      <div className="flex items-center gap-3">
        <SignedOut>
          <SignInButton mode="modal">
            <button className="text-sm  cursor-pointer font-medium text-zinc-600 hover:text-black dark:text-zinc-300 dark:hover:text-white transition">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="bg-[#6c47ff] cursor-pointer text-white rounded-full font-medium text-sm px-5 py-2 hover:bg-[#5939cc] transition">
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>

        <SignedIn>
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: 'h-10 w-10',
              },
            }}
          />
        </SignedIn>
      </div>
    </header>
  );
}
