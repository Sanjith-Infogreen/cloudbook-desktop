 'use client';

import { useState } from 'react'; // Import useState
import Sidebar from './Sidebar';
import Header from './Header';
import ProgressBar from './progressBar'; // Adjust path as necessary
import Dashboard from '../modules/dashboard/page'; // Import your Dashboard component

interface LayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

export default function Layout({ children, pageTitle }: LayoutProps) {
  // State to control the visibility of the search dropdown
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);

  // Function to toggle the search dropdown visibility
  const handleSearchClick = () => {
    setIsSearchDropdownOpen(prev => !prev);
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* The ProgressBar component will manage its own loading state and animation */}
      <ProgressBar />

      <Sidebar />

      <div className="flex-1 flex flex-col">
        {/* Pass the handleSearchClick function to the Header component */}
        <Header pageTitle={pageTitle} onSearchClick={handleSearchClick} />

        <main className="custom-scrollbar bg-white">
          {/* Pass the search dropdown state and toggle function to the Dashboard component */}
          <Dashboard
            isDropdownOpen={isSearchDropdownOpen}
            handleDropdownToggle={handleSearchClick} // Re-using handleSearchClick to close the dropdown
          />
          {children}
        </main>
      </div>
    </div>
  );
}