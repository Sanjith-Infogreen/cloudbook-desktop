"use client";
import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import Layout from "../../../components/Layout";
import DatePicker from "@/app/utils/commonDatepicker";
import CommonTypeahead from "@/app/utils/commonTypehead";
import { useDispatch, useSelector } from "react-redux";
import { setTypeHead } from "@/store/typeHead/typehead";
import { AppDispatch, RootState } from "@/store/store";
import { Input, RadioGroup, Toggle } from "@/app/utils/form-controls";
import SearchableSelect, { Option } from "@/app/utils/searchableSelect";
import useInputValidation from "@/app/utils/inputValidations";

// Define types for product fields
type ProductField =
  | "productName"
  | "unit"
  | "details"
  | "quantity"
  | "rate"
  | "rateIncTax"
  | "mrp"
  | "taxable"
  | "gst"
  | "less"
  | "sch"
  | "cd"
  | "total";

// Interface for a single product
interface Product {
  productName: string;
  unit: string;
  details: string;
  quantity: string;
  rate: string;
  rateIncTax: string; // new alternative rate field
  mrp: string;
  taxable: string;
  gst: string;
  less: string;
  sch: string;
  cd: string;
  total: string;
}

interface FormDataTypes {
  name: string;
  billType: string;
  place: string;
  transportMode: string;
  vehicleNumber: string;
  ewaybillnumber: string;
  reference: string;
  productDetails: Product[];
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

interface BillItem {
  id: number;
  date: string;
  billNumber: string;
  purpose: string; // New field added
  total: number;
  paid: number;
  balance: number | string; // Can be number or empty string for input
}

// Main NewInvoice component
const NewInvoice = () => {
  useInputValidation();
  const dispatch = useDispatch<AppDispatch>();
  const typeHead = useSelector((state: RootState) => state.typeHead.typeHead);
  const [formData, setFormData] = useState<FormDataTypes>({
    name: "",
    billType: "",
    place: "",
    transportMode: "",
    vehicleNumber: "",
    ewaybillnumber: "",
    reference: "",
    productDetails: [],
  });
  const [details, setDetails] = useState<any>(null);
  const [bills, setBills] = useState<BillItem[]>([]);
  const [activeTab, setActiveTab] = useState("transport");

  const stateOptions: Option[] = [{ value: "Tamil Nadu", label: "Tamil Nadu" }];

  const [ProductDetails, setProductDetails] = useState<Product[]>([
    {
      productName: "",
      unit: "",
      details: "",
      quantity: "",
      rate: "",
      rateIncTax: "",
      mrp: "",
      less: "",
      sch: "",
      cd: "",
      taxable: "",
      gst: "",
      total: "",
    },
  ]);

  const [rateIncTax, setRateIncTax] = useState(false);

  const handleStateChange = (value: string | string[] | null) => {
    setFormData((prev) => ({
      ...prev,
      state: value as string,
    }));
  };
  const data = [
    { date: "13-03-2024", rate: 50.0, qty: 10 },
    { date: "12-03-2024", rate: 75.5, qty: 5 },
    { date: "13-03-2024", rate: 50.0, qty: 10 },
    { date: "12-03-2024", rate: 75.5, qty: 5 },
    { date: "13-03-2024", rate: 50.0, qty: 10 },
    { date: "12-03-2024", rate: 75.5, qty: 5 },
  ];

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddRow = () => {
    setProductDetails((prev) => [
      ...prev,
      {
        productName: "",
        unit: "",
        details: "",
        quantity: "",
        rate: "",
        rateIncTax: "",
        mrp: "",
        less: "",
        sch: "",
        cd: "",
        taxable: "",
        gst: "",
        total: "",
      },
    ]);
  };

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
  const unit: Option[] = [
    { value: "case", label: "Case" },
    { value: "nos", label: "Nos" },
    { value: "pcs", label: "Pcs" },
  ];

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

  const handleNameSelect = (item: any) => {
    if (item) {
      // If an item is selected (not null/undefined)
      setDetails(item);

      setBills(sampleBills.map((bill) => ({ ...bill })));
    } else {
      setDetails(null); // This correctly clears the details
      setBills([]); // This correctly clears the bills
    }
  };

  const handleDeleteRow = (index: number) => {
    setProductDetails((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      productDetails: ProductDetails,
    }));
  }, [ProductDetails]);

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
    console.log(formData);
  };

  const handleAddNewName = () => {
    console.log("Add new name clicked for product");
  };

  const handleAddNewProduct = () => {
    console.log("Add new name clicked for product");
  };

  const productChange = (index: number, item: any) => {
    setProductDetails((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        productName: item?.name || "",
      };
      return updated;
    });
  };

  const unitChange = (index: number, item: any) => {
    setProductDetails((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        unit: item || "", // assuming your CommonTypeahead returns {name: "..."}
      };
      return updated;
    });
  };
  return (
    <Layout pageTitle="Invoice New">
      <div className="flex-1">
        <main id="main-content" className="flex-1">
          <div className="flex-1 overflow-y-auto h-[calc(100vh-104px)] ">
            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="border-b border-gray-300">
                <div className="grid grid-cols-1 lg:grid-cols-2   px-4 pt-2">
                  <div className="lg:pr-4 flex items-center ml-4">
                    <FormField label="Bill Type" required htmlFor="billType">
                      <RadioGroup
                        name="billType"
                        className="ml-7"
                        options={[
                          { value: "cash", label: "Cash" },
                          { value: "credit", label: "Credit" },
                        ]}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            billType: e.target.value,
                          }))
                        }
                        defaultValue={formData.billType}
                      />
                    </FormField>
                  </div>
                </div>
              </div>

              <div className="px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
                  <div className="space-y-4 lg:border-r lg:border-gray-300 lg:pr-4">
                    <div className="bg-white rounded-lg    border border-gray-200 ">
                      <div className="p-4 pb-1 border-b border-gray-200">
                        <FormField label="Name" required htmlFor="name">
                          <CommonTypeahead
                            className="capitalize"
                            name="Name"
                            placeholder="Search To Name Select"
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

                      {/* Conditional rendering for details or the 'select contact' message */}
                      {details ? (
                        <div className="p-4 text-sm text-gray-700">
                          <div className="grid grid-cols-2 gap-12">
                            <div>

                              <div className="mb-3 border-b border-gray-200 ">
                                <h2 className="text-lg font-medium text-blue-900 mb-2">Billing Address</h2>

                               
                              </div>


                              <div className="space-y-3">
                                


                                {details.billingAddresses?.map((address: any, index: number) => (
                                  <div key={address.id || index} className="">
                                    <div className="flex items-start gap-3">
                                      
                                      <div className="flex-1">
                                        <div className="flex justify-between items-center">
                                          <h4 className="font-medium text-black">{details.name || "N/A"}</h4>
                                          <div className="flex gap-3">
                                            <button className="text-[#26ae60] cursor-pointer flex items-center gap-1 text-sm">
                                              <i className="ri-edit-box-line text-[14px]"></i> Edit
                                            </button>
                                            {/* <button className="text-[#e55d67] cursor-pointer flex items-center gap-1 text-sm">
                                              <i className="ri-delete-bin-7-line text-[14px]"></i> Delete
                                            </button> */}
                                          </div>
                                        </div>
                                        <p className="text-sm text-gray-800 leading-relaxed">
                                          <span className="font-medium text-gray-600">Location : </span> {address.addressLine1}, {address.addressLine2}
                                        </p>
                                        <p className="text-sm text-gray-800">
                                          <span className="font-medium text-gray-600">Mobile : </span> {address.phoneNumber || "N/A"}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}

                              </div>




                            </div>
                            <div>



                              <div className="mb-3 border-b border-gray-200">
                                <h2 className="text-lg font-medium text-blue-900 mb-2">Shipping Address</h2>

                                
                              </div>

                              {/* Address List */}
                              <div className="space-y-3">
                               


                                {details.shippingAddresses?.map((address: any, index: number) => (
                                  <div key={address.id || index} className="">
                                    <div className="flex items-start gap-3">
                                     

                                    
                                      <div className="flex-1">
                                        <div className="flex justify-between items-center">
                                          <h4 className="font-medium text-black">{details.name || "N/A"}</h4>
                                          <div className="flex gap-3">
                                            <button className="text-[#26ae60] cursor-pointer flex items-center gap-1 text-sm">
                                              <i className="ri-edit-box-line text-[14px]"></i> Edit
                                            </button>
                                            {/* <button className="text-[#e55d67] cursor-pointer flex items-center gap-1 text-sm">
                                              <i className="ri-delete-bin-7-line text-[14px]"></i> Delete
                                            </button> */}
                                          </div>
                                        </div>
                                        <p className="text-sm text-gray-800 leading-relaxed">
                                          <span className="font-medium text-gray-600">Location : </span> {address.addressLine1}, {address.addressLine2}
                                        </p>
                                        <p className="text-sm text-gray-800">
                                          <span className="font-medium text-gray-600">Mobile : </span> {address.phoneNumber || "N/A"}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                ))}


                              </div>




                            </div>
                          </div>

                        </div>

















                      ) : (
                        <div className="text-center p-4 pt-1 text-gray-500 text-sm">
                          Kindly select the contact first
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Purchase Details */}
                  <div className="space-y-4 ">
                    <div className="bg-white rounded-lg  overflow-hidden border border-gray-200">
                      {/* Tabs */}
                      <div className="border-b bg-[#f0f5f3]">
                        {["transport", "others", "transactions"].map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-3 py-2 font-medium border-b-2 cursor-pointer ${activeTab === tab
                              ? "border-[#44745c] text-green-900 bg-white"
                              : "border-transparent text-[#666c6a]"
                              }`}
                          >
                            {tab === "transport"
                              ? "Transport Details"
                              : tab === "others"
                                ? "Others"
                                : "Transactions"}
                          </button>
                        ))}
                      </div>

                      {/* Tab Content */}
                      <div className="">
                        {activeTab === "transport" && (
                          <div className="space-y-4 p-4 pb-2">
                            <FormField label="Place" required htmlFor="place">
                              <Input
                                name="place"
                                placeholder="Enter Place"
                                className="form-control w-full capitalize"
                                value={formData.place}
                                onChange={handleValueChange}
                              />
                            </FormField>

                            <FormField
                              label="Transport Mode"
                              required
                              htmlFor="transportMode"
                            >
                              <Input
                                name="transportMode"
                                placeholder="Enter Transport Mode"
                                className="form-control w-full capitalize"
                                value={formData.transportMode}
                                onChange={handleValueChange}
                              />
                            </FormField>

                            <FormField
                              label="Vehicle Number"
                              required
                              htmlFor="vehicleNumber"
                            >
                              <Input
                                name="vehicleNumber"
                                placeholder="Enter Vehicle Number"
                                className="form-control w-full all_uppercase alphanumeric no_space"
                                value={formData.vehicleNumber}
                                onChange={handleValueChange}
                              />
                            </FormField>
                          </div>
                        )}

                        {activeTab === "others" && (
                          <div className="space-y-4 p-4 pb-2">
                            {/* E-way Bill Number Field */}
                            <FormField
                              label="E-way Bill Number"
                              required
                              htmlFor="ewayBillNumber"
                            >
                              <Input
                                name="ewayBillNumber"
                                placeholder="Enter E-way Bill Number"
                                className="form-control w-full"
                                value={formData.ewaybillnumber}
                                onChange={handleValueChange}
                              />
                            </FormField>

                            {/* Reference Field */}
                            <FormField
                              label="Reference"
                              required
                              htmlFor="reference"
                            >
                              <Input
                                name="reference"
                                placeholder="Enter Reference"
                                className="form-control w-full capitalize"
                                value={formData.reference}
                                onChange={handleValueChange}
                              />
                            </FormField>
                          </div>
                        )}

                        {activeTab === "transactions" && (
                          <div >
                            {/* Header badges */}
                            <div className="flex flex-wrap gap-2 p-4 ">
                              <span className="bg-white text-[#333] text-xs px-4 py-[6px] rounded-md border border-gray-300 ">
                                C. Stock: 250
                              </span>
                              <span className="bg-white text-[#333] text-xs px-4 py-[6px] rounded-md border border-gray-300 ">
                                P.R: 250 - MRP: 35 - Qty: 35
                              </span>
                              <span className="bg-white text-[#333] text-xs px-4 py-[4px] rounded-md border border-gray-300 ">
                                P.R: 250 - MRP: 35 - Qty: 35
                              </span>
                            </div>

                            {/* Transactions Table */}
                            <div className="max-h-[100px] overflow-y-auto">
                              <table className="w-full text-sm">
                                <thead className="bg-[#fafcfc] sticky top-0 shadow-[inset_0_1px_0_#efefef,inset_0_-1px_0_#efefef] z-10">
                                  <tr className="divide-x divide-[#efefef]">
                                    <th className="text-left px-2 py-2 text-xs font-medium text-gray-600">
                                      S.No
                                    </th>
                                    <th className="text-left px-2 py-2 text-xs font-medium text-gray-600">
                                      Date
                                    </th>
                                    <th className="text-left px-2 py-2 text-xs font-medium text-gray-600">
                                      Rate
                                    </th>
                                    <th className="text-left px-2 py-2 text-xs font-medium text-gray-600">
                                      Qty
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-[#efefef] cursor-pointer">
                                  {data.map((item, index) => (
                                    <tr
                                      key={index}
                                      className="hover:bg-[#f8faf9] divide-x divide-[#efefef]"
                                    >
                                      <td className="px-2 py-2 text-sm text-gray-700 font-medium text-center w-10">
                                        {index + 1}
                                      </td>
                                      <td className="px-2 py-2 text-sm text-gray-900">
                                        {item.date}
                                      </td>
                                      <td className="px-2 py-2 text-sm font-medium">
                                        ₹{item.rate.toFixed(2)}
                                      </td>
                                      <td className="px-2 py-2 text-sm font-medium">
                                        {item.qty}
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
                  </div>
                </div>

                {/* Product Details Section */}
                <h2 className="text-lg text-[#009333] mt-5 mb-5">
                  Product Details
                </h2>
                <div className="max-h-[calc(100vh-520px)] overflow-y-auto">
                  <table className="w-full text-[14px] text-sm">
                    <thead className="bg-[#f8f9fa] text-left  text-[#12344d] sticky-table-header">
                      <tr>
                        <th className="p-2 w-[4%] th-cell">S.no</th>
                        <th className="p-2 w-[12%] th-cell">Product</th>
                        <th className="p-2 w-[8%] th-cell">Unit</th>
                        <th className="p-2 w-[8%] th-cell">Qty</th>
                        <th className="p-2 w-[10%] th-cell">
                          <div className="flex gap-2">
                            <span>{rateIncTax ? "Net Rate" : "Rate"}</span>
                            <Toggle
                              name="rate"
                              checked={rateIncTax}
                              onChange={(e) => setRateIncTax(e.target.checked)}
                            />
                          </div>
                        </th>
                        <th className="p-2 w-[8%] th-cell">MRP</th>
                        <th className="p-2 w-[8%] th-cell">Taxable</th>
                        <th className="p-2 w-[8%] th-cell">GST</th>
                        <th className="p-2 w-[7%] th-cell">Less%</th>
                        <th className="p-2 w-[6%] th-cell">Sch%</th>
                        <th className="p-2 w-[6%] th-cell">CD</th>
                        <th className="p-2 w-[10%] th-cell text-center">
                          Total
                        </th>
                        <th className="p-2 w-[5%] last-th-cell text-center">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody id="productTableBody">
                      {ProductDetails.map((product, idx) => (
                        <tr key={idx}>
                          <td className="p-2 text-center w-[3%] td-cell">
                            {idx + 1}
                          </td>
                          <td className="p-2 td-cell">
                            <CommonTypeahead
                              name={`productName-${idx}`}
                              placeholder="Search Name to Select"
                              data={typeHead}
                              required={true}
                              searchFields={["name"]}
                              displayField="name"
                              minSearchLength={1}
                              onAddNew={handleAddNewProduct}
                              onSelect={(item) => productChange(idx, item)}
                            />
                          </td>

                          <td className="p-2  td-cell">
                            <SearchableSelect
                              name={`unit-${idx}`}
                              options={unit}
                              searchable
                              placeholder="Select Unit"
                              initialValue={product.unit}
                              onChange={(item) => unitChange(idx, item)}
                            />
                          </td>

                          <td className="p-2  td-cell">
                            <Input
                              type="text"
                              name={`quantity-${idx}`}
                              className="w-full only_number"
                              placeholder="Enter Qty"
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
                          <td className="p-2  td-cell">
                            {rateIncTax ? (
                              <Input
                                type="text"
                                name={`rateIncTax-${idx}`}
                                className="w-full only_number"
                                placeholder="Enter Rate"
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
                                placeholder="Enter Rate"
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
                          <td className="p-2  td-cell">
                            <Input
                              type="text"
                              name={`mrp-${idx}`}
                              className="w-full text-gray-700 border-none bg-transparent focus:ring-0 cursor-default"
                              placeholder="e.g.,1099.99"
                              value={product.mrp}
                              readOnly
                            />
                          </td>
                          <td className="p-2 td-cell">
                            <Input
                              type="text"
                              name={`taxable-${idx}`}
                              className="w-full text-gray-700  border-none bg-transparent focus:ring-0 cursor-default"
                              placeholder="0"
                              value={product.taxable}
                              readOnly
                            />
                          </td>
                          <td className="p-2  td-cell">
                            <Input
                              type="text"
                              name={`gst-${idx}`}
                              className="w-full text-gray-700 border-none bg-transparent focus:ring-0 cursor-default"
                              placeholder="e.g.,18%"
                              value={product.gst}
                              readOnly
                            />
                          </td>
                          <td className="p-2  td-cell">
                            <Input
                              type="text"
                              name={`less-${idx}`}
                              className="w-full alphanumeric all_uppercase no_space"
                              placeholder="Enter less"
                              value={product.less}
                              onChange={(e: any) =>
                                handleProductChange(idx, "less", e.target.value)
                              }
                              maxLength={100}
                            />
                          </td>
                          <td className="p-2  td-cell">
                            <Input
                              type="text"
                              name={`sch-${idx}`}
                              className="w-full alphanumeric all_uppercase no_space"
                              placeholder="Enter sch"
                              value={product.sch}
                              onChange={(e: any) =>
                                handleProductChange(idx, "sch", e.target.value)
                              }
                              maxLength={100}
                            />
                          </td>
                          <td className="p-2  td-cell">
                            <Input
                              type="text"
                              name={`cd-${idx}`}
                              className="w-full alphanumeric all_uppercase no_space"
                              placeholder="Enter cd"
                              value={product.cd}
                              onChange={(e: any) =>
                                handleProductChange(idx, "cd", e.target.value)
                              }
                              maxLength={100}
                            />
                          </td>
                          <td className="p-2  text-right td-cell">
                            <Input
                              type="text"
                              name={`total-${idx}`}
                              className="w-full text-center border-none bg-transparent focus:ring-0 cursor-default"
                              placeholder="0"
                              value={product.total}
                              readOnly
                            />
                          </td>
                          <td className="p-2 text-center  last-td-cell">
                            <div className="flex ">
                              <i className="ri-pencil-line text-[16px] cursor-pointer mr-2"></i>
                              <button
                                type="button"
                                className="text-red-600 delete-row cursor-pointer"
                                onClick={() => handleDeleteRow(idx)}
                              >
                                <i className="ri-delete-bin-line text-[16px]"></i>
                              </button>
                            </div>
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
                  <i className="ri-add-fill mr-1"></i>
                  <span className="text-sm">Add Row</span>
                </button>
              </div>
            </form>
          </div>
        </main>

        <footer className="bg-[#ebeff3] py-3 h-[53.9px] px-4 flex justify-start gap-2">
          <button onClick={handleSubmit} className="btn-sm btn-primary">
            Save
          </button>
          <button className="btn-secondary btn-sm">Cancel</button>
        </footer>
      </div>
    </Layout>
  );
};

export default NewInvoice;
