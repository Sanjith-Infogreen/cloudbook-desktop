"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { Toggle } from "@/app/utils/form-controls";

export default function Sidebar() {
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>(
    {}
  );
  const sidebarRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null); // Ref for the dropdown
  const router = useRouter();
  const pathname = usePathname();
  const sideMenuBar = useSelector(
    (state: RootState) => state.sideMenu.sideMenuBar
  );

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 1024);
    };

    const handleClickOutsideSidebar = (event: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target as Node)
      ) {
        setHoveredMenu(null);
      }
    };

    const handleClickOutsideDropdown = (event: MouseEvent) => {
      if (
        isDropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest(".bottom-profile-toggle-area")
      ) {
        setIsDropdownOpen(false);
      }
    };

    // Run initial screen size check
    checkScreenSize();

    // Attach all listeners
    window.addEventListener("resize", checkScreenSize);
    document.addEventListener("mousedown", handleClickOutsideSidebar);
    document.addEventListener("mousedown", handleClickOutsideDropdown);

    // Cleanup all listeners
    return () => {
      window.removeEventListener("resize", checkScreenSize);
      document.removeEventListener("mousedown", handleClickOutsideSidebar);
      document.removeEventListener("mousedown", handleClickOutsideDropdown);
    };
  }, [isDropdownOpen]);

  // Add state for submenu position
  const [submenuPosition, setSubmenuPosition] = useState({ top: 0, left: 0 });

  // Add this function to calculate position
  const handleMenuHover = (menu: any, event: any) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setSubmenuPosition({
      top: rect.top,
      left: rect.left + rect.width + 10,
    });
    setHoveredMenu(menu.Title);
  };

  const isActive = (path: string) => pathname === path;

  const isSectionActive = (submenu: any[]) =>
    submenu.some((s) => pathname === s.main_Link || pathname === s.new_Link);

  const toggleSection = (title: string, currentOpen: boolean) =>
    setOpenSections((prev) => ({
      ...prev,
      [title]: !currentOpen, // flip based on current resolved open state
    }));

  const toggleDropdown = (event: React.MouseEvent) => {
    // This function now just toggles the state directly.
    // The `handleClickOutsideDropdown` will handle closing when clicking outside.
    setIsDropdownOpen((prev) => !prev);
  };

  // DESKTOP SIDEBAR
  if (!isMobile) {
    return (
      <>
        <div
          ref={sidebarRef}
          className="w-[200px] bg-[#212934] shadow-md relative h-full"
        >
          <div className="px-0 pt-1 pb-0 flex justify-center">
            <img src="/images/logo.png" alt="Logo" className="w-[120px]" />
          </div>

          <nav className="py-0 max-h-[calc(100vh-105px)] overflow-y-auto custom-scrollbar">
            <ul>
              {sideMenuBar.map((menu, idx) => {
                const isSection = menu.submenu && menu.submenu.length > 0;

                const hasToggled = menu.Title in openSections;
                const sectionOpen = hasToggled
                  ? openSections[menu.Title]
                  : isSectionActive(menu.submenu || []);
                const activeItem =
                  (!isSection && isActive(menu.main_Link)) ||
                  isActive(menu.new_Link);

                return (
                  <li key={idx}>
                    {isSection ? (
                      <>
                        <div
                          className={`px-4 py-2 hover:bg-[#191f26] border-l-5 border-l-transparent hover:border-l-[#1aed59] flex items-center justify-between cursor-pointer ${
                            hasToggled || sectionOpen
                              ? "text-white "
                              : "text-[#b0b3b7]"
                          }`}
                          onClick={() => toggleSection(menu.Title, sectionOpen)}
                        >
                          <div className="flex items-center">
                            <i className={`${menu.icon} mr-3 text-lg`}></i>
                            <span>{menu.Title}</span>
                          </div>
                          {menu.icon_down && (
                            <i
                              className={`${
                                menu.icon_down
                              } text-lg transition-transform duration-200 ${
                                sectionOpen ? "rotate-180" : ""
                              }`}
                            ></i>
                          )}
                        </div>
                        {sectionOpen && (
                          <ul className="text-[#b0b3b7]">
                            {menu.submenu.map((sub, subIdx) => (
                              <li
                                key={subIdx}
                                className={`py-2 pr-4 pl-12 hover:bg-[#191f26] border-l-5  hover:border-l-[#1aed59] flex items-center justify-between cursor-pointer ${
                                  isActive(sub.main_Link) ||
                                  isActive(sub.new_Link)
                                    ? "bg-[#191f26] border-l-[#1aed59] text-white"
                                    : "text-[#b0b3b7] border-l-transparent"
                                }`}
                              >
                                <span
                                  onClick={() => router.push(sub.main_Link)}
                                  className={`${
                                    isActive(sub.main_Link) ? "text-white" : ""
                                  }`}
                                >
                                  {sub.Title}
                                </span>
                                {sub.new_Link && (
                                  <i
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      router.push(sub.new_Link);
                                    }}
                                    className={`${sub.icon_New} text-lg ${
                                      isActive(sub.new_Link) ? "text-white" : ""
                                    }`}
                                  ></i>
                                )}
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    ) : (
                      <div
                        onClick={() => router.push(menu.main_Link)}
                        className={`px-4 py-2 border-l-5  hover:bg-[#191f26] hover:border-l-[#1aed59] flex items-center justify-between cursor-pointer ${
                          activeItem
                            ? "bg-[#191f26] border-l-[#1aed59] text-white"
                            : "text-[#b0b3b7] border-l-transparent"
                        }`}
                      >
                        <div className="flex items-center">
                          <i
                            className={`${menu.icon} mr-3 text-lg ${
                              activeItem ? "text-white" : ""
                            }`}
                          ></i>
                          <span>{menu.Title}</span>
                        </div>
                        {menu.new_Link && (
                          <i
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(menu.new_Link);
                            }}
                            className={`${menu.icon_New} text-lg ${
                              isActive(menu.new_Link) ? "text-white" : ""
                            }`}
                          ></i>
                        )}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div
            className="absolute bottom-0 w-full border-t border-t-[#b0b3b7] py-2 pl-2 pr-4 flex items-center cursor-pointer bottom-profile-toggle-area"
            onClick={toggleDropdown}
          >
            <div className="mr-2">
              <div className="bg-gray-200 rounded-full w-9.5 h-9.5 flex items-center justify-center overflow-hidden">
                <img
                  src="/images/profile-pic.jpg"
                  alt="User Image"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="text-[#b0b3b7]">
              <div className="font-semibold text-[15px]">Emma Stone</div>
              <div className="text-xs">Admin</div>
            </div>
            <div className="ml-auto">
              <i className="ri-expand-up-down-fill text-[#b0b3b7] text-md"></i>
            </div>
          </div>
        </div>
        {isDropdownOpen && (
          <div
            ref={dropdownRef}
            className="absolute top-[calc(100vh-350px)] h-[340px] left-[200px] p-2 ml-2 w-75 bg-white rounded-xl z-50 shadow-[0_4px_16px_#27313a66]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-2 py-1.5 flex items-center">
              <div className="mr-3">
                <div className="bg-gray-200 rounded-full w-11 h-11 flex items-center justify-center overflow-hidden">
                  <img
                    src="/images/profile-pic.jpg"
                    alt="User Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex flex-col w-full">
                  <div className="flex items-center w-full">
                    <div className="font-semibold text-gray-900 text-[15px]">
                      Emma
                      <span className="text-[13px] font-normal  ml-1 text-gray-500">
                        @emmastone
                      </span>
                      <p className="text-[13px] font-normal text-gray-500">
                        emily.stone@example.com
                      </p>
                    </div>
                    <div className="ml-auto  px-2 text-[11px] font-bold text-green-700 bg-green-100 rounded-full  ">
                      PRO
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <ul className="py-2">
              <li className="flex items-center px-2 py-1.5 mb-1 hover:bg-gray-100 rounded-md cursor-pointer">
                <i className="ri-moon-line mr-3 text-gray-600 "></i>
                <span className="text-[14px] text-gray-800 leading-none">
                  Dark Mode
                </span>
                <div className="ml-auto flex items-center">
                  <Toggle
                    name="darkMode"
                    checked={isDarkMode}
                    onChange={(e) => setIsDarkMode(e.target.checked)}
                  />
                </div>
              </li>
              <hr className="border-t border-gray-200" />

              <li className="flex items-center px-2 py-1.5 mt-1  hover:bg-gray-100 rounded-md cursor-pointer">
                <i className="ri-line-chart-line mr-3 text-gray-600"></i>
                <span className="text-[14px] text-gray-800">Activity</span>
              </li>
              <li className="flex items-center px-2 py-1.5 hover:bg-gray-100 rounded-md cursor-pointer">
                <i className="ri-grid-fill mr-3 text-gray-600"></i>
                <span className="text-[14px] text-gray-800">Integrations</span>
              </li>
              <li className="flex items-center px-2 py-1.5 mb-1 hover:bg-gray-100 rounded-md cursor-pointer">
                <i className="ri-settings-3-line mr-3 text-gray-600"></i>
                <span className="text-[14px] text-gray-800">Settings</span>
              </li>
              <hr className="border-t border-gray-200" />
              <li className="flex items-center px-2 py-1.5  mt-1 hover:bg-gray-100 rounded-md  cursor-pointer">
                <i className="ri-add-circle-line mr-3 text-gray-600"></i>
                <span className="text-[14px] text-gray-800">Add Account</span>
              </li>
              <li className="flex items-center px-2 py-1.5 hover:bg-gray-100 rounded-md cursor-pointer">
                <i className="ri-logout-box-line mr-3 text-gray-600"></i>
                <span className="text-[14px] text-gray-800">Logout</span>
              </li>
            </ul>

            <div className="px-2 py-1 text-xs text-gray-400 flex items-center ">
              <span>v.1.5.69</span>
              <span className="text-[10px] ml-1">•</span>
              <a href="#" className="ml-1 text-gray-400 ">
                Terms & Conditions
              </a>
            </div>
          </div>
        )}
      </>
    );
  }

  // MOBILE/TABLET SIDEBAR
  return (
    <div
      ref={sidebarRef}
      className="w-[60px] bg-[#212934] shadow-md relative h-full"
    >
      <div className="px-0 py-1.5 flex justify-center">
        <img src="/images/tab-logo.png" alt="Logo" className="h-9" />
      </div>

      <nav className="py-0 max-h-[calc(100vh-105px)] overflow-y-auto custom-scrollbar">
        <ul>
          {sideMenuBar.map((menu, idx) => {
            const isSection = menu.submenu && menu.submenu.length > 0;
            const activeSection =
              isSection && isSectionActive(menu.submenu || []);
            const activeItem =
              (!isSection && isActive(menu.main_Link)) ||
              isActive(menu.new_Link);

            return (
              <li
                key={idx}
                className={`relative group menu-item px-4 py-2 hover:bg-[#191f26] border-l-5 hover:border-l-[#1aed59] flex items-center justify-between cursor-pointer ${
                  activeSection || activeItem
                    ? "bg-[#191f26] border-l-[#1aed59] text-white"
                    : "text-[#b0b3b7] border-l-transparent"
                }`}
                onClick={(e) => handleMenuHover(menu, e)}
              >
                <div className="flex items-center">
                  <i
                    className={`${menu.icon} text-lg ${
                      activeSection || activeItem ? "text-white" : ""
                    }`}
                  ></i>
                </div>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Fixed positioned submenu */}
      {hoveredMenu && (
        <div
          className="submenu fixed w-56 bg-[#12344d] shadow-[0px_4px_16px_#27313a66] rounded-[0.375rem] z-[1000] text-white"
          style={{
            top: `${submenuPosition.top}px`,
            left: `${submenuPosition.left}px`,
          }}
        >
          <ul>
            {(() => {
              const currentMenu = sideMenuBar.find(
                (menu) => menu.Title === hoveredMenu
              );
              if (!currentMenu) return null;

              const isSection =
                currentMenu.submenu && currentMenu.submenu.length > 0;

              return isSection ? (
                currentMenu.submenu.map((sub, subIdx) => (
                  <div key={subIdx}>
                    {sub.main_Link && (
                      <li
                        key={`${subIdx}-main`}
                        className={`px-3 py-2 flex items-center text-white text-[15px] rounded-md hover:bg-[#103d5a] hover:border-l-4 border-l-4  hover:border-[#1aed59] cursor-pointer gap-2 ${
                          isActive(sub.main_Link)
                            ? "bg-[#103d5a] border-[#1aed59] text-[#fff]"
                            : "border-l-transparent"
                        }`}
                        onClick={() => router.push(sub.main_Link)}
                      >
                        <i className="ri-list-unordered text-[16px]"></i>
                        {sub.Title} {sub.new_Link && "List"}
                      </li>
                    )}

                    {sub.new_Link && sub.main_Link && (
                      <li
                        key={`${subIdx}-new`}
                        className={`px-3 py-2 flex items-center text-white text-[15px] rounded-md hover:bg-[#103d5a] hover:border-l-4 border-l-4  hover:border-[#1aed59] cursor-pointer gap-2 ${
                          isActive(sub.new_Link)
                            ? "bg-[#103d5a] border-[#1aed59] text-[#fff]"
                            : "border-l-transparent"
                        }`}
                        onClick={() => router.push(sub.new_Link)}
                      >
                        <i className="ri-add-line text-[16px]"></i>
                        New {sub.Title}
                      </li>
                    )}
                  </div>
                ))
              ) : (
                <div>
                  {currentMenu.main_Link && (
                    <li
                      className={`px-3 py-2 flex items-center text-white text-[15px] rounded-md hover:bg-[#103d5a] hover:border-l-4 border-l-4  hover:border-[#1aed59] cursor-pointer gap-2 ${
                        isActive(currentMenu.main_Link)
                          ? "bg-[#103d5a] border-[#1aed59] text-[#fff]"
                          : "border-l-transparent"
                      }`}
                      onClick={() => router.push(currentMenu.main_Link)}
                    >
                      <i className={`ri-list-unordered text-[16px]`}></i>
                      {currentMenu.Title} {currentMenu.new_Link && "List"}
                    </li>
                  )}

                  {currentMenu.new_Link && currentMenu.main_Link && (
                    <li
                      className={`px-3 py-2 flex items-center text-white text-[15px] rounded-md hover:bg-[#103d5a] hover:border-l-4 border-l-4  hover:border-[#1aed59] cursor-pointer gap-2 ${
                        isActive(currentMenu.new_Link)
                          ? "bg-[#103d5a] border-[#1aed59] text-[#fff]"
                          : "border-l-transparent"
                      }`}
                      onClick={() => router.push(currentMenu.new_Link)}
                    >
                      <i className="ri-add-line text-[16px]"></i>
                      New {currentMenu.Title}
                    </li>
                  )}
                </div>
              );
            })()}
          </ul>
        </div>
      )}

      <div className="absolute bottom-0 w-full border-t border-t-[#b0b3b7] py-2 pl-2 pr-4 flex items-center">
        <div className="mr-2">
          <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center overflow-hidden">
            <img
              src="/images/profile-pic.png"
              alt="User Image"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
