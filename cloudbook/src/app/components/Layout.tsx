 'use client';

import Sidebar from './Sidebar';
import Header from './Header';
 

interface LayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

export default function Layout({ children, pageTitle }: LayoutProps) {
  return (
 
    <div className="flex h-screen overflow-hidden">
        <Sidebar />

        <div className="flex-1 flex flex-col">
          <Header pageTitle={pageTitle} />

          <main className= " custom-scrollbar bg-white">
            {children}
          </main>
        </div>
 
      </div>
    
  );
}
