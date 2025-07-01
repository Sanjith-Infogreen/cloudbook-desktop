'use client'

import { useState } from 'react'

interface HeaderProps {
  pageTitle?: string
}

export default function Header({ pageTitle = "Dashboard" }: HeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false)

  return (
    <header className="bg-[#f8f9fa] shadow-sm flex justify-between items-center p-2">
      <div className="flex-1">
        <span className="in-page-title  text-base font-semibold text-[#009333]">{pageTitle}</span>
      </div>

      <div
        className={`relative border border-[#cfd7df] rounded-md px-4 py-1 mr-3 w-[175px] bg-[#FDFEFE] text-[#12375D] text-sm flex items-center cursor-pointer transition-all duration-200 ${
          searchFocused ? 'ring-2 ring-blue-200' : ''
        }`}
        onClick={() => setSearchFocused(true)}
      >
        <i className="ri-search-line absolute left-2 text-sm"></i>
        {searchFocused ? (
          <input
            type="text"
            className="pl-2 w-full bg-transparent outline-none text-[#12375d]"
            placeholder="Search..."
            autoFocus
            onBlur={() => setSearchFocused(false)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setSearchFocused(false)
              }
            }}
          />
        ) : (
          <span className="pl-2 text-[#12375d]">Click here... or Use /</span>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <div
          className="bg-[#16364d] text-white font-bold rounded-md px-1 flex items-center justify-center cursor-pointer text-md hover:bg-[#1a3d56] transition-colors duration-200"
          title="Add New"
        >
          <i className="ri-add-line"></i>
        </div>

        <div className="relative">
          <i className="ri-notification-line text-xl text-[#264966] cursor-pointer hover:text-[#1a3d56] transition-colors duration-200"></i>
          {/* Optional notification badge */}
          {/* <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span> */}
        </div>
      </div>
    </header>
  )
} 