"use client";
import {
  useState,
  ChangeEvent,
  FormEvent,
  useRef,
  ReactNode,
  useEffect,
} from "react";
import Layout from "../../../components/Layout";
import useInputValidation from "@/app/utils/inputValidations";
import { Input, RadioGroup, Toggle } from "@/app/utils/form-controls";
import SearchableSelect, { Option } from "@/app/utils/searchableSelect";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { Product, setProduct } from "@/store/product/product";

type unitField =
  | "unitName"
  | "quantity"
  | "remarks"

  type discountField =
  | "unitName"
  | "qtyFrom"
  | "qtyTo"
  |"discount"
  | "cashDiscount"

interface FormData {
  productName: string;
  group: string;
  hsnCode: string;
  printingName: string;
  shortCode: string;
  productType: string;
  unit: string;
  gst: string;
  cess: string;
  sellingRateExcTax: string;
  sellingRateIncTax: string;
  purchaseRateExcTax: string;
  purchaseRateIncTax: string;
  mrp: string;
  unitDetails: UnitTabDetails[];
  discountDetails: DisCountTabDetails[];
  otherDetails: {
    minimumStock: string;
    status: string;
  };
}
interface UnitTabDetails {
  unitName: string;
  quantity: string;
  remarks: string;
}

interface DisCountTabDetails {
  unitName: string;
  qtyFrom: string;
  qtyTo: string;
  discount: string;
  cashDiscount: string;
}
interface FormFieldProps {
  label: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
  error?: string;
  htmlFor?: string;
}
const FormField = ({
  label,
  required = false,
  children,
  className = "",
  error,
  htmlFor,
}: FormFieldProps) => (
  <div
    className={`mb-[10px] flex flex-col md:flex-row md:items-start gap-2 md:gap-4 ${className}`}
  >
    <label className="form-label w-50 mt-2" htmlFor={htmlFor}>
      {label}
      {required && <span className="form-required text-red-500">*</span>}{" "}
    </label>
    <div className="flex flex-col w-3/4">
      {children}
      {error && (
        <p className="error-message text-red-500 text-xs mt-1">{error}</p>
      )}{" "}
    </div>
  </div>
);
export default function NewProduct() {
  const [activeTab, setActiveTab] = useState<string>("Unit_Details");
  const formRef = useRef<HTMLFormElement>(null);

  useInputValidation();
  const countryOptions: Option[] = [
    { value: "usa", label: "United States" },
    { value: "canada", label: "Canada" },
    { value: "uk", label: "United Kingdom" },
    { value: "india", label: "India" },
    { value: "australia", label: "Australia" },
    { value: "germany", label: "Germany" },
  ];

  const productType: Option[] = [
    { value: "none", label: "None" },
    { value: "mrp", label: "MRP" },
    { value: "serialNumber", label: "Serial Number" },
    { value: "batch", label: "Batch" },
  ];

  const unit: Option[] = [
    { value: "case", label: "Case" },
    { value: "nos", label: "Nos" },
    { value: "pcs", label: "Pcs" },
  ];

  const GST: Option[] = [
    { value: "0", label: "0 %" },
    { value: "5", label: "5 %" },
    { value: "12", label: "12 %" },
    { value: "18", label: "18 %" },
    { value: "28", label: "28 %" },
  ];

  const Product = useSelector((state: RootState) => state.product.product);
  const [isShown, setIsShown] = useState<boolean>(false);
  const [sellingChecked, setsellingChecked] = useState<boolean>(false);
  const [purchaseChecked, setpurchaseChecked] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<FormData>({
    productName: "",
    group: "",
    hsnCode: "",
    printingName: "",
    shortCode: "",
    productType: "",
    unit: "",
    gst: "",
    cess: "",
    sellingRateExcTax: "",
    sellingRateIncTax: "",
    purchaseRateExcTax: "",
    purchaseRateIncTax: "",
    mrp: "",
    unitDetails: [],
    discountDetails: [],
    otherDetails: {
      minimumStock: "",
      status: "",
    },
  });
  const [UnitDeatils, setUnitDeatils] = useState<UnitTabDetails[]>([
    {
      unitName: "",
      quantity: "",
      remarks: "",
    },
  ]);

  const [DiscountDetails, setDiscountDetails] = useState<DisCountTabDetails[]>([
    {
      unitName:"",
      qtyFrom:"",
      qtyTo:"",
      discount:"",
      cashDiscount:""
    },
  ]);

  const [filteredProuct, setFilterProduct] = useState<Product[]>([]);

  const fetchCustomerData = async () => {
    try {
      const res = await fetch("http://localhost:4000/existingProducts");

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      dispatch(setProduct(data));
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    if (Product.length === 0) fetchCustomerData();
  }, []);

  const filterProduct = () => {
    const name = formData.productName.trim().toLowerCase();
    if (name.length < 2) {
      setFilterProduct([]);
      return;
    }
    setIsShown(true);
    const searchWord = name.split(/\s+/);
    const filter = Product.filter((customer: any) => {
      const custName = customer.name.toLowerCase().split(/\s+/);
      return searchWord.every((searchWord: string) =>
        custName.some((newWord: string) =>
          newWord.startsWith(searchWord.toLowerCase())
        )
      );
    });
    setFilterProduct(filter);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "productName") {
      filterProduct();
    }

    if (name === "minimumStock") {
      setFormData((prev) => ({
        ...prev,
        otherDetails: {
          ...prev.otherDetails,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSellingChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setsellingChecked(checked);
  };

  const handlePurchaseChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setpurchaseChecked(checked);
  };

  const handleUnitChange = (value: string | string[] | null) => {
    setFormData((prev) => ({
      ...prev,
      unit: value as string,
    }));
  };

  const handleGroupChange = (value: string | string[] | null) => {
    setFormData((prev) => ({
      ...prev,
      group: value as string,
    }));
  };

  const handleProductTypeChange = (value: string | string[] | null) => {
    setFormData((prev) => ({
      ...prev,
      productType: value as string,
    }));
  };

  const handleGSTChange = (value: string | string[] | null) => {
    setFormData((prev) => ({
      ...prev,
      gst: value as string,
    }));
  };

  const tabs = [
    { id: "Unit_Details", label: "Unit Details" },
    { id: "Discount_Details", label: "Discount Details" },
    { id: "Other_details", label: "Other Details" },
  ];

  const handleUnitAddRow = () => {
    setUnitDeatils((prev) => [
      ...prev,
      {
        unitName:"",
        quantity:"",
        remarks:""
      },
    ]);
  };

  const handleDiscountAddRow = () => {
    setDiscountDetails((prev) => [
      ...prev,
      {
        unitName:"",
        qtyFrom:"",
        qtyTo:"",
        discount:"",
        cashDiscount:""
      },
    ]);
  };

  const handleAddNewUnit = () => {
    console.log("Add new name clicked");
    // Handle add new logic here
  };

  const handleAddNewDiscountUnit = () => {
    console.log("Add new name clicked");
    // Handle add new logic here
  };

  const handleUnitDetailsChange = (
    index: number,
    field: unitField,
    value: string
  ) => {
    setUnitDeatils((prev) => {
      const updated = [...prev];
      updated[index][field] = value;

      return updated;
    });
  };

  const handleDiscountDetailsChange = (
    index: number,
    field: discountField,
    value: string
  ) => {
    setDiscountDetails((prev) => {
      const updated = [...prev];
      updated[index][field] = value;


      return updated;
    });
  };

  useEffect(() => {
  setFormData((prev) => ({
    ...prev,
    unitDetails: UnitDeatils,
    discountDetails: DiscountDetails,
  }));
}, [UnitDeatils, DiscountDetails]);


  const unitDetailsQtyChange = (index: number, item: any) => {
    setUnitDeatils((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        unitName: item || "", // assuming your CommonTypeahead returns {name: "..."}
      };
      return updated;
    });
  };

  const dicountDetailsQtyChange = (index: number, item: any) => {
    setDiscountDetails((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        unitName: item || "", // assuming your CommonTypeahead returns {name: "..."}
      };
      return updated;
    });
  };

  const handleUnitDeleteRow = (index: number) => {
    setUnitDeatils((prev) => prev.filter((_, i) => i !== index));
  };

  const handlDiscounteDeleteRow = (index: number) => {
    setDiscountDetails((prev) => prev.filter((_, i) => i !== index));
  };
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    console.log(formData);
  };
  const renderTabContent = () => {
    switch (activeTab) {
      case "Unit_Details":
        return (
          <div id="Unit_Details">
            <div className=" px-4 py-2">
              <div className="max-h-[calc(100vh-600px)] w-[70%] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#f8f9fa] text-left text-[#12344d] sticky-table-header">
                    <tr>
                      <td className="p-2 w-[3%]">S.no</td>
                      <td className="p-2 w-[15%]">Unit Name</td>
                      <td className="p-2 w-[15%]">Quantity ()</td>
                      <td className="p-2 w-[15%]">Remarks</td>
                      <td className="p-2 w-[7%] text-center">Action</td>
                    </tr>
                  </thead>
                  <tbody id="productTableBody">
                    {UnitDeatils.map((product, idx) => (
                      <tr key={idx}>
                        <td className="p-2 text-start w-[3%]">{idx + 1}</td>

                        <td className="p-2 w-[15%]">
                          <SearchableSelect
                            name={`unitName-${idx}`}
                            placeholder="Select Unit"
                            options={countryOptions}
                            onChange={(item) => unitDetailsQtyChange(idx, item)}
                            initialValue={product.unitName}
                            onAddNew={handleAddNewUnit}
                          />

                          {/* <CommonTypeahead
                            name={`productName-${idx}`}
                            placeholder="Enter name"
                            data={typeHead}
                            required={true}
                            searchFields={["name"]}
                            displayField="name"
                            minSearchLength={1}
                            onAddNew={handleAddNewName}
                            onSelect={(item) => productChange(idx, item)}
                          /> */}
                        </td>
                        <td className="p-2 w-[15%]">
                          <Input
                            type="text"
                            name={`quantity-${idx}`}
                            className="w-full only_number"
                            placeholder="Enter Quantity"
                            value={product.quantity}
                            onChange={(e: any) =>
                              handleUnitDetailsChange(
                                idx,
                                "quantity",
                                e.target.value
                              )
                            }
                          />
                        </td>

                        <td className="p-2 w-[15%]">
                          <Input
                            type="text"
                            name={`remarks-${idx}`}
                            className="w-full "
                            placeholder="Enter Remarks"
                            value={product.remarks}
                            onChange={(e: any) =>
                              handleUnitDetailsChange(
                                idx,
                                "remarks",
                                e.target.value
                              )
                            }
                          />
                        </td>

                        <td className="p-2 text-center w-[7%]">
                          <button
                            type="button"
                            className="text-red-600 delete-row mx-1 cursor-pointer"
                            onClick={() => handleUnitDeleteRow(idx)}
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
                onClick={handleUnitAddRow}
                className="btn-sm btn-primary mt-4"
              >
                Add Row
              </button>
            </div>
          </div>
        );
      case "Discount_Details":
        return (
          <div id="Bank_details_tab_content">
            <div className=" px-4 py-2">
              <div className="max-h-[calc(100vh-600px)] w-[70%] overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#f8f9fa] text-left text-[#12344d] sticky-table-header">
                    <tr>
                      <td className="p-2 w-[3%]">S.no</td>
                      <td className="p-2 w-[15%]">Unit Name</td>
                      <td className="p-2 w-[15%]">Qty.From</td>
                      <td className="p-2 w-[15%]">Qty.To</td>
                      <td className="p-2 w-[15%]">Discount %</td>
                      <td className="p-2 w-[15%]">Cash Discount</td>
                      <td className="p-2 w-[7%] text-center">Action</td>
                    </tr>
                  </thead>
                  <tbody id="productTableBody">
                    {DiscountDetails.map((product, idx) => (
                      <tr key={idx}>
                        <td className="p-2 text-start w-[3%]">{idx + 1}</td>

                        <td className="p-2 w-[15%]">
                          <SearchableSelect
                            name={`productName-${idx}`}
                            placeholder="Select Unit"
                            options={countryOptions}
                            onChange={(item) =>
                              dicountDetailsQtyChange(idx, item)
                            }
                            initialValue={product.unitName}
                            onAddNew={handleAddNewDiscountUnit}
                          />
                          {/* <CommonTypeahead
                            name={`productName-${idx}`}
                            placeholder="Enter name"
                            data={typeHead}
                            required={true}
                            searchFields={["name"]}
                            displayField="name"
                            minSearchLength={1}
                            onAddNew={handleAddNewName}
                            onSelect={(item) => dicountDetailsQtyChange(idx, item)}
                          /> */}
                        </td>

                        <td className="p-2 w-[15%]">
                          <Input
                            type="text"
                            name={`qtyFrom-${idx}`}
                            className="w-full only_number"
                            placeholder="Enter Quantity From"
                            value={product.qtyFrom}
                            onChange={(e: any) =>
                              handleDiscountDetailsChange(
                                idx,
                                "qtyFrom",
                                e.target.value
                              )
                            }
                          />
                        </td>

                        <td className="p-2 w-[15%]">
                          <Input
                            type="text"
                            name={`qtyTo-${idx}`}
                            className="w-full only_number"
                            placeholder="Enter Quantity To"
                            value={product.qtyTo}
                            onChange={(e: any) =>
                              handleDiscountDetailsChange(
                                idx,
                                "qtyTo",
                                e.target.value
                              )
                            }
                          />
                        </td>

                        <td className="p-2 w-[15%]">
                          <Input
                            type="text"
                            name={`discount-${idx}`}
                            className="w-full only_number"
                            placeholder="Enter Discount"
                            value={product.discount}
                            onChange={(e: any) =>
                              handleDiscountDetailsChange(
                                idx,
                                "discount",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-2 w-[15%]">
                          <Input
                            type="text"
                            name={`cashDiscount-${idx}`}
                            className="w-full only_number"
                            placeholder="Enter Cash Discount"
                            value={product.cashDiscount}
                            onChange={(e: any) =>
                              handleDiscountDetailsChange(
                                idx,
                                "cashDiscount",
                                e.target.value
                              )
                            }
                          />
                        </td>

                        <td className="p-2 text-center w-[7%]">
                          <button
                            type="button"
                            className="text-red-600 delete-row mx-1 cursor-pointer"
                            onClick={() => handlDiscounteDeleteRow(idx)}
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
                onClick={handleDiscountAddRow}
                className="btn-sm btn-primary mt-4"
              >
                Add Row
              </button>
            </div>
          </div>
        );

      case "Other_details":
        return (
          <div id="Other_details">
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 px-4 py-6">
              <div className="lg:pr-4">
                <FormField label="Status" htmlFor="status">
                  <RadioGroup
                    name="status"
                    options={[
                      { value: "active", label: "Active" },
                      { value: "inActive", label: "Inactive" },
                    ]}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        otherDetails: {
                          ...prev.otherDetails,
                          status: e.target.value,
                        },
                      }));
                    }}
                  />
                </FormField>

                <FormField label="Minimum Stock" htmlFor="minimumStock">
                  <Input
                    name="minimumStock"
                    placeholder="Enter Minimum Stock"
                    className="form-control w-full only_number"
                    value={formData.otherDetails.minimumStock}
                    onChange={handleChange}
                  />
                </FormField>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div id="Unit_Details">
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6 px-4 py-6"></div>
          </div>
        );
    }
  };
  return (
    <Layout pageTitle="Product New">
      <div className="min-h-screen">
        <main id="main-content" className="flex-1">
          <div className="flex-1 overflow-y-auto h-[calc(100vh-103px)]">
            <form ref={formRef} onSubmit={handleSubmit} autoComplete="off">
              <div className="border-b border-gray-300">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 py-2">
                  <div className="lg:pr-4">
                    <FormField
                      label="Product Name"
                      required
                      htmlFor="productName"
                    >
                      <div className="relative">
                        <Input
                          name="productName"
                          placeholder="Enter Product Name"
                          className="form-control  alphabet_only capitalize"
                          value={formData.productName}
                          onChange={handleChange}
                        />

                        {/* Suggestion box positioned to the right of the input */}
                        {isShown &&
                          filteredProuct &&
                          filteredProuct.length > 0 && (
                            <div className="absolute top-0 left-full ml-2 bg-white border border-gray-200 rounded-sm shadow-lg p-3 z-[60] w-md max-w-md">
                              <div className="text-sm">
                                <span className="text-[#009333] font-medium">
                                  Existing Names
                                </span>
                                {filteredProuct.map((item, id) => (
                                  <div
                                    key={id}
                                    className="font-bold text-[#12375d] mb-1 mt-1"
                                  >
                                    {item.name}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                      </div>
                    </FormField>
                  </div>
                  <div className="space-y-4">
                    <FormField label="Unit" htmlFor="unit" required>
                      <SearchableSelect
                        name="unit"
                        options={unit}
                        searchable
                        placeholder="Select Unit"
                        onChange={handleUnitChange}
                      />
                    </FormField>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-6 px-4 py-6">
                <div className="space-y-4 lg:border-r lg:border-gray-300 lg:pr-4">
                  <FormField label="Group" htmlFor="group" required>
                    <SearchableSelect
                      name="group"
                      options={countryOptions}
                      searchable
                      placeholder="Select Group"
                      multiple={true}
                      onChange={handleGroupChange}
                    />
                  </FormField>

                  <FormField label="HSN Code" required htmlFor="hsnCode">
                    <Input
                      name="hsnCode"
                      placeholder="Enter HSN Code"
                      className="form-control w-full only_number"
                      maxLength={10}
                      value={formData.hsnCode}
                      onChange={handleChange}
                    />
                  </FormField>
                  <FormField
                    label="Printing Name"
                    htmlFor="printingName"
                    required
                  >
                    <Input
                      name="printingName"
                      placeholder="Enter Printing Name"
                      className="form-control w-full capitalize"
                      value={formData.printingName}
                      onChange={handleChange}
                    />
                  </FormField>
                  <FormField label="Short Code" required>
                    <Input
                      name="shortCode"
                      placeholder="Enter Short Code"
                      className="form-control w-full only_number"
                      value={formData.shortCode}
                      onChange={handleChange}
                    />
                  </FormField>
                  <FormField
                    label="Product Type"
                    htmlFor="productType"
                    required
                  >
                    <SearchableSelect
                      name="productType"
                      options={productType}
                      searchable
                      placeholder="Select Product Type"
                      onChange={handleProductTypeChange}
                    />
                  </FormField>
                </div>
                <div className="space-y-4">
                  <FormField label="GST" required>
                    <SearchableSelect
                      name="gst"
                      options={GST}
                      searchable
                      placeholder="Select GST"
                      onChange={handleGSTChange}
                    />
                  </FormField>
                  <FormField label="CESS">
                    <Input
                      name="cess"
                      placeholder="Enter CESS"
                      className="form-control w-full only_number"
                      value={formData.cess}
                      onChange={handleChange}
                    />
                  </FormField>

                  <div
                    className={`mb-[10px] flex flex-col md:flex-row md:items-start gap-2 md:gap-4`}
                  >
                    <div className="flex  w-50 mt-2  gap-1 items-center">
                      <label className="form-label">
                        Selling Rate
                        <span className="form-required text-red-500">*</span>
                      </label>
                      <Toggle
                        name=""
                        label=""
                        checked={sellingChecked}
                        onChange={handleSellingChange}
                      />
                      <span className="text-sm text-gray-600 whitespace-nowrap">
                        {sellingChecked ? "(Incl Tax)" : "(Excl Tax)"}
                      </span>
                    </div>
                    <div className="flex flex-col w-3/4">
                      {sellingChecked ? (
                        <Input
                          name="sellingRateIncTax"
                          placeholder={"Enter Rate (Including Tax)"}
                          className="form-control w-full only_number"
                          value={formData.sellingRateIncTax}
                          onChange={handleChange}
                        />
                      ) : (
                        <Input
                          name="sellingRateExcTax"
                          placeholder={"Enter Rate (Excluding Tax)"}
                          className="form-control w-full only_number"
                          value={formData.sellingRateExcTax}
                          onChange={handleChange}
                        />
                      )}
                    </div>
                  </div>

                  <div
                    className={`mb-[10px] flex flex-col md:flex-row md:items-start gap-2 md:gap-4`}
                  >
                    <div className="flex w-50 mt-2 gap-1 items-center">
                      <label className="form-label ">
                        Purchase Rate
                        <span className="form-required text-red-500">*</span>
                      </label>
                      <Toggle
                        name=""
                        label=""
                        checked={purchaseChecked}
                        onChange={handlePurchaseChange}
                      />
                      <span className="text-sm text-gray-600 whitespace-nowrap">
                        {purchaseChecked ? "(Incl Tax)" : "(Excl Tax)"}
                      </span>
                    </div>
                    <div className="flex flex-col w-3/4">
                      {purchaseChecked ? (
                        <Input
                          name="purchaseRateIncTax"
                          placeholder="Enter Purchase Rate (Including Tax)"
                          className="form-control w-full only_number"
                          value={formData.purchaseRateIncTax}
                          onChange={handleChange}
                        />
                      ) : (
                        <Input
                          name="purchaseRateExcTax"
                          placeholder="Enter Purchase Rate (Excluding Tax)"
                          className="form-control w-full only_number"
                          value={formData.purchaseRateExcTax}
                          onChange={handleChange}
                        />
                      )}
                    </div>
                  </div>

                  <FormField label="MRP" required htmlFor="mrp">
                    <Input
                      name="mrp"
                      placeholder="Enter MRP"
                      className="form-control w-full only_number"
                      value={formData.mrp}
                      onChange={handleChange}
                    />
                  </FormField>
                </div>
              </div>
              {/* Tab Navigation */}
              <div className="mx-2 mt-5">
                <ul className="flex whitespace-nowrap w-full border-b border-gray-300 mr-3">
                  {tabs.map((tab) => (
                    <li
                      key={tab.id}
                      className={`mr-6 pb-2 cursor-pointer hover:text-[#009333] ${
                        activeTab === tab.id
                          ? "text-[#009333] border-b-2 border-[#009333]"
                          : ""
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.label}
                    </li>
                  ))}
                </ul>
              </div>
              {/* Tab Content */}
              <div className="mt-3">{renderTabContent()}</div>
            </form>
          </div>
        </main>
        <footer className="bg-[#ebeff3] py-3 h-[56.9px] px-4 flex justify-start gap-2">
          <button
            type="submit"
            onClick={handleSubmit as any}
            className="btn-sm btn-primary"
          >
            Save
          </button>
          <button type="button" className="btn-sm btn-secondary">
            Cancel
          </button>
        </footer>
      </div>
    </Layout>
  );
}
