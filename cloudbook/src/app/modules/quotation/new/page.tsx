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
  total: string;
}

interface FormDataTypes {
  name: string;
  phoneNumber: string;
  shippingAddress1: string;
  shippingAddress2: string;
  state: string;
  gstNumber: string;
  billType: string;
  paidAmount: string;
  place: string;
  transportMode: string;
  vehicleNumber: string;
  pinCode: string;
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

// Main NewQuotation component
const NewQuotation = () => {
  useInputValidation();
  const dispatch = useDispatch<AppDispatch>();
  const typeHead = useSelector((state: RootState) => state.typeHead.typeHead);
  const [formData, setFormData] = useState<FormDataTypes>({
    name: "",
    phoneNumber: "",
    shippingAddress1: "",
    shippingAddress2: "",
    state: "",
    gstNumber: "",
    billType: "",
    paidAmount: "",
    place: "",
    transportMode: "",
    vehicleNumber: "",
    pinCode: "",
    productDetails: [],
  });

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
        taxable: "",
        gst: "",
        total: "",
      },
    ]);
  };
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
    <Layout pageTitle="Quotation New">
      <div className="flex-1">
        <main id="main-content" className="flex-1">
          <div className="flex-1 overflow-y-auto h-[calc(100vh-104px)] ">
            <form onSubmit={handleSubmit} autoComplete="off">
              <div className="px-4 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
                  {/* Left Column: Supplier Details */}
                  <div className="space-y-4 lg:border-r lg:border-gray-300 lg:pr-4">
                    <div>
                      <span className="text-md">
                        <u>Billing Details</u>
                      </span>
                    </div>
                    <FormField label="Name" required htmlFor="name">
                      <CommonTypeahead
                        name="name"
                        placeholder="Search Name to Select"
                        data={typeHead}
                        required={true}
                        searchFields={["name"]}
                        displayField="name"
                        minSearchLength={1}
                        onAddNew={handleAddNewName}
                        onSelect={(item) =>
                          setFormData((prev) => ({
                            ...prev,
                            name: item.name,
                          }))
                        }
                      />
                    </FormField>

                    <FormField
                      label="Phone Number"
                      required
                      htmlFor="phoneNumber"
                    >
                      <Input
                        name="phoneNumber"
                        placeholder="Enter Phone Number"
                        className="form-control w-full only_number no_space"
                        value={formData.phoneNumber}
                        onChange={handleValueChange}
                        maxLength={10} // Assuming 10 digit phone number
                      />
                    </FormField>

                    <FormField
                      label="Shipping Address1"
                      required
                      htmlFor="shippingAddress1"
                    >
                      <Input
                        name="shippingAddress1"
                        placeholder="Enter Shipping Address 1"
                        className="form-control w-full capitalize "
                        value={formData.shippingAddress1}
                        onChange={handleValueChange}
                      />
                    </FormField>

                    <FormField
                      label="Shipping Address2"
                      required
                      htmlFor="shippingAddress2"
                    >
                      <Input
                        name="shippingAddress2"
                        placeholder="Enter Shipping Address 2"
                        className="form-control w-full capitalize "
                        value={formData.shippingAddress2}
                        onChange={handleValueChange}
                      />
                    </FormField>

                    <FormField label="State" required htmlFor="state">
                      <SearchableSelect
                        name="state"
                        options={stateOptions}
                        placeholder="Select State"
                        searchable
                        onChange={handleStateChange}
                        initialValue={formData.state}
                      />
                    </FormField>

                    <FormField label="GST Number" required htmlFor="gstNumber">
                      <Input
                        name="gstNumber"
                        placeholder="Enter GST Number"
                        className="form-control w-full alphanumeric all_uppercase no_space"
                        value={formData.gstNumber}
                        onChange={handleValueChange}
                        maxLength={15} // Standard GST number length
                      />
                    </FormField>
                  </div>

                  <div className="space-y-4 ">
                    <div>
                      <span className="text-md">
                        <u>Other Details</u>
                      </span>
                    </div>
                    <FormField label="Bill Type" required htmlFor="billType">
                      <RadioGroup
                        name="billType"
                        options={[
                          { value: "cash", label: "Cash" },
                          { value: "credit", label: "credit" },
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

                    <FormField
                      label="Paid Amount"
                      required
                      htmlFor="paidAmount"
                    >
                      <Input
                        name="paidAmount"
                        placeholder="Enter Amount"
                        className="form-control w-full only_number"
                        value={formData.paidAmount}
                        onChange={handleValueChange}
                      />
                    </FormField>

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
                        className="form-control w-full  capitalize"
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

                    <FormField label="Pincode" required htmlFor="pinCode">
                      <Input
                        name="pinCode"
                        placeholder="Enter Pincode"
                        className="form-control w-full  only_number no_space"
                        maxLength={6}
                        value={formData.pinCode}
                        onChange={handleValueChange}
                      />
                    </FormField>
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
                        <th className="p-2 w-[3%] th-cell">S.no</th>
                        <th className="p-2 w-[12%] th-cell">Product</th>
                        <th className="p-2 w-[10%] th-cell">Unit</th>
                        <th className="p-2 w-[10%] th-cell">Details</th>
                        <th className="p-2 w-[10%] th-cell">Quantity</th>
                        <th className="p-2 w-[10%] th-cell">
                          <div className="flex gap-2">
                            <span >
                              Rate {rateIncTax ? "(Inc tax)" : "(Exc tax)"}
                            </span>
                            <Toggle
                              name="rate"
                              checked={rateIncTax}
                              onChange={(e) => setRateIncTax(e.target.checked)}
                            />
                          </div>
                        </th>
                        <th className="p-2 w-[10%] th-cell">MRP</th>

                        <th className="p-2 w-[10%] th-cell">Taxable</th>

                        <th className="p-2 w-[10%] th-cell">GST</th>
                        <th className="p-2 w-[10%] th-cell text-center">
                          Total
                        </th>
                        <th className="p-2 w-[7%] last-th-cell text-center">
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
                              onChange={(item) =>
                                unitChange(idx, item)
                              }
                            />
                          </td>

                          <td className="p-2  td-cell">
                            <Input
                              type="text"
                              name={`details-${idx}`}
                              className="w-full alphanumeric all_uppercase no_space"
                              placeholder="Enter Details"
                              value={product.details}
                              onChange={(e: any) =>
                                handleProductChange(
                                  idx,
                                  "details",
                                  e.target.value
                                )
                              }
                              maxLength={100}
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
                              className="w-full only_number"
                              placeholder="Enter MRP"
                              value={product.mrp}
                              onChange={(e: any) =>
                                handleProductChange(idx, "mrp", e.target.value)
                              }
                            />
                          </td>
                          <td className="p-2 td-cell">
                            <Input
                              type="text"
                              name={`taxable-${idx}`}
                              className="w-full only_number"
                              placeholder="Enter Taxable"
                              value={product.taxable}
                              onChange={(e: any) =>
                                handleProductChange(idx, "taxable", e.target.value)
                              }
                            />
                          </td>
                          <td className="p-2  td-cell">
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
                          <td className="p-2  text-right td-cell">
                            <Input
                              type="text"
                              name={`total-${idx}`}
                              className="w-full text-start total"
                              placeholder="Total"
                              value={product.total}
                              readOnly
                            />
                          </td>
                          <td className="p-2 text-center  last-td-cell">
                            <div className="flex justify-around">
                              <i className="ri-pencil-line text-[16px] cursor-pointer"></i>
                            <button
                              type="button"
                              className="text-red-600 delete-row mx-1 cursor-pointer"
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

export default NewQuotation;
