// app/expense/new/page.tsx
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

type ProductField =
  | "productName"
  | "serialNo"
  | "quantity"
  | "rate"
  | "rateIncTax"
  | "gst"
  | "total";
interface Product {
  productName: string;
  serialNo: string;
  quantity: string;
  rate: string;
  rateIncTax: string;
  gst: string;
  total: string;
}
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
  useInputValidation();
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
  const formRef = useRef<HTMLFormElement>(null);
  const [productDetails, setProductDetails] = useState<Product[]>([
    {
      productName: "",
      serialNo: "",
      quantity: "",
      rate: "",
      rateIncTax: "", // new alternative rate field
      gst: "",
      total: "",
    },
  ]);
  const [rateIncTax, setRateIncTax] = useState(false);

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

  const handleProductChange = (
    index: number,
    field: ProductField,
    value: string
  ) => {
    setProductDetails((prev) => {
      const updated = [...prev];
      updated[index][field] = value;

      // Recalculate total if quantity and rate are present
      if (field === "quantity" || field === "rate") {
        const qty = parseFloat(updated[index].quantity) || 0;
        const rate = parseFloat(updated[index].rate) || 0;
        updated[index].total = (qty * rate).toFixed(2);
      }

      return updated;
    });
  };

  const handleDeleteRow = (index: number) => {
    setProductDetails((prev) => prev.filter((_, i) => i !== index));
  };
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

    const form = formRef.current;
    if (!form) return;

    const purchaseNumber =
      (form.elements.namedItem("purchaseNumber") as HTMLInputElement)?.value ||
      "";
    const vehicleNumber =
      (form.elements.namedItem("vehicleNumber") as HTMLInputElement)?.value ||
      "";
    const dueDays =
      (form.elements.namedItem("dueDays") as HTMLInputElement)?.value || "";

    const fullFormData = {
      supplier: details,
      date,
      purchaseType: selectedPurchaseType,
      purchaseNumber,
      vehicleNumber,
      dueDays,
      productDetails,
    };

    console.log("Full Form Data:", fullFormData);

    // TODO: send fullFormData to your API here
  };

  const handlePurchaseTypeChange = (value: string | string[] | null) => {
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
              </div>

              <div className="px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 ">
                  <div className="space-y-4 lg:border-r lg:border-gray-300 lg:pr-4">
                    <div className="bg-white border border-gray-200 rounded-sm  p-3 h-[175px] overflow-y-auto">
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
                        className="form-control w-full alphanumeric all_uppercase no_space"
                      />
                    </FormField>

                    <FormField label="Vehicle No" required>
                      <Input
                        name="vehicleNumber"
                        placeholder="Enter Vehicle Number"
                        className="form-control w-full all_uppercase alphanumeric  no_space "
                      />
                    </FormField>

                    <FormField label="Due Days" required>
                      <Input
                        name="dueDays"
                        placeholder="Enter Due Days"
                        className="form-control w-full only_number"
                      />
                    </FormField>
                  </div>
                </div>
                <h2 className="text-lg text-[#009333] mt-5 mb-4">
                  Product Details
                </h2>
                <div className="max-h-[calc(100vh-520px)]  overflow-y-auto">
                  <table className="w-full text-[14px]">
                    <thead className="bg-[#f8f9fa] text-left text-[14px]  text-[#12344d] sticky-table-header">
                      <tr>
                        <td className="p-2 w-[3%] td-cell">S.no</td>
                        <td className="p-2 w-[25%] td-cell">Product Name</td>
                        <td className="p-2 w-[15%] td-cell">Serial No</td>
                        <td className="p-2 w-[10%] td-cell">Quantity</td>
                        <td className="p-2 w-[15%] td-cell">
                          <div className="flex  gap-2">
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

                        <td className="p-2 w-[10%] td-cell">GST</td>
                        <td className="p-2 w-[12%] td-cell text-center">Total</td>
                        <td className="p-2 w-[7%] last-td-cell text-center">Action</td>
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
