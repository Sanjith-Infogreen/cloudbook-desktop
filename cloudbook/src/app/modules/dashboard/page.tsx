 // components/Dashboard.tsx
 'use client';

 import { useState, useEffect } from 'react';
 
 interface DashboardProps {
   mainContentHTML?: string;
   isDropdownOpen: boolean;
   handleDropdownToggle: () => void;
 }
 
 const Dashboard: React.FC<DashboardProps> = ({ mainContentHTML, isDropdownOpen, handleDropdownToggle }) => {
   const [pages, setPages] = useState<string[]>([]); // You'll populate this from data
   const [recentSearches, setRecentSearches] = useState<string[]>([]); // You'll populate this from data
 
   useEffect(() => {
     setPages([
       'Contact',
       'Contact List',
       'Invoice',
       'Invoice List',
       'Invoice Payment',
       'Expense',
       'Expense List',
       'Purchase',
       'Purchase List',
       'Quotation',
       'Quotation List'
     ]);
     setRecentSearches([
       'Search term 1',
       'Search term 2',
       'Search term 3',
     ]);
   }, []);
 
   const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
     const searchTerm = event.target.value.toLowerCase();
     // In a real application, you'd filter your data based on searchTerm
     console.log('Searching for:', searchTerm);
   };
 
   return (
     <div className="flex-1 w-full bg-[#ffffff]">
       
 
       {isDropdownOpen && (
         <>
           <div
             id="dropdownBackdrop"
             className="fixed inset-0 bg-black/30 backdrop-blur-md z-30"
             onClick={handleDropdownToggle}
           ></div>
 
           <div
             id="dropdownMenu"
             className="fixed left-[200px] right-[110px] top-[10px] bg-white border border-gray-300 rounded-md shadow-lg z-30"
           >
             <div className="bg-white mt-2">
               <div className="relative mb-0 p-2 rounded-md">
                 <div className="absolute inset-y-0 left-2 flex items-center pl-3 pointer-events-none">
                   <svg
                     className="w-4 h-4 text-gray-500"
                     aria-hidden="true"
                     xmlns="http://www.w3.org/2000/svg"
                     fill="none"
                     viewBox="0 0 20 20"
                   >
                     <path
                       stroke="currentColor"
                       strokeLinecap="round"
                       strokeLinejoin="round"
                       strokeWidth="2"
                       d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                     />
                   </svg>
                 </div>
                 <input
                   type="search"
                   id="searchInput"
                   className="w-full p-2 pl-10 text-sm text-gray-900 border border-[#009333] rounded-lg"
                   placeholder="Search"
                   onChange={handleSearchInput}
                 />
               </div>
 
               {/* Pages Section */}
               <div className="mb-1 border-b-1 border-b-[#DEE2E6]">
                 <h2 className="text-sm font-semibold text-green-600 mb-1 mr-3 ml-3">Pages</h2>
                 <ul className="p-1 mr-3 ml-3 max-h-[340px] overflow-y-scroll" id="pages-list">
                   {pages.map((page, index) => (
                     <li key={index} className="py-1 cursor-pointer hover:bg-gray-100 px-2 rounded-md flex justify-between items-center">
                       <div className="flex items-center">
                         <i className="ri-file-line text-gray-500 mr-2"></i> {/* Remix icon added here */}
                         {page}
                       </div>
                       <span className="text-gray-400 text-sm">Jump to</span> {/* "Jump to" text added here */}
                     </li>
                   ))}
                 </ul>
               </div>
 
               {/* Recent Searches Section */}
               <div className="mb-3 border-b-1 border-b-[#DEE2E6]">
                 <h2 className="text-sm font-semibold text-green-600 mb-1 p-1 mr-3 ml-3">
                   Recent Searches
                 </h2>
                 <ul className="space-y-2 mb-3 p-1 mr-3 ml-3" id="recent-searches-list">
                   {recentSearches.map((search, index) => (
                     <li key={index} className="py-1 cursor-pointer hover:bg-gray-100 px-2 rounded-md">
                       {search}
                     </li>
                   ))}
                 </ul>
               </div>
 
               {/* Footer */}
               <div className="flex justify-between items-center px-2 mr-3 ml-3 mb-2">
                 <button className="text-sm font-semibold text-green-600">
                   Search by fields
                 </button>
                 <button className="text-sm font-semibold text-green-600">
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