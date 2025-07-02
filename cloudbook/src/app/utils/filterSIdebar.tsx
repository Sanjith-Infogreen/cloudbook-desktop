"use client";

import React from "react";

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: () => void;
  onReset: () => void;
  title?: string;
  children: React.ReactNode;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  isOpen,
  onClose,
  onApply,
  onReset,
  title = "Add Filters",
  children
}) => {
 return (
  <div className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
    {/* Backdrop */}
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)]" onClick={onClose}></div>

    {/* Sidebar */}
    <div className={`relative w-80 mt-[5.4rem] mb-[0.15rem] h-full rounded-tl-[0.375rem] rounded-bl-[0.375rem] bg-white shadow-[0_4px_16px_#27313a66] transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"} flex flex-col`}>
      
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b">
        <h2 className="font-semibold text-lg">{title}</h2>
        <button className="text-gray-500 hover:text-black" onClick={onClose}>
          <i className="ri-close-line text-xl"></i>
        </button>
      </div>

      {/* Content */}
      <div className="p-4 overflow-y-auto flex-1">
        {children}
      </div>

      {/* Footer */}
      <div className="p-2 border-t border-[#dee2e6] flex justify-end gap-2 mb-[89px]">
        <button className="btn btn-sm btn-outline" onClick={onReset}>
          Reset
        </button>
        <button className="btn btn-sm btn-primary" onClick={onApply}>
          Apply
        </button>
      </div>

    </div>
  </div>
);

};

export default FilterSidebar;
