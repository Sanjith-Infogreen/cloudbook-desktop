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
      <div className="fixed inset-0 bg-black/50" onClick={onClose}></div>

      {/* Sidebar */}
      <div className={`offcanvas-sidebar flex flex-col ${isOpen ? "translate-x-0" : "translate-x-full"} `}>

        {/* Header */}
        <div className="filter-header">
          <h5 className="">{title}</h5>
          <button onClick={onClose} className="cursor-pointer">
            <i className="ri-close-line "></i>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1">
          {children}
        </div>

        {/* Footer */}
        <div className="p-2 border-t border-[#dee2e6] flex justify-end gap-2">
          <button className="btn-sm btn-light" onClick={onReset}>
            Reset All
          </button>
          <button className="btn-sm btn-primary" onClick={onApply}>
            Apply
          </button>
        </div>

      </div>
    </div>
  );

};

export default FilterSidebar;
