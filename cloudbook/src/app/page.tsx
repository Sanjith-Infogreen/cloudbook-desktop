import React from 'react';
import Layout from './components/Layout';

 
export default function DesktopPage() {
  return (
    <Layout> 
        <div className="flex flex-col gap-8 items-start p-8">
      <h1 className="text-3xl font-bold text-green-600">Desktop View</h1>
      {/* Placeholder image for Next.js logo */}
      <img
        className="dark:invert w-[180px] h-[38px] rounded-md"
        src="https://placehold.co/180x38/000000/FFFFFF?text=Next.js"
        alt="Next.js logo"
      />
      <ol className="list-inside list-decimal text-base leading-7 font-mono">
        <li className="mb-2 tracking-tighter">
          Get started by editing{" "}
          <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-mono font-semibold">
            src/app/desktop/page.tsx
          </code>
          .
        </li>
        <li className="tracking-tighter">
          Save and see your changes instantly.
        </li>
      </ol>

      <div className="flex gap-4 items-center flex-row">
        <a
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-gray-800 text-white gap-2 hover:bg-gray-700 dark:hover:bg-gray-300 font-medium text-base h-12 px-5 min-w-[150px]"
          href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          {/* Placeholder image for Vercel logo */}
          <img
            className="dark:invert w-[20px] h-[20px]"
            src="https://placehold.co/20x20/000000/FFFFFF?text=Vercel"
            alt="Vercel logomark"
          />
          Deploy now
        </a>
        <a
          className="rounded-full border border-solid border-gray-200 dark:border-gray-700 transition-colors flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-transparent font-medium text-base h-12 px-5 min-w-[150px]"
          href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Read our docs
        </a>
      </div>
    </div>
    </Layout>
  );
}
