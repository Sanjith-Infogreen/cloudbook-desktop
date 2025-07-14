import { Input } from '@/app/utils/form-controls';
import React, { ReactNode, useState, useEffect } from 'react';

 
interface RadioGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
  options: { value: string; label: string }[];
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ options, name, value, onChange }) => (
  <div className="flex flex-wrap gap-4">
    {options.map((option) => (
      <label key={option.value} className="inline-flex items-center">
        <input
          type="radio"
          name={name}
          value={option.value}
          checked={value === option.value}
          onChange={onChange}
          className="form-radio h-4 w-4 text-[#009333] focus:ring-[#009333] border-gray-300 rounded"
        />
        <span className="ml-2 text-gray-700">{option.label}</span>
      </label>
    ))}
  </div>
);


// Props for the main Branding component
interface BrandingProps {
  activeReport?: string | null; // Made optional as it's not used in the provided snippet
  activeCategory?: string | null; // Made optional as it's not used in the provided snippet
}

// Props for a generic form field wrapper
interface FormFieldProps {
  label: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
  error?: string;
  htmlFor?: string;
}

// FormField wrapper component for consistent styling and error display
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

// Props for a generic Select dropdown component
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: { value: string; label: string }[];
}

// A simple Select dropdown component
const Select: React.FC<SelectProps> = ({ options, className, ...rest }) => (
  <select
    className={` w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009333] ${className}`}
    {...rest}
  >
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

// Define the structure for all form data across different tabs
interface FormData {
  basicData: {
    proprietorSalutation: string;
    proprietorName: string;
    companyName: string;
    phoneNumber: string;
    alternateNumber: string;
    emailId: string;
    financialMonth: string;
  };
  addressDetails: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    landmark: string;
  };
  bankDetails: {
    bankName: string;
    ifscCode: string;
    accountNo: string;
    upi: string;
    branchName: string;
  };
  proofDetails: {
    gstNumber: string;
    panNumber: string;
    aadharNumber: string;
    fssaiNumber: string;
    billPrefix: string;
    logo: string;
  };
}

const Branding: React.FC<BrandingProps> = ({ activeReport, activeCategory }) => {
  // State to manage the currently active tab
  const [activeTab, setActiveTab] = useState<string>("basicData"); // Default to 'basicData'

  // State to hold all form data
  const [formData, setFormData] = useState<FormData>({
    basicData: {
      proprietorSalutation: "Mr.",
      proprietorName: "",
      companyName: "",
      phoneNumber: "",
      alternateNumber: "",
      emailId: "",
      financialMonth: "",
    },
    addressDetails: {
      address: "",
      city: "",
      state: "Tamil Nadu", // Default state
      zipCode: "",
      country: "India", // Default country
      landmark: "",
    },
    bankDetails: {
      bankName: "",
      ifscCode: "",
      accountNo: "",
      upi: "",
      branchName: "",
    },
    proofDetails: {
      gstNumber: "",
      panNumber: "",
      aadharNumber: "",
      fssaiNumber: "",
      billPrefix: "",
      logo: "",
    },
  });

 
  const proprietorSalutationOptions = [
    { value: "Mr.", label: "Mr." },
    { value: "Mrs.", label: "Mrs." },
    { value: "Ms.", label: "Ms." },
    { value: "Miss.", label: "Miss." },
    { value: "Dr.", label: "Dr." },
  ];

 
  const states = [
    { value: "Andaman and Nicobar Islands", label: "Andaman and Nicobar Islands" },
    { value: "Andhra Pradesh", label: "Andhra Pradesh" },
    { value: "Andhra Pradesh (New)", label: "Andhra Pradesh (New)" },
    { value: "Arunachal Pradesh", label: "Arunachal Pradesh" },
    { value: "Assam", label: "Assam" },
    { value: "Bihar", label: "Bihar" },
    { value: "Chandigarh", label: "Chandigarh" },
    { value: "Chattisgarh", label: "Chattisgarh" },
    { value: "Dadra and Nagar Haveli", label: "Dadra and Nagar Haveli" },
    { value: "Daman and Diu", label: "Daman and Diu" },
    { value: "Delhi", label: "Delhi" },
    { value: "Goa", label: "Goa" },
    { value: "Gujarat", label: "Gujarat" },
    { value: "Haryana", label: "Haryana" },
    { value: "Himachal Pradesh", label: "Himachal Pradesh" },
    { value: "Jammu and Kashmir", label: "Jammu and Kashmir" },
    { value: "Jharkhand", label: "Jharkhand" },
    { value: "Karnataka", label: "Karnataka" },
    { value: "Kerala", label: "Kerala" },
    { value: "Lakshadweep Islands", label: "Lakshadweep Islands" },
    { value: "Madhya Pradesh", label: "Madhya Pradesh" },
    { value: "Maharashtra", label: "Maharashtra" },
    { value: "Manipur", label: "Manipur" },
    { value: "Meghalaya", label: "Meghalaya" },
    { value: "Mizoram", label: "Mizoram" },
    { value: "Nagaland", label: "Nagaland" },
    { value: "Odisha", label: "Odisha" },
    { value: "Pondicherry", label: "Pondicherry" },
    { value: "Punjab", label: "Punjab" },
    { value: "Rajasthan", label: "Rajasthan" },
    { value: "Sikkim", label: "Sikkim" },
    { value: "Tamil Nadu", label: "Tamil Nadu" },
    { value: "Telangana", label: "Telangana" },
    { value: "Tripura", label: "Tripura" },
    { value: "Uttar Pradesh", label: "Uttar Pradesh" },
    { value: "Uttarakhand", label: "Uttarakhand" },
    { value: "West Bengal", label: "West Bengal" },
  ];

 
  const handleChange = (section: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value,
      },
    }));
  };

 
  const handleRadioChange = (section: keyof FormData, name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [name]: value,
      },
    }));
  };

  // Renders content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "basicData":
        return (
          <div id="basicData" className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 py-2">
            <div className="md:pr-4">
              <FormField label="Proprietor Name" htmlFor="proprietorSalutation">
                <RadioGroup
                  name="proprietorSalutation"
                  options={proprietorSalutationOptions}
                  value={formData.basicData.proprietorSalutation}
                  onChange={(e) => handleRadioChange('basicData', 'proprietorSalutation', e.target.value)}
                />
              </FormField>
              <FormField label="Proprietor Name" htmlFor="proprietorName">
                <Input
                  name="proprietorName"
                  placeholder="Enter Proprietor Name"
                  className=""
                  value={formData.basicData.proprietorName}
                  onChange={handleChange('basicData')}
                />
              </FormField>
              <FormField label="Company Name" htmlFor="companyName">
                <Input
                  name="companyName"
                  placeholder="Enter Company Name"
                  className=""
                  value={formData.basicData.companyName}
                  onChange={handleChange('basicData')}
                />
              </FormField>
              <FormField label="Phone Number" htmlFor="phoneNumber">
                <Input
                  name="phoneNumber"
                  placeholder="Enter Phone Number"
                  className=" only_number"
                  value={formData.basicData.phoneNumber}
                  onChange={handleChange('basicData')}
                />
              </FormField>
            </div>
            <div className="md:pl-4">
              <FormField label="Alternate Number" htmlFor="alternateNumber">
                <Input
                  name="alternateNumber"
                  placeholder="Enter Alternate Number"
                  className=" only_number"
                  value={formData.basicData.alternateNumber}
                  onChange={handleChange('basicData')}
                />
              </FormField>
              <FormField label="Email Id" htmlFor="emailId">
                <Input
                  name="emailId"
                  type="email"
                  placeholder="Enter Email Id"
                  className=""
                  value={formData.basicData.emailId}
                  onChange={handleChange('basicData')}
                />
              </FormField>
              <FormField label="Financial Month" htmlFor="financialMonth">
                <Input
                  name="financialMonth"
                  placeholder="Enter Financial Month"
                  className=""
                  value={formData.basicData.financialMonth}
                  onChange={handleChange('basicData')}
                />
              </FormField>
            </div>
          </div>
        );

      case "addressDetails":
        return (
          <div id="addressDetails" className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 py-2">
            <div className="md:pr-4">
              <FormField label="Address" htmlFor="address">
                <Input
                  name="address"
                  placeholder="Enter Address"
                  className=""
                  value={formData.addressDetails.address}
                  onChange={handleChange('addressDetails')}
                />
              </FormField>
              <FormField label="City" htmlFor="city">
                <Input
                  name="city"
                  placeholder="Enter City"
                  className=""
                  value={formData.addressDetails.city}
                  onChange={handleChange('addressDetails')}
                />
              </FormField>
              <FormField label="State" htmlFor="state">
                <Select
                  name="state"
                  options={states}
                  value={formData.addressDetails.state}
                  onChange={handleChange('addressDetails')}
                />
              </FormField>
            </div>
            <div className="md:pl-4">
              <FormField label="Zip Code" htmlFor="zipCode">
                <Input
                  name="zipCode"
                  placeholder="Enter Zip Code"
                  className=" only_number"
                  value={formData.addressDetails.zipCode}
                  onChange={handleChange('addressDetails')}
                />
              </FormField>
              <FormField label="Country" htmlFor="country">
                <Select
                  name="country"
                  options={[{ value: "India", label: "India" }]}
                  value={formData.addressDetails.country}
                  onChange={handleChange('addressDetails')}
                />
              </FormField>
              <FormField label="Landmark" htmlFor="landmark">
                <Input
                  name="landmark"
                  placeholder="Enter Landmark"
                  className=""
                  value={formData.addressDetails.landmark}
                  onChange={handleChange('addressDetails')}
                />
              </FormField>
            </div>
          </div>
        );

      case "bankDetails":
        return (
          <div id="bankDetails" className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 py-2">
            <div className="md:pr-4">
              <FormField label="Bank Name" htmlFor="bankName">
                <Input
                  name="bankName"
                  placeholder="Enter Bank Name"
                  className=""
                  value={formData.bankDetails.bankName}
                  onChange={handleChange('bankDetails')}
                />
              </FormField>
              <FormField label="IFSC Code" htmlFor="ifscCode">
                <Input
                  name="ifscCode"
                  placeholder="Enter IFSC Code"
                  className=""
                  value={formData.bankDetails.ifscCode}
                  onChange={handleChange('bankDetails')}
                />
              </FormField>
            </div>
            <div className="md:pl-4">
              <FormField label="Account No" htmlFor="accountNo">
                <Input
                  name="accountNo"
                  placeholder="Enter Account Number"
                  className=" only_number"
                  value={formData.bankDetails.accountNo}
                  onChange={handleChange('bankDetails')}
                />
              </FormField>
              <FormField label="UPI" htmlFor="upi">
                <Input
                  name="upi"
                  placeholder="Enter UPI ID"
                  className=""
                  value={formData.bankDetails.upi}
                  onChange={handleChange('bankDetails')}
                />
              </FormField>
              <FormField label="Branch Name" htmlFor="branchName">
                <Input
                  name="branchName"
                  placeholder="Enter Branch Name"
                  className=""
                  value={formData.bankDetails.branchName}
                  onChange={handleChange('bankDetails')}
                />
              </FormField>
            </div>
          </div>
        );

      case "proofDetails":
        return (
          <div id="proofDetails" className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 py-2">
            <div className="md:pr-4">
              <FormField label="GST Number" htmlFor="gstNumber">
                <Input
                  name="gstNumber"
                  placeholder="Enter GST Number"
                  className=""
                  value={formData.proofDetails.gstNumber}
                  onChange={handleChange('proofDetails')}
                />
              </FormField>
              <FormField label="Pan Number" htmlFor="panNumber">
                <Input
                  name="panNumber"
                  placeholder="Enter Pan Number"
                  className=""
                  value={formData.proofDetails.panNumber}
                  onChange={handleChange('proofDetails')}
                />
              </FormField>
              <FormField label="Aadhar Number" htmlFor="aadharNumber">
                <Input
                  name="aadharNumber"
                  placeholder="Enter Aadhar Number"
                  className=" only_number"
                  value={formData.proofDetails.aadharNumber}
                  onChange={handleChange('proofDetails')}
                />
              </FormField>
            </div>
            <div className="md:pl-4">
              <FormField label="FSSAI Number" htmlFor="fssaiNumber">
                <Input
                  name="fssaiNumber"
                  placeholder="Enter FSSAI Number"
                  className=""
                  value={formData.proofDetails.fssaiNumber}
                  onChange={handleChange('proofDetails')}
                />
              </FormField>
              <FormField label="Bill Prefix" htmlFor="billPrefix">
                <Input
                  name="billPrefix"
                  placeholder="Enter Bill Prefix"
                  className=""
                  value={formData.proofDetails.billPrefix}
                  onChange={handleChange('proofDetails')}
                />
              </FormField>
              <FormField label="Logo URL" htmlFor="logo">
                <Input
                  name="logo"
                  placeholder="Enter Logo URL"
                  className=""
                  value={formData.proofDetails.logo}
                  onChange={handleChange('proofDetails')}
                />
              </FormField>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col"> {/* Added a wrapper div */}
      <div className="p-2 bg-white flex-grow overflow-y-auto max-h-[calc(100vh-105px)]  h-[calc(100vh-105px)]">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Brand Settings</h2>

        {/* Tab Navigation */}
        <div className="flex flex-wrap border-b border-gray-200 mb-4">
          {["basicData", "addressDetails", "bankDetails", "proofDetails"].map((tab) => (
            <button
              key={tab}
              className={`py-2 px-4 text-sm font-medium focus:outline-none transition-colors duration-200
                ${activeTab === tab
                  ? "border-b-2 border-[#009333] text-[#009333]"
                  : "text-gray-600 hover:text-[#009333] hover:border-[#009333]"
                }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())} {/* Converts camelCase to Title Case */}
            </button>
          ))}
        </div>

        {/* Render the tab content here */}
        <div className="mt-6 border border-gray-200 rounded-md p-4">
          {renderTabContent()}
        </div>
      </div>
      <footer className="bg-[#ebeff3] py-3 h-[53.9px] px-4 flex justify-start gap-2">
        <button
          type="submit"
          className="btn-sm btn-primary"
        >
          Save
        </button>
        <button
          type="button"
          className="btn-sm btn-secondary"
        >
          Cancel
        </button>
      </footer>
    </div>
  );
};

export default Branding;
