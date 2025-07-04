// CommonModal.tsx
import React, { useState, useMemo } from "react";
import {
  Input,
  RadioGroup,
  CheckboxGroup, // Keep this import
  Toggle,
} from "@/app/utils/form-controls";

interface CommonModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
}

const CommonModal: React.FC<CommonModalProps> = ({
  isModalOpen,
  closeModal,
}) => {
  const [activeTab, setActiveTab] = useState("Customer Ledger");
  const [name, setName] = useState("");
  const [remarks, setRemarks] = useState("");

  const [tableData, setTableData] = useState([
    {
      id: 1,
      sNo: 1,
      name: "Bangalore",
      remarks: "-",
      status: false,
      isSelected: false,
    },
    {
      id: 2,
      sNo: 2,
      name: "Chennai",
      remarks: "South India",
      status: true,
      isSelected: false,
    },
    {
      id: 3,
      sNo: 3,
      name: "Delhi",
      remarks: "-",
      status: false,
      isSelected: false,
    },
    {
      id: 4,
      sNo: 4,
      name: "Mumbai",
      remarks: "Financial Hub",
      status: true,
      isSelected: false,
    },
    {
      id: 5,
      sNo: 5,
      name: "Kolkata",
      remarks: "-",
      status: false,
      isSelected: false,
    },
    {
      id: 6,
      sNo: 6,
      name: "Hyderabad",
      remarks: "IT City",
      status: true,
      isSelected: false,
    },
    {
      id: 7,
      sNo: 7,
      name: "Pune",
      remarks: "-",
      status: false,
      isSelected: false,
    },
    {
      id: 8,
      sNo: 8,
      name: "Ahmedabad",
      remarks: "-",
      status: true,
      isSelected: false,
    },
    {
      id: 9,
      sNo: 9,
      name: "Bangalore",
      remarks: "-",
      status: false,
      isSelected: false,
    },
    {
      id: 10,
      sNo: 10,
      name: "Chennai",
      remarks: "South India",
      status: true,
      isSelected: false,
    },
    {
      id: 11,
      sNo: 11,
      name: "Delhi",
      remarks: "-",
      status: false,
      isSelected: false,
    },
    {
      id: 12,
      sNo: 12,
      name: "Mumbai",
      remarks: "Financial Hub",
      status: true,
      isSelected: false,
    },
    {
      id: 13,
      sNo: 13,
      name: "Kolkata",
      remarks: "-",
      status: false,
      isSelected: false,
    },
    {
      id: 14,
      sNo: 14,
      name: "Hyderabad",
      remarks: "IT City",
      status: true,
      isSelected: false,
    },
    {
      id: 15,
      sNo: 15,
      name: "Pune",
      remarks: "-",
      status: false,
      isSelected: false,
    },
    {
      id: 16,
      sNo: 16,
      name: "Ahmedabad",
      remarks: "-",
      status: true,
      isSelected: false,
    },
  ]);

  // Calculate if all rows are selected
  const allRowsSelected = useMemo(() => {
    return tableData.every((row) => row.isSelected);
  }, [tableData]);

  const handleSaveUpdate = () => {
    console.log("Save & Update:", { name, remarks });
  };

  const handleRefresh = () => {
    console.log("Refreshing data...");
  };

  const handleToggleStatus = (id: number) => {
    setTableData((prevData) =>
      prevData.map((row) =>
        row.id === id ? { ...row, status: !row.status } : row
      )
    );
  };

  // NEW: Handler for the individual row checkboxes using CheckboxGroup
  const handleRowCheckboxChange = (rowId: number, selectedValues: string[]) => {
    // Since each CheckboxGroup here only has one option ({value: rowId}),
    // selectedValues will either be [String(rowId)] (checked) or [] (unchecked).
    const isChecked = selectedValues.includes(String(rowId));

    setTableData((prevData) =>
      prevData.map((row) =>
        row.id === rowId ? { ...row, isSelected: isChecked } : row
      )
    );
  };

  // Handler for the "select all" checkbox in the header
  const handleSelectAllChange = (selectedValues: string[]) => {
    // If 'selectAll' is in the values, it means the checkbox is checked
    const checked = selectedValues.includes("selectAll");
    setTableData((prevData) =>
      prevData.map((row) => ({ ...row, isSelected: checked }))
    );
  };

  if (!isModalOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={closeModal}
    >
      <div
        className="bg-white rounded-[0.5rem] w-full max-w-[85%]  flex flex-col custom-helvetica"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative border-b border-[#dee2e6] px-4 py-2 bg-[#f8f8f8] rounded-tl-md">
          <span className="text-[16px] text-[#212529]">Settings</span>
          <button
            onClick={closeModal}
            className="absolute -top-[10px] -right-[10px] text-gray-500 hover:text-gray-700 bg-[#909090] hover:bg-[#cc0000] rounded-full w-[30px] h-[30px] border-2 border-white cursor-pointer"
          >
            <i className="ri-close-line text-white"></i>
          </button>
        </div>

        <div className="row p-[16px] m-0 flex-1 flex flex-col">
          <div className="grid grid-cols-12 min-h-[calc(100vh-120px)] flex-1">
            <div className="col-span-2 bg-[#f0f0f0] rounded-bl-md -m-4 overflow-y-auto h-[calc(100vh-85px)]">
              <ul className="text-[14px] text-[#000000]">
                {[
                  "Customer Ledger",
                  "Product Ledger",
                  "Expense Ledger",
                  "Unit Ledger",
                  "Bank Accounts",
                  "Mandatory Fields",
                ].map((tab) => (
                  <li
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`cursor-pointer px-4 py-2 ${
                      activeTab === tab ? "bg-white" : ""
                    }`}
                  >
                    <a
                      href="#"
                      className="block px-1 py-1 w-full whitespace-normal"
                      onClick={(e) => e.preventDefault()}
                    >
                      {tab}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-span-10 pl-4 pr-4 -mt-4 -mb-4 -mr-[10px] flex flex-col flex-1">
              <div className="bg-white rounded-md ml-5 my-5 shadow-[0_2px_8px_rgba(60,72,88,0.08)] border border-gray-200">
                <div className=" flex flex-col md:flex-row md:flex-nowrap items-end gap-3 p-6">
                  <div className="w-full md:w-1/3">
                    <div className="relative">
                      <label htmlFor="name" className="form-label">
                        Name<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        placeholder="Enter your name"
                        autoComplete="off"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full form-control"
                      />
                      <div className="text-red-500 absolute top-full left-0 text-xs mt-1"></div>
                    </div>
                  </div>
                  <div className="w-full md:w-1/3">
                    <label htmlFor="remarks" className="form-label">
                      Remarks
                    </label>
                    <input
                      type="text"
                      id="remarks"
                      placeholder="Enter your Remarks"
                      autoComplete="off"
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="w-full form-control"
                    />
                  </div>

                  <div className="w-full md:w-1/3 flex justify-start">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={handleSaveUpdate}
                        className="btn-sm btn-primary"
                      >
                        Save & Update
                      </button>
                      <i
                        onClick={handleRefresh}
                        className="ri-refresh-line text-[#0d6efd] font-semibold text-[18px] cursor-pointer"
                      ></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="ml-5 overflow-hidden rounded-t-lg h-[calc(100vh-277px)] border border-[#ebeff3] ">
                <div className="h-full overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="sticky-table-header">
                      <tr>
                        <th className="th-cell w-[5%] text-left">
                        <CheckboxGroup
        name="features_Heating"
        value="Heating"
        label="Heating"
        checked={allRowsSelected}
        onChange={(e) => handleSelectAllChange(e.target.checked ? ["selectAll"] : [])}
      />
                        </th>
                        <th className="th-cell w-[10%] text-left">
                          <span>S.No</span>
                        </th>
                        <th className="th-cell w-[45%] text-left">
                          <div className="flex items-center justify-between relative">
                            <span className="font-semibold">Name</span>
                            <i
                              className="ri-arrow-down-s-fill text-[12px] dropdown-icon-hover"
                              id="statusDropdownBtn"
                            ></i>
                          </div>
                        </th>
                        <th className="th-cell w-[25%] text-left">Remarks</th>
                        <th className="th-cell w-[15%] text-left">
                          <div className="flex items-center justify-between relative">
                            <span>Status</span>
                            <i
                              className="ri-arrow-down-s-fill text-[12px] dropdown-icon-hover"
                              id="statusDropdownBtn"
                            ></i>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#ebeff3]">
                      {tableData.map((row) => (
                        <tr key={row.id} className="tr-hover group">
                          <td className="td-cell w-[5%]">
                             <CheckboxGroup
        name="features_Heating"
        value="Heating"
        label="Heating"
        checked={row.isSelected}
        onChange={(e) => handleRowCheckboxChange(row.id, e.target.checked ? [String(row.id)] : [])}
      />
                          </td>
                          <td className="td-cell w-[5%]">
                            <span className="float-left">{row.sNo}</span>
                            <span className="float-right">
                              <i className="ri-pencil-fill edit-icon opacity-0 group-hover:opacity-100"></i>
                            </span>
                          </td>
                          <td className="td-cell w-[45%]">
                            <div className="flex items-center justify-between">
                              <span>{row.name}</span>
                            </div>
                          </td>
                          <td className="td-cell w-[25%]">
                            <div className="flex items-center justify-between">
                              <span>{row.remarks}</span>
                            </div>
                          </td>
                          <td className="last-td-cell w-[15%]">
                            <div className="flex items-center">
                              <label className="relative inline-flex items-center mt-1 cursor-pointer">
                                <Toggle
                                  name="status"
                                  checked={row.status}
                                  onChange={() => handleToggleStatus(row.id)}
                                />
                              </label>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="ml-5 bg-[#ebeff3] border-t border-[#ebeff3]  rounded-b-lg">
                <div className="px-3 py-2 text-right text-[14px] text-[#212529]">
                  Total Entries: {tableData.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommonModal;