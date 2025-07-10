"use client";

import { useState, useEffect, useRef } from "react";

interface HeaderProps {
  pageTitle?: string;
  onSearchClick: () => void;
}

export default function Header({ pageTitle, onSearchClick }: HeaderProps) {
  const [searchFocused, setSearchFocused] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState("notifications");

  // State for counts
  const [notificationCount, setNotificationCount] = useState(6); // Example count
  const [activityCount, setActivityCount] = useState(5); // Example count
  const [messageCount, setMessageCount] = useState(4); // Example count

  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "/") {
        event.preventDefault();
        setSearchFocused(true);
        onSearchClick();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setShowNotificationDropdown(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onSearchClick]);

  return (
    <header className="bg-[#f8f9fa] shadow-sm flex justify-between items-center p-2 ">
      <div className="flex-1">
        <span className="in-page-title text-lg font-medium text-[#009333]">
          {pageTitle}
        </span>
      </div>

      <div
        className={`relative border border-[#cfd7df] rounded-md px-4 py-1 mr-3 w-[175px] bg-[#FDFEFE] text-[#12375D] text-sm flex items-center cursor-pointer transition-all duration-200 ${
          searchFocused ? "ring-2 ring-[#009333]" : ""
        }`}
        onClick={() => {
          setSearchFocused(true);
          onSearchClick();
        }}
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
              if (e.key === "Escape") {
                setSearchFocused(false);
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

        <div className="relative" ref={notificationRef}>
          <i
            className="ri-notification-line text-xl text-[#264966] cursor-pointer hover:text-[#1a3d56] transition-colors duration-200"
            onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
          ></i>
          <div
            className={`absolute right-0 mt-2 w-115 bg-white border border-gray-200 rounded-md shadow-2xl  z-100 overflow-hidden transform transition-all duration-300 ease-out ${
              showNotificationDropdown
                ? "opacity-100 scale-100 pointer-events-auto"
                : "opacity-0 scale-95 pointer-events-none"
            }`}
          >
            {/* Dropdown Title */}
            <div className="px-4 py-3 text-lg font-semibold text-[#12375D] border-b border-gray-200">
              Notifications
            </div>

            {/* Tabs Navigation */}
            <div className="flex border-b border-gray-200 bg-gray-50">
              <button
                className={`flex-1 py-3 text-sm font-medium ${
                  activeTab === "notifications"
                    ? "text-[#009333] border-b-2 border-[#009333]"
                    : "text-gray-600 hover:text-gray-800"
                } transition-colors duration-200 focus:outline-none`}
                onClick={() => setActiveTab("notifications")}
              >
                Notifications{" "}
                {notificationCount > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-[#009333] text-white text-xs rounded-full">
                    {notificationCount}
                  </span>
                )}
              </button>
              <button
                className={`flex-1 py-3 text-sm font-medium ${
                  activeTab === "activity"
                    ? "text-[#009333] border-b-2 border-[#009333]"
                    : "text-gray-600 hover:text-gray-800"
                } transition-colors duration-200 focus:outline-none`}
                onClick={() => setActiveTab("activity")}
              >
                Activity{" "}
                {activityCount > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-[#009333] text-white text-xs rounded-full">
                    {activityCount}
                  </span>
                )}
              </button>
              <button
                className={`flex-1 py-3 text-sm font-medium ${
                  activeTab === "messages"
                    ? "text-[#009333] border-b-2 border-[#009333]"
                    : "text-gray-600 hover:text-gray-800"
                } transition-colors duration-200 focus:outline-none`}
                onClick={() => setActiveTab("messages")}
              >
                Messages{" "}
                {messageCount > 0 && (
                  <span className="ml-1 px-2 py-0.5 bg-[#009333] text-white text-xs rounded-full">
                    {messageCount}
                  </span>
                )}
              </button>
            </div>

            {/* Tab Content Area - Scrollable */}
            <div className="max-h-60 overflow-y-auto custom-scrollbar">
              {activeTab === "notifications" && (
                <div className="py-2">
                  <a
                    href="#"
                    className="flex items-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                  >
                    <i className="ri-mail-line text-lg mr-3 text-[#009333]"></i>
                    <div>
                      <p className="font-semibold">New Message</p>
                      <p className="text-xs text-gray-500">
                        You have 3 unread messages.
                      </p>
                    </div>
                    <p className="ml-auto text-xs text-gray-400 mt-1">
                      5 min ago
                    </p>
                  </a>
                  <a
                    href="#"
                    className="flex items-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                  >
                    <i className="ri-file-line text-lg mr-3 text-[#009333]"></i>
                    <div>
                      <p className="font-semibold">Report Ready</p>
                      <p className="text-xs text-gray-500">
                        Your monthly report is ready for download.
                      </p>
                    </div>
                    <p className="ml-auto text-xs text-gray-400 mt-1">
                      1 hour ago
                    </p>
                  </a>
                  <a
                    href="#"
                    className="flex items-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                  >
                    <i className="ri-bill-line text-lg mr-3 text-[#009333]"></i>
                    <div>
                      <p className="font-semibold">Payment Reminder</p>
                      <p className="text-xs text-gray-500">
                        Payment for invoice #1234 is due tomorrow.
                      </p>
                    </div>
                    <p className="ml-auto text-xs text-gray-400 mt-1">
                      3 hours ago
                    </p>
                  </a>
                  <a
                    href="#"
                    className="flex items-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                  >
                    <i className="ri-refresh-line text-lg mr-3 text-[#009333]"></i>
                    <div>
                      <p className="font-semibold">System Update</p>
                      <p className="text-xs text-gray-500">
                        Scheduled maintenance tonight at 10 PM.
                      </p>
                    </div>
                    <p className="ml-auto text-xs text-gray-400 mt-1">
                      Yesterday
                    </p>
                  </a>
                  <a
                    href="#"
                    className="flex items-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                  >
                    <i className="ri-sparkling-2-line text-lg mr-3 text-[#009333]"></i>
                    <div>
                      <p className="font-semibold">New Feature!</p>
                      <p className="text-xs text-gray-500">
                        Check out our new analytics dashboard!
                      </p>
                    </div>
                    <p className="ml-auto text-xs text-gray-400 mt-1">
                      2 days ago
                    </p>
                  </a>
                  <a
                    href="#"
                    className="flex items-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                  >
                    <i className="ri-gift-line text-lg mr-3 text-[#009333]"></i>
                    <div>
                      <p className="font-semibold">Welcome Bonus</p>
                      <p className="text-xs text-gray-500">
                        Your welcome bonus has been applied.
                      </p>
                    </div>
                    <p className="ml-auto text-xs text-gray-400 mt-1">
                      3 days ago
                    </p>
                  </a>
                </div>
              )}

              {activeTab === "activity" && (
                <div className="py-2">
                  <a
                    href="#"
                    className="flex items-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                  >
                    <i className="ri-login-box-line text-lg mr-3 text-[#009333]"></i>
                    <div>
                      <p className="font-semibold">Login Detected</p>
                      <p className="text-xs text-gray-500">
                        Login from a new device: Chrome on Windows.
                      </p>
                    </div>
                    <p className="ml-auto text-xs text-gray-400 mt-1">
                      Just now
                    </p>
                  </a>
                  <a
                    href="#"
                    className="flex items-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                  >
                    <i className="ri-upload-line text-lg mr-3 text-[#009333]"></i>
                    <div>
                      <p className="font-semibold">File Upload</p>
                      <p className="text-xs text-gray-500">
                        Document "Project Plan.pdf" was uploaded.
                      </p>
                    </div>
                    <p className="ml-auto text-xs text-gray-400 mt-1">
                      10 min ago
                    </p>
                  </a>
                  <a
                    href="#"
                    className="flex items-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                  >
                    <i className="ri-key-line text-lg mr-3 text-[#009333]"></i>
                    <div>
                      <p className="font-semibold">Password Change</p>
                      <p className="text-xs text-gray-500">
                        Your password was successfully changed.
                      </p>
                    </div>
                    <p className="ml-auto text-xs text-gray-400 mt-1">
                      2 hours ago
                    </p>
                  </a>
                  <a
                    href="#"
                    className="flex items-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                  >
                    <i className="ri-user-settings-line text-lg mr-3 text-[#009333]"></i>
                    <div>
                      <p className="font-semibold">Profile Updated</p>
                      <p className="text-xs text-gray-500">
                        Your profile information was updated.
                      </p>
                    </div>
                    <p className="ml-auto text-xs text-gray-400 mt-1">Today</p>
                  </a>
                  <a
                    href="#"
                    className="flex items-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                  >
                    <i className="ri-chat-1-line text-lg mr-3 text-[#009333]"></i>
                    <div>
                      <p className="font-semibold">Comment Added</p>
                      <p className="text-xs text-gray-500">
                        John Doe commented on "Task X".
                      </p>
                    </div>
                    <p className="ml-auto text-xs text-gray-400 mt-1">
                      Yesterday
                    </p>
                  </a>
                </div>
              )}

              {activeTab === "messages" && (
                <div className="py-2">
                  <a
                    href="#"
                    className="flex items-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                  >
                    <i className="ri-chat-quote-line text-lg mr-3 text-[#009333]"></i>
                    <div>
                      <p className="font-semibold">Support Inquiry</p>
                      <p className="text-xs text-gray-500">
                        New support request from Jane Smith.
                      </p>
                    </div>
                    <p className="ml-auto text-xs text-gray-400 mt-1">
                      15 min ago
                    </p>
                  </a>
                  <a
                    href="#"
                    className="flex items-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                  >
                    <i className="ri-group-line text-lg mr-3 text-[#009333]"></i>
                    <div>
                      <p className="font-semibold">Team Meeting</p>
                      <p className="text-xs text-gray-500">
                        Reminder: Team sync in 30 minutes.
                      </p>
                    </div>
                    <p className="ml-auto text-xs text-gray-400 mt-1">
                      30 min ago
                    </p>
                  </a>
                  <a
                    href="#"
                    className="flex items-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                  >
                    <i className="ri-edit-line text-lg mr-3 text-[#009333]"></i>
                    <div>
                      <p className="font-semibold">Document Review</p>
                      <p className="text-xs text-gray-500">
                        Feedback requested on "Marketing Strategy.docx".
                      </p>
                    </div>
                    <p className="ml-auto text-xs text-gray-400 mt-1">
                      1 day ago
                    </p>
                  </a>
                  <a
                    href="#"
                    className="flex items-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                  >
                    <i className="ri-alarm-line text-lg mr-3 text-[#009333]"></i>
                    <div>
                      <p className="font-semibold">Deadline Approaching</p>
                      <p className="text-xs text-gray-500">
                        Task "Implement Feature Y" is due soon.
                      </p>
                    </div>
                    <p className="ml-auto text-xs text-gray-400 mt-1">
                      2 days ago
                    </p>
                  </a>
                </div>
              )}
            </div>

            {/* "View All" link */}
            <div className="border-t border-gray-200 bg-gray-50">
              <a
                href="#"
                className="block px-4 py-2 text-sm text-[#009333] hover:bg-gray-100 text-center transition-colors duration-200"
              >
                View all {activeTab}
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}