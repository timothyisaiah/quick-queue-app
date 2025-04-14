'use client';

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-8 sm:p-16">
      <main className="flex flex-col items-center text-center gap-8 max-w-xl">
        {/* Replace with your own open-source icon or image later */}
        <Image
          src="/images/Quickqueue.png" // Replace with your own image/icon
          alt="QuickQueue logo"
          width={120}
          height={120}
          className="rounded-lg"
        />

        <h1 className="text-4xl sm:text-5xl font-bold">Welcome to QuickQueue</h1>
        <p className="text-lg sm:text-xl text-gray-300">
          Simplifying appointment scheduling between clients and service providers.
        </p>

        <Link
          href="/login"
          className="bg-white text-gray-900 px-6 py-3 rounded-full text-lg font-medium transition hover:bg-gray-200"
        >
          Log in to get started
        </Link>
      </main>

      <footer className="mt-20 text-sm text-gray-500">
        © {new Date().getFullYear()} QuickQueue. All rights reserved.
      </footer>
    </div>
  );
}
