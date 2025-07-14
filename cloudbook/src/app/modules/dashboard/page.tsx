"use client";

import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";

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
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [modals, setModals] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const pages = useSelector((state: RootState) => state.sideMenu.sideMenuBar);
  const router = useRouter();

  useEffect(() => {
    if (isDropdownOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isDropdownOpen]);

  useEffect(() => {
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

  const flatList = useMemo(() => {
    const list: { label: string; href?: string }[] = [];

    pages.forEach((page) => {
      if (page.main_Link)
        list.push({ label: `${page.Title} List`, href: page.main_Link });
      if (page.new_Link && page.main_Link)
        list.push({ label: `New ${page.Title}`, href: page.new_Link });

      page.submenu?.forEach((subPage) => {
        const label =
          subPage.Title === "Category"
            ? subPage.Title
            : `${subPage.Title} List`;
        if (subPage.main_Link) list.push({ label, href: subPage.main_Link });
        if (subPage.new_Link && subPage.main_Link)
          list.push({ label: `New ${subPage.Title}`, href: subPage.new_Link });
      });
    });

    modals.forEach((modal) => list.push({ label: modal }));

    return list;
  }, [pages, modals]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % flatList.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + flatList.length) % flatList.length);
    } else if (e.key === "Enter") {
      const selectedItem = flatList[activeIndex];
      if (selectedItem.href) {
        router.push(selectedItem.href);
        handleDropdownToggle();
        setActiveIndex(-1);
      }
    }
    else if(e.key==='Escape'){
      handleDropdownToggle()
      setActiveIndex(-1)
    }
  };

  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${activeIndex}"]`);
    if (el) {
      requestAnimationFrame(() => {
        el.scrollIntoView({ block: "nearest" });
      });
    }
  }, [activeIndex]);

  return (
    <div className="flex-1 w-full bg-[#ffffff]">
      {isDropdownOpen && (
        <>
          <div
            id="dropdownBackdrop"
            className="fixed inset-0 bg-black/50 z-30"
            onClick={handleDropdownToggle}
          ></div>

          <div
            id="dropdownMenu"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            className="fixed left-[220px] right-[20px] top-[10px] bg-white border border-gray-300 rounded-md shadow-lg z-30"
            ref={listRef}
          >
            <div className="bg-white mt-2">
              <div className="relative p-2 rounded-md">
                <div className="absolute top-1/2 left-5 -translate-y-1/2 flex items-center pointer-events-none">
                  <i className="ri-search-line text-[#59636e] text-base"></i>
                </div>
                <input
                  ref={inputRef}
                  id="searchInput"
                  value={searchTerm}
                  onChange={handleSearchInput}
                  className="w-full h-10 pl-9 pr-8 text-sm text-gray-900 border-2 border-[#009333] rounded-sm focus:outline-none"
                  placeholder="Search here..."
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute top-1/2 right-3 -translate-y-1/2 flex items-center text-gray-500 hover:text-gray-700"
                  >
                    <i className="ri-close-circle-fill text-lg mr-2"></i>
                  </button>
                )}
              </div>

              <div className="pl-0 border-b border-[#DEE2E6] max-h-[300px] overflow-y-scroll">
                <h2 className="text-[12px] font-semibold text-[#59636E] ml-[8px] p-[8px]">
                  Pages
                </h2>
                <ul className="ml-[6px] mb-1">
                  {pages.map((page, index) => (
                    <div key={index}>
                      {page.submenu &&
                        page.submenu.length > 0 &&
                        page.submenu.map((subPage, ind) => {
                          const label =
                            subPage.Title === "Category"
                              ? subPage.Title
                              : `${subPage.Title} List`;
                          return (
                            <div key={`sp-${ind}`}>
                              <li
                                data-index={flatList.findIndex(
                                  (f) => f.label === label
                                )}
                                className={`py-1.5 px-2 text-[14px] text-[#1f2328] cursor-pointer rounded-sm flex justify-between items-center hover:bg-gray-100 ${
                                  activeIndex ===
                                  flatList.findIndex((f) => f.label === label)
                                    ? "bg-gray-100"
                                    : ""
                                }`}
                                onClick={() => {
                                  if (subPage.main_Link)
                                    router.push(subPage.main_Link);
                                  setActiveIndex(-1)
                                  handleDropdownToggle();
                                }}
                              >
                                <div className="flex items-center">
                                  <i className="ri-file-line text-gray-500 mr-2"></i>
                                  {label}
                                </div>
                                <span className="text-[#59636E] text-[14px]">
                                  Jump to
                                </span>
                              </li>
                              {subPage.new_Link && subPage.main_Link && (
                                <li
                                  
                                  data-index={flatList.findIndex(
                                    (f) => f.label === `New ${subPage.Title}`
                                  )}
                                  className={`py-1.5 px-2 text-[14px] text-[#1f2328] cursor-pointer rounded-sm flex justify-between items-center hover:bg-gray-100 ${
                                    activeIndex ===
                                    flatList.findIndex(
                                      (f) => f.label === `New ${subPage.Title}`
                                    )
                                      ? "bg-gray-100"
                                      : ""
                                  }`}
                                  onClick={() => {
                                    router.push(subPage.new_Link);
                                    setActiveIndex(-1);
                                    handleDropdownToggle();
                                  }}
                                >
                                  <div className="flex items-center">
                                    <i className="ri-file-line text-gray-500 mr-2"></i>
                                    New {subPage.Title}
                                  </div>
                                  <span className="text-[#59636E] text-[14px]">
                                    Jump to
                                  </span>
                                </li>
                              )}
                            </div>
                          );
                        })}
                      {page.main_Link && (
                        <li
                          data-index={flatList.findIndex(
                            (f) => f.label === `${page.Title} List`
                          )}
                          className={`py-1.5 px-2 text-[14px] text-[#1f2328] cursor-pointer rounded-sm flex justify-between items-center hover:bg-gray-100  ${
                            activeIndex ===
                            flatList.findIndex(
                              (f) => f.label === `${page.Title} List`
                            )
                              ? "bg-gray-100"
                              : ""
                          }`}
                          onClick={() => {
                            router.push(page.main_Link);
                            setActiveIndex(-1);
                            handleDropdownToggle();
                          }}
                        >
                          <div className="flex items-center">
                            <i className="ri-file-line text-gray-500 mr-2"></i>
                            {page.Title} List
                          </div>
                          <span className="text-[#59636E] text-[14px]">
                            Jump to
                          </span>
                        </li>
                      )}
                      {page.new_Link && page.main_Link && (
                        <li
                          data-index={flatList.findIndex(
                            (f) => f.label === `New ${page.Title}`
                          )}
                          className={`py-1.5 px-2 text-[14px] text-[#1f2328] cursor-pointer rounded-sm flex justify-between items-center hover:bg-gray-100  ${
                            activeIndex ===
                            flatList.findIndex(
                              (f) => f.label === `New ${page.Title}`
                            )
                              ? "bg-gray-100"
                              : ""
                          }`}
                          onClick={() => {
                            router.push(page.new_Link);
                            setActiveIndex(-1);
                            handleDropdownToggle();
                          }}
                        >
                          <div className="flex items-center">
                            <i className="ri-file-line text-gray-500 mr-2"></i>
                            New {page.Title}
                          </div>
                          <span className="text-[#59636E] text-[14px]">
                            Jump to
                          </span>
                        </li>
                      )}
                    </div>
                  ))}
                </ul>

                <div className="border-b border-[#DEE2E6] p-0"></div>

                <h2 className="text-[12px] font-semibold text-[#59636E] ml-[8px] p-[8px]">
                  Modals
                </h2>
                <ul className="ml-[6px] mb-1">
                  {modals.map((modal, index) => (
                    <li
                      key={index}
                      data-index={flatList.findIndex((f) => f.label === modal)}
                      className={`py-1.5 px-2 text-[14px] text-[#1f2328] cursor-pointer rounded-sm flex justify-between items-center hover:bg-gray-100  ${
                        activeIndex ===
                        flatList.findIndex((f) => f.label === modal)
                          ? "bg-gray-100"
                          : ""
                      }`}
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

              <div className="mb-2 border-b border-b-[#DEE2E6]">
                <h2 className="text-[12px] text-[#59636E] font-semibold ml-[8px] p-[8px]">
                  Recent Searches
                </h2>
                <ul className="mb-1 mr-3 ml-2" id="recent-searches-list">
                  {recentSearches.map((search, index) => (
                    <li
                      key={index}
                      data-index={flatList.findIndex((f) => f.label === search)}
                      className={`py-1.5 px-2 cursor-pointer text-[14px] text-[#1f2328]  rounded-md  ${
                        activeIndex ===
                        flatList.findIndex((f) => f.label === search)
                          ? "hover:bg-gray-100 "
                          : ""
                      }`}
                    >
                      {search}
                    </li>
                  ))}
                </ul>
              </div>

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

      {mainContentHTML && (
        <div dangerouslySetInnerHTML={{ __html: mainContentHTML }} />
      )}
    </div>
  );
};

export default Dashboard;
