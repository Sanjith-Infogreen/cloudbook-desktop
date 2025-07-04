// components/Dashboard.tsx
"use client";

import { useState, useRef, useEffect } from "react";

interface DashboardProps {
  mainContentHTML?: string;
  isDropdownOpen: boolean;
  handleDropdownToggle: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({
  mainContentHTML,
  isDropdownOpen,
  handleDropdownToggle,
}) => {
  const [pages, setPages] = useState<string[]>([]); // You'll populate this from data
  const [recentSearches, setRecentSearches] = useState<string[]>([]); // You'll populate this from data
  const [modals, setModals] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (isDropdownOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isDropdownOpen]);

  useEffect(() => {
    setPages([
      "Contact",
      "Contact List",
      "Invoice",
      "Invoice List",
      "Invoice Payment",
      "Expense",
      "Expense List",
      "Purchase",
      "Purchase List",
      "Quotation",
      "Quotation List",
    ]);

    setModals([
      "Customer Ledger",
      "Product Ledger",
      "Expense Ledger",
      "Unit Ledger",
      "Bank Accounts",
      "Mandatory Fields",
    ]);

    setRecentSearches(["Search term 1", "Search term 2", "Search term 3"]);
  }, []);

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };
  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="flex-1 w-full bg-[#ffffff]">
      {isDropdownOpen && (
        <>
          <div
            id="dropdownBackdrop"
            className="fixed inset-0 bg-black/50  z-30"
            onClick={handleDropdownToggle}
          ></div>

          <div
            id="dropdownMenu"
            className="fixed left-[220px] right-[20px] top-[10px] bg-white border border-gray-300 rounded-md shadow-lg z-30"
          >
            <div className="bg-white mt-2">
              <div className="relative p-2 rounded-md">
                {/* Search Icon */}
                <div className="absolute top-1/2 left-5 -translate-y-1/2 flex items-center pointer-events-none">
                  <i className="ri-search-line text-[#59636e] text-base"></i>
                </div>

                {/* Input Field */}
                <input
                  ref={inputRef}
                  id="searchInput"
                  value={searchTerm}
                  onChange={handleSearchInput}
                  className="w-full h-10 pl-9 pr-8 text-sm text-gray-900 border-2 border-[#009333] rounded-sm focus:outline-none  "
                  placeholder="Search here..."
                />

                {/* Clear Icon */}
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    <i className="ri-close-circle-fill text-lg mr-2"></i>
                  </button>
                )}
              </div>

              {/* Pages Section */}
              <div className=" pl-0 border-b border-[#DEE2E6] max-h-[300px]  overflow-y-scroll">
                <h2 className="text-[12px] font-semibold text-[#59636E] ml-[8px] p-[8px]">
                  Pages
                </h2>
                <ul className="ml-[6px] mb-1">
                  {pages.map((page, index) => (
                    <li
                      key={index}
                      className="py-1.5 px-2 text-[14px] text-[#1f2328] cursor-pointer hover:bg-gray-100  rounded-sm flex justify-between items-center"
                    >
                      <div className="flex items-center">
                        <i className="ri-file-line text-gray-500 mr-2"></i>
                        {page}
                      </div>
                      <span className="text-[#59636E] text-[14px]">
                        Jump to
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="border-b border-[#DEE2E6] p-0"></div>
                {/* Modals Section */}
                <h2 className="text-[12px]   font-semibold text-[#59636E] ml-[8px] p-[8px]">
                  Modals
                </h2>
                <ul className="ml-[6px] mb-1">
                  {modals.map((modal, index) => (
                    <li
                      key={index}
                      className="py-1.5 px-2 text-[14px] text-[#1f2328] cursor-pointer hover:bg-gray-100 rounded-sm flex justify-between items-center"
                    >
                      <div className="flex items-center">
                        <i className="ri-file-line text-gray-500 mr-2"></i>
                        {modal}
                      </div>
                      <span className="text-[#59636E] text-[14px]">
                        Jump to
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recent Searches Section */}
              <div className="mb-2 border-b border-b-[#DEE2E6]">
                <h2 className="text-[12px]  text-[#59636E] font-semibold ml-[8px] p-[8px]">
                  Recent Searches
                </h2>
                <ul className="mb-1 mr-3 ml-2" id="recent-searches-list">
                  {recentSearches.map((search, index) => (
                    <li
                      key={index}
                      className="py-1.5 px-2 cursor-pointer text-[14px] text-[#1f2328] hover:bg-gray-100  rounded-md"
                    >
                      {search}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center px-4 mb-2">
                <button className="text-[12px] text-green-500 cursor-pointer">
                  Search by fields
                </button>
                <button className="text-[12px] text-green-500 cursor-pointer">
                  Give Feedback
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main content can go here if provided */}
      {mainContentHTML && (
        <div dangerouslySetInnerHTML={{ __html: mainContentHTML }} />
      )}
    </div>
  );
};

export default Dashboard;
