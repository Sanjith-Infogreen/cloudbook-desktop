"use client";

import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";
// Assuming these paths are correct relative to your project structure
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

const NewPayment = () => {
  useInputValidation(); // Custom hook for input validation
  const [date, setDate] = useState<string | undefined>("01/07/2025");
  const dispatch = useDispatch<AppDispatch>();
  const typeHead = useSelector((state: RootState) => state.typeHead.typeHead);
  const [details, setDetails] = useState<any>(null); // For supplier details from typeahead

  // New states for the requested fields
  const [name, setName] = useState<string>(""); // New generic name field
  const [remarks, setRemarks] = useState<string>("");
  const [mode, setMode] = useState<string>(""); // Default to Cash
  const [bankAccount, setBankAccount] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>(""); // Main amount field
  const [activeTab, setActiveTab] = useState("traders");
  // State for the table data (bills)
  const [bills, setBills] = useState<BillItem[]>([]);
  const [traderInfo, setTraderInfo] = useState<any>(null); // Initialize as null
  const [transactionsData, setTransactionsData] = useState<any[]>([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const [upiReference, setUpiReference] = useState("");
  const [chequeNumber, setChequeNumber] = useState("");
  const [chequeDate, setChequeDate] = useState<string | undefined>("")

  const formRef = useRef<HTMLFormElement>(null);

  // Sample static JSON data for bills with the new 'purpose' field
  const sampleBills: BillItem[] = [
    {
      id: 1,
      date: "01/01/2025",
      billNumber: "B001",
      purpose: "Sales",
      total: 1500.0,
      paid: 1000.0,
      balance: 500.0,
    },
    {
      id: 2,
      date: "02/15/2025",
      billNumber: "B002",
      purpose: "Delivery",
      total: 2500.5,
      paid: 2000.0,
      balance: 500.5,
    },
    {
      id: 3,
      date: "03/10/2025",
      billNumber: "B003",
      purpose: "Service",
      total: 500.0,
      paid: 500.0,
      balance: 0.0,
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
  }, [typeHead.length]); // Added typeHead.length to dependency array

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
      console.error("Fetch typeahead error:", error);
      // Optionally set an error state for typeahead if needed
    }
  };

  // Effect to fetch trader and transaction data
  useEffect(() => {
    const fetchReceiptData = async () => {
      setLoading(true); // Set loading to true before fetching
      setError(""); // Clear previous errors
      try {
        const [traderRes, transactionsRes] = await Promise.all([
          fetch("http://localhost:4000/traderInfo"),
          fetch("http://localhost:4000/transactionsData"),
        ]);

        if (!traderRes.ok || !transactionsRes.ok) {
          throw new Error("Failed to fetch receipt data");
        }

        const traderData = await traderRes.json();
        const transactionData = await transactionsRes.json();

        setTraderInfo(traderData);
        setTransactionsData(transactionData);
      } catch (err: any) {
        // Type the error as any for console.error
        console.error("Error fetching receipt data:", err);
        setError("Error loading receipt data: " + err.message); // Set specific error message
      } finally {
        setLoading(false); // Set loading to false after fetch completes (success or error)
      }
    };

    fetchReceiptData();
  }, []); // Empty dependency array means this runs once on mount

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
      bills: bills.map((bill) => ({
        ...bill,
        balance: parseFloat(bill.balance as string), // Ensure balance is number
      })),
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

  useEffect(() => {
    console.log(traderInfo);
  }, [traderInfo]);
  // Helper function to get status color and icon
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
      case "completed":
        return {
          color: "text-[#287855] border border-[#c2e9d8] bg-[#eafcf2]",
          icon: "ri-check-line",
        };
      case "inactive":
      case "failed":
        return {
          color: "text-[#b91c1c] border border-[#f5c2c2] bg-[#fee2e2]",
          icon: "ri-close-circle-line",
        };
      case "pending":
        return {
          color: "text-[#d67c1c] border border-[#f3d9a5] bg-[#fff0bf]",
          icon: "ri-time-line",
        };
      default:
        return {
          color: "text-[#4b5563] border border-[#d1d5db] bg-[#f3f4f6]",
          icon: "ri-information-line",
        };
    }
  };

 
  return (
    <Layout pageTitle="Payment New">
      <div className="">
        <main id="main-content" className="flex-1">
          <div className="flex-1 overflow-y-auto h-[calc(100vh-104px)]">
            <form ref={formRef} onSubmit={handleSubmit} autoComplete="off">
              {/* Top section: Supplier Name and Date */}
              {/* <div className="border-b border-gray-300">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-4 py-2 mb-1">
                  <div className="lg:pr-4">
                    <FormField label="Supplier Name" required className="!mb-0">
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
                    <FormField label="" className="w-full lg:w-1/2 !mb-0">
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
              </div> */}

              {/* Middle section: Remarks, Mode, Bank Account, Amount, and Supplier Details */}
              <div className="px-4 py-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-4 lg:pr-4">
                    <FormField label="Date">
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
                    <FormField label="Name">
                      <CommonTypeahead
                        className="capitalize"
                        name="PaymentName"
                        placeholder="Search name"
                        data={typeHead}
                        required={true}
                        searchFields={["name"]}
                        displayField="name"
                        minSearchLength={1}
                        onAddNew={handleAddNewName}
                        onSelect={handleNameSelect}
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
                      <div className="flex flex-wrap">
                        <RadioGroup
                          name="mode"
                          options={[
                            { value: "cash", label: "Cash" },
                            { value: "neft", label: "Neft" },
                            { value: "UPI", label: "UPI" },
                            { value: "Cheque", label: "Cheque" },
                          ]}
                          
                          onChange={(value) => setMode(value.target.value)}
                        />
                      </div>
                    </FormField>
                    {/* Conditional Fields Based on Mode */}
                    {mode === "UPI" && (
                      <FormField label="Reference No" required>
                        <Input
                          name="upiReference"
                          placeholder="Enter UPI reference no"
                          className="form-control w-full"
                          value={upiReference}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setUpiReference(e.target.value)
                          }
                        />
                      </FormField>
                    )}

                    {mode === "Cheque" && (
                      <>
                        <FormField label="Cheque No" required>
                          <Input
                            name="chequeNumber"
                            placeholder="Enter Cheque Number"
                            className="form-control w-full"
                            value={chequeNumber}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => setChequeNumber(e.target.value)}
                          />
                        </FormField>

                        <FormField label="Cheque Date" required>
                          <DatePicker
                            name="chequeDate"
                            id="chequeDate"
                            selected={chequeDate}
                            onChange={(date) =>
                              setChequeDate(date)
                            }
                            className="w-full"
                          />
                        </FormField>
                      </>
                    )}

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
                        className="form-control w-full number_with_decimal" 
                        value={amount}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          handleNumericInputChange(e.target.value, setAmount)
                        }
                      />
                    </FormField>
                  </div>
                  {/* Supplier Details Display */}
                  <div className="space-y-4 lg:pr-1">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                      {/* Header Tabs */}
                      <div className="border-b bg-[#f0f5f3]">
                        <div className="flex items-center">
                          <button
                            className={`px-3 py-2 font-medium border-b-2 cursor-pointer ${
                              activeTab === "traders"
                                ? "border-[#44745c] text-green-900 bg-white"
                                : "border-transparent text-[#666c6a]"
                            }`}
                            onClick={() => setActiveTab("traders")}
                          >
                            Trader's Information
                          </button>
                          <button
                            className={`px-3 py-2 font-medium border-b-2 cursor-pointer ${
                              activeTab === "transactions"
                                ? "border-[#44745c] text-green-900 bg-white"
                                : "border-transparent text-[#666c6a]"
                            }`}
                            onClick={() => setActiveTab("transactions")}
                          >
                            Transactions
                            <span className="ml-2 px-2 py-1 bg-[#d8e2df] text-[#666c6a] rounded text-xs">
                              {transactionsData.length}
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="overflow-x-auto mt-3 h-[calc(100vh-210px)]">
                        {loading ? (
                          <div className="p-4 text-center text-gray-500">
                            Loading trader data...
                          </div>
                        ) : error ? (
                          <div className="p-4 text-center text-red-500">
                            {error}
                          </div>
                        ) : activeTab === "traders" ? (
                          // Check if traderInfo is available after loading and no error
                          traderInfo &&
                          traderInfo.length > 0 &&
                          traderInfo.map((item: any, ind: any) => (
                            <div className="p-4 " key={ind}>
                              {/* Top: Avatar + Name + Email */}
                              <div className="flex items-start gap-3">
                                <div className="w-14 h-14 rounded-full overflow-hidden border border-gray-200">
                                  <img
                                    src="/images/profile-pic.jpg" // Ensure this path is correct and image exists
                                    alt="Trader"
                                    className="w-full h-full object-cover"
                                  />
                                </div>

                                <div className="flex-1">
                                  <h3 className="text-lg font-semibold text-[#080d1b]">
                                    {item.name || "N/A"}
                                  </h3>
                                  <p className="text-sm text-[#191a25] flex items-center gap-1.5">
                                    <i className="ri-mail-line text-base text-gray-500"></i>
                                    {item.email || "N/A"}
                                  </p>
                                  <div className="flex items-center gap-1.5 mt-1 text-sm text-[#080d1b]">
                                    <i className="ri-calendar-line text-base text-gray-500"></i>
                                    <span>
                                      Joined on {item.joinDate || "N/A"}
                                    </span>
                                  </div>

                                  <div className=" flex items-center gap-2 text-sm mt-1 text-green-600 font-medium">
                                    <i className="ri-checkbox-circle-fill text-lg"></i>
                                    <span>{item.status || "N/A"}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Quick Info Badges */}
                              <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                                {/* Phone */}
                                <div className="bg-[#e8f4ff] rounded-lg py-2 px-4 border border-[#b8e1ff]">
                                  <div className="text-[15px] mb-1">Phone</div>
                                  <div className="text-gray-900 font-medium">
                                    {item.phone || "N/A"}
                                  </div>
                                </div>

                                {/* Transactions */}
                                <div className="bg-[#fff7e6] rounded-lg py-2 px-4 border border-[#ffe2b8]">
                                  <div className="text-[15px] mb-1">
                                    Transactions
                                  </div>
                                  <div className="text-blue-600 font-semibold">
                                    {item.totalTransactions || 0}
                                  </div>
                                </div>

                                {/* Amount */}
                                <div className="bg-[#e6f9f1] rounded-lg py-2 px-4 border border-[#b8f0db]">
                                  <div className="text-[15px] mb-1">Amount</div>
                                  <div className="text-green-600 font-semibold">
                                    ₹{item.totalAmount?.toLocaleString() || "0"}
                                  </div>
                                </div>

                                {/* Last Txn */}
                                <div className="bg-[#fdf1f7] rounded-lg py-2 px-4 border border-[#f9cfe1]">
                                  <div className="text-[15px] mb-1">
                                    Last Transaction
                                  </div>
                                  <div className="text-gray-900">
                                    {item.lastTransaction || "N/A"}
                                  </div>
                                </div>
                              </div>

                              {/* Address */}
                              <div className="mt-4 bg-[#f4f4ff] rounded-lg py-3 px-4 text-sm border border-[#d5d5ff]">
                                <div className="mb-1 text-[15px]">Address</div>
                                <div className="text-gray-900">
                                  {item.address || "N/A"}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
 
                           
                          <div className="h-[calc(100vh-210px)] ">
 
                            <table className="w-full h-full overflow-y-auto ">
                              <thead className="bg-[#fafcfc] sticky top-0 shadow-[inset_0_1px_0_#efefef,inset_0_-1px_0_#efefef] z-10">
                                <tr className="divide-x divide-[#efefef]">
                                  <th className="text-left px-2 py-2 text-xs font-medium text-gray-600">
                                    S.No
                                  </th>
                                  <th className="text-left px-2 py-2 text-xs font-medium text-gray-600">
                                    Date
                                  </th>
                                  <th className="text-left px-2 py-2 text-xs font-medium text-gray-600">
                                    Amount
                                  </th>
                                  <th className="text-left px-2 py-2 text-xs font-medium text-gray-600">
                                    Bank
                                  </th>
                                  <th className="text-left px-2 py-2 text-xs font-medium text-gray-600">
                                    Remarks
                                  </th>
                                  <th className="text-left px-2 py-2 text-xs font-medium text-gray-600">
                                    Status
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-[#efefef] cursor-pointer">
                                {transactionsData.length > 0 ? (
                                  transactionsData.map((transaction, index) => (
                                    <tr
                                      key={transaction.id}
                                      className="hover:bg-[#f8faf9] divide-x divide-[#efefef]"
                                    >
                                      <td className="px-2 py-2 text-sm text-gray-700 font-medium text-center w-10">
                                        {index + 1}
                                      </td>

                                      <td className="px-2 py-2">
                                        <div className="text-sm text-gray-900">
                                          {transaction.date}
                                        </div>
                                      </td>
                                      <td className="px-2 py-2">
                                        <div className="font-medium text-sm flex items-center">
                                          <i
                                            className={`mr-1 text-base ${
                                              transaction.type === "Credit"
                                                ? "ri-arrow-down-line text-green-600"
                                                : "ri-arrow-up-line text-red-600"
                                            }`}
                                          ></i>
                                          ₹{transaction.amount.toLocaleString()}
                                        </div>
                                      </td>

                                      <td className="px-2 py-2">
                                        <div>
                                          <div className="text-sm font-medium">
                                            {transaction.bankName}
                                          </div>
                                        </div>
                                      </td>

                                      <td className="px-2 py-2">
                                        <div className="text-sm text-gray-600">
                                          {transaction.remarks}
                                        </div>
                                      </td>

                                      <td className="px-2 py-2">
                                        {(() => {
                                          const { color, icon } =
                                            getStatusColor(transaction.status);
                                          return (
                                            <span
                                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${color}`}
                                            >
                                              <i
                                                className={`text-sm ${icon}`}
                                              ></i>
                                              {transaction.status}
                                            </span>
                                          );
                                        })()}
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td
                                      colSpan={6}
                                      className="p-4 text-center text-gray-500"
                                    >
                                      No transactions found.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              
            </form>
          </div>
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

export default NewPayment;
