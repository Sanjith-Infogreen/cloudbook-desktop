// app/expense/new/page.tsx
"use client";

import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import Layout from "../../../components/Layout";

import { useSearchParams } from "next/navigation";
import DatePicker from "@/app/utils/commonDatepicker";
import TableShimmer from "@/app/utils/tableShimmer";
import CommonTypeahead from "@/app/utils/commonTypehead";
import { useDispatch, useSelector } from "react-redux";
import { setTypeHead } from "@/store/typeHead/typehead";
import { AppDispatch, RootState } from "@/store/store";
import { Input } from "@/app/utils/form-controls";
import SearchableSelect, { Option } from "@/app/utils/searchableSelect";

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
  error?: string;
}

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

const NewPurchase = () => {
  // Initialize expenseCategory with an empty string
  const [date, setDate] = useState<string | undefined>("01/07/2025");
  const dispatch = useDispatch<AppDispatch>();
  const typeHead = useSelector((state: RootState) => state.typeHead.typeHead);
  const [selectedPurchaseType, setSelectedPurchasetype] = useState<
    string | null
  >(null);
  const [details, setDetails] = useState<any>(null);
  const purchaseType: Option[] = [
    { value: "cash", label: "Cash" },
    { value: "credit", label: "Crediit" },
    { value: "loan", label: "Loan" },
  ];
  useEffect(() => {
    if (typeHead.length === 0) {
      fetchTypeHead();
    }
  }, []);

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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  };
  const handlePurchaseTypeChange = (value: string | string[] | null) => {
    console.log("Selected Fruit:", value);
    setSelectedPurchasetype(value as string | null);
  };
  const handleAddNewItem = () => {
    alert("Add New functionality would go here!");
  };
  const handleAddNewName = () => {
    console.log("Add new name clicked");
    // Handle add new logic here
  };
  const handleNameSelect = (item: any) => {
    setDetails(item);
  };
  return (
    <Layout pageTitle="Purchase New">
      <div className="flex-1">
        <main id="main-content" className="flex-1">
          <div className="flex-1 overflow-y-auto h-[calc(100vh-103px)]">
            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="border-b border-gray-300">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 py-2">
                  <div className=" lg:pr-4">
                    <FormField label="Supplier Name" required>
                      <CommonTypeahead
                      className="capitalize"
                        name="name"
                        placeholder="Enter name"
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

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 py-6">
                <div className="space-y-4 lg:border-r lg:border-gray-300 lg:pr-4">
                  <div className="bg-white border border-gray-200 rounded-sm shadow-md p-3 h-[175px] overflow-y-auto">
                    {details && Object.keys(details).length > 0 ? (
                      <div className="text-sm text-gray-700 ">
                       
                        {/* Grid for main content */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* Address Block */}
                          <div>
                            <div>
                              <strong>Phone Number:</strong>
                              <p>{details.phoneNumber}</p>
                            </div>
                            <div>
                              <strong>GST Number:</strong>
                              <p>{details.gstNumber}</p>
                            </div>
                          </div>

                          {/* Other Fields Block */}
                          <div className="space-y-3">
                            <h3 className="text-base font-semibold text-gray-800 mb-1">
                              Address
                            </h3>
                            <div className="space-y-1">
                              <div>{details.addressLine1}</div>
                              <div>{details.addressLine2}</div>
                              <div>{details.state}</div>
                              <div>{details.pincode}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-center items-center h-full">
                      <p className="text-gray-500 italic text-center">
                        No supplier selected
                      </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <FormField label="Purchase Type" required>
                    <SearchableSelect
                      id="purchaseType"
                      name="purchaseType"
                      options={purchaseType}
                      placeholder="Select Purchase Type"
                      onChange={handlePurchaseTypeChange}
                      initialValue={selectedPurchaseType}
                      onAddNew={handleAddNewItem}
                    />
                  </FormField>

                  <FormField label="Purchase No" required>
                    <Input
                      name="purchaseNumber"
                      placeholder="Enter Purchase Number"
                      className="form-control w-full capitalize"
                    />
                  </FormField>

                  <FormField label="Vehicle No" required>
                    <Input
                      name="vehicleNumber"
                      placeholder="Enter Vehicle Number"
                      className="form-control w-full all_uppercase"
                    />
                  </FormField>

                  <FormField label="Due Days" required>
                    <Input
                      name="dueDays"
                      placeholder="Enter Due Days"
                      className="form-control w-full all_uppercase"
                    />
                  </FormField>
                </div>
              </div>
            </form>
          </div>
        </main>

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

export default NewPurchase;
