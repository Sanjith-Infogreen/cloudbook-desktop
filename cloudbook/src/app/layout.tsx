"use client"; // Add this line at the very top

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useState } from "react"; // This import is now allowed in a client component
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
 
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
   

  return (
    <Providers>
      <html lang="en">
        <head>
          <link
            href="https://cdn.jsdelivr.net/npm/remixicon/fonts/remixicon.css"
            rel="stylesheet"
          />
        </head>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </Providers>
  );
}
