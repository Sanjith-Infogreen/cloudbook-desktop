 "use client";

import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import Layout from "../../../components/Layout";

import DatePicker from "@/app/utils/commonDatepicker";
import CommonTypeahead from "@/app/utils/commonTypehead";
import { useDispatch, useSelector } from "react-redux";
import { setTypeHead } from "@/store/typeHead/typehead";
import { AppDispatch, RootState } from "@/store/store";
import { Input, RadioGroup } from "@/app/utils/form-controls";
import SearchableSelect, { Option } from "@/app/utils/searchableSelect";
import useInputValidation from "@/app/utils/inputValidations";

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
  error?: string;
}

// FormField component for consistent styling
const FormField = ({
  label,
  required = false,
  children,
  className = "",
  error,
}: FormFieldProps) => (
  <div
    className={`mb-[10px] flex flex-col md:flex-row md:items-center gap-2 md:gap-4 ${className}`}
  >
    <label className="form-label w-50">
      {label}
      {required && <span className="form-required text-red-500">*</span>}
    </label>
    <div className="flex flex-col w-3/4 flex-grow">
      {children}
      {error && (
        <div className="error-message text-red-500 text-sm mt-1">{error}</div>
      )}
    </div>
  </div>
);

// Define the structure for a bill item
interface BillItem {
  id: number;
  date: string;
  billNumber: string;
  purpose: string; // New field added
  total: number;
  paid: number;
  balance: number | string; // Can be number or empty string for input
}

const NewReceipt = () => {
  useInputValidation(); // Custom hook for input validation
  const [date, setDate] = useState<string | undefined>("01/07/2025");
  const dispatch = useDispatch<AppDispatch>();
  const typeHead = useSelector((state: RootState) => state.typeHead.typeHead);
  const [details, setDetails] = useState<any>(null); // For supplier details from typeahead

  // New states for the requested fields
  const [name, setName] = useState<string>(""); // New generic name field
  const [remarks, setRemarks] = useState<string>("");
  const [mode, setMode] = useState<string>("Cash"); // Default to Cash
  const [bankAccount, setBankAccount] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>(""); // Main amount field

  // State for the table data (bills)
  const [bills, setBills] = useState<BillItem[]>([]);

  const formRef = useRef<HTMLFormElement>(null);

  // Sample static JSON data for bills with the new 'purpose' field
  const sampleBills: BillItem[] = [
    {
      id: 1,
      date: "01/01/2025",
      billNumber: "B001",
      purpose: "Sales",
      total: 1500.00,
      paid: 1000.00,
      balance: 500.00,
    },
    {
      id: 2,
      date: "02/15/2025",
      billNumber: "B002",
      purpose: "Delivery",
      total: 2500.50,
      paid: 2000.00,
      balance: 500.50,
    },
    {
      id: 3,
      date: "03/10/2025",
      billNumber: "B003",
      purpose: "Service",
      total: 500.00,
      paid: 500.00,
      balance: 0.00,
    },
  ];

  // Options for Bank Account dropdown
  const bankAccountOptions: Option[] = [
    { value: "", label: "--Select--" },
    { value: "cash_account", label: "Cash Account" },
    { value: "bank_of_india", label: "Bank of India" },
    { value: "sbi", label: "State Bank of India" },
    // Add more bank accounts as needed
  ];

  // Fetch typeahead data on component mount
  useEffect(() => {
    if (typeHead.length === 0) {
      fetchTypeHead();
    }
  }, []);

  // Function to fetch typeahead data
  const fetchTypeHead = async () => {
    try {
      const res = await fetch("http://localhost:4000/typeHeadData");

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      dispatch(setTypeHead(data));
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const form = formRef.current;
    if (!form) return;

    // Collect all form data including new fields and updated bill balances
    const fullFormData = {
      supplier: details,
      date,
      name, // Generic name field
      remarks,
      mode,
      bankAccount,
      amount: parseFloat(amount), // Convert amount to number
      bills: bills.map(bill => ({
        ...bill,
        balance: parseFloat(bill.balance as string) // Ensure balance is number
      }))
    };

    console.log("Full Form Data:", fullFormData);

    // Add your form submission logic here (e.g., send to API)
    // Using a custom modal/message box instead of alert()
    // For demonstration, a console log is used. In a real app, you'd trigger a modal.
    console.log("Form submitted! Check console for data.");
  };

  // Handle "Add New Name" for supplier typeahead (placeholder for future logic)
  const handleAddNewName = () => {
    console.log("Add new supplier name clicked");
    // Logic to add a new supplier name
  };

  // Handle supplier selection from typeahead
  const handleNameSelect = (item: any) => {
    setDetails(item);
    // Populate bills with sample data when a supplier is selected
    // Create a deep copy to ensure independent state for each bill's balance
    setBills(sampleBills.map((bill) => ({ ...bill })));
  };

  // Handle bank account selection
  const handleBankAccountChange = (value: string | string[] | null) => {
    setBankAccount(value as string | null);
  };

  // Generic handler for numeric inputs (Amount, Balance) to allow only numbers with up to two decimal places
  const handleNumericInputChange = (
    value: string,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    // Regex to allow empty string, or numbers with optional decimal and up to two decimal places
    const regex = /^\d*\.?\d{0,2}$/;
    if (value === "" || regex.test(value)) {
      setter(value);
    }
  };

  // Handler for individual bill balance changes
  const handleBillBalanceChange = (id: number, value: string) => {
    const regex = /^\d*\.?\d{0,2}$/;
    if (value === "" || regex.test(value)) {
      setBills((prevBills) =>
        prevBills.map((bill) =>
          bill.id === id ? { ...bill, balance: value } : bill
        )
      );
    }
  };

  // Calculate total sum of 'Total' and 'Paid' columns
  const totalSum = bills.reduce((sum, bill) => sum + (bill.total || 0), 0);
  const paidSum = bills.reduce((sum, bill) => sum + (bill.paid || 0), 0);

  return (
    <Layout pageTitle="Receipt New">
      <div className="flex-1 flex flex-col">
        <main id="main-content" className="flex-1 overflow-y-auto">
          <form ref={formRef} onSubmit={handleSubmit} autoComplete="off">
            {/* Top section: Supplier Name and Date */}
            <div className="border-b border-gray-300">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 py-2">
                <div className="lg:pr-4">
                  <FormField label="Supplier Name" required>
                    <CommonTypeahead
                      className="capitalize"
                      name="supplierName"
                      placeholder="Enter supplier name"
                      data={typeHead}
                      required={true}
                      searchFields={["name"]}
                      displayField="name"
                      minSearchLength={1}
                      onAddNew={handleAddNewName}
                      onSelect={handleNameSelect}
                    />
                  </FormField>
                </div>
                <div className="space-y-4 flex justify-end">
                  <FormField label="" className="w-full lg:w-1/2">
                    <DatePicker
                      name="date"
                      id="date"
                      selected={date}
                      initialDate={date}
                      onChange={(e) => {
                        setDate(e);
                      }}
                      className="w-full"
                    />
                  </FormField>
                </div>
              </div>
            </div>

            {/* Middle section: Remarks, Mode, Bank Account, Amount, and Supplier Details */}
            <div className="px-4 py-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  {/* New Name Field */}
                  <FormField label="Name">
                    <Input
                      name="receiptName"
                      placeholder="Enter name"
                      className="form-control w-full"
                      value={name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setName(e.target.value)
                      }
                    />
                  </FormField>

                  {/* New Remarks Field */}
                  <FormField label="Remarks">
                    <Input
                      name="remarks"
                      placeholder="Enter remarks"
                      className="form-control w-full"
                      value={remarks}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setRemarks(e.target.value)
                      }
                    />
                  </FormField>

                  {/* New Mode Field (Radio Buttons) */}
                  <FormField label="Mode" required>
                    <div className="flex flex-wrap gap-4">
                       <RadioGroup
                                  name="mode"
                                  options={[
                                    { value: "cash", label: "Cash" },
                                    { value: "cheque", label: "Cheque" },
                                    { value: "neft", label: "NEFT" } 
                                  ]}
                                   
                                />
                    </div>
                  </FormField>

                   
                  <FormField label="Bank Account">
                    <SearchableSelect
                      id="bankAccount"
                      name="bankAccount"
                      options={bankAccountOptions}
                      placeholder="--Select--"
                      onChange={handleBankAccountChange}
                      initialValue={bankAccount}
                    />
                  </FormField>

                  {/* New Amount Field */}
                  <FormField label="Amount" required>
                    <Input
                      name="amount"
                      placeholder="Enter Amount"
                      className="form-control w-full number_with_decimal" // Apply class for styling/validation
                      value={amount}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleNumericInputChange(e.target.value, setAmount)
                      }
                    />
                  </FormField>
                </div>
                {/* Supplier Details Display */}
                <div className="space-y-4   lg:pr-1">
                  <div className="bg-white border border-gray-300 rounded-xl   p-6 h-[175px] overflow-y-auto transition-all duration-200  ">
                    {details && Object.keys(details).length > 0 ? (
                      <div className="text-sm">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-5">
                          {/* Contact Information */}
                          <div className="space-y-4">
                            <div className="group">
                              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                Phone Number
                              </label>
                              <p className="text-gray-900 font-medium text-base leading-tight">
                                {details.phoneNumber}
                              </p>
                            </div>
                            <div className="group">
                              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
                                GST Number
                              </label>
                              <p className="text-gray-900 font-medium text-base leading-tight">
                                {details.gstNumber}
                              </p>
                            </div>
                          </div>

                          {/* Address Information */}
                          <div className="space-y-3">
                            <div className="pb-1 border-b border-gray-200">
                              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                Business Address
                              </label>
                            </div>
                            <div className="space-y-1.5 leading-relaxed">
                              <p className="text-gray-900 font-medium">
                                {details.addressLine1}
                              </p>
                              {details.addressLine2 && (
                                <p className="text-gray-900 font-medium">
                                  {details.addressLine2}
                                </p>
                              )}
                              <div className="flex items-center space-x-2 text-gray-700">
                                <span className="font-medium">
                                  {details.state}
                                </span>
                                <span className="text-gray-400">•</span>
                                <span className="font-medium">
                                  {details.pincode}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col justify-center items-center h-full text-center">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                          <svg
                            className="w-6 h-6 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                            />
                          </svg>
                        </div>
                        <p className="text-gray-500 text-sm font-medium">
                          No supplier selected
                        </p>
                        <p className="text-gray-400 text-xs mt-1">
                          Select a supplier to view details
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bills Table Section */}
            <div className="h-[calc(100vh-422px)] max=h-[calc(100vh-422px)] overflow-y-auto pr-5 pl-4">
              <table className="w-full text-sm">
                <thead className="bg-[#f8f9fa] text-left text-[#12344d] sticky-table-header">
                  {/* Removed whitespace between <tr> and <th> */}
                  <tr>
                    <th className="p-2 w-[3%]">S.no</th>
                    <th className="p-2 w-[20%]">Date</th>
                    <th className="p-2 w-[10%]">Bill Number</th>
                    <th className="p-2 w-[10%]">Purpose</th> {/* New column header */}
                    <th className="p-2 w-[15%]">Total</th>
                    <th className="p-2 w-[14%] text-center">Paid</th>
                    <th className="p-2 w-[10%] text-center">Balance</th>
                  </tr>
                </thead>
                <tbody id="productTableBody">
                  {bills.length > 0 ? (
                    bills.map((bill, index) => (
                      <tr key={bill.id} className="border-b border-gray-200">
                        <td className="pl-2 py-1">{index + 1}</td>
                        <td className="pl-2 py-1">{bill.date}</td>
                        <td className="pl-2 py-1">{bill.billNumber}</td>
                        <td className="pl-2 py-1">{bill.purpose}</td>
                        <td className="pl-2 py-1 text-right">
                          {bill.total.toLocaleString("en-IN", {
                            style: "currency",
                            currency: "INR",
                          })}
                        </td> 
                        <td className="pl-2 py-1 text-right text-[#009333] ">
                          {bill.paid.toLocaleString("en-IN", {
                            style: "currency",
                            currency: "INR",
                          })}
                        </td> 
                        <td className="pl-2 py-1">
                          <Input
                            name={`balance-${bill.id}`}
                            placeholder="Enter Balance"
                            className="form-control number_with_decimal text-right"
                            value={bill.balance.toString()}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleBillBalanceChange(bill.id, e.target.value)
                            }
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-4 text-center text-gray-500">
                        Select a supplier to view bills.
                      </td>
                    </tr>
                  )}
                </tbody>
                {/* Table Footer for Totals */}
                {bills.length > 0 && (
                  <tfoot className="bg-[#f8f9fa] text-left text-[#12344d] font-bold sticky-table-footer">
                    {/* Removed empty line and consolidated td tags */}
                    <tr>
                      <td colSpan={4} className="p-2 text-right">Totals:</td><td className="p-2">
                        {totalSum.toLocaleString("en-IN", {
                          style: "currency",
                          currency: "INR",
                        })}
                      </td><td className="p-2 text-center">
                        {paidSum.toLocaleString("en-IN", {
                          style: "currency",
                          currency: "INR",
                        })}
                      </td><td className="p-2"></td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </form>
        </main>

        {/* Footer with Save and Cancel buttons */}
        <footer className="bg-[#ebeff3] py-3 h-[56.9px] px-4 flex justify-start gap-2">
          <button onClick={handleSubmit} className="btn-sm btn-primary">
            Save
          </button>
          <button className="btn-secondary btn-sm">Cancel</button>
        </footer>
      </div>
    </Layout>
  );
};

export default NewReceipt;
