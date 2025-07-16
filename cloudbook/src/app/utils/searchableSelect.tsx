"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
const DROPDOWN_HEIGHT_PX = 250;
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
  "data-validate"?: string;
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
  placeholder = "Select an option",
  className = "text-[13px]",
  "data-validate": dataValidate,
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
  const [searchTerm, setSearchTerm] = useState("");
  // Use a Set for efficient management of selected values when `multiple` is true
  const [currentSelection, setCurrentSelection] = useState<Set<string>>(
    new Set()
  );
  const [displayLabel, setDisplayLabel] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1); // New state for keyboard navigation focus
  // New state to track if navigation is happening via keyboard
  const [isKeyboardNavigating, setIsKeyboardNavigating] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const optionsListRef = useRef<HTMLUListElement>(null); // Ref for the options list

  // code for open dropdown over the table open
  const [menuPos, setMenuPos] = useState({ left: 0, top: 0, width: 0 });
  const [mounted, setMounted] = useState(false);
const [openDirection, setOpenDirection] = useState<"top" | "bottom">("bottom");

  /** 1️⃣ When input gains focus or term changes, remember its screen coords */
  const updateMenuPos = () => {
  if (wrapperRef.current) {
    const rect = wrapperRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    const shouldOpenBottom = spaceBelow >= DROPDOWN_HEIGHT_PX;
    const direction: "top" | "bottom" = shouldOpenBottom ? "bottom" : "top";
    setOpenDirection(direction);

    const top = direction === "bottom"
      ? rect.bottom + window.scrollY
      : rect.top+80 + window.scrollY - DROPDOWN_HEIGHT_PX;

    setMenuPos({
      left: rect.left,
      top,
      width: rect.width,
    });
  }
};
  useEffect(updateMenuPos, [searchTerm, isOpen]);
useEffect(() => {
  const handler = () => updateMenuPos();
  window.addEventListener("resize", handler);
  window.addEventListener("scroll", handler, true);
  return () => {
    window.removeEventListener("resize", handler);
    window.removeEventListener("scroll", handler, true);
  };
}, []);
  useEffect(() => {
    setMounted(true);
  }, []);
  // code for open dropdown over the table close

  // Effect to synchronize internal state with initialValue prop
  useEffect(() => {
    if (multiple) {
      if (Array.isArray(initialValue)) {
        setCurrentSelection(new Set(initialValue));
      } else if (typeof initialValue === "string" && initialValue) {
        setCurrentSelection(new Set([initialValue]));
      } else {
        setCurrentSelection(new Set());
      }
    } else {
      setCurrentSelection(
        initialValue ? new Set([initialValue as string]) : new Set()
      );
    }
  }, [initialValue, multiple]);

  // Effect to update the display label for single select or when multiple selections change
  useEffect(() => {
    if (multiple) {
      if (currentSelection.size === 0) {
        setDisplayLabel(null);
      } else if (currentSelection.size === 1) {
        const selectedOption = options.find(
          (opt) => opt.value === Array.from(currentSelection)[0]
        );
        setDisplayLabel(selectedOption?.label || null);
      } else {
        setDisplayLabel(`${currentSelection.size} items selected`);
      }
    } else {
      const selectedOption = options.find(
        (opt) => opt.value === Array.from(currentSelection)[0]
      );
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
      setIsKeyboardNavigating(false); // Reset keyboard navigation flag
    } else if (filteredOptions.length > 0 && focusedIndex === -1) {
      // If opening or options change, try to focus on the current selection or first item
      const currentlySelectedValue = multiple
        ? Array.from(currentSelection)[0]
        : Array.from(currentSelection)[0];
      const initialFocusIndex = filteredOptions.findIndex(
        (opt) => opt.value === currentlySelectedValue
      );
      setFocusedIndex(initialFocusIndex !== -1 ? initialFocusIndex : 0);
    }
  }, [isOpen, filteredOptions, currentSelection, focusedIndex, multiple]);

  // Effect to scroll focused item into view with smooth scrolling
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && optionsListRef.current) {
      const focusedItem = optionsListRef.current.children[
        focusedIndex
      ] as HTMLElement;
      if (focusedItem) {
        focusedItem.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "nearest",
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
        setSearchTerm("");
        if (externalOnChange) {
          externalOnChange(option.value);
        }
        // Close the dropdown
        setIsOpen(false);
        // After closing, ensure the main input element gets focus back
        requestAnimationFrame(() => {
          const mainInput =
            wrapperRef.current?.querySelector('input[type="text"]');
          // Type assertion to tell TypeScript that mainInput is an HTMLInputElement
          if (mainInput instanceof HTMLInputElement) {
            mainInput.focus();
          }
        });
      }
      setIsKeyboardNavigating(false); // Reset keyboard navigation after selection
    },
    [currentSelection, multiple, externalOnChange]
  );

  const handleClear = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      setCurrentSelection(new Set());
      setSearchTerm("");
      if (externalOnChange) {
        externalOnChange(multiple ? [] : null);
      }
    },
    [externalOnChange, multiple]
  );

 const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as Node;
    const dropdown = document.getElementById("searchable-select-dropdown");

    if (
      wrapperRef.current &&
      !wrapperRef.current.contains(target) &&
      (!dropdown || !dropdown.contains(target))
    ) {
      setIsOpen(false);
    }
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;

      // Set keyboard navigation flag when a relevant key is pressed
      if (["ArrowDown", "ArrowUp", "Enter", "Escape"].includes(e.key)) {
        setIsKeyboardNavigating(true);
      }

      if (!isOpen) {
        // If dropdown is closed, open it on ArrowDown, ArrowUp, or Enter
        if (["ArrowDown", "ArrowUp", "Enter"].includes(e.key)) {
          e.preventDefault();
          setIsOpen(true);
          // Set initial focused index if options are available
          if (filteredOptions.length > 0) {
            const initialFocusIndex = filteredOptions.findIndex((opt) =>
              currentSelection.has(opt.value)
            );
            setFocusedIndex(initialFocusIndex !== -1 ? initialFocusIndex : 0);
          }
        }
        return;
      }

      switch (e.key) {
        case "Enter":
          e.preventDefault();
          if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
            handleSelect(filteredOptions[focusedIndex]);
          } else if (filteredOptions.length > 0 && !multiple) {
            // If nothing focused, select first for single-select
            handleSelect(filteredOptions[0]);
          }
          break;
        case "Escape":
          setIsOpen(false);
          setSearchTerm("");
          break;
        case "ArrowDown":
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
        case "ArrowUp":
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
        case "Tab": // Close on tab out
          setIsOpen(false);
          break;
      }
    },
    [
      disabled,
      isOpen,
      filteredOptions,
      handleSelect,
      multiple,
      focusedIndex,
      currentSelection,
    ]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
      setFocusedIndex(0); // Reset focused index on search
      setIsKeyboardNavigating(false); // Reset keyboard navigation when typing in search
    },
    []
  );

  // Handle keyboard events for search input
  const handleSearchKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return;

      // Set keyboard navigation flag when a relevant key is pressed
      if (["ArrowDown", "ArrowUp", "Enter", "Escape"].includes(e.key)) {
        setIsKeyboardNavigating(true);
      }

      switch (e.key) {
        case "Enter":
          e.preventDefault();
          if (focusedIndex >= 0 && filteredOptions[focusedIndex]) {
            handleSelect(filteredOptions[focusedIndex]);
          } else if (filteredOptions.length > 0 && !multiple) {
            handleSelect(filteredOptions[0]);
          }
          break;
        case "Escape":
          setIsOpen(false);
          setSearchTerm("");
          break;
        case "ArrowDown":
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
        case "ArrowUp":
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
        case "Tab":
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
    // When opening/closing with a click, we are not keyboard navigating
    setIsKeyboardNavigating(false);
  }, [disabled, isOpen, searchable]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [handleClickOutside]);

  // Determine if a value is currently selected
  const hasValue = currentSelection.size > 0;

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      {/* The hidden input will hold the actual value(s) for form submission */}
      <input
        type="hidden"
        name={name}
        value={
          multiple
            ? Array.from(currentSelection).join(",")
            : Array.from(currentSelection)[0] || ""
        }
        required={required}
        data-validate={dataValidate}
      />
      <div className="relative w-full" onClick={handleToggle}>
        <input
          id={id}
          type="text"
          readOnly // Keep readOnly if you're using this like a custom select
          value={displayLabel ?? ""}
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          tabIndex={disabled ? -1 : 0}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-labelledby={id}
          className={`
            form-control w-full truncate pr-8 rounded-md px-3 py-2 cursor-pointer
            ${disabled ? "bg-gray-100 cursor-not-allowed opacity-60" : ""}
            ${
              isOpen
                ? "border-[#009333]"
                : error
                ? "border-red-500"
                : "border-gray-300"
            }
            focus:outline-none focus:border-[#009333]
          `}
        />

        {/* Clear Button - Show only if there's a value and not disabled */}
        {hasValue && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label="Clear selection"
          >
            <i className="ri-close-circle-line w-4 h-4"></i>
          </button>
        )}

        {/* Arrow Icon - Show only if there's no value or if the component is disabled */}
        {(!hasValue || disabled) && (
          <i
            className={`ri-arrow-down-s-line absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          ></i>
        )}
      </div>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      {isOpen &&
        mounted &&
        createPortal(
          <div id="searchable-select-dropdown"
            className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg"
            style={{ position: "absolute", ...menuPos, width: menuPos.width }}
          >
            {searchable && (
              <div className="p-2 border-b border-gray-200">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search..."
                  className="form-control w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-[#009333]"
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
                      ${
                        currentSelection.has(option.value)
                          ? "bg-[#E6F5EC] text-gray-900"
                          : "text-gray-900"
                      }
                      ${
                        focusedIndex === index
                          ? "bg-[#ebe8e8]"
                          : !isKeyboardNavigating
                          ? "hover:bg-gray-100"
                          : ""
                      }
                    `}
                      // The li itself still triggers selection for better UX (clicking anywhere on the row)
                      // onClick={() => handleSelect(option)}
                      onMouseDown={(e) => {
                        e.preventDefault(); // keep focus
                        handleSelect(option); // select before outside handler
                      }}
                      // Only update focusedIndex on mouse enter if not keyboard navigating
                      onMouseEnter={() => {
                        if (!isKeyboardNavigating) {
                          setFocusedIndex(index);
                        }
                      }}
                      onMouseLeave={() => {
                        if (!isKeyboardNavigating) {
                          setFocusedIndex(-1);
                        }
                      }}
                      role="option"
                      aria-selected={currentSelection.has(option.value)}
                    >
                      {multiple && (
                        // The checkbox
                        <input
                          type="checkbox"
                          checked={currentSelection.has(option.value)}
                          onChange={() => handleSelect(option)} // <-- Use onChange to toggle selection
                          onClick={(e) => e.stopPropagation()} // Still prevent bubbling
                          className="form-checkbox h-4 w-4 text-[#009333] border-gray-300 rounded focus:ring-[#009333]"
                        />
                      )}
                      {/* The label for the option */}
                      <span className="flex-grow">{option.label}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-3 py-4 text-sm text-gray-500 text-center">
                  {searchTerm ? "No results found" : "No options available"}
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
                      setIsKeyboardNavigating(false); // Reset keyboard navigation after action
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
                        setIsKeyboardNavigating(false); // Reset keyboard navigation after action
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
                      setIsKeyboardNavigating(false); // Reset keyboard navigation after closing
                    }}
                    className="text-gray-600 hover:text-gray-800 p-1 rounded"
                    aria-label="Close"
                  >
                    <i className="ri-close-line"></i>
                  </button>
                </div>
              </div>
            )}
          </div>,
          document.body
        )}
    </div>
  );
};

export default SearchableSelect;
