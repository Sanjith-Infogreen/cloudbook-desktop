"use client";

import { useRef, useState, useEffect } from "react";

interface CommonTypeaheadProps {
  name: string;
  placeholder?: string;
  data: any[]; // Data for the typeahead
  required?: boolean;
  onSelect?: (item: any) => void;
  onAddNew?: () => void;
  className?: string;
  searchFields?: string[];
  displayField?: string;
  minSearchLength?: number;
  [key: string]: any; // Allows for additional props
}

const CommonTypeahead: React.FC<CommonTypeaheadProps> = ({
  name,
  placeholder = "Enter text",
  data = [],
  required = false,
  onSelect,
  onAddNew,
  className = "",
  searchFields = ['name'],
  displayField = 'name',
  minSearchLength = 3,
  ...props
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [hoveredItem, setHoveredItem] = useState<any>(null);
  const [hoveredPosition, setHoveredPosition] = useState({ x: 0, y: 0 });
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [keyboardSelectedIndex, setKeyboardSelectedIndex] = useState(-1);
  const [navigationMode, setNavigationMode] = useState<'mouse' | 'keyboard'>('mouse');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Filter data based on search criteria
  const filterData = (term: string) => {
    if (!term.trim()) return [];

    const searchTerms = term.toLowerCase().split(' ').filter((t: string) => t.length > 0);

    return data.filter(item => {
      return searchFields.some(field => {
        const fieldValue = item[field]?.toLowerCase() || '';

        return searchTerms.every((searchTerm: string) => {
          if (searchTerm.length < minSearchLength) return false;

          const words = fieldValue.split(' ');
          return words.some((word: string) => word.startsWith(searchTerm));
        });
      });
    });
  };

  // Check if current input matches selected item exactly
  const isCurrentInputValid = () => {
    return selectedItem && searchTerm === selectedItem[displayField];
  };

  // Get currently highlighted item (either by mouse or keyboard)
  const getCurrentHighlightedItem = () => {
    if (navigationMode === 'keyboard' && keyboardSelectedIndex >= 0) {
      return filteredData[keyboardSelectedIndex];
    }
    return hoveredItem;
  };

  // Update description card position (fixed position like original)
  const updateDescriptionPosition = () => {
    if (!dropdownRef.current) return;

    const dropdownRect = dropdownRef.current.getBoundingClientRect();
    setHoveredPosition({
      x: dropdownRect.right + 10,
      y: dropdownRect.top + 40
    });
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // If user modifies a previously selected item, clear the selection
    if (selectedItem && value !== selectedItem[displayField]) {
      setSelectedItem(null);
    }

    const filtered = filterData(value);
    setFilteredData(filtered);
    const shouldOpen = value.length >= minSearchLength && filtered.length >= 0;
    setIsDropdownOpen(shouldOpen);

    // Reset keyboard navigation and hover states when input changes
    setKeyboardSelectedIndex(-1);
    setNavigationMode('mouse');

    // Hide description card immediately if dropdown should close
    if (!shouldOpen) {
      setHoveredItem(null);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isDropdownOpen || filteredData.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setNavigationMode('keyboard');
        const nextIndex = keyboardSelectedIndex < filteredData.length - 1 ? keyboardSelectedIndex + 1 : 0;
        setKeyboardSelectedIndex(nextIndex);
        setHoveredItem(filteredData[nextIndex]);
        updateDescriptionPosition();

        // Scroll into view
        if (itemRefs.current[nextIndex]) {
          itemRefs.current[nextIndex]?.scrollIntoView({ block: 'nearest' });
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        setNavigationMode('keyboard');
        const prevIndex = keyboardSelectedIndex > 0 ? keyboardSelectedIndex - 1 : filteredData.length - 1;
        setKeyboardSelectedIndex(prevIndex);
        setHoveredItem(filteredData[prevIndex]);
        updateDescriptionPosition();

        // Scroll into view
        if (itemRefs.current[prevIndex]) {
          itemRefs.current[prevIndex]?.scrollIntoView({ block: 'nearest' });
        }
        break;

      case 'Enter':
        e.preventDefault();
        const itemToSelect = getCurrentHighlightedItem();
        if (itemToSelect) {
          handleItemSelect(itemToSelect);
        }
        break;

      case 'Escape':
        setIsDropdownOpen(false);
        setHoveredItem(null);
        setKeyboardSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle item selection
  const handleItemSelect = (item: any) => {    
    setSelectedItem(item);
    setSearchTerm(item[displayField]);
    setIsDropdownOpen(false);
    setHoveredItem(null);
    setKeyboardSelectedIndex(-1);
    setNavigationMode('mouse');
    onSelect?.(item);
  };

  // Handle clear button click
  const handleClearInput = () => {
    setSearchTerm("");
    setSelectedItem(null);
    setIsDropdownOpen(false);
    setHoveredItem(null);
    setKeyboardSelectedIndex(-1);
    setNavigationMode('mouse');
    inputRef.current?.focus();
  };

  // Handle mouse enter on item
  const handleMouseEnter = (item: any, index: number, event: React.MouseEvent) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    // Switch to mouse navigation mode
    setNavigationMode('mouse');
    setKeyboardSelectedIndex(index);
    updateDescriptionPosition();
    setHoveredItem(item);
  };

  // Handle mouse leave from item
  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      if (navigationMode === 'mouse') {
        setHoveredItem(null);
      }
    }, 100);
  };

  // Handle description card mouse events
  const handleDescriptionMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  };

  const handleDescriptionMouseLeave = () => {
    if (navigationMode === 'mouse') {
      setHoveredItem(null);
    }
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setHoveredItem(null);
        setKeyboardSelectedIndex(-1);
        setNavigationMode('mouse');

        // Clear input if it doesn't match a selected item or if no valid selection
        if (!isCurrentInputValid() && searchTerm.trim() !== "") {
          setSearchTerm("");
          setSelectedItem(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchTerm, selectedItem, isCurrentInputValid, navigationMode]);

  // Reset item refs when filtered data changes
  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, filteredData.length);
  }, [filteredData]);

  // Close description card when dropdown closes
  useEffect(() => {
    if (!isDropdownOpen) {
      setHoveredItem(null);
      setKeyboardSelectedIndex(-1);
      setNavigationMode('mouse');
    }
  }, [isDropdownOpen]);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Input with Typeahead */}
      <div className="relative">
        <input
        autoComplete="off"
          ref={inputRef}
          type="text"
          name={name}
          value={searchTerm}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`form-control w-full pr-8 ${className}`}
          {...(required ? { "data-validate": "required" } : {})}
          {...props}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
          {searchTerm ? (
            <i
              className="ri-close-circle-fill text-gray-600 "
              onClick={handleClearInput}
            ></i>
          ) : (
            <i className="ri-arrow-down-s-line text-gray-600"></i>
          )}
        </div>
      </div>

      {/* Dropdown */}
      {isDropdownOpen && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-sm shadow-lg z-50 max-h-64 overflow-hidden flex flex-col">
          {/* Scrollable Suggestions Area */}
          <div className="flex-1 overflow-y-auto py-0">
            {filteredData.length > 0 ? (
              filteredData.map((item: any, index: number) => (
                <div
                  key={item.id}
                  ref={el => { itemRefs.current[index] = el; }}
                  className={`px-3 py-2 cursor-pointer text-sm  ${
                    (navigationMode === 'keyboard' && keyboardSelectedIndex === index) ||
                    (navigationMode === 'mouse' && hoveredItem?.id === item.id)
                      ? 'bg-gray-50 text-[#12375d]  font-[700]'
                      : 'hover:bg-gray-50 text-gray-700 '
                  }`}
                  onClick={() => handleItemSelect(item)}
                  onMouseEnter={(e) => handleMouseEnter(item, index, e)}
                  onMouseLeave={handleMouseLeave}
                >
                  {item[displayField]}
                </div>
              ))
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">
                No data found
              </div>
            )}
          </div>

          {/* Fixed Add New Button */}
          {onAddNew && (
            <div className="flex justify-between border-t border-gray-200 px-3 py-2 bg-white">
              <button type="button" onClick={onAddNew} className="flex items-center cursor-pointer gap-1 text-green-600 text-sm ">
                <i className="ri-add-line text-green-600"></i>
                Add New
              </button>
              <i className="ri-refresh-line text-blue-500 cursor-pointer"></i>
            </div>
          )}
        </div>
      )}

      {/* Description Card */}
      {hoveredItem && hoveredItem.description && isDropdownOpen && (
        <div
          className="fixed bg-white border border-gray-200 rounded-sm shadow-lg p-3 z-[60] max-w-xs"
          style={{
            left: `${hoveredPosition.x}px`,
            top: `${hoveredPosition.y}px`,
          }}
          onMouseEnter={handleDescriptionMouseEnter}
          onMouseLeave={handleDescriptionMouseLeave}
        >
          <div className="text-sm">
            <div className="font-bold text-[#12375d] mb-1">
              Name: <span className="font-medium text-[#12375d] mb-1 ms-1">{hoveredItem[displayField]}</span>
            </div>
            {/* Uncomment if you want to show description
            <div className="text-gray-600 text-xs leading-relaxed">
              {hoveredItem.description}
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommonTypeahead;