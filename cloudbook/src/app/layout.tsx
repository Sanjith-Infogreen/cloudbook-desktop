 "use client"; // Add this line at the very top

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useState } from "react"; // This import is now allowed in a client component

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// useState and other hooks must be called inside a component function
// For a layout, if you need these states globally, consider using React Context
// or placing them in a client component that wraps your children.

// Remove these lines from the global scope:
// const [progress, setProgress] = useState(0);
// const [loading, setLoading] = useState(false);

// Metadata should typically be in a Server Component for SEO benefits.
// If you make layout.tsx a client component, you might lose some SEO benefits
// for metadata that's dynamically generated on the client.
// For static metadata, you can define it as an exported const.
 
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Declare your state variables inside the component function

  // In a real application, you'd update 'progress' and 'loading' based on
  // actual loading events, e.g., using a NProgress-like library or
  // by listening to router events.

  return (
    <html lang="en">
      <head>
        <link href="https://cdn.jsdelivr.net/npm/remixicon/fonts/remixicon.css" rel="stylesheet" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        
        {children}
      </body>
    </html>
  );
}