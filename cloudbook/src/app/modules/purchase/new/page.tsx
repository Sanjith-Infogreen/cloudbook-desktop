"use client";
import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import Layout from "../../../components/Layout";
import DatePicker from "@/app/utils/commonDatepicker";
import CommonTypeahead from "@/app/utils/commonTypehead";
import { useDispatch, useSelector } from "react-redux";
import { setTypeHead } from "@/store/typeHead/typehead";
import { AppDispatch, RootState } from "@/store/store";
import { Input, Toggle } from "@/app/utils/form-controls";
import SearchableSelect, { Option } from "@/app/utils/searchableSelect";
import useInputValidation from "@/app/utils/inputValidations";



// Define types for product fields
type ProductField =
  | "productName"
  | "serialNo"
  | "quantity"
  | "rate"
  | "rateIncTax"
  | "gst"
  | "total";

// Interface for a single product
interface Product {
  productName: string;
  serialNo: string;
  quantity: string;
  rate: string;
  rateIncTax: string; // new alternative rate field
  gst: string;
  total: string;
}

// Interface for FormField props
interface FormFieldProps {
  label: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
  error?: string;
  htmlFor?: string;
}

// FormField component for consistent layout and error display
const FormField = ({
  label,
  required = false,
  children,
  className = "",
  error,
  htmlFor,
}: FormFieldProps) => (
  <div
    className={`mb-[10px] flex flex-col md:flex-row md:items-center gap-2 md:gap-4 ${className}`}
  >
    <label htmlFor={htmlFor} className="form-label w-50">
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

// Main NewPurchase component
const NewPurchase = () => {
  // Custom hook for input validation (assuming it handles the class names like 'only_number', 'all_uppercase' etc.)
  useInputValidation();

  // State for the purchase date
  const [date, setDate] = useState<string | undefined>("01/07/2025");

  // Redux hooks for dispatching actions and selecting state
  const dispatch = useDispatch<AppDispatch>();
  const typeHead = useSelector((state: RootState) => state.typeHead.typeHead);

  // State for selected purchase type
  const [selectedPurchaseType, setSelectedPurchasetype] = useState<
    string | null
  >(null);

  // State for supplier details (now directly input)
  const [tempAddress, setTempAddress] = useState({
    name: "",
    phoneNumber: "",
    address: "",
    state: "",
    gstNumber: "",
    place: "",
    transportMode: "",
    billNumber: "",
    vehicleNumber:"",
  });

  // Options for purchase type dropdown
  const purchaseType: Option[] = [
    { value: "cash", label: "Cash" },
    { value: "credit", label: "Credit" },
    { value: "loan", label: "Loan" },
  ];

  // Options for state dropdown (example: Tamil Nadu)
  const stateOptions: Option[] = [{ value: "Tamil Nadu", label: "Tamil Nadu" }];

  // Ref for the form element to access form data directly
  const formRef = useRef<HTMLFormElement>(null);

  // State for product details table
  const [productDetails, setProductDetails] = useState<Product[]>([
    {
      productName: "",
      serialNo: "",
      quantity: "",
      rate: "",
      rateIncTax: "",
      gst: "",
      total: "",
    },
  ]);

  // State for toggling between rate including tax or excluding tax
  const [rateIncTax, setRateIncTax] = useState(false);

  // Handle change for the state field in supplier details
  const handleTabStateChange = (value: string | string[] | null) => {
    setTempAddress((prev) => ({
      ...prev,
      state: value as string,
    }));
  };

  // Handle general input changes for supplier details
  const handleTempAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Add a new row to the product details table
  const handleAddRow = () => {
    setProductDetails((prev) => [
      ...prev,
      {
        productName: "",
        serialNo: "",
        quantity: "",
        rate: "",
        rateIncTax: "",
        gst: "",
        total: "",
      },
    ]);
  };

  // Handle changes in product fields and recalculate total
  const handleProductChange = (
    index: number,
    field: ProductField,
    value: string
  ) => {
    setProductDetails((prev) => {
      const updated = [...prev];
      updated[index][field] = value;

      // Recalculate total if quantity and rate (or rateIncTax) are present
      const qty = parseFloat(updated[index].quantity) || 0;
      let rateToUse = 0;

      if (rateIncTax) {
        rateToUse = parseFloat(updated[index].rateIncTax) || 0;
      } else {
        rateToUse = parseFloat(updated[index].rate) || 0;
      }

      // Calculate total: quantity * rate
      updated[index].total = (qty * rateToUse).toFixed(2);

      return updated;
    });
  };

  // Delete a row from the product details table
  const handleDeleteRow = (index: number) => {
    setProductDetails((prev) => prev.filter((_, i) => i !== index));
  };

  // Fetch typeahead data on component mount if not already present
  useEffect(() => {
    if (typeHead.length === 0) {
      fetchTypeHead();
    }
  }, []);

  // Function to fetch typeahead data from API
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

  const form = formRef.current;
  if (!form) return;

  // Compile all form data
  const fullFormData = {
    // Supplier/Customer Details (from the left column in the image)
    supplier: {
      name: tempAddress.name || "",
      phoneNumber: tempAddress.phoneNumber || "",
      address: tempAddress.address || "",
      state: tempAddress.state || "",
      gstNumber: tempAddress.gstNumber || "",
    },
    // Purchase/Sales Return Details (from the right column in the image)
    billNumber: tempAddress.billNumber || "",
    place: tempAddress.place || "",
    transportMode: tempAddress.transportMode || "",
    vehicleNumber: tempAddress.vehicleNumber || "", // Ensure 'vehicleNumber' is correctly used if that's the key in tempAddress

   

    productDetails: productDetails, // Array of product details
  };

  console.log("Full Form Data:", fullFormData);

  // TODO: send fullFormData to your API here
};

  // Handle purchase type selection change
  const handlePurchaseTypeChange = (value: string | string[] | null) => {
    setSelectedPurchasetype(value as string | null);
  };

  // Placeholder for "Add New Item" functionality
  const handleAddNewItem = () => {
    console.log("Add New functionality would go here!");
  };

  // Placeholder for "Add New Name" functionality (for product typeahead)
  const handleAddNewName = () => {
    console.log("Add new name clicked for product");
    // Handle add new logic here
  };

  // Handle product selection from typeahead
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
    <Layout pageTitle="Purchase New">
      <div className="flex-1">
        <main id="main-content" className="flex-1">
          <div className="flex-1 overflow-y-auto h-[calc(100vh-103px)] ">
            <form ref={formRef} onSubmit={handleSubmit} autoComplete="off">
              {/* Supplier and Purchase Details Section */}
              <div className="px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
                  {/* Left Column: Supplier Details */}
                  <div className="space-y-4 lg:border-r lg:border-gray-300 lg:pr-4">
                    <FormField label="Name" required htmlFor="name">
                      <Input
                        name="name"
                        placeholder="Enter the Name"
                        className="form-control w-full alphanumeric all_uppercase no_space"
                        value={tempAddress.name}
                        onChange={handleTempAddressChange}
                      />
                    </FormField>

                    <FormField label="Phone Number" required htmlFor="phoneNumber">
                      <Input
                        name="phoneNumber"
                        placeholder="Enter Phone Number"
                        className="form-control w-full only_number"
                        value={tempAddress.phoneNumber}
                        onChange={handleTempAddressChange}
                        maxLength={10} // Assuming 10 digit phone number
                      />
                    </FormField>

                    <FormField label="Address" required htmlFor="address">
                      <Input
                        name="address"
                        placeholder="Enter the Address"
                        className="form-control w-full all_uppercase alphanumeric"
                        value={tempAddress.address}
                        onChange={handleTempAddressChange}
                      />
                    </FormField>

                    <FormField label="State" required htmlFor="state">
                      <SearchableSelect
                        name="state"
                        options={stateOptions}
                        placeholder="Select State"
                        searchable
                        onChange={handleTabStateChange}
                        initialValue={tempAddress.state}
                      />
                    </FormField>

                    <FormField label="GST Number" required htmlFor="gstNumber">
                      <Input
                        name="gstNumber"
                        placeholder="Enter GST Number"
                        className="form-control w-full alphanumeric all_uppercase no_space"
                        value={tempAddress.gstNumber}
                        onChange={handleTempAddressChange}
                        maxLength={15} // Standard GST number length
                      />
                    </FormField>
                  </div>

                  {/* Right Column: Purchase Details */}
                  <div className="space-y-4 ">
                   

                    <FormField label="Bill Number" required htmlFor="billNumber">
                      <Input
                        name="billNumber"
                        placeholder="Enter Bill Number"
                        className="form-control w-full alphanumeric all_uppercase no_space"
                        value={tempAddress.billNumber}
                        onChange={handleTempAddressChange}
                      />
                    </FormField>

                    <FormField label="Place" required htmlFor="place">
                      <Input
                        name="place"
                        placeholder="Enter Place"
                        className="form-control w-full all_uppercase alphanumeric"
                        value={tempAddress.place}
                        onChange={handleTempAddressChange}
                      />
                    </FormField>

                    <FormField label="Transport Mode" required htmlFor="transportMode">
                      <Input
                        name="transportMode"
                        placeholder="Enter Transport Mode"
                        className="form-control w-full all_uppercase alphanumeric"
                        value={tempAddress.transportMode}
                        onChange={handleTempAddressChange}
                      />
                    </FormField>

                    <FormField label="Vehicle Number" required htmlFor="vehicleNumber">
                      <Input
                        name="vehicleNumber"
                        placeholder="Enter Vehicle Number"
                        className="form-control w-full all_uppercase alphanumeric no_space"
                        value={tempAddress.vehicleNumber}
                        onChange={handleTempAddressChange}
                      />
                    </FormField>

                   
                  </div>
                </div>

                {/* Product Details Section */}
                <h2 className="text-lg text-[#009333] mt-5 mb-4">
                  Product Details
                </h2>
                <div className="max-h-[calc(100vh-520px)] overflow-y-auto">
                  <table className="w-full text-[14px] text-sm">
                    <thead className="bg-[#f8f9fa] text-left  text-[#12344d] sticky-table-header">
                      <tr>
                        <td className="p-2 w-[3%] th-cell">S.no</td>
                        <td className="p-2 w-[25%] th-cell">Product Name</td>
                        <td className="p-2 w-[15%] th-cell">Serial No</td>
                        <td className="p-2 w-[10%] th-cell">Quantity</td>
                        <td className="p-2 w-[15%] th-cell">
                          <div className="flex gap-2">
                            <span className="text-sm font-medium text-gray-700 ">
                              Rate {rateIncTax ? "(Inc tax)" : "(Exc tax)"}
                            </span>
                            <Toggle
                              name="rate"
                              checked={rateIncTax}
                              onChange={(e) => setRateIncTax(e.target.checked)}
                            />
                          </div>
                        </td>
                        <td className="p-2 w-[10%] th-cell">GST</td>
                        <td className="p-2 w-[12%] th-cell text-center">Total</td>
                        <td className="p-2 w-[7%] last-th-cell text-center">Action</td>
                      </tr>
                    </thead>
                    <tbody id="productTableBody">
                      {productDetails.map((product, idx) => (
                        <tr key={idx}>
                          <td className="p-2 text-center w-[3%] td-cell">{idx + 1}</td>
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
                          <td className="p-2 w-[15%] td-cell">
                            <Input
                              type="text"
                              name={`serialNo-${idx}`}
                              className="w-full alphanumeric all_uppercase no_space"
                              placeholder="Enter Serial No"
                              value={product.serialNo}
                              onChange={(e: any) =>
                                handleProductChange(
                                  idx,
                                  "serialNo",
                                  e.target.value
                                )
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
                          <td className="p-2 w-[15%] td-cell">
                            {rateIncTax ? (
                              <Input
                                type="text"
                                name={`rateIncTax-${idx}`}
                                className="w-full only_number"
                                placeholder="Enter Rate with tax"
                                value={product.rateIncTax}
                                onChange={(e: any) =>
                                  handleProductChange(
                                    idx,
                                    "rateIncTax",
                                    e.target.value
                                  )
                                }
                              />
                            ) : (
                              <Input
                                type="text"
                                name={`rate-${idx}`}
                                className="w-full only_number"
                                placeholder="Enter Rate without tax"
                                value={product.rate}
                                onChange={(e: any) =>
                                  handleProductChange(
                                    idx,
                                    "rate",
                                    e.target.value
                                  )
                                }
                              />
                            )}
                          </td>
                          <td className="p-2 w-[10%] td-cell">
                            <Input
                              type="text"
                              name={`gst-${idx}`}
                              className="w-full only_number"
                              placeholder="Enter GST"
                              value={product.gst}
                              onChange={(e: any) =>
                                handleProductChange(idx, "gst", e.target.value)
                              }
                            />
                          </td>
                          <td className="p-2 w-[12%] text-right td-cell">
                            <Input
                              type="text"
                              name={`total-${idx}`}
                              className="w-full text-right total"
                              placeholder="Auto-calculated Total"
                              value={product.total}
                              readOnly
                            />
                          </td>
                          <td className="p-2 text-center w-[7%] last-td-cell">
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
                  className="btn-sm btn-primary mt-4"
                >
                  Add Row
                </button>
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

export default NewPurchase;