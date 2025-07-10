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
import DatePicker from "@/app/utils/commonDatepicker";
import { Input, RadioGroup, Toggle } from "@/app/utils/form-controls";
import SearchableSelect, { Option } from "@/app/utils/searchableSelect";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { Contact, setContact } from "@/store/contact/contact";
interface BankDetails {
  id: number;
  bankName: string;
  accountNumber: string;
  accountName: string;
  ifscCode: string;
  branchName: string;
}
interface deliveryDetails {
  id: number;
  addressLine1: string;
  addressLine2: string;
  district: string;
  state: string;
  pincode: string;
}
interface FormData {
  salutation: string;
  ledgerName: string;
  contactType: string;
  group: string;
  phoneNumber: string;
  email: string;
  alternateNumber: string;
  companyName: string;
  addressLine1: string;
  addressLine2: string;
  district: string;
  state: string;
  pincode: string;
  gstNumber: string;
  deliveryDetails: deliveryDetails[];
  bankDetails: BankDetails[];
  proofDetails: { aadhaarNumber: string; panNumber: string };
  otherDetails: {
    creditLimit: string;
    status: boolean;
  };
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
    className={`mb-[10px] flex flex-col md:flex-row md:items-center gap-2 md:gap-4 ${className}`}
  >
    <label className="form-label w-50" htmlFor={htmlFor}>
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
export default function NewContact() {
  const [activeTab, setActiveTab] = useState<string>("Delivery_details");
  const [showModal, setShowModal] = useState<boolean>(true);
  const [customerType, setCustomerType] = useState<string>("");
  const [GstNumber, setGstNumber] = useState("");
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  useInputValidation();
  const stateOptions = [{ value: "Tamil Nadu", label: "Tamil Nadu" }];
  const countryOptions: Option[] = [
    { value: "usa", label: "United States" },
    { value: "canada", label: "Canada" },
    { value: "uk", label: "United Kingdom" },
    { value: "india", label: "India" },
    { value: "australia", label: "Australia" },
    { value: "germany", label: "Germany" },
  ];
  const Contact = useSelector((state: RootState) => state.contact.contact);
  const [isShown, setIsShown] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState<FormData>({
    salutation: "Mr.",
    ledgerName: "",
    contactType: "",
    group: "",
    phoneNumber: "",
    email: "",
    alternateNumber: "",
    companyName: "",
    addressLine1: "",
    addressLine2: "",
    district: "",
    state: "",
    pincode: "",
    gstNumber: "",
    deliveryDetails: [],
    bankDetails: [],
    otherDetails: {
      creditLimit: "",
      status: false,
    },
    proofDetails: { aadhaarNumber: "", panNumber: "" },
  });
  const [bankIdCounter, setBankIdCounter] = useState<number>(1);
  const [bankInputError, setBankInputError] = useState<string>("");
  const [filteredContact, setFilterContact] = useState<Contact[]>([]);
  const [addressIdCounter, setAddressCounter] = useState<number>(1);
  const [addressInputError, setAddressInputError] = useState<string>("");
  const [isCompanyEdited, setIsCompanyEdited] = useState(false);

  const [tempAddress, setTempAddress] = useState<deliveryDetails>({
    id: 0,
    addressLine1: "",
    addressLine2: "",
    district: "",
    state: "",
    pincode: "",
  });

  const [tempBank, setTempBank] = useState<BankDetails>({
    id: 0,
    bankName: "",
    accountNumber: "",
    accountName: "",
    ifscCode: "",
    branchName: "",
  });

  const fetchCustomerData = async () => {
    try {
      const res = await fetch("http://localhost:4000/existingContacts");

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      dispatch(setContact(data));
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    if (Contact.length === 0) fetchCustomerData();
    setFormData((prev) => ({
      ...prev,
      salutation: "Mr.",
    }));
  }, []);

  const filterContact = () => {
    console.log(Contact);

    const name = formData.ledgerName.trim().toLowerCase();
    if (name.length < 2) {
      setFilterContact([]);
      return;
    }
    setIsShown(true);
    const searchWord = name.split(/\s+/);
    const filter = Contact.filter((customer: any) => {
      const custName = customer.name.toLowerCase().split(/\s+/);
      return searchWord.every((searchWord: string) =>
        custName.some((newWord: string) =>
          newWord.startsWith(searchWord.toLowerCase())
        )
      );
    });
    setFilterContact(filter);
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "companyName") {
      setIsCompanyEdited(true);
    }

    if (name === "ledgerName") {
      filterContact();
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (!isCompanyEdited) {
      setFormData((prev) => ({
        ...prev,
        companyName: prev.ledgerName,
      }));
    }
  }, [formData.ledgerName, isCompanyEdited]);

  const validateGST = (value: string) => {
    const gstRegex =
      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!value.trim()) return "GST Number is required";
    if (!gstRegex.test(value)) return "Invalid GST Number format";
    return "";
  };
  const handleGSTChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase(); // GST is usually uppercase
    setGstNumber(value);
    setError(validateGST(value));
  };
  const handleApply = () => {
    const validationError = validateGST(GstNumber);
    setError(validationError);
    if (!validationError) {
      setGstNumber(GstNumber);
      setFormData((pre) => ({
        ...pre,
        gstNumber: GstNumber,
      }));
      setShowModal(false);
    }
  };
  const handleGroupChange = (value: string | string[] | null) => {
    setFormData((prev) => ({
      ...prev,
      group: value as string,
    }));
  };
  const handleBankChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempBank((prev) => ({
      ...prev,
      [name]: name === "accountNumber" ? value.replace(/[^0-9]/g, "") : value,
    }));
  };

  const handleStatusChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      otherDetails: {
        ...prev.otherDetails,
        status: checked,
      },
    }));
  };

  const handleProofChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      proofDetails: { ...prev.proofDetails, [e.target.name]: e.target.value },
    }));
  };
  const handleDeliverDetailsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOtherDetailsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      otherDetails: {
        ...prev.otherDetails,
        [e.target.name]: e.target.value,
      },
    }));
  };
  const handleStateChange = (value: string | string[] | null) => {
    setFormData((prev) => ({
      ...prev,
      state: value as string,
    }));
  };


  const handleSalutationChange = (value: string | string[] | null) => {
    setFormData((prev) => ({
      ...prev,
      salutation: value as string,
    }));
  };
  const handleTabStateChange = (value: string | string[] | null) => {
    setTempAddress((pre) => ({
      ...pre,
      state: value as string,
    }));
  };

  const handleAddAddress = () => {
    const { addressLine1, district, state, pincode } = tempAddress;
    if (addressLine1 && district && state && pincode) {
      const id = tempAddress.id || addressIdCounter;

      setFormData((prev) => {
        const existingIndex = prev.deliveryDetails.findIndex(
          (a) => a.id === id
        );
        const newList =
          existingIndex !== -1
            ? prev.deliveryDetails.map((a) =>
                a.id === id ? { ...tempAddress, id } : a
              )
            : [...prev.deliveryDetails, { ...tempAddress, id }];

        return {
          ...prev,
          deliveryDetails: newList,
        };
      });

      if (!tempAddress.id) setAddressCounter((prev) => prev + 1);

      setTempAddress({
        id: 0,
        addressLine1: "",
        addressLine2: "",
        district: "",
        state: "",
        pincode: "",
      });

      setAddressInputError("");
    } else {
      setAddressInputError(
        "Please fill all fields before clicking 'Add Address'."
      );
    }
  };

  const handleEditDeliveryAddress = (id: number) => {
    const addressToEdit = formData.deliveryDetails.find((a) => a.id === id);
    if (addressToEdit) setTempAddress({ ...addressToEdit });
  };

  const handleRemoveDeliveryAddress = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      deliveryDetails: prev.deliveryDetails.filter((a) => a.id !== id),
    }));
  };

  const handleAddBank = () => {
    const { bankName, accountNumber, accountName, ifscCode, branchName } =
      tempBank;
    if (bankName && accountNumber && accountName && ifscCode && branchName) {
      const id = tempBank.id || bankIdCounter;

      setFormData((prev) => {
        const existingIndex = prev.bankDetails.findIndex((b) => b.id === id);
        const newList =
          existingIndex !== -1
            ? prev.bankDetails.map((b) =>
                b.id === id ? { ...tempBank, id } : b
              )
            : [...prev.bankDetails, { ...tempBank, id }];

        return {
          ...prev,
          bankDetails: newList,
        };
      });

      if (!tempBank.id) setBankIdCounter((prev) => prev + 1);

      setTempBank({
        id: 0,
        bankName: "",
        accountNumber: "",
        accountName: "",
        ifscCode: "",
        branchName: "",
      });

      setBankInputError("");
    } else {
      setBankInputError(
        "Please fill all bank details before clicking 'Add Bank'."
      );
    }
  };
  const handleEditBank = (id: number) => {
    const bankToEdit = formData.bankDetails.find((b) => b.id === id);
    if (bankToEdit) setTempBank({ ...bankToEdit });
  };
  const handleDeleteBank = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      bankDetails: prev.bankDetails.filter((b) => b.id !== id),
    }));
  };
  const handleCustomerType = (type: string) => {
    setCustomerType(type);
    type === "non-gst" && setShowModal(false);
  };
  const tabs = [
    { id: "Delivery_details", label: "Delivery Details" },
    { id: "Bank_details", label: "Bank Details" },
    { id: "Other_details", label: "Other Details" },
    { id: "Proof_details", label: "Proof Details" },
  ];
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log(formData);
  };
  const renderTabContent = () => {
    switch (activeTab) {
      case "Delivery_details":
        return (
          <div id="Delivery_Address">
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 px-4 py-2">
              <div className="lg:border-r lg:border-gray-300 lg:pr-4">
                <FormField
                  label="Delivery Address"
                  required
                  htmlFor="addressLine1"
                >
                  <Input
                    name="addressLine1"
                    className="form-control alphanumeric capitalize"
                    value={tempAddress.addressLine1}
                    onChange={handleDeliverDetailsChange}
                    placeholder="Enter Address Line 1"
                  />
                </FormField>
                <FormField label="" htmlFor="addressLine2">
                  <Input
                    name="addressLine2"
                    className="form-control alphanumeric capitalize"
                    value={tempAddress.addressLine2}
                    onChange={handleDeliverDetailsChange}
                    placeholder="Enter Address Line 2"
                  />
                </FormField>
                <FormField label="District" required htmlFor="district">
                  <Input
                    name="district"
                    className="form-control alphabet_only capitalize"
                    value={tempAddress.district}
                    onChange={handleDeliverDetailsChange}
                    placeholder="Enter district"
                    data-validate="required"
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
                <FormField label="Pincode" required htmlFor="pincode">
                  <Input
                    name="pincode"
                    className="form-control only_number no_space"
                    value={tempAddress.pincode}
                    onChange={handleDeliverDetailsChange}
                    placeholder="Enter Pincode"
                    data-validate="required"
                    maxLength={6}
                  />
                </FormField>
                <FormField label="">
                  {addressInputError && (
                    <div className="text-red-500 text-sm mt-2 text-start">
                      {addressInputError}
                    </div>
                  )}
                </FormField>
                <FormField label="">
                  <button
                    type="button"
                    onClick={handleAddAddress}
                    className="btn-sm btn-primary py-2"
                  >
                    Add Address
                  </button>
                </FormField>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 h-[150px]">
                {formData.deliveryDetails.map((addr, idx) => (
                  <div key={addr.id} className="border rounded p-4 shadow-sm">
                    <div className="mb-2 border-b border-gray-200">
                      <h4 className="text-gray-700 font-medium ">
                        Address {idx + 1}
                      </h4>
                    </div>
                    <div className="text-sm">
                      {addr.addressLine1},{" "}
                      {addr.addressLine2 && `${addr.addressLine2}, `}
                      {addr.district}
                      <br />
                      {addr.state}
                      <br />
                      Pincode: {addr.pincode}
                    </div>
                    <div className="pt-2 text-sm  text-blue-600 flex gap-2">
                      <button
                        className="cursor-pointer"
                        onClick={() => handleEditDeliveryAddress(addr.id)}
                      >
                        Edit
                      </button>
                      <span>|</span>
                      <button
                        className="cursor-pointer"
                        onClick={() => handleRemoveDeliveryAddress(addr.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case "Bank_details":
        return (
          <div id="Bank_details_tab_content">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 px-4 py-2">
              <div className="lg:border-r lg:border-gray-300 lg:pr-4">
                <div>
                  <FormField label="Account Name" required>
                    <Input
                      type="text"
                      name="accountName"
                      value={tempBank.accountName}
                      onChange={handleBankChange}
                      placeholder="Enter Account Name"
                      className="alphabet_only capitalize"
                    />
                  </FormField>
                  <FormField label="Account Number" required>
                    <Input
                      name="accountNumber"
                      type="text"
                      value={tempBank.accountNumber}
                      onChange={handleBankChange}
                      className="only_number no_space"
                      placeholder="Enter Account Number"
                      maxLength={18}
                    />
                  </FormField>
                  <FormField label="IFSC Code" required>
                    <Input
                      name="ifscCode"
                      type="text"
                      value={tempBank.ifscCode}
                      onChange={handleBankChange}
                      placeholder="Enter IFSC Code"
                      className="alphanumeric all_uppercase no_space"
                      maxLength={11}
                    />
                  </FormField>
                  <FormField label="Bank Name" required>
                    <Input
                      name="bankName"
                      type="text"
                      value={tempBank.bankName}
                      onChange={handleBankChange}
                      placeholder="Enter Bank Name"
                      className="alphabet_only capitalize"
                    />
                  </FormField>
                  <FormField label="Branch Name" required>
                    <Input
                      name="branchName"
                      type="text"
                      value={tempBank.branchName}
                      onChange={handleBankChange}
                      placeholder="Enter Branch Name"
                      className="alphabet_only capitalize"
                    />
                  </FormField>
                  <FormField label="">
                    {bankInputError && (
                      <div className="text-red-500 text-sm mt-2 text-start">
                        {bankInputError}
                      </div>
                    )}
                  </FormField>
                  <FormField label="">
                    <button
                      type="button"
                      onClick={handleAddBank}
                      className="btn-sm btn-primary py-2"
                    >
                      Add Bank
                    </button>
                  </FormField>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto text-sm text-left">
                  <thead className="text-[#475867]">
                    <tr>
                      <th className="px-3 py-2">S.No</th>
                      <th className="px-3 py-2">Account Name</th>
                      <th className="px-3 py-2">Account Number</th>
                      <th className="px-3 py-2">IFSC</th>
                      <th className="px-3 py-2">Bank</th>
                      <th className="px-3 py-2">Branch</th>
                      <th className="px-3 py-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#000000]">
                    {formData.bankDetails.map((bank, index) => (
                      <tr key={bank.id}>
                        <td className="px-3 py-2">{index + 1}</td>
                        <td className="px-3 py-2">{bank.accountName}</td>
                        <td className="px-3 py-2">{bank.accountNumber}</td>
                        <td className="px-3 py-2">{bank.ifscCode}</td>
                        <td className="px-3 py-2">{bank.bankName}</td>
                        <td className="px-3 py-2">{bank.branchName}</td>
                        <td className="px-3 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleEditBank(bank.id)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <i className="ri-pencil-line text-lg cursor-pointer"></i>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteBank(bank.id)}
                            className="text-red-500 hover:text-red-700 ml-2"
                          >
                            <i className="ri-delete-bin-line text-lg cursor-pointer"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {formData.bankDetails.length === 0 && (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-3 py-2 text-center text-gray-500"
                        >
                          No bank details added.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "Other_details":
        return (
          <div id="Other_details">
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 px-4 py-2">
              <div className="lg:pr-4">
                <FormField label="Credit Limit" htmlFor="creditLimit">
                  <Input
                    name="creditLimit"
                    className="form-control only_number no_space"
                    value={formData.otherDetails.creditLimit}
                    onChange={handleOtherDetailsChange}
                    placeholder="Enter Credit Limit"
                  />
                </FormField>
                <FormField label="Status">
                  <Toggle
                    name="status"
                    label="Active"
                    onChange={handleStatusChange}
                    checked={formData.otherDetails.status}
                  />
                </FormField>
              </div>
              <div></div>
            </div>
          </div>
        );

      case "Proof_details":
        return (
          <div id="Proof_details_tab_content">
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 px-4 py-2">
              <div className="  lg:pr-4">
                <FormField label="Aadhaar Number" htmlFor="aadhaarNumber">
                  <Input
                    name="aadhaarNumber"
                    value={formData.proofDetails.aadhaarNumber}
                    onChange={handleProofChange}
                    placeholder="Enter Aadhaar Number"
                    className="only_number"
                    maxLength={12}
                    data-validate="required"
                  />
                </FormField>
                <FormField label="PAN Number" htmlFor="panNumber">
                  <Input
                    name="panNumber"
                    value={formData.proofDetails.panNumber}
                    onChange={handleProofChange}
                    placeholder="Enter PAN Number"
                    className="alphanumeric all_uppercase no_space"
                    maxLength={10}
                    data-validate="required"
                  />
                </FormField>
              </div>
            </div>
          </div>
        );
      default:
        return (
          <div id="Delivery_Address">
            <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4 px-4 py-2">
              <div className="lg:border-r lg:border-gray-300 lg:pr-4">
                <FormField
                  label="Delivery Address"
                  required
                  htmlFor="addressLine1"
                >
                  <Input
                    name="addressLine1"
                    className="form-control alphanumeric capitalize"
                    value={tempAddress.addressLine1}
                    onChange={handleDeliverDetailsChange}
                    placeholder="Enter AddressLine1"
                  />
                </FormField>
                <FormField label="" htmlFor="addressLine2">
                  <Input
                    name="addressLine2"
                    className="form-control alphanumeric capitalize"
                    value={tempAddress.addressLine2}
                    onChange={handleDeliverDetailsChange}
                    placeholder="Enter AddressLine2"
                  />
                </FormField>
                <FormField label="District" required htmlFor="district">
                  <Input
                    name="district"
                    className="form-control alphabet_only capitalize"
                    value={tempAddress.district}
                    onChange={handleDeliverDetailsChange}
                    placeholder="Enter district"
                    data-validate="required"
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
                <FormField label="Pincode" required htmlFor="pincode">
                  <Input
                    name="pincode"
                    className="form-control only_number no_space"
                    value={tempAddress.pincode}
                    onChange={handleDeliverDetailsChange}
                    placeholder="Enter Pincode"
                    data-validate="required"
                    maxLength={6}
                  />
                </FormField>
                <FormField label="">
                  {addressInputError && (
                    <div className="text-red-500 text-sm mt-2 text-start">
                      {addressInputError}
                    </div>
                  )}
                </FormField>
                <FormField label="">
                  <button
                    type="button"
                    onClick={handleAddAddress}
                    className="btn-sm btn-primary py-2"
                  >
                    Add Address
                  </button>
                </FormField>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 h-[150px]">
                {formData.deliveryDetails.map((addr, idx) => (
                  <div key={addr.id} className="border rounded p-4 shadow-sm">
                    <div className="mb-2 border-b border-gray-200">
                      <h4 className="text-gray-700 font-medium ">
                        Address {idx + 1}
                      </h4>
                    </div>
                    <div className="text-sm">
                      {addr.addressLine1},{" "}
                      {addr.addressLine2 && `${addr.addressLine2}, `}
                      {addr.district}
                      <br />
                      {addr.state}
                      <br />
                      Pincode: {addr.pincode}
                    </div>
                    <div className="pt-2 text-sm  text-blue-600 flex gap-2">
                      <button
                        className="cursor-pointer"
                        onClick={() => handleEditDeliveryAddress(addr.id)}
                      >
                        Edit
                      </button>
                      <span>|</span>
                      <button
                        className="cursor-pointer"
                        onClick={() => handleRemoveDeliveryAddress(addr.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };
  return (
    <Layout pageTitle="Contact New">
      <div className="min-h-screen">
        <main id="main-content" className="flex-1">
          <div className="flex-1 overflow-y-auto h-[calc(100vh-104px)]">
            <form ref={formRef} onSubmit={handleSubmit} autoComplete="off">
              <div className="border-b border-gray-300">
                <div className="grid grid-cols-1 lg:grid-cols-2 px-4 py-2 mb-1">
                  <FormField label="Ledger Name" required htmlFor="ledgerName" className="!mb-0">
                    <div className="relative">
                      <div className="flex gap-2">
                        <SearchableSelect
                          name="salutation"
                          placeholder="Select state"
                          options={[{value:'Mr.',label:'Mr.'},{value:'Mrs.',label:'Mrs.'},{value:'Ms.',label:'Ms.'}]}
                          data-validate="required"
                          onChange={handleSalutationChange}
                          initialValue={formData.salutation}
                        />
                        <Input
                          data-validate="required"
                          name="ledgerName"
                          placeholder="Enter Name"
                          className="form-control lg:w-300 alphabet_only capitalize"
                          value={formData.ledgerName}
                          onChange={handleChange}
                        />
                      </div>

                      {/* Suggestion box positioned to the right of the input */}
                      {isShown &&
                        filteredContact &&
                        filteredContact.length > 0 && (
                          <div className="absolute top-0 left-full ml-2 bg-white border border-gray-200 rounded-sm shadow-lg p-3 z-[60] w-md max-w-md">
                            <div className="text-sm">
                              <span className="text-[#009333] font-medium">
                                Existing Names
                              </span>
                              {filteredContact.map((item, id) => (
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
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-4 px-4 py-4">
                <div className="space-y-4 lg:border-r lg:border-gray-300 lg:pr-4">
                  <FormField
                    label="Contact Type"
                    required
                    htmlFor="contactType"
                    className="!mt-0"
                  >
                    <RadioGroup
                
                      name="contactType"
                      options={[
                        { value: "customer", label: "Sundry creditors" },
                        { value: "supplier", label: "Sundry debtors" },
                      ]}
                      onChange={(e) =>
                        setFormData((pre) => ({
                          ...pre,
                          contactType: e.target.value,
                        }))
                      }
                      
                    />
                  </FormField>
                  <FormField label="Group" htmlFor="group">
                    <SearchableSelect
                      name="group"
                      options={countryOptions}
                      searchable
                      multiple={true}
                      onChange={handleGroupChange}
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
                      className="form-control w-full only_number"
                      data-validate="required"
                      maxLength={10}
                      value={formData.phoneNumber}
                      onChange={handleChange}
                    />
                  </FormField>
                  <FormField label="Email" htmlFor="email">
                    <Input
                      name="email"
                      placeholder="Enter Email"
                      className="form-control w-full"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </FormField>
                  <FormField label="Alternate Number">
                    <Input
                      name="alternateNumber"
                      placeholder="Enter Alternate Number"
                      className="form-control w-full only_number"
                      maxLength={10}
                      value={formData.alternateNumber}
                      onChange={handleChange}
                    />
                  </FormField>
                </div>
                <div className="space-y-4">
                  <FormField label="Company Name" required>
                    <Input
                      name="companyName"
                      placeholder="Enter Company Name"
                      className="form-control w-full capitalize"
                      value={formData.companyName}
                      onChange={handleChange}
                    />
                  </FormField>
                  <FormField label="Billing address" required>
                    <Input
                      name="addressLine1"
                      placeholder="Enter Address Line 1"
                      className="form-control w-full capitalize"
                      value={formData.addressLine1}
                      onChange={handleChange}
                    />
                  </FormField>
                  <FormField label="">
                    <Input
                      name="addressLine2"
                      placeholder="Enter Address Line 2"
                      className="form-control w-full capitalize"
                      value={formData.addressLine2}
                      onChange={handleChange}
                    />
                  </FormField>

                  <FormField label="District">
                    <Input
                      name="district"
                      placeholder="Enter District"
                      className="form-control w-full alphabetnumeric capitalize"
                      value={formData.district}
                      onChange={handleChange}
                    />
                  </FormField>
                  <FormField label="State" required htmlFor="state">
                    <SearchableSelect
                      name="state"
                      placeholder="Select state"
                      options={stateOptions}
                      searchable
                      data-validate="required"
                      onChange={handleStateChange}
                      initialValue={formData.state}
                    />
                  </FormField>
                  <FormField label="Pincode">
                    <Input
                      name="pincode"
                      placeholder="Enter Pincode"
                      className="w-full only_number no_space"
                      maxLength={6}
                      value={formData.pincode}
                      onChange={handleChange}
                    />
                  </FormField>
                  {formData.gstNumber && (
                    <FormField label="GST Number" required>
                      <Input
                        name="gstNumber"
                        placeholder="Enter GST Number"
                        className="w-full form-control alphanumeric no_space all_uppercase"
                        maxLength={15}
                        value={formData.gstNumber}
                        readOnly={true}
                      />
                    </FormField>
                  )}
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
        <footer className="bg-[#ebeff3] py-3 h-[53.9px] px-4 flex justify-start gap-2">
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
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center p-4 z-50">
          <div className="bg-[#f1eef4] rounded-[40px] border border-white max-w-[470px] w-full text-center mx-4 mt-10 p-4.5">
            <div className="bg-white rounded-[20px]  p-8 relative max-w-[470px] w-full text-center">
              <div className="flex justify-center items-center mb-5 gap-2">
                <i className="ri-user-line text-green-600 text-3xl"></i>
                <h2 className="text-[#000000] text-2xl">
                  Select Customer Type
                </h2>
              </div>
              <p className="text-md text-gray-600 mb-7">
                Choose the customer type that best describes your business
              </p>
              <div className="flex gap-4 justify-center">
                <button
                  type="button"
                  onClick={() => handleCustomerType("gst")}
                  className={`text-sm cursor-pointer  px-4 py-2 w-full ${
                    customerType === "gst"
                      ? "bg-[#009333] text-white"
                      : "bg-[#f3f4f6] hover:bg-[#009333] hover:text-white text-gray-800"
                  } `}
                >
                  GST Customer
                </button>
                <button
                  type="button"
                  onClick={() => handleCustomerType("non-gst")}
                  className="text-sm cursor-pointer bg-[#f3f4f6] hover:bg-[#009333] hover:text-white text-gray-800 px-4 py-2  w-full"
                >
                  Non - GST Customer
                </button>
              </div>
              {customerType === "gst" && (
                <div className="mt-3">
                  <label className="text-sm font-medium mb-1 block text-start">
                    GST Number
                  </label>
                  <div className="flex flex-col gap-1">
                    <Input
                      name="gstNumber"
                      className={` ${error && "border-red-500"}`}
                      placeholder="Enter GST Number"
                      autoComplete="off"
                      value={GstNumber}
                      maxLength={15}
                      onChange={handleGSTChange}
                    />
                    {error && (
                      <div className="text-red-500 text-sm transition-opacity duration-300">
                        {error}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 ">
                    <button
                      className="btn-sm btn-primary ml-2  py-2 px-4"
                      onClick={handleApply}
                    >
                      <i className="ri-checkbox-circle-line mr-1 text-[17px]"></i>
                      <span className="text-[15px]">Apply</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
