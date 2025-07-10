 // components/Reports/StockValueReport.tsx
"use client";

import { useEffect, useState, useRef } from "react"; 

import DatePicker from "@/app/utils/commonDatepicker";
import { CheckboxGroup } from "@/app/utils/form-controls";

interface StockValueReportProps {
  activeReport: string | null;
  activeCategory: string | null;
}

// Define the interface for a single item in the Product Sales Report list
interface StockValueReportItem {
  id: number;
  customerName: string;
  address: string;
  productName: string;
  quantitySold: number;
  saleDate: string;
  totalAmount: number;
  status: string;
}

// --- START: Move ViewModeDropdown outside StockValueReport ---
const ViewModeDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block">
      <button
        id="viewModeBtn"
        ref={buttonRef} // Assign ref to the button
        className="btn-sm !border-transparent !text-[#384551] hover:bg-[#dce0e5] hover:border-[#ebeff3] text-sm"
        onClick={toggleDropdown}
        aria-haspopup="true" // Indicate that this button controls a popup
        aria-expanded={isOpen} // Indicate whether the popup is currently expanded
      >
        <i className="ri-layout-5-line"></i>
      </button>

      {isOpen && (
        <div
          ref={dropdownRef} // Assign ref to the dropdown content
          className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-11"
          role="menu" // Indicate that this is a menu
          aria-orientation="vertical"
          aria-labelledby="viewModeBtn"
        >
          <div className="py-1">
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
            >
              Option 1
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
            >
              Option 2
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              role="menuitem"
            >
              Option 3
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
// --- END: Moved ViewModeDropdown outside StockValueReport ---


const StockValueReport: React.FC<StockValueReportProps> = ({
  activeReport,
}) => {
  // State to hold the fetched product sales report data
  const [stockValueReport, setStockValueReports] = useState<
    StockValueReportItem[]
  >([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filters, setFilters] = useState<any>({}); // Applied filters
  const [localFilters, setLocalFilters] = useState<any>({}); // Filters being set in the sidebar
  const [fromDate, setFromDate] = useState<string | undefined>(undefined);
  const [toDate, setToDate] = useState<string | undefined>(undefined);

  const fetchProductSalesReport = async () => {
    try {
      setLoading(true); // Set loading to true when fetching starts
      setError(null); // Clear any previous errors

      const res = await fetch(
        "http://localhost:4000/mockProductSalesReportData"
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data: StockValueReportItem[] = await res.json();
      setStockValueReports(data); // Store the fetched data in state

      // Simulate API delay (if needed for testing loading state)
      // await new Promise(resolve => setTimeout(resolve, 1000));

      // Apply filters to mockData (This logic would go here if you were filtering client-side)
    } catch (err: any) {
      console.error("Error fetching StockValueReport:", err);
      setError("Failed to fetch StockValueReport: " + err.message);
    } finally {
      setLoading(false); // Set loading to false when fetching finishes
    }
  };

  useEffect(() => {
    // Only fetch if the stockValueReport array is empty
    if (stockValueReport.length === 0) {
      fetchProductSalesReport();
    }
  }, [stockValueReport]); // Dependency array includes stockValueReport to prevent infinite loops if data changes

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    // Map over the actual data array, not the component name
    setSelectedIds(checked ? stockValueReport.map((t) => t.id) : []);
  };

  const handleCheckboxChange = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleRefresh = () => {
    setFilters({}); // Clear filters on refresh
    setLocalFilters({}); // Clear local filters
    setStockValueReports([]); // Clear current data to force refetch
    fetchProductSalesReport(); // Refetch data
  };

  const handleFilterToggle = () => {
    setIsSidebarOpen(true);
    setLocalFilters(filters); // Initialize local filters with currently applied filters
  };

  const handleFilterClose = () => {
    setIsSidebarOpen(false);
  };

  const handleLocalFilterChange = (key: string, value: string) => {
    setLocalFilters((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    setFilters(localFilters); // Apply the local filters to the main filters state
    setIsSidebarOpen(false);
    // You would typically re-fetch or re-filter data here based on the new 'filters' state
    // For now, we'll just re-fetch the mock data (which doesn't apply filters yet)
    fetchProductSalesReport();
  };

  const handleClearFilters = () => {
    const clearedFilters = {};
    setLocalFilters(clearedFilters);
    setFilters(clearedFilters);
    setIsSidebarOpen(false); // Close sidebar after clearing
    setFromDate(undefined); // Clear date pickers
    setToDate(undefined);

    fetchProductSalesReport(); // Refetch data after clearing filters
  };

  useEffect(() => {
    // Update selectAll state based on current data and selected IDs
    setSelectAll(
      stockValueReport.length > 0 &&
        selectedIds.length === stockValueReport.length
    );
  }, [selectedIds, stockValueReport]); // Depend on selectedIds and stockValueReport

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
        <div className="text-lg font-medium text-gray-700">
          Loading Product Sales Report...
        </div>
        <div className="text-sm text-gray-500">
          Please wait while we fetch the data
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 flex-col">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-2 mb-2">
          <span className="block sm:inline">{error}</span>
          <button
            onClick={handleRefresh}
            className="ml-2 underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Check if stockValueReport is empty after loading and filtering
  if (stockValueReport.length === 0 && Object.keys(filters).length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">
          No Product Sales Report data available.
        </div>
      </div>
    );
  } else if (
    stockValueReport.length === 0 &&
    Object.keys(filters).length > 0
  ) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-lg text-gray-500">
          No Product Sales Report found matching your filters.
        </div>
        <button
          onClick={handleClearFilters}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Clear Filters
        </button>
      </div>
    );
  }

  return (
    <main className="flex-1">
      <h3 className="text-[16px] p-2 sm:text-[16px] font-medium text-[#009333]">
        {activeReport}
      </h3>

      {/* Header Section */}
      <div className="flex justify-between items-center px-1.5 py-1.5 bg-[#ebeff3]">
        <div className="flex items-center space-x-2 ml-2">
          {!selectedIds.length && (
            <>
              <button className="btn-sm !border-[#cfd7df] text-[#12375d] bg-white hover:bg-[#ebeff3] text-sm">
                <i className="ri-table-fill mr-1"></i>
                <span className="text-sm">Table</span>
                <i className="ri-arrow-down-s-line ml-1"></i>
              </button>

              {/* Use the standalone ViewModeDropdown component here */}
              <ViewModeDropdown />

              <button
                className="btn-sm !border-transparent !text-[#384551] hover:bg-[#dce0e5] hover:border-[#ebeff3] text-sm"
                id="bulkActionsBtn"
                onClick={() => {
                  setSelectAll(true);
                  // Map over the actual data array, not the component name
                  setSelectedIds(stockValueReport.map((t) => t.id));
                }}
              >
                <i className="ri-stack-fill mr-1"></i>
                Bulk Actions
              </button>
            </>
          )}

          {selectedIds.length > 0 && (
            <div className="bulk-actions flex items-center space-x-2">
              <button
                className="btn-sm !border-[#cfd7df] text-[#12375d] bg-white hover:bg-[#ebeff3] text-sm"
                id="printBtn"
              >
                <i className="ri-printer-line mr-1"></i>
                Print
              </button>
              <button
                className="btn-sm !border-[#cfd7df] text-[#12375d] bg-white hover:bg-[#ebeff3] text-sm"
                id="summaryBtn"
              >
                <i className="ri-sticky-note-line mr-1"></i>
                Summary
              </button>
              <button
                className="btn-sm !border-[#cfd7df] text-[#12375d] bg-white hover:bg-[#ebeff3] text-sm"
                id="downloadBtn"
              >
                <i className="ri-arrow-down-line mr-1"></i>
                Download
              </button>
              <button
                className="btn-sm !border-[#cfd7df] text-[#12375d] bg-white hover:bg-[#ebeff3] text-sm"
                id="deleteBtn"
              >
                <i className="ri-delete-bin-6-line mr-1"></i>
                Delete
              </button>
              <button
                className="btn-sm !border-[#cfd7df] text-[#12375d] bg-white hover:bg-[#ebeff3] text-sm"
                id="cancelSelectionBtn"
                onClick={() => setSelectedIds([])}
              >
                <i className="ri-close-line mr-1"></i>
                Cancel Bulk Actions
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center relative space-x-2">
            
          <input
            className="form-control !h-[31px]"
            type="text"
            placeholder="Search by Name"  
            value={localFilters.customerName || ""}  
            onChange={
              (e) => handleLocalFilterChange("customerName", e.target.value) 
            }
          />
          <button
            className="btn-sm !border-transparent !text-[#384551] hover:bg-[#dce0e5] hover:border-[#ebeff3] text-sm"
            onClick={handleFilterToggle}
          >
            <i className="ri-sort-desc"></i>
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-[#ebeff3]">
        {selectedIds.length > 1 && (
          <div className="fixed top-42 left-1/2 transform -translate-x-1/2 z-50 badge-selected">
            {selectedIds.length} Product Sales Reports selected
          </div>
        )}

        <div className="mx-2 h-[calc(100vh-187px)] overflow-hidden rounded-lg bg-white">
          <div className="h-full overflow-y-auto">
            <table className="w-full">
              <thead className="sticky-table-header">
                <tr>
                  <th className="th-cell" id="checkboxColumn">
                    <CheckboxGroup
                      name="selectall"
                      value="selectAll"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                  </th>
                  <th className="th-cell">
                    <div className="flex justify-between items-center gap-1">
                      <span>S.No.</span>
                    </div>
                  </th>
                  <th className="th-cell">
                    <div className="flex justify-between items-center gap-1">
                      <span>Customer Name</span>
                      <i className="dropdown-hover ri-arrow-down-s-fill cursor-pointer"></i>
                    </div>
                  </th>
                  <th className="th-cell">
                    <div className="flex justify-between items-center gap-1">
                      <span>Product Name</span>
                      <i className="dropdown-hover ri-arrow-down-s-fill cursor-pointer"></i>
                    </div>
                  </th>
                  <th className="th-cell">
                    <div className="flex justify-between items-center gap-1">
                      <span>Quantity</span>
                      <i className="dropdown-hover ri-arrow-down-s-fill cursor-pointer"></i>
                    </div>
                  </th>

                  <th className="th-cell">
                    <div className="flex justify-between items-center gap-1">
                      <span>Sale Date</span>
                      <i className="dropdown-hover ri-arrow-down-s-fill cursor-pointer"></i>
                    </div>
                  </th>
                  <th className="th-cell">
                    <div className="flex justify-between items-center gap-1">
                      <span>Total Amount</span>
                      <i className="dropdown-hover ri-arrow-down-s-fill cursor-pointer"></i>
                    </div>
                  </th>
                  <th className="th-cell">
                    <div className="flex justify-between items-center gap-1">
                      <span>Status</span>
                      <i className="dropdown-hover ri-arrow-down-s-fill cursor-pointer"></i>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Map over the actual data array, not the component name */}
                {stockValueReport.map((reportItem, index) => (
                  <tr
                    key={reportItem.id}
                    className={`group hover:bg-[#f5f7f9] text-sm cursor-pointer ${
                      selectedIds.includes(reportItem.id)
                        ? "bg-[#e5f2fd] hover:bg-[#f5f7f9]"
                        : ""
                    }`}
                  >
                    <td className="td-cell">
                      <CheckboxGroup
                        name="selectall"
                        value="selectAll"
                        checked={selectedIds.includes(reportItem.id)}
                        onChange={() => handleCheckboxChange(reportItem.id)}
                      />
                    </td>
                    <td className="td-cell">
                      <span className="float-left">{index + 1}</span>
                      <span className="float-right cursor-pointer">
                        <i className="p-1 rounded border border-[#cfd7df] text-[#4d5e6c] ri-pencil-fill opacity-0 group-hover:opacity-100"></i>
                      </span>
                    </td>
                    <td className="td-cell">{reportItem.customerName}</td>
                    <td className="td-cell">{reportItem.productName}</td>
                    <td className="td-cell">{reportItem.quantitySold}</td>
                    <td className="td-cell">{reportItem.saleDate}</td>
                    <td className="td-cell">
                      ₹{reportItem.totalAmount.toFixed(2)}
                    </td>

                    <td className="td-cell">{reportItem.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#ebeff3] py-3 h-[56.9px] px-4 flex items-center justify-start">
        <span className="text-sm">
          Showing{" "}
          <span className="text-red-600">{stockValueReport.length}</span> of{" "}
          <span className="text-blue-600">{stockValueReport.length}</span>
        </span>
      </footer>

      {/* Offcanvas Sidebar (Filters) */}
      <div
        className={`fixed inset-0 z-50 flex justify-end transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-[rgba(0,0,0,0.5)]"
          onClick={handleFilterClose}
        ></div>

        {/* Sidebar Content */}
        <div
          className={`relative w-80 mt-[5.8rem] mb-[0.15rem] rounded-tl-[0.375rem] rounded-bl-[0.375rem] bg-white shadow-[0_4px_16px_#27313a66] transform transition-transform duration-300 ${
            isSidebarOpen ? "translate-x-0" : "translate-x-full"
          } flex flex-col`}
        >
          {/* Header */}
          <div className="py-[0.5rem] px-[0.75rem] border-b border-[#dee2e6] flex justify-between items-center">
            <h5 className="text-sm text-[#12344d]">Add Filters</h5>
            <button
              onClick={handleFilterClose}
              className="text-[#12344d] cursor-pointer"
            >
              <i className="ri-close-line"></i>
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="p-4 overflow-y-auto flex-1">
            <div className="mb-4">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="w-35">
                  <label className="filter-label block mb-1">From Date</label>
                  <DatePicker
                    id="fromDate"
                    name="trip_start_date"
                    placeholder="Select start date"
                    selected={fromDate}
                    onChange={setFromDate}
                    // Max date for "From Date" is "To Date" (if set), otherwise no max.
                    maxDate={toDate ? new Date(toDate) : undefined} // Ensure Date object is passed
                    className="w-full"
                  />
                </div>
                <div className="w-35">
                  <label className="filter-label block mb-1">To Date</label>
                  <DatePicker
                    id="toDate"
                    name="trip_end_date"
                    placeholder="Select end date"
                    selected={toDate}
                    onChange={setToDate}
                    // Min date for "To Date" is "From Date" (if set), otherwise no min.
                    minDate={fromDate ? new Date(fromDate) : undefined} // Ensure Date object is passed
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-2 border-t border-[#dee2e6] flex justify-end gap-2">
            <button className="btn-sm btn-light" onClick={handleClearFilters}>
              Reset All
            </button>
            <button className="btn-sm btn-primary" onClick={handleApplyFilters}>
              Apply
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default StockValueReport;