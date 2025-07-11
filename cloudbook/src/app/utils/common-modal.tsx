// Refactored CommonModal.tsx with full UI sections for all ledgers
import React, { useState, useMemo } from "react";
import {
  CheckboxGroup,
  Toggle, Input
} from "@/app/utils/form-controls";

interface CommonModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
}

const CommonModal: React.FC<CommonModalProps> = ({ isModalOpen, closeModal }) => {
  const [activeTab, setActiveTab] = useState("Customer Ledger");
  const [name, setName] = useState("");
  const [remarks, setRemarks] = useState("");

  const [tableData, setTableData] = useState([
    { "id": 1, "name": "City 1", "remarks": "Important region", "status": true, "isSelected": false },
    { "id": 2, "name": "City 2", "remarks": "Urban area", "status": false, "isSelected": false },
    { "id": 3, "name": "City 3", "remarks": "-", "status": true, "isSelected": false },
    { "id": 4, "name": "City 4", "remarks": "Important region", "status": false, "isSelected": false },
    { "id": 5, "name": "City 5", "remarks": "Urban area", "status": true, "isSelected": false },
    { "id": 6, "name": "City 6", "remarks": "-", "status": false, "isSelected": false },
    { "id": 7, "name": "City 7", "remarks": "Important region", "status": true, "isSelected": false },
    { "id": 8, "name": "City 8", "remarks": "Urban area", "status": false, "isSelected": false },
    { "id": 9, "name": "City 9", "remarks": "-", "status": true, "isSelected": false },
    { "id": 10, "name": "City 10", "remarks": "Important region", "status": false, "isSelected": false },
    { "id": 11, "name": "City 11", "remarks": "Urban area", "status": true, "isSelected": false },
    { "id": 12, "name": "City 12", "remarks": "-", "status": false, "isSelected": false },
    { "id": 13, "name": "City 13", "remarks": "Important region", "status": true, "isSelected": false },
    { "id": 14, "name": "City 14", "remarks": "Urban area", "status": false, "isSelected": false },
    { "id": 15, "name": "City 15", "remarks": "-", "status": true, "isSelected": false },
    { "id": 16, "name": "City 16", "remarks": "Important region", "status": false, "isSelected": false },
    { "id": 17, "name": "City 17", "remarks": "Urban area", "status": true, "isSelected": false },
    { "id": 18, "name": "City 18", "remarks": "-", "status": false, "isSelected": false },
    { "id": 19, "name": "City 19", "remarks": "Important region", "status": true, "isSelected": false },
    { "id": 20, "name": "City 20", "remarks": "Urban area", "status": false, "isSelected": false },
    { "id": 21, "name": "City 21", "remarks": "-", "status": true, "isSelected": false },
    { "id": 22, "name": "City 22", "remarks": "Important region", "status": false, "isSelected": false },
    { "id": 23, "name": "City 23", "remarks": "Urban area", "status": true, "isSelected": false },
    { "id": 24, "name": "City 24", "remarks": "-", "status": false, "isSelected": false },
    { "id": 25, "name": "City 25", "remarks": "Important region", "status": true, "isSelected": false },
    { "id": 26, "name": "City 26", "remarks": "Urban area", "status": false, "isSelected": false },
    { "id": 27, "name": "City 27", "remarks": "-", "status": true, "isSelected": false },
    { "id": 28, "name": "City 28", "remarks": "Important region", "status": false, "isSelected": false },
    { "id": 29, "name": "City 29", "remarks": "Urban area", "status": true, "isSelected": false },
    { "id": 30, "name": "City 30", "remarks": "-", "status": false, "isSelected": false }
  ]
  );


  const mandatoryFieldList = [
    "Ledger Name",
    "Contact Type",
    "Group",
    "Phone Number",
    "Company Name",
    "Billing Address",
    "State",
    "Pincode"
  ];

  const [mandatoryFields, setMandatoryFields] = useState<Record<string, boolean>>(
    mandatoryFieldList.reduce((acc, field) => {
      acc[field] = false; 
      return acc;
    }, {} as Record<string, boolean>)
  );


  const handleMandatoryToggle = (field: string) => {
    setMandatoryFields((prev) => ({
      ...prev,
      [field]: !prev[field]
    }));
  };


  const uniqueFieldList = ["Email", "Customer ID"];

  const [uniqueFields, setUniqueFields] = useState<Record<string, boolean>>(
    uniqueFieldList.reduce((acc, field) => {
      acc[field] = false; 
      return acc;
    }, {} as Record<string, boolean>)
  );


  const handleUniqueToggle = (field: string) => {
    setUniqueFields((prev) => ({
      ...prev,
      [field]: !prev[field]
    }));
  };


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
      prevData.map((row) => (row.id === id ? { ...row, status: !row.status } : row))
    );
  };

  const handleRowCheckboxChange = (rowId: number, selectedValues: string[]) => {
    const isChecked = selectedValues.includes(String(rowId));
    setTableData((prevData) =>
      prevData.map((row) => (row.id === rowId ? { ...row, isSelected: isChecked } : row))
    );
  };

  const handleSelectAllChange = (selectedValues: string[]) => {
    const checked = selectedValues.includes("selectAll");
    setTableData((prevData) => prevData.map((row) => ({ ...row, isSelected: checked })));
  };

  const renderLedgerFormAndList = (ledgerName: string) => (
    <div className="flex flex-col md:flex-row gap-6 h-full">
      <div className="md:w-1/3 bg-white rounded-sm border border-gray-200 ">


        <div className="flex items-center rounded-t-sm bg-gray-50 border-b  px-4 py-3">
          <div>
            <h6 className="  text-green-800"><i className="ri-add-large-line mr-0.5  text-lg"></i> New {ledgerName} Entry</h6>

          </div>

        </div>
        <div className=" space-y-4 p-4">
          <div>
            <label className="form-label mb-1">Name<span className="text-red-500">*</span></label>
            <Input
              name="ledgername"
              type="text"
              placeholder="Enter Name"
              className=""
            />
          </div>
          <div>
            <label className="form-label mb-1">Remarks</label>
            <textarea
              placeholder="Enter remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="form-control !h-[100px]"
            />
          </div>
          <div className="flex items-center justify-end pt-4 space-x-2">
            <button onClick={handleSaveUpdate} className="btn-sm btn-primary">
              <i className="ri-save-line mr-0.5"></i> Save & Update
            </button>
            <button onClick={handleRefresh} className="btn-sm btn-light">
              <i className="ri-refresh-line  "></i>
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-sm border border-gray-200 ">
        <div className="flex items-center  bg-[#f0f5f3] border-b rounded-t-sm px-4 py-3">
          <div>
            <h6 className="  text-gray-800"><i className="ri-file-list-2-line mr-1  text-lg"></i>{ledgerName} Entries</h6>

          </div>

        </div>

        <div className="flex items-center justify-between p-4">
          <div>
            <p className="text-sm text-green-900">Manage {ledgerName.toLowerCase()} records</p>

          </div>
          <div className="text-sm  items-center">
            List Count : <span className=" px-2 py-1 bg-purple-500 text-[#fff] rounded text-xs">
              {tableData.length}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto ">
          <div className="max-h-[calc(100vh-287px)] ">
            <table className="w-full h-full overflow-y-auto ">
              <thead className="bg-[#fafcfc] sticky top-0 shadow-[inset_0_1px_0_#efefef,inset_0_-1px_0_#efefef] z-10">
                <tr className="divide-x divide-[#efefef]">

                  <th className="text-center px-2 py-2 text-xs font-medium text-gray-600">
                    <CheckboxGroup
                      name="selectAll"
                      value="selectAll"
                      label=""
                      checked={allRowsSelected}
                      onChange={(e) =>
                        handleSelectAllChange(e.target.checked ? ["selectAll"] : [])
                      }
                    />
                  </th>

                  <th className="text-left px-2 py-2 text-xs font-medium text-gray-600">
                    S.No
                  </th>


                  <th className="text-left px-2 py-2 text-xs font-medium text-gray-600">
                    Name
                  </th>
                  <th className="text-left px-2 py-2 text-xs font-medium text-gray-600">
                    Remarks
                  </th>
                  <th className="text-left px-2 py-2 text-xs font-medium text-gray-600">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="] cursor-pointer">
                {tableData.length > 0 ? (
                  tableData.map((row, index) => (
                    <tr
                      key={row.id}
                      className="hover:bg-[#f8faf9] divide-x divide-[#efefef]"
                    >
                      <td className="px-2 py-2 text-sm text-gray-700 font-medium text-center border-b border-[#efefef]">
                        <CheckboxGroup
                          name={`select_${row.id}`}
                          value={String(row.id)}
                          label=""
                          checked={row.isSelected}
                          onChange={(e) =>
                            handleRowCheckboxChange(row.id, e.target.checked ? [String(row.id)] : [])
                          }
                        />
                      </td>

                      <td className="px-2 py-2 border-b border-[#efefef]">
                        <div className="text-sm text-gray-900">{index + 1}</div>
                      </td>

                      <td className="px-2 py-2 border-b border-[#efefef]">
                        <div>
                          <div className="text-sm font-medium">{row.name}</div>
                        </div>
                      </td>

                      <td className="px-2 py-2 border-b border-[#efefef]">
                        <div className="text-sm text-gray-600">{row.remarks}</div>
                      </td>

                      <td className="px-2 py-2 border-b border-[#efefef]">
                        <div className="text-sm text-gray-600">
                          <Toggle
                            name="status"
                            checked={row.status}
                            onChange={() => handleToggleStatus(row.id)}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="p-4 text-center text-gray-500">
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>







      </div>
    </div >
  );

  const renderMandatoryFieldsUI = () => (
    <div className="grid grid-cols-3 space-x-10">
      <div>
        <h3 className="text-md font-semibold text-gray-700 mb-4 pb-1.5 border-b-2 border-gray-300">Mandatory Fields</h3>
        <ul className="space-y-4 text-[15px]">
          {mandatoryFieldList.map((field) => (
            <li key={field} className="flex items-center gap-2">
              <Toggle
                name={field}
                checked={mandatoryFields[field]}
                onChange={() => handleMandatoryToggle(field)}
              />
              <span>{field}</span>
               <span><i className="ri-information-2-fill text-[16px] text-[#bdbbbc] cursor-pointer"></i></span>
            </li>
          ))}
        </ul>

      </div>
      <div>
        <h3 className="text-md font-semibold text-gray-700 mb-4 pb-1.5  border-b-2 border-gray-300">Unique Fields</h3>
        <ul className="space-y-4 text-[15px]">
          {uniqueFieldList.map((field) => (
            <li key={field} className="flex items-center gap-2">
              <Toggle
                name={field}
                checked={uniqueFields[field]}
                onChange={() => handleUniqueToggle(field)}
              />
              <span>{field}</span>
              <span><i className="ri-information-2-fill text-[16px] text-[#bdbbbc] cursor-pointer"></i></span>
            </li>
          ))}
        </ul>

      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "Customer Ledger":
      case "Product Ledger":
      case "Expense Ledger":
      case "Unit Ledger":
      case "Bank Accounts":
        return renderLedgerFormAndList(activeTab);
      case "Mandatory Fields":
        return renderMandatoryFieldsUI();
      default:
        return null;
    }
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={closeModal}>
      <div
        className="bg-white rounded-md w-full max-w-[75%] h-[90vh] flex flex-col "
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

        <div className="flex flex-1 overflow-hidden">
          <aside className="w-1/6 bg-gray-100 rounded-bl-md overflow-y-auto">
            <ul className=" text-[14px] text-[#000000]">
              {["Customer Ledger", "Product Ledger", "Expense Ledger", "Unit Ledger", "Bank Accounts", "Mandatory Fields"].map(
                (tab) => (
                  <li
                    key={tab}
                    className={`cursor-pointer px-4 py-3  ${activeTab === tab ? "bg-white " : "hover:bg-gray-200"}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </li>
                )
              )}
            </ul>
          </aside>

          <main className="flex-1 p-6 overflow-y-auto">{renderContent()}</main>
        </div>
      </div>
    </div>
  );
};

export default CommonModal;
