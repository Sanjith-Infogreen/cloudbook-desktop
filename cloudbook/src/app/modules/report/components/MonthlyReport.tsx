// components/Reports/MonthlyReport.tsx
"use client";

import { RadioGroup } from "@/app/utils/form-controls";
import { useEffect, useState } from "react";

import { Search } from "lucide-react";
import SearchableSelect from "@/app/utils/searchableSelect";
import DatePicker from "@/app/utils/commonDatepicker";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { setMonthlyReports } from "@/store/report/monthlyReport";

// Define the MonthlyReport interface as per AllMonthlyReportList


interface MonthlyReportProps {
  activeReport: string | null;
  activeCategory: string | null;
}

const MonthlyReport: React.FC<MonthlyReportProps> = ({
  activeReport,
  activeCategory,
}) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const [materialType, setMaterialType] = useState<string>("TapiocaRoot"); // Not used in current display, but kept if needed for filtering

  // Filter states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filters, setFilters] = useState<any>({}); // Applied filters
  const [localFilters, setLocalFilters] = useState<any>({}); // Filters being set in the sidebar
  const [fromDate, setFromDate] = useState<string | undefined>(undefined);
  const [toDate, setToDate] = useState<string | undefined>(undefined);

   const [includeTimeDetails, setIncludeTimeDetails] = useState(false);
const dispatch = useDispatch<AppDispatch>();
  const monthlyreport = useSelector(
    (state: RootState) => state.monthlyreport.monthlyreport
  );

  const fetchMonthlyReport = async () => {
    try {
      // setLoading(true);
      // setError(null);

     const res = await fetch("http://localhost:4000/mockMonthlyReportData");

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      dispatch(setMonthlyReports(data))
    } catch (err) {
      console.error("Error fetching MonthlyReport:", err);
      setError("Failed to fetch MonthlyReport");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
   if(monthlyreport.length === 0) fetchMonthlyReport();
  }, []); // Refetch when filters change

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    setSelectedIds(checked ? monthlyreport.map((t) => t.id) : []);
  };

  const handleCheckboxChange = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleRefresh = () => {
    setFilters({}); // Clear filters on refresh
    setLocalFilters({}); // Clear local filters
    fetchMonthlyReport();
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
  };

  const handleClearFilters = () => {
    const clearedFilters = {};
    setLocalFilters(clearedFilters);
    setFilters(clearedFilters);
    setIsSidebarOpen(false); // Close sidebar after clearing
  };


  const handleFilterCheckboxChange = (event: { target: { checked: boolean | ((prevState: boolean) => boolean); }; }) => {
    setIncludeTimeDetails(event.target.checked);
  };

  useEffect(() => {
    setSelectAll(
      monthlyreport.length > 0 && selectedIds.length === monthlyreport.length
    );
  }, [selectedIds, monthlyreport]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        </div>
        <div className="text-lg font-medium text-gray-700">
          Loading MonthlyReport List...
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

  if (monthlyreport.length === 0 && Object.keys(filters).length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500">
          No MonthlyReport data available.
        </div>
      </div>
    );
  } else if (monthlyreport.length === 0 && Object.keys(filters).length > 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="text-lg text-gray-500">
          No MonthlyReport found matching your filters.
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
      <h1 className="text-[18px] sm:text-[20px] font-medium text-[#009333] p-2">{activeReport}</h1>

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

              <div className="relative inline-block">
                <button
                  id="viewModeBtn"
                  className="btn-sm !border-transparent !text-[#384551] hover:bg-[#dce0e5] hover:border-[#ebeff3] text-sm"
                >
                  <i className="ri-layout-5-line"></i>
                </button>
              </div>

              <button
                className="btn-sm !border-transparent !text-[#384551] hover:bg-[#dce0e5] hover:border-[#ebeff3] text-sm"
                id="bulkActionsBtn"
                onClick={() => {
                  setSelectAll(true);
                  setSelectedIds(monthlyreport.map((t) => t.id));
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
            placeholder="Search Month"
            value={localFilters.vehicleNo || ""}
            onChange={(e) =>
              handleLocalFilterChange("vehicleNo", e.target.value)
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
            {selectedIds.length} MonthlyReports selected
          </div>
        )}

        <div className="mx-2 h-[calc(100vh-187px)] overflow-hidden rounded-lg bg-white">
          <div className="h-full overflow-y-auto">
            <table className="w-full">
              <thead className="sticky-table-header">
                <tr>
                  <th className="th-cell" id="checkboxColumn">
                    <input
                      type="checkbox"
                      id="selectAll"
                      className="form-check"
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
                      <span>Month</span>
                      <i className="dropdown-hover ri-arrow-down-s-fill cursor-pointer"></i>
                    </div>
                  </th>
                  <th className="th-cell">
                    <div className="flex justify-between items-center gap-1">
                      <span>Total Leave</span>
                      <i className="dropdown-hover ri-arrow-down-s-fill cursor-pointer"></i>
                    </div>
                  </th>
                  <th className="th-cell">
                    <div className="flex justify-between items-center gap-1">
                      <span>Approved Leave</span>
                      <i className="dropdown-hover ri-arrow-down-s-fill cursor-pointer"></i>
                    </div>
                  </th>

                  <th className="th-cell">
                    <div className="flex justify-between items-center gap-1">
                      <span>Pending Leave</span>
                      <i className="dropdown-hover ri-arrow-down-s-fill cursor-pointer"></i>
                    </div>
                  </th>
                  <th className="th-cell">
                    <div className="flex justify-between items-center gap-1">
                      <span>Rejected Leave</span>
                      <i className="dropdown-hover ri-arrow-down-s-fill cursor-pointer"></i>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {monthlyreport.map((payment, index) => (
                  <tr
                    key={payment.id}
                    className={`group hover:bg-[#f5f7f9] text-sm cursor-pointer ${
                      selectedIds.includes(payment.id)
                        ? "bg-[#e5f2fd] hover:bg-[#f5f7f9]"
                        : ""
                    }`}
                  >
                    <td className="td-cell">
                      <input
                        type="checkbox"
                        className="form-check"
                        checked={selectedIds.includes(payment.id)}
                        onChange={() => handleCheckboxChange(payment.id)}
                      />
                    </td>
                    <td className="td-cell">
                      <span className="float-left">{index + 1}</span>
                      <span className="float-right cursor-pointer">
                        <i className="p-1 rounded border border-[#cfd7df] text-[#4d5e6c] ri-pencil-fill opacity-0 group-hover:opacity-100"></i>
                      </span>
                    </td>
                    <td className="td-cell">{payment.month}</td>
                    <td className="td-cell">{payment.totalLeaves}</td>
                    <td className="td-cell">{payment.approvedLeaves}</td>
                    <td className="td-cell">{payment.pendingLeaves}</td>
                    <td className="td-cell">{payment.rejectedLeaves}</td>
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
          Showing <span className="text-red-600">{monthlyreport.length}</span>{" "}
          of <span className="text-blue-600">{monthlyreport.length}</span>
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
                    maxDate={toDate}
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
                    minDate={fromDate}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

           <div className="mb-4">
              <label className="filter-label">Group</label>
              <SearchableSelect
                name="group"
                options={[]}
                placeholder="Select Group"
                initialValue={localFilters.group}
                onChange={(e)=>setLocalFilters({
                  ...localFilters,
                  group: e? e :""
                })}
              />
            </div>
            <div className="mb-4">
              <label className="filter-label">Section</label>
              <SearchableSelect
                name="section"
                options={[]}
                placeholder="Select Section"
                initialValue={localFilters.section}
                onChange={(e)=>setLocalFilters({
                  ...localFilters,
                  section: e? e :""
                })}
              />
            </div>
            <div className="mb-4">
              <label className="filter-label">Report Type</label>
              <RadioGroup
                name="materialType"
                options={[
                  { value: "sectionWise", label: "Section Wise" },
                  { value: "employeeWise", label: "Employee Wise" },
                ]}
                defaultValue={localFilters.materialType || "sectionWise"}
               onChange={(e) =>
                  setLocalFilters({
                    ...localFilters,
                    materialType: e.target.value,
                  })
                }
              />
            </div>

            <div className="mb-4">
              <div className="flex items-center">
                <input
                type="checkbox"
                id="includeTimeDetails" // Add an ID to link with the label
                name="reportType"
                checked={includeTimeDetails} // Controlled component: checkbox reflects state
                onChange={handleFilterCheckboxChange}
                className="mr-2" // Add some margin to the right of the checkbox
              />
              <label htmlFor="includeTimeDetails" className="text-center text-sm ">
                Include time details in report
              </label>
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

export default MonthlyReport;
