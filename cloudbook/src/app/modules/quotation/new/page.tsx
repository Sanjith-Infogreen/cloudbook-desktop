"use client";

import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import Layout from "../../../components/Layout"; // Assuming this path is correct

import DatePicker from "@/app/utils/commonDatepicker"; // Assuming this path is correct
import CommonTypeahead from "@/app/utils/commonTypehead"; // Assuming this path is correct
import { useDispatch, useSelector } from "react-redux";
import { setTypeHead } from "@/store/typeHead/typehead"; // Assuming this path is correct
import { AppDispatch, RootState } from "@/store/store"; // Assuming this path is correct
import { Input, Toggle } from "@/app/utils/form-controls"; // Assuming this path is correct
import SearchableSelect, { Option } from "@/app/utils/searchableSelect"; // Assuming this path is correct
import useInputValidation from "@/app/utils/inputValidations"; // Assuming this path is correct

// Define the fields for a product in the quotation
type ProductField =
  | "productName"
  | "mrp"
  | "quantity"
  | "stock" // New field for stock
  | "netRate" // New field for net rate, replaces 'rate' and 'rateIncTax' for table display/calculation
  | "less" // New field for less percentage
  | "discount" // New field for discount
  | "total";

// Interface for a single product entry
interface Product {
  productName: string;
  mrp: string;
  quantity: string;
  stock: string;
  netRate: string;
  less: string;
  discount: string;
  total: string;
}

// Props for the FormField component
interface FormFieldProps {
  label: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
  error?: string;
}

// FormField component for consistent layout of form elements
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

// Main Newquotation component
const Newquotation = () => {
  useInputValidation(); // Custom hook for input validations
  const [date, setDate] = useState<string | undefined>("01/07/2025"); // State for the quotation date
  const dispatch = useDispatch<AppDispatch>(); // Redux dispatch hook
  const typeHead = useSelector((state: RootState) => state.typeHead.typeHead); // Redux selector for typeahead data
  const [selectedquotationType, setSelectedquotationtype] = useState<
    string | null
  >(null); // State for selected quotation type
  const [details, setDetails] = useState<any>(null); // State for supplier details (from typeahead)

  // Options for quotation type dropdown
  const quotationType: Option[] = [
    { value: "cash", label: "Cash" },
    { value: "credit", label: "Credit" },
    { value: "loan", label: "Loan" },
  ];

  const formRef = useRef<HTMLFormElement>(null); // Ref for the form element

  // State for product details, initialized with one empty row
  const [productDetails, setProductDetails] = useState<Product[]>([
    {
      productName: "",
      mrp: "",
      quantity: "",
      stock: "",
      netRate: "",
      less: "",
      discount: "",
      total: "",
    },
  ]);

  const [rateIncTax, setRateIncTax] = useState(false);

  const handleAddRow = () => {
    setProductDetails((prev) => [
      ...prev,
      {
        productName: "",
        mrp: "",
        quantity: "",
        stock: "",
        netRate: "",
        less: "",
        discount: "",
        total: "",
      },
    ]);
  };

  // Function to handle changes in product fields and recalculate total
  const handleProductChange = (
    index: number,
    field: ProductField,
    value: string
  ) => {
    setProductDetails((prev) => {
      const updated = [...prev];
      updated[index][field] = value;

      if (field === "quantity" || field === "netRate") {
        const qty = parseFloat(updated[index].quantity) || 0;
        const netRate = parseFloat(updated[index].netRate) || 0;
        updated[index].total = (qty * netRate).toFixed(2);
      }

      return updated;
    });
  };

  // Function to delete a product row
  const handleDeleteRow = (index: number) => {
    setProductDetails((prev) => prev.filter((_, i) => i !== index));
  };

  // Effect to fetch typeahead data on component mount if not already present
  useEffect(() => {
    if (typeHead.length === 0) {
      fetchTypeHead();
    }
  }, []);

  // Function to fetch typeahead data from an API
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

  // Function to handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const form = formRef.current;
    if (!form) return;

    // Extract form values
    const quotationName =
      (form.elements.namedItem("quotationName") as HTMLInputElement)?.value ||
      "";
    const vehicleNumber =
      (form.elements.namedItem("vehicleNumber") as HTMLInputElement)?.value ||
      "";
    const gstNumber =
      (form.elements.namedItem("GST") as HTMLInputElement)?.value || "";
    const phoneNumber =
      (form.elements.namedItem("phoneno") as HTMLInputElement)?.value || "";
    const ewayBillNumber =
      (form.elements.namedItem("e-way bill number") as HTMLInputElement)
        ?.value || "";
    const reference =
      (form.elements.namedItem("quotationNumber") as HTMLInputElement)?.value ||
      "";
    const dueDays =
      (form.elements.namedItem("dueDays") as HTMLInputElement)?.value || "";
    const quotationAddress =
      (form.elements.namedItem("quotationaddress") as HTMLInputElement)
        ?.value || "";
    const state =
      (form.elements.namedItem("state") as HTMLInputElement)?.value || "";

    // Compile all form data
    const fullFormData = {
      supplier: details, // This was from the commented out section, keeping it for now.
      date,
      quotationType: selectedquotationType, // This was from the commented out section, keeping it for now.
      quotationName,
      vehicleNumber,
      gstNumber,
      phoneNumber,
      ewayBillNumber,
      reference,
      dueDays,
      quotationAddress,
      state,
      productDetails, // Array of product details
    };

    console.log("Full Form Data:", fullFormData);

    // TODO: send fullFormData to your API here
  };

  // Function to handle quotation type change (from the commented out section)
  const handlequotationTypeChange = (value: string | string[] | null) => {
    setSelectedquotationtype(value as string | null);
  };

  // Placeholder function for adding new item (from the commented out section)
  const handleAddNewItem = () => {
    // alert("Add New functionality would go here!"); // Changed from alert to console.log
    console.log("Add New functionality would go here!");
  };

  // Placeholder function for adding new name (from the commented out section)
  const handleAddNewName = () => {
    console.log("Add new name clicked");
    // Handle add new logic here
  };

  // Function to handle selection of a name from typeahead (from the commented out section)
  const handleNameSelect = (item: any) => {
    setDetails(item);
  };

  // Function to update product name when selected from typeahead
  const productChange = (index: number, item: any) => {
    setProductDetails((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        productName: item?.name || "", // assuming your CommonTypeahead returns {name: "..."}
      };
      return updated;
    });
  };

  return (
    <Layout pageTitle="Quotation New">
      <div className="flex-1">
        <main id="main-content" className="flex-1">
          <div className="flex-1 overflow-y-auto h-[calc(100vh-103px)] ">
            <form ref={formRef} onSubmit={handleSubmit} autoComplete="off">
              {/* The following section was commented out in the original code,
                  but its elements (supplier, date, quotationType) are still referenced in handleSubmit.
                  Leaving it commented out as per original provided code, but noting the discrepancy.
              <div className="border-b border-gray-200">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 pt-[10px]">
                  <div className=" lg:pr-4">
                    <FormField label="Supplier Name" required>
                      <CommonTypeahead
                        className="capitalize"
                        name="name"
                        placeholder="Search Name to select"
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
              </div> */}

              <div className="px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
                  <div className="space-y-4 lg:border-r lg:border-gray-200 lg:pr-4">
                    <div className="space-y-4">
                      <FormField label="Name" required>
                        <Input
                          name="quotationName"
                          placeholder="Enter the Name"
                          className="form-control w-full alphanumeric all_uppercase no_space"
                        />
                      </FormField>
                      <FormField label="Vehicle No" required>
                        <Input
                          name="vehicleNumber"
                          placeholder="Enter Vehicle Number"
                          className="form-control w-full all_uppercase alphanumeric no_space "
                        />
                      </FormField>
                      <FormField label="GST" required>
                        <Input
                          name="GST"
                          placeholder="Enter GST Number"
                          className="form-control w-full all_uppercase alphanumeric no_space "
                        />
                      </FormField>
                      <FormField label="Phone Number" required>
                        <Input
                          name="phoneno"
                          placeholder="Enter the Phone Number"
                          className="form-control w-full only_number"
                        />
                      </FormField>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <FormField label="E-way bill Number" required>
                      <Input
                        name="e-way bill number"
                        placeholder="Enter the E-way Bill Number"
                        className="form-control w-full only_number"
                      />
                    </FormField>

                    <FormField label="Reference" required>
                      <Input
                        name="Reference"
                        placeholder="Enter the Reference"
                        className="form-control w-full alphanumeric all_uppercase no_space"
                      />
                    </FormField>

                    <FormField label="Due Days" required>
                      <Input
                        name="dueDays"
                        placeholder="Enter Due Days"
                        className="form-control w-full only_number"
                      />
                    </FormField>
                    <FormField label="Address" required>
                      <Input
                        name="quotationaddress"
                        placeholder="Enter the Address"
                        className="form-control w-full alphanumeric all_uppercase no_space"
                      />
                    </FormField>
                    <FormField label="State" required>
                      <Input
                        name="state"
                        placeholder="Enter State"
                        className="form-control w-full alphanumeric" // Changed to alphanumeric as states can contain spaces
                      />
                    </FormField>
                  </div>
                </div>
               
                <div className="max-h-[calc(100vh-520px)] overflow-y-auto mt-10">
                  <table className="w-full text-[14px]">
                    <thead className="bg-[#f8f9fa] text-left text-[14px] text-[#12344d] sticky-table-header">
                      <tr>
                        <td className="p-2 w-[3%] th-cell ">S.no</td>
                        <td className="p-2 w-[25%]  th-cell ">Product Name</td>
                        <td className="p-2 w-[10%]  th-cell  ">MRP</td>
                        <td className="p-2 w-[10%]  th-cell ">Qty</td>
                        <td className="p-2 w-[5%]  th-cell ">Stock</td>
                        <td className="p-2 w-[10%]  th-cell ">Net Rate</td>
                        <td className="p-2 w-[8%]  th-cell ">Less%</td>
                        <td className="p-2 w-[8%]   th-cell  text-center">
                          Discount
                        </td>
                        <td className="p-2 w-[10%] th-cell text-center">
                          Total
                        </td>
                        <td className="p-2 w-[5%] last-th-cell text-center">
                          Action
                        </td>
                      </tr>
                    </thead>
                    <tbody id="productTableBody">
                      {productDetails.map((product, idx) => (
                        <tr key={idx}>
                          <td className="p-2 text-center w-[3%] td-cell">
                            {idx + 1}
                          </td>

                          <td className="p-2 w-[25%] td-cell">
                            <CommonTypeahead
                              name={`productName-${idx}`}
                              placeholder="Search Name to Select"
                              data={typeHead}
                              required={true}
                              searchFields={["name"]}
                              displayField="name"
                              minSearchLength={1}
                              onAddNew={handleAddNewName}
                              onSelect={(item) => productChange(idx, item)}
                            />
                          </td>

                          <td className="p-2 w-[10%] td-cell">
                            <Input
                              type="text"
                              name={`mrp-${idx}`}
                              className="w-full alphanumeric all_uppercase no_space"
                              placeholder="Enter MRP"
                              value={product.mrp}
                              onChange={(e: any) =>
                                handleProductChange(idx, "mrp", e.target.value)
                              }
                              maxLength={100}
                            />
                          </td>

                          <td className="p-2 w-[10%] td-cell">
                            <Input
                              type="text"
                              name={`quantity-${idx}`}
                              className="w-full only_number"
                              placeholder="Enter Quantity"
                              value={product.quantity}
                              onChange={(e: any) =>
                                handleProductChange(
                                  idx,
                                  "quantity",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          {/* Stock Column */}
                          <td className="p-2 w-[10%] td-cell">
                            <Input
                              type="text"
                              name={`stock-${idx}`}
                              className="w-full only_number"
                              placeholder="Enter Stock"
                              value={product.stock}
                              onChange={(e: any) =>
                                handleProductChange(
                                  idx,
                                  "stock",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          {/* NetRate Column */}
                          <td className="p-2 w-[10%] td-cell">
                            <Input
                              type="text"
                              name={`netRate-${idx}`}
                              className="w-full only_number"
                              placeholder="Enter Netrate"
                              value={product.netRate}
                              onChange={(e: any) =>
                                handleProductChange(
                                  idx,
                                  "netRate",
                                  e.target.value
                                )
                              }
                            />
                          </td>
                          {/* Less% Column */}
                          <td className="p-2 w-[8%] td-cell">
                            <Input
                              type="text"
                              name={`less-${idx}`}
                              className="w-full only_number"
                              placeholder="Enter less"
                              value={product.less}
                              onChange={(e: any) =>
                                handleProductChange(idx, "less", e.target.value)
                              }
                            />
                          </td>

                          {/* Discount Column */}
                          <td className="p-2 w-[8%] td-cell">
                            <Input
                              type="text"
                              name={`discount-${idx}`}
                              className="w-full only_number"
                              placeholder="Enter Discount"
                              value={product.discount}
                              onChange={(e: any) =>
                                handleProductChange(
                                  idx,
                                  "discount",
                                  e.target.value
                                )
                              }
                            />
                          </td>

                          <td className="p-2 w-[10%] text-right td-cell">
                            <Input
                              type="text"
                              name={`total-${idx}`}
                              className="w-full text-right total"
                              placeholder="Auto-calculated Total"
                              value={product.total}
                              readOnly
                            />
                          </td>

                          <td className="p-2 text-center w-[5%] last-td-cell">
                            <button
                              type="button"
                              className="text-red-600 delete-row mx-1 cursor-pointer"
                              onClick={() => handleDeleteRow(idx)}
                            >
                              <i className="ri-delete-bin-line text-[16px]"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <button
                  type="button"
                  onClick={handleAddRow}
                  className="btn-sm btn-primary mt-4 flex items-center gap-1"
                >
                  <i className="ri-add-line  "></i>
                  Add Product
                </button>
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

export default Newquotation;
