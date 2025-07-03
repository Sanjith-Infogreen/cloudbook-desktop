"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

export default function Sidebar() {
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>(
    {}
  );
const sidebarRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const sideMenuBar = useSelector(
    (state: RootState) => state.sideMenu.sideMenuBar
  );
useEffect(() => {
  const checkScreenSize = () => {
    setIsMobile(window.innerWidth <= 1024);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target as Node)
    ) {
      setHoveredMenu(null);
    }
  };

  // Run initial screen size check
  checkScreenSize();

  // Attach both listeners
  window.addEventListener("resize", checkScreenSize);
  document.addEventListener("mousedown", handleClickOutside);

  // Cleanup both listeners
  return () => {
    window.removeEventListener("resize", checkScreenSize);
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);


  const isActive = (path: string) => pathname.startsWith(path);

  const isSectionActive = (submenu: any[]) =>
    submenu.some((s) => pathname.startsWith(s.main_Link));

  const toggleSection = (title: string) =>
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));

  // DESKTOP SIDEBAR
  if (!isMobile) {
    return (
      <div ref={sidebarRef} className="w-[200px] bg-[#212934] shadow-md relative h-full">
        <div className="px-0 pt-2 pb-0 flex justify-center">
          <Image src="/images/logo.png" alt="Logo" width={100} height={100} />
        </div>

        <nav className="py-0">
          <ul>
            {sideMenuBar.map((menu, idx) => {
              const isSection = menu.submenu && menu.submenu.length > 0;
              const sectionOpen =
                openSections[menu.Title] || isSectionActive(menu.submenu || []);
              const activeItem = !isSection && isActive(menu.main_Link);

              return (
                <li key={idx}>
                  {isSection ? (
                    <>
                      <div
                        className={`px-4 py-2 hover:bg-[#191f26] border-l-5 border-l-transparent hover:border-l-[#1aed59] flex items-center justify-between cursor-pointer ${
                          sectionOpen ? "text-white " : "text-[#b0b3b7]"
                        }`}
                        onClick={() => toggleSection(menu.Title)}
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
                                isActive(sub.main_Link)
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

        <div className="absolute bottom-0 w-full border-t border-t-[#b0b3b7] py-2 pl-2 pr-4 flex items-center">
          <div className="mr-2">
            <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center">
              <img
                src="/images/profile-pic.png"
                alt="User Image"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="text-[#b0b3b7]">
            <div className="font-semibold">Emily Clark</div>
            <div className="text-xs">Admin</div>
          </div>
          <div className="ml-auto">
            <i className="ri-expand-up-down-fill text-[#b0b3b7] text-lg cursor-pointer"></i>
          </div>
        </div>
      </div>
    );
  }

  // MOBILE/TABLET SIDEBAR
  return (
    <div ref={sidebarRef} className="w-[60px] bg-[#212934] shadow-md relative h-full">
      <div className="px-0 py-1.5 flex justify-center">
        <img src="/images/tab-logo.png" alt="Logo" className="h-9" />
      </div>

      <nav className="py-0">
        <ul>
          {sideMenuBar.map((menu, idx) => {
            const isSection = menu.submenu && menu.submenu.length > 0;
            const activeSection =
              isSection && isSectionActive(menu.submenu || []);
            const activeItem = !isSection && isActive(menu.main_Link);

            return (
              <li
                key={idx}
                className={`relative group menu-item px-4 py-2 hover:bg-[#191f26] border-l-5 hover:border-l-[#1aed59] flex items-center justify-between cursor-pointer ${
                  activeSection || activeItem
                    ? "bg-[#191f26] border-l-[#1aed59] text-white"
                    : "text-[#b0b3b7] border-l-transparent"
                }`}
                
                onClick={() => setHoveredMenu(menu.Title)}
              >
                <div className="flex items-center">
                  <i
                    className={`${menu.icon} text-lg ${
                      activeSection || activeItem ? "text-white" : ""
                    }`}
                  ></i>
                </div>

                {hoveredMenu === menu.Title && (
                  <div className="submenu absolute left-full top-0 ml-2.5 w-56 bg-[#12344d] shadow-[0px_4px_16px_#27313a66] rounded-[0.375rem] z-[1000] text-white">
                    <ul>
                      {isSection ? (
                        menu.submenu.map((sub, subIdx) => (
                          <div key={subIdx}>
                            {sub.main_Link && (
                              <li
                                key={`${subIdx}-main`}
                                className={`px-3 py-2 border-l-5  hover:bg-[#191f26] hover:border-l-[#1aed59] flex items-center gap-2 cursor-pointer ${
                                  isActive(sub.main_Link)
                                    ? "bg-[#191f26] border-l-[#1aed59] text-white"
                                    : "border-l-transparent"
                                }`}
                                onClick={() => router.push(sub.main_Link)}
                              >
                                <i
                                  className={`ri-list-unordered text-[16px]`}
                                ></i>
                                {sub.Title} {sub.new_Link && "List"}
                              </li>
                            )}

                            {sub.new_Link && sub.main_Link && (
                              <li
                                key={`${subIdx}-new`}
                                className={`px-3 py-2 border-l-5  hover:bg-[#191f26] hover:border-l-[#1aed59] flex items-center gap-2 cursor-pointer ${
                                  isActive(sub.new_Link)
                                    ? "bg-[#191f26] border-l-[#1aed59] text-white"
                                    : "border-l-transparent"
                                }`}
                                onClick={() => router.push(sub.new_Link)}
                              >
                                <i className={`ri-add-line text-[16px]`}></i>
                                New {sub.Title}
                              </li>
                            )}
                          </div>
                        ))
                      ) : (
                        <li
                          className={`px-3 py-2 border-l-5  hover:bg-[#191f26] hover:border-l-[#1aed59] flex items-center gap-2 cursor-pointer ${
                            isActive(menu.main_Link)
                              ? "bg-[#191f26] border-l-[#1aed59] text-white"
                              : "border-l-transparent"
                          }`}
                          onClick={() => router.push(menu.main_Link)}
                        >
                          <i className={`${menu.icon} text-[16px]`}></i>
                          {menu.Title}
                        </li>
                      )}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="absolute bottom-0 w-full border-t border-t-[#b0b3b7] py-2 pl-2 pr-4 flex items-center">
        <div className="mr-2">
          <div className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center">
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
