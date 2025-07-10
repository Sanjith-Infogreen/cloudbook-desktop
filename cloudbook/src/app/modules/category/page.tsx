"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Layout from "../../components/Layout";
import { Input } from "@/app/utils/form-controls";

// FormField and ToggleSwitch components remain the same as they were already consistent.
const FormField = ({
  label,
  required = false,
  children,
  className = "",
  error,
  htmlFor,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  error?: string;
  htmlFor?: string;
}) => (
  <div className={`mb-[10px] flex flex-col md:flex-row md:items-center gap-2 md:gap-4 ${className}`}>
    <label className="form-label w-50" htmlFor={htmlFor}>
      {label}
      {required && <span className="form-required text-red-500">*</span>}{" "}
    </label>
    <div className="flex flex-col w-3/4">
      {children}
      {error && <p className="error-message text-red-500 text-xs mt-1">{error}</p>}
    </div>
  </div>
);

const ToggleSwitch = ({
  isChecked,
  onChange,
  disabled = false,
}: {
  isChecked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) => (
  <label className="inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      className="sr-only"
      checked={isChecked}
      onChange={(e) => onChange(e.target.checked)}
      disabled={disabled}
    />
    <div
      className={`w-8 h-4 rounded-full relative transition-colors duration-300 ${
        isChecked ? "bg-[#008a39]" : "bg-gray-300"
      }`}
    >
      <div
        className={`w-3 h-3 bg-white rounded-full absolute top-0.5 left-0.5 shadow transition-transform duration-300 ease-in-out ${
          isChecked ? "transform translate-x-4" : "transform translate-x-0"
        }`}
      />
    </div>
  </label>
);

const Categories = () => {
  const [activeLedger, setActiveLedger] = useState<string>("customerLedger");
  const [formData, setFormData] = useState({
    name: "",
    remarks: "",
  });
  const [ledgerData, setLedgerData] = useState<any>({});
  const [tableData, setTableData] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const formRef = useRef<HTMLFormElement>(null);

  // State for the search input
  const [menuSearchTerm, setMenuSearchTerm] = useState<string>(""); // New state for menu search

  const titles: { [key: string]: string } = {
    customerLedger: "Customer Ledger",
    productLedger: "Product Ledger",
    unitLedger: "Unit Ledger",
    bankAccounts: "Bank Accounts",
    expenseLedger: "Expense Ledger",
  };

  // Filtered titles based on the search term
  const filteredTitles = Object.keys(titles).filter((key) =>
    titles[key].toLowerCase().includes(menuSearchTerm.toLowerCase())
  );

  // Define a base URL for your JSON server
  const BASE_URL = "http://localhost:4000";

  const fetchData = useCallback(
    async (ledgerName: string) => {
      try {
        const response = await fetch(`${BASE_URL}/${ledgerName}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setLedgerData((prev: any) => ({
          ...prev,
          [ledgerName]: data,
        }));
      } catch (error) {
        console.error(`Error fetching ${ledgerName}:`, error);
      }
    },
    []
  );

  useEffect(() => {
    fetchData(activeLedger);
    setFormData({ name: "", remarks: "" });
    setEditingId(null);
    setFormErrors({});
    // No need to clear menuSearchTerm here, it should persist across ledger changes
  }, [activeLedger, fetchData]);

  useEffect(() => {
    setTableData(ledgerData[activeLedger] || []);
  }, [activeLedger, ledgerData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Handler for menu search input
  const handleMenuSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMenuSearchTerm(e.target.value);
  };

  const validateForm = () => {
    let errors: { [key: string]: string } = {};
    if (!formData.name.trim()) {
      errors.name = "Name is required.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    const url = editingId ? `${BASE_URL}/${activeLedger}/${editingId}` : `${BASE_URL}/${activeLedger}`;
    const method = editingId ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${editingId ? "update" : "add"} item: ${response.statusText}`);
      }

      fetchData(activeLedger);

      setFormData({ name: "", remarks: "" });
      setEditingId(null);
    } catch (error) {
      console.error(`Error ${editingId ? "updating" : "adding"} item:`, error);
    }
  };

  const handleEdit = (item: any) => {
    setFormData({
      name: item.name || "",
      remarks: item.remarks || "",
    });
    setEditingId(item.id);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${BASE_URL}/${activeLedger}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete item: ${response.statusText}`);
      }

      fetchData(activeLedger);

      setFormData({ name: "", remarks: "" });
      setEditingId(null);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    try {
      const itemToUpdate = tableData.find((item) => item.id === id);
      if (!itemToUpdate) return;

      const updatedItem = { ...itemToUpdate, status: !currentStatus };

      const response = await fetch(`${BASE_URL}/${activeLedger}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedItem),
      });

      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.statusText}`);
      }

      fetchData(activeLedger);
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  return (
    <Layout pageTitle="Categories">
      <div className="flex-1">
        <main id="main-content" className="flex-1 overflow-y-auto bg-white">
          <div className="flex">
            <aside className="w-[240px] h-[100vh] bg-[#f8f9fa] border-[#ebeff3] px-3 flex flex-col space-y-4">
              <div className="mt-2">
                <h1 className="text-[18px] sm:text-[20px] font-medium text-[#009333]">Categories</h1>
              </div>
              <div className="relative ">
                <div className="flex items-center overflow-hidden ">
                  <i className="ri-search-line absolute left-2 text-sm"></i>
                  <Input
                    type="text"
                    placeholder="Search here..."
                    name="menuSearch" // Changed name for clarity
                    id="menuSearch" // Changed id for clarity
                    value={menuSearchTerm}
                    onChange={handleMenuSearchInputChange} // Use the new handler
                    className="capitalize w-full  pl-7"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4 text-sm bg-[#f8f9fa] overflow-y-auto pr-2 max-h-[calc(100vh-110px)]">
                <ul className="flex-1 overflow-y-auto pr-1 space-y-1 py-2 ">
                  {filteredTitles.map((key) => (
                    <li
                      key={key}
                      className={`p-1 cursor-pointer flex items-center gap-2 ${
                        activeLedger === key ? "bg-[#f0f0f0] text-[#009333] rounded-[5px]" : "hover:bg-gray-100"
                      }`}
                      onClick={() => setActiveLedger(key)}
                    >
                      <i className="ri-file-text-line"></i> {titles[key]}
                    </li>
                  ))}
                </ul>
              </div>
            </aside>

            <div className="flex-1 flex flex-col">
              {activeLedger && (
                <div className="px-4 py-2 border-b border-gray-300 bg-white w-full">
                  <h1 className="text-[18px] sm:text-[20px] font-semibold text-[#009333]">
                    {titles[activeLedger]}
                  </h1>
                </div>
              )}

              {activeLedger && (
                <div className="w-full flex justify-center pt-4">
                  <form ref={formRef} onSubmit={handleSubmit} className="p-4 w-full max-w-2xl" autoComplete="off">
                    <FormField label="Name" required error={formErrors.name} htmlFor="nameInput">
                      <Input
                        name="name"
                        id="nameInput"
                        placeholder="Enter name"
                        value={formData.name}
                        onChange={handleInputChange}
                        data-validate="required"
                        className="capitalize w-full"
                      />
                    </FormField>
                    <FormField label="Remarks">
                      <Input
                        name="remarks"
                        placeholder="Enter remarks"
                        value={formData.remarks}
                        onChange={handleInputChange}
                        className="capitalize w-full"
                      />
                    </FormField>

                    <div className="mb-[10px] flex flex-col md:flex-row md:items-start gap-2 md:gap-4">
                      <label className="w-46 text-[14px]"></label>
                      <div className="flex-grow">
                        <button type="submit" className="btn-sm btn-primary disabled:opacity-50">
                          {editingId ? "Update" : "Save"}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {activeLedger && tableData.length > 0 && (
                <div className="mx-2 max-h-[calc(100vh-300px)] flex justify-center overflow-hidden rounded-lg bg-white text-[14px]">
                  <div className="w-full max-w-2xl h-full overflow-y-auto border border-gray-200 rounded-lg shadow-lg">
                    <table className="w-full">
                      <thead className="sticky-table-header bg-gray-100">
                        <tr>
                          <th className="th-cell">S.no</th>
                          <th className="th-cell">Name</th>
                          <th className="th-cell">Remarks</th>
                          <th className="th-cell">Action</th>
                          <th className="th-cell">Status</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {tableData.map((item, index) => (
                          <tr key={item.id}>
                            <td className="td-cell text-center">{index + 1}</td>
                            <td className="td-cell">{item.name || ""}</td>
                            <td className="td-cell">{item.remarks || ""}</td>
                            <td className="td-cell">
                              <button
                                onClick={() => handleEdit(item)}
                                className="text-indigo-600 mr-2"
                                title="Edit"
                              >
                                <i className="ri-pencil-line"></i>
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="text-red-600"
                                title="Delete"
                              >
                                <i className="ri-delete-bin-line"></i>
                              </button>
                            </td>
                            <td className="td-cell text-center">
                              <ToggleSwitch
                                isChecked={item.status !== false}
                                onChange={(checked) => handleToggleStatus(item.id, item.status)}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
};

export default Categories;