"use client";
import React, { ReactNode, useState, useEffect } from "react";
// Import SearchableSelect and its Option type (if needed, not directly used in this snippet but kept for context)
import SearchableSelect, { Option } from "@/app/utils/searchableSelect";
import { Toggle } from "@/app/utils/form-controls";
// Props for a generic form field wrapper (kept for context, not directly used in the current table layout)
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
      )}
    </div>
  </div>
);

// Props for the Toggle component
interface ToggleProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  className?: string;
}

// Define the structure for SMS Template data
interface SMSTemplate {
  id: string;
  notificationType: string;
  module: string;
  smsContent: string;
  description: string; // Added description field for the text below notification type
  status: boolean;
  specialLinkText?: string; // Optional: Add a property for a special link if needed for specific templates
  specialLinkUrl?: string;
}

// Props for the main SMSNotifications component
interface SMSNotificationsProps {
  // These props are not used in the current component structure but kept if context implies external control
  activeReport?: string | null;
  activeCategory?: string | null;
}

const SMSNotifications: React.FC<SMSNotificationsProps> = () => {
  // State to manage the currently active tab
  const [activeTab, setActiveTab] = useState<string>("smsTemplates"); // Default to 'smsTemplates' as per image
  const [isOpen, setIsOpen] = useState(false);
  // State to manage SMS templates data
  const [smsTemplates, setSmsTemplates] = useState<SMSTemplate[]>([
    {
      id: "customerBalance",
      notificationType: "Customer Balance",
      module: "Contact",
      smsContent:
        "Dear customer,\nYou have a total outstanding balance of %CustomerBalance%. Please make the payment as soon as possible.\nBest regards,\n%CompanyName%",
      description:
        "Send an SMS to notify customers about their current outstanding balance and to make the payment.",
      status: false, // Updated status as per provided HTML/image
    },
    {
      id: "quoteDetails",
      notificationType: "Quote Details",
      module: "Quote",
      smsContent:
        "Dear customer,\nWe've created an quote - %EstimateNumber% for you. View the quote at %EstimateURL% to proceed further.\nLooking forward to hearing from you.",
      description:
        "Allow customers to view and approve quotes by sending SMS notifications manually.",
      status: false, // Updated status as per provided HTML/image
    },
    {
      id: "invoiceDetails",
      notificationType: "Invoice Details",
      module: "Invoice",
      smsContent:
        "Dear customer,\nYour outstanding balance for invoice %InvoiceNumber% is %InvoiceBalance%. Please visit %InvoiceURL% to pay for your invoice.\nThank you.", // Added "Thank you."
      description:
        "An SMS notification will be sent to your customer when recurring invoices are automatically sent or when you notify via SMS about the invoice manually.",
      status: false, // Updated status as per provided HTML/image
    },
    {
      id: "paymentReminder",
      notificationType: "Payment Reminder",
      module: "Invoice",
      smsContent:
        "Dear customer,\nThis is a friendly reminder that a payment of %InvoiceBalance% is pending. View your invoice at %InvoiceURL% and ensure that you pay before the due date.\nThank you for your business.",
      description:
        "A Payment Reminder SMS will be sent to your customer based on the reminder preferences that you've set in the Reminders tab.",
      status: false,
      specialLinkText: "Configure Reminders",
      specialLinkUrl: "#", // Placeholder URL
    },
    {
      id: "paymentThankYou",
      notificationType: "Payment Thank-you",
      module: "Invoice",
      smsContent:
        "Dear customer,\nThank you for your recent payment of %PaymentReceived% towards your invoice.\n- %CompanyName%",
      description:
        "A Payment Thank You SMS will be sent to your customer when your customer pays you online or if you choose to send it while recording the payment manually.",
      status: true,
    },
    {
      id: "paymentRetry",
      notificationType: "Payment Retry",
      module: "Invoice",
      smsContent:
        "Your payment method could not be charged automatically. We'll try to process the payment again on %DueRenewalDate%. If required,you can update your payment method at %InvoiceURL% for a hassle-free experience\n- %CompanyName%",
      description:
        "A Payment Retry Reminder SMS will be sent to your customer based on the retry preferences that you've set.",
      status: false,
    },
  ]);

  // Handle toggle change for SMS template status
  const handleTemplateStatusChange = (templateId: string) => {
    setSmsTemplates((prevTemplates) =>
      prevTemplates.map((template) =>
        template.id === templateId
          ? { ...template, status: !template.status }
          : template
      )
    );
  };

  // Renders content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="p-4 pt-0 mt-7">
            <h2 className="text-[16px] font-medium ms-1 mb-3">
              Overview Content Here
            </h2>
            <p className="text-gray-600">
              This section would display a general overview of SMS
              notifications, such as summary statistics or recent activity.
            </p>
          </div>
        );

      case "smsTemplates":
        return (
          <div className=" pt-0  bg-[#fafafa]">
           <div className="flex items-center px-3 py-5">
      <span className="text-[#6c718a] text-[13px] font-bold mr-2">
        VIEW BY:
      </span>

      <div className="relative">
        <select
          onFocus={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          className="appearance-none bg-white border-none text-gray-700 py-1 px-3 pr-8 rounded leading-tight focus:outline-none focus:border-[#009333] text-sm"
        >
          <option>All</option>
          <option>Active</option>
          <option>Inactive</option>
        </select>

        <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-500">
          <i
            className={`text-base ${
              isOpen ? "ri-arrow-up-s-line" : "ri-arrow-down-s-line"
            }`}
          />
        </div>
      </div>
    </div>

            <div className="overflow-x-auto rounded-lg  mb-8">
              <table className="w-full text-sm text-left">
                <thead className="text-gray-500 font-semibold border-b border-t border-gray-200 sticky top-0 bg-[#f9f9fb] z-10">
                  <tr>
                    <th className="align-bottom ps-4 pr-[6.5px] py-[6.5px] text-[11px] text-[#6c718a] w-[31.08%]">
                      NOTIFICATION TYPE
                    </th>
                    <th className="align-bottom p-[6.5px] text-[11px] text-[#6c718a] w-[8.11%]">
                      MODULE
                    </th>
                    <th className="align-bottom p-[6.5px] text-[11px] text-[#6c718a] w-[47.3%]">
                      SMS CONTENT
                    </th>
                    <th className=" p-[6.5px] text-[11px] text-[#6c718a] w-[13.51%] text-center">
                     NOTIFICATION<br />STATUS
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white text-[13px]">
                  {smsTemplates.map((template) => (
                    <tr
                      key={template.id}
                      className="hover:bg-[#f6f6fa] cursor-pointer"
                    >
                      <td className="py-[30px] ps-[20px] pr-[6.5px]  font-medium text-gray-800">
                        <div>
                          <div className="flex items-center  font-semibold  mb-3">
                            {template.notificationType}
                          </div>

                          <p className="text-[13px] text-[#6c718a] mb-3">
                            {template.description}
                          </p>

                          {template.specialLinkText && (
                            <a
                              href={template.specialLinkUrl}
                              className="text-[#009333] hover:text-green-800 text-xs mt-1 inline-block"
                            >
                              {template.specialLinkText}
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="py-[30px] px-[6.5px] text-[13px]">
                        {template.module}
                      </td>
                      <td className="py-[30px]  px-[6.5px]">
                        <div className="sms-preview-layout">
                          <div className="mb-3 flex justify-between items-center text-[13px]">
                            <span className="font-medium">SMS Template 1</span>
                            <button className="cursor-pointer text-[#009333]  ">
                              Change Template
                            </button>
                          </div>

                          <div className="relative inline-block w-full p-3  cursor-pointer whitespace-pre-wrap text-[13px] bg-[#f9f9fb] border border-dashed border-[#dcdcdc] rounded text-start  ">
                            <button className="absolute top-2 right-2 text-[#009333] hover:text-green-800">
                              <i className="ri-eye-line text-[16px]"></i>
                            </button>
                            <span className="block pr-6 ">
                              {template.smsContent}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-[30px] ps-[6.5px] pr-[30px] text-center">
                        <Toggle
                          name={`toggle-${template.id}`}
                          checked={template.status}
                          onChange={() =>
                            handleTemplateStatusChange(template.id)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col max-h-[calc(100vh-60px)] bg-white">
      {/* Fixed Header + Tabs */}
      <div className="bg-white z-10">
        {/* Header */}
        <div className="px-4 py-2.5">
          <h2 className="text-2xl font-bold text-gray-800">
            SMS Notifications
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap border-b border-gray-200 px-4 mt-1">
          {["overview", "smsTemplates"].map((tab) => (
            <button
              key={tab}
              className={`py-2 px-4 text-sm font-medium focus:outline-none transition-colors duration-200 border-b-2
                ${
                  activeTab === tab
                    ? "border-[#009333] text-[#009333]"
                    : "border-transparent text-gray-600 hover:text-[#009333]"
                }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "overview" ? "Overview" : "SMS Templates"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-grow overflow-y-auto ">{renderTabContent()}</div>
    </div>
  );
};

export default SMSNotifications;
