 'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

export interface Option {
  value: string;
  label: string;
}

interface Props {
  name: string;
  options: Option[];
  required?: boolean;
  searchable?: boolean;
  placeholder?: string;
  className?: string;
  'data-validate'?: string;
  initialValue?: string | string[] | null; // Can be a single string or an array of strings
  onChange?: (selectedValue: string | string[] | null) => void;
  onAddNew?: () => void;
  onRefresh?: () => void;
  disabled?: boolean;
  error?: string;
  id?: string;
  multiple?: boolean; // New prop for multiple selection
}

const SearchableSelect = ({
  name,
  options,
  required = false,
  searchable = false,
  placeholder = 'Select an option',
  className = 'text-[13px]',
  'data-validate': dataValidate,
  initialValue,
  onChange: externalOnChange,
  onAddNew,
  onRefresh,
  disabled = false,
  error,
  id,
  multiple = false, // Default to single selection
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  // Use a Set for efficient management of selected values when `multiple` is true
  const [currentSelection, setCurrentSelection] = useState<Set<string>>(new Set());
  const [displayLabel, setDisplayLabel] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1); // New state for keyboard navigation focus

  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const optionsListRef = useRef<HTMLUListElement>(null); // Ref for the options list

  // Effect to synchronize internal state with initialValue prop
  useEffect(() => {
    if (multiple) {
      if (Array.isArray(initialValue)) {
        setCurrentSelection(new Set(initialValue));
      } else if (typeof initialValue === 'string' && initialValue) {
        setCurrentSelection(new Set([initialValue]));
      } else {
        setCurrentSelection(new Set());
      }
    } else {
      setCurrentSelection(initialValue ? new Set([initialValue as string]) : new Set());
    }
  }, [initialValue, multiple]);

  // Effect to update the display label for single select or when multiple selections change
  useEffect(() => {
    if (multiple) {
      if (currentSelection.size === 0) {
        setDisplayLabel(null);
      } else if (currentSelection.size === 1) {
        const selectedOption = options.find(opt => opt.value === Array.from(currentSelection)[0]);
        setDisplayLabel(selectedOption?.label || null);
      } else {
        setDisplayLabel(`${currentSelection.size} items selected`);
      }
    } else {
      const selectedOption = options.find(opt => opt.value === Array.from(currentSelection)[0]);
      setDisplayLabel(selectedOption?.label || null);
    }
  }, [currentSelection, multiple, options]);

  const filteredOptions = searchable
    ? options.filter((option) =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  // Effect to reset focusedIndex when options change or dropdown closes
  useEffect(() => {
    if (!isOpen) {
      setFocusedIndex(-1);
    } else if (filteredOptions.length > 0 && focusedIndex === -1) {
        // If opening or options change, try to focus on the current selection or first item
        const currentlySelectedValue = multiple ? Array.from(currentSelection)[0] : Array.from(currentSelection)[0];
        const initialFocusIndex = filteredOptions.findIndex(opt => opt.value === currentlySelectedValue);
        setFocusedIndex(initialFocusIndex !== -1 ? initialFocusIndex : 0);
    }
  }, [isOpen, filteredOptions, currentSelection, focusedIndex, multiple]);

  // Effect to scroll focused item into view with smooth scrolling
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && optionsListRef.current) {
      const focusedItem = optionsListRef.current.children[focusedIndex] as HTMLElement;
      if (focusedItem) {
        focusedItem.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'nearest'
        });
      }
    }
  }, [isOpen, focusedIndex]);

  const handleSelect = useCallback(
    (option: Option) => {
      let newSelection: Set<string>;
      if (multiple) {
        newSelection = new Set(currentSelection);
        if (newSelection.has(option.value)) {
          newSelection.delete(option.value);
        } else {
          newSelection.add(option.value);
        }
        setCurrentSelection(newSelection);
        if (externalOnChange) {
          externalOnChange(Array.from(newSelection));
        }
      } else {
        newSelection = new Set([option.value]);
        setCurrentSelection(newSelection);
        setIsOpen(false);
        setSearchTerm('');
        if (externalOnChange) {
          externalOnChange(option.value);
        }
      }
    },
    [currentSelection, multiple, externalOnChange]
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentSelection(new Set());
      setSearchTerm('');
      if (externalOnChange) {
        externalOnChange(multiple ? [] : null);
      }
    },
    [externalOnChange, multiple]
  );

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
      setIsOpen(false);
      setSearchTerm('');
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;

      if (!isOpen) {
        // If dropdown is closed, open it on ArrowDown, ArrowUp, or Enter
        if (['ArrowDown', 'ArrowUp', 'Enter'].includes(e.key)) {
          e.preventDefault();
          setIsOpen(true);
          // Set initial focused index if options are available
          if (filteredOptions.length > 0) {
            const initialFocusIndex = filteredOptions.findIndex(opt => currentSelection.has(opt.value));
            setFocusedIndex(initialFocusIndex !== -1 ? initialFocusIndex : 0);
          }
        }
        return;
      }

      switch (e.key) {
        case 'Enter':
          e.preventDefault();
          if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
            handleSelect(filteredOptions[focusedIndex]);
          } else if (filteredOptions.length > 0 && !multiple) { // If nothing focused, select first for single-select
            handleSelect(filteredOptions[0]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setSearchTerm('');
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (filteredOptions.length > 0) {
            setFocusedIndex((prevIndex) => {
              // Cycle to first option if at the end
              if (prevIndex >= filteredOptions.length - 1) {
                return 0;
              }
              return prevIndex + 1;
            });
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (filteredOptions.length > 0) {
            setFocusedIndex((prevIndex) => {
              // Cycle to last option if at the beginning
              if (prevIndex <= 0) {
                return filteredOptions.length - 1;
              }
              return prevIndex - 1;
            });
          }
          break;
        case 'Tab': // Close on tab out
          setIsOpen(false);
          break;
      }
    },
    [disabled, isOpen, filteredOptions, handleSelect, multiple, focusedIndex, currentSelection]
  );

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setFocusedIndex(0); // Reset focused index on search
  }, []);

  // Handle keyboard events for search input
  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return;

      switch (e.key) {
        case 'Enter':
          e.preventDefault();
          if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
            handleSelect(filteredOptions[focusedIndex]);
          } else if (filteredOptions.length > 0 && !multiple) {
            handleSelect(filteredOptions[0]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setSearchTerm('');
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (filteredOptions.length > 0) {
            setFocusedIndex((prevIndex) => {
              // Cycle to first option if at the end
              if (prevIndex >= filteredOptions.length - 1) {
                return 0;
              }
              return prevIndex + 1;
            });
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (filteredOptions.length > 0) {
            setFocusedIndex((prevIndex) => {
              // Cycle to last option if at the beginning
              if (prevIndex <= 0) {
                return filteredOptions.length - 1;
              }
              return prevIndex - 1;
            });
          }
          break;
        case 'Tab':
          setIsOpen(false);
          break;
      }
    },
    [disabled, filteredOptions, handleSelect, multiple, focusedIndex]
  );

  const handleToggle = useCallback(() => {
    if (disabled) return;
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    if (newIsOpen && searchable) {
      // Focus the search input when opening if searchable
      // Use requestAnimationFrame for better timing with DOM updates
      requestAnimationFrame(() => {
        searchInputRef.current?.focus();
      });
    }
  }, [disabled, isOpen, searchable]);
  
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handleClickOutside]);

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      {/* The hidden input will hold the actual value(s) for form submission */}
      <input
        type="hidden"
        name={name}
        value={multiple ? Array.from(currentSelection).join(',') : Array.from(currentSelection)[0] || ''}
        required={required}
        data-validate={dataValidate}
      />
      <div
        id={id}
        className={`form-control flex items-center justify-between border rounded-md px-3 py-2 cursor-pointer ${
          disabled
            ? 'bg-gray-100 cursor-not-allowed opacity-60'
            : ''
        } ${
          isOpen ? 'ring-0.5' : 'border-gray-300'
        } ${error ? 'border-red-500' : ''}`}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-labelledby={id}
      >
        <span
          className={`flex-1 truncate ${
            currentSelection.size > 0 ? 'text-black' : 'text-gray-500'
          }`}
        >
          {displayLabel || placeholder}
        </span>
        {currentSelection.size > 0 && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label="Clear selection"
          >
            {/* Remix Icon: ri-close-circle-line for clear */}
            <i className="ri-close-circle-line w-4 h-4"></i>
          </button>
        )}
        {/* Remix Icon: ri-arrow-down-s-line for dropdown arrow */}
        <i className={`ri-arrow-down-s-line w-4 h-4 text-gray-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}></i>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg">
          {searchable && (
            <div className="p-2 border-b border-gray-200">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                className="form-control w-full p-2 border border-gray-300 rounded"
                value={searchTerm}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          )}
          <div className="max-h-60 overflow-y-auto scroll-smooth">
            {filteredOptions.length > 0 ? (
              <ul ref={optionsListRef} role="listbox">
                {filteredOptions.map((option, index) => (
                  <li
                    key={option.value}
                    className={`flex items-center gap-2 px-3 py-2 cursor-pointer text-sm transition-colors duration-150 
                      ${currentSelection.has(option.value) ? 'bg-[#E6F5EC] text-gray-900' : 'text-gray-900'} 
                      ${focusedIndex === index ? 'bg-[#ebe8e8]' : 'hover:bg-gray-100'} 
                    `}
                    onClick={() => handleSelect(option)}
                    onMouseEnter={() => setFocusedIndex(index)}  
                    onMouseLeave={() => setFocusedIndex(-1)}  
                    role="option"
                    aria-selected={currentSelection.has(option.value)}
                  >
                    {multiple && (
                      <input
                        type="checkbox"
                        checked={currentSelection.has(option.value)}
                        readOnly // Managed by parent li click
                        className="form-checkbox h-4 w-4 text-[#009333] border-gray-300 rounded focus:ring-[#009333]"
                        onClick={(e) => e.stopPropagation()} // Prevent handleSelect from firing twice
                      />
                    )}
                    {option.label}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-3 py-4 text-sm text-gray-500 text-center">
                {searchTerm ? 'No results found' : 'No options available'}
              </div>
            )}
          </div>
          {(onAddNew || onRefresh) && (
            <div className="flex justify-between items-center p-2 border-t border-gray-200 bg-gray-50">
              {onAddNew && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onAddNew) onAddNew();
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-1 text-sm text-[#009333] hover:text-green-700 font-medium"
                >
                  {/* Remix Icon: ri-add-line */}
                  <i className="ri-add-line w-4 h-4"></i>
                  Add New
                </button>
              )}
              {/* This div ensures both refresh and close icons are grouped on the right */}
              <div className="flex gap-2 ml-auto"> 
                {onRefresh && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onRefresh) onRefresh();
                      setIsOpen(false);
                    }}
                    className="text-blue-600 hover:text-blue-700 p-1 rounded"
                    aria-label="Refresh options"
                  >
                    {/* Remix Icon: ri-refresh-line */}
                    <i className="ri-restart-line"></i>
                  </button>
                )}
                {/* Close Icon (Remix Icon: ri-close-line) */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsOpen(false);
                  }}
                  className="text-gray-600 hover:text-gray-800 p-1 rounded"
                  aria-label="Close"
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;