"use client";
import React, { ReactNode, useState, useEffect } from "react";
// Import SearchableSelect and its Option type
import SearchableSelect, { Option } from "@/app/utils/searchableSelect";

// Props for the main Reminders component
interface RemindersProps {
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

// Toggle switch component
const Toggle: React.FC<ToggleProps> = ({
  name,
  checked,
  onChange,
  label,
  className,
  ...props
}) => (
  <label
    className={`relative inline-flex items-center cursor-pointer ${className}`}
  >
    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      className="sr-only peer"
      {...props}
    />

    <div className="w-7.5 h-4 bg-white rounded-full border border-gray-300 peer-checked:bg-[#009333] transition-colors" />

    <div className="absolute left-0.5 top-0.2 w-2.5 h-2.5 bg-[#bfbfbf] rounded-full shadow transition-transform peer-checked:translate-x-4 peer-checked:bg-white" />

    {label && (
      <span className="ml-3 text-sm font-medium text-gray-900">{label}</span>
    )}
  </label>
);

// Define the structure for all form data across different tabs

// Interface for Reminder details
interface ReminderDetails {
  type: "invoice" | "bill";
  name: string;
  scheduleDays: number;
  scheduleTime: "After" | "Before";
  scheduleBasis: string; // e.g., 'expected payment date', 'due date'
  toEmail: string;
  ccEmail: string;
  bccEmail: string;
  enabled: boolean;
}

// Props for the ReminderModal component
interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (details: ReminderDetails) => void;
  initialDetails: ReminderDetails;
}

// Reminder Modal Component
const ReminderModal: React.FC<ReminderModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialDetails,
}) => {
  const [details, setDetails] = useState<ReminderDetails>(initialDetails);

  useEffect(() => {
    setDetails(initialDetails); // Update modal state when initialDetails prop changes
  }, [initialDetails]);

  if (!isOpen) return null;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDetails((prev) => ({ ...prev, enabled: e.target.checked }));
  };

  const handleSubmit = () => {
    onSave(details);
    onClose();
  };

  // Dummy options for Cc/Bcc dropdowns, now typed as Option[] for SearchableSelect
  const emailOptions: Option[] = [
    { value: "", label: "Select Email" },
    { value: "email1@example.com", label: "email1@example.com" },
    { value: "email2@example.com", label: "email2@example.com" },
    { value: "support@example.com", label: "support@example.com" },
    { value: "admin@example.com", label: "admin@example.com" },
  ];

  // Options for scheduleTime, typed as Option[] for SearchableSelect
  const scheduleTimeOptions: Option[] = [
    { value: "Before", label: "Before" },
    { value: "After", label: "After" },
  ];

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-md w-full max-w-[50%] h-[60vh] flex flex-col "
        
      >
        <div className="relative border-b border-[#dee2e6] px-4 py-2 bg-[#f8f8f8] rounded-tl-md">
          <span className="text-[16px] text-[#212529]"> Automated Reminders - Bills</span>
          <button
            onClick={onClose}
            className="absolute -top-[10px] -right-[10px] text-gray-500 hover:text-gray-700 bg-[#909090] hover:bg-[#cc0000] rounded-full w-[30px] h-[30px] border-2 border-white cursor-pointer"
          >
            <i className="ri-close-line text-white"></i>
          </button>
        </div>

        <div className=" overflow-hidden">
          <div className="space-y-4 p-5 text-sm">
            {/* Remind row */}
            <FormField label="Remind" htmlFor="scheduleDays">
              <div className="grid grid-cols-[80px_60px_1fr_auto] items-center gap-3">
                <input
                  type="text"
                  id="scheduleDays"
                  name="scheduleDays"
                  value={details.scheduleDays}
                  onChange={handleInputChange}
                  className="p-2 border border-gray-300 rounded-sm focus:outline-none focus:border-green-600"
                />
                <span>day(s)</span>
                <SearchableSelect
                  name="scheduleTime"
                  initialValue={details.scheduleTime}
                  onChange={(value: any) =>
                    setDetails((prev) => ({
                      ...prev,
                      scheduleTime: value as "After" | "Before",
                    }))
                  }
                  options={scheduleTimeOptions}
                  className="w-full"
                  searchable={false}
                  placeholder="Select time"
                />
                <span>{details.scheduleBasis}</span>
              </div>
            </FormField>

            {/* Email fields */}
            <FormField label="Email To" htmlFor="toEmail">
              <input
                type="email"
                id="toEmail"
                name="toEmail"
                value={details.toEmail}
                onChange={handleInputChange}
                className="p-2 border border-gray-300 rounded-sm focus:outline-none focus:border-green-600 w-full"
              />
            </FormField>
            <FormField label="Cc" htmlFor="ccEmail">
              <SearchableSelect
                name="ccEmail"
                initialValue={details.ccEmail}
                onChange={(value: any) =>
                  setDetails((prev) => ({ ...prev, ccEmail: value as string }))
                }
                options={emailOptions}
                className="w-full"
                searchable={true}
                placeholder="Select Cc email"
              />
            </FormField>
            <FormField label="Bcc" htmlFor="bccEmail">
              <SearchableSelect
                name="bccEmail"
                initialValue={details.bccEmail}
                onChange={(value: any) =>
                  setDetails((prev) => ({ ...prev, bccEmail: value as string }))
                }
                options={emailOptions}
                className="w-full"
                searchable={true}
                placeholder="Select Bcc email"
              />
            </FormField>
          </div>

          {/* Enable checkbox */}
          <div className="flex items-center gap-2 bg-[#f9f9fb] py-3 px-5 border-t border-gray-200">
            <input
              type="checkbox"
              id="enabled"
              checked={details.enabled}
              onChange={handleToggleChange}
              className="accent-[#009333] cursor-pointer"
            />
            <label
              htmlFor="enabled"
              className="text-sm text-gray-700 cursor-pointer"
            >
              Enable this reminder
            </label>
          </div>

          {/* ✅ Divider */}
          <hr className="border-t border-gray-200" />

          {/* ✅ Button alignment improved */}
          <div className="flex justify-end gap-3 py-4 px-5">
            <button
              onClick={handleSubmit}
              className="btn-sm btn-primary min-w-[80px]"
            >
              Save
            </button>
            <button
              onClick={onClose}
              className="btn-sm btn-secondary min-w-[80px]"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Reminders: React.FC<RemindersProps> = ({
  activeReport,
  activeCategory,
}) => {
  // State to manage the currently active tab
  const [activeTab, setActiveTab] = useState<string>("invoices"); // Default to 'invoices'

  const [invoiceReminders, setInvoiceReminders] = useState<{
    [key: string]: ReminderDetails;
  }>({
    paymentExpected: {
      type: "invoice",
      name: "Payment Expected",
      scheduleDays: 0,
      scheduleTime: "After",
      scheduleBasis: "expected payment date",
      toEmail: "abc@gmail.com",
      ccEmail: "",
      bccEmail: "",
      enabled: false,
    },
    reminder1: {
      type: "invoice",
      name: "Reminder - 1",
      scheduleDays: 0,
      scheduleTime: "After",
      scheduleBasis: "due date",
      toEmail: "",
      ccEmail: "",
      bccEmail: "",
      enabled: false,
    },
    reminder2: {
      type: "invoice",
      name: "Reminder - 2",
      scheduleDays: 0,
      scheduleTime: "After",
      scheduleBasis: "due date",
      toEmail: "",
      ccEmail: "",
      bccEmail: "",
      enabled: false,
    },
    reminder3: {
      type: "invoice",
      name: "Reminder - 3",
      scheduleDays: 0,
      scheduleTime: "After",
      scheduleBasis: "due date",
      toEmail: "",
      ccEmail: "",
      bccEmail: "",
      enabled: false,
    },
  });

  const [billReminders, setBillReminders] = useState<{
    [key: string]: ReminderDetails;
  }>({
    paymentExpected: {
      type: "bill",
      name: "Payment Expected",
      scheduleDays: 0,
      scheduleTime: "Before",
      scheduleBasis: "expected payment date",
      toEmail: "",
      ccEmail: "",
      bccEmail: "",
      enabled: false,
    },
    defaultReminder: {
      type: "bill",
      name: "Default",
      scheduleDays: 0,
      scheduleTime: "Before",
      scheduleBasis: "bill due date",
      toEmail: "",
      ccEmail: "",
      bccEmail: "",
      enabled: false,
    },
  });

  // State for modal visibility and current reminder being edited
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentReminder, setCurrentReminder] =
    useState<ReminderDetails | null>(null);

  // Function to open the modal with specific reminder details
  const openModal = (reminder: ReminderDetails) => {
    setCurrentReminder(reminder);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentReminder(null);
  };

  // Function to save reminder details from the modal
  const handleSaveReminder = (updatedDetails: ReminderDetails) => {
    if (updatedDetails.type === "invoice") {
      setInvoiceReminders((prev) => ({
        ...prev,
        [updatedDetails.name.toLowerCase().replace(/[^a-z0-9]/g, "")]:
          updatedDetails, // Simple key generation
      }));
    } else if (updatedDetails.type === "bill") {
      setBillReminders((prev) => ({
        ...prev,
        [updatedDetails.name.toLowerCase().replace(/[^a-z0-9]/g, "")]:
          updatedDetails, // Simple key generation
      }));
    }
  };

  // Renders content based on the active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "invoices":
        return (
  <div className="p-4 pt-0 mt-7">
    {/* Manual Reminders */}
    <h2 className="text-[16px] font-medium ms-1 mb-3">Manual Reminders</h2>

    <div className="overflow-x-auto rounded-lg border border-gray-200 mb-8">
      <table className="w-full table-fixed text-sm text-left">
        <thead className="text-gray-500 font-semibold border-b border-gray-200">
          <tr>
            <th className="ps-3.5 pr-[6.5px] py-[6.5px] text-[11px] text-[#6c718a] w-[30%]">NAME</th>
            <th className="p-[6.5px] text-[11px] text-[#6c718a] w-[50%]">DESCRIPTION</th>
            <th className="p-[6.5px] text-[11px] text-[#6c718a] w-[10%] text-center"></th>
            <th className="p-[6.5px] text-[11px] text-[#6c718a] w-[10%] text-center">ACTIONS</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white text-[13px]">
          {/* Row 1 */}
          <tr>
            <td className="p-[6.5px] ps-4 font-medium cursor-pointer text-[#009333] hover:text-green-800">
              Reminder For Overdue Invoices
            </td>
            <td className="p-[6.5px]">
              You can send this reminder to your customers manually, from an overdue invoice's details page.
            </td>
            <td className="p-[6.5px] text-center"></td>
            <td className="p-[6.5px] text-center relative group">
              <button
                className="px-1.5 py-0.5 rounded-sm border border-[#ebeaf2] bg-white transition duration-150 cursor-pointer"
                onClick={() => openModal(invoiceReminders.paymentExpected)}
              >
                <i className="ri-pencil-line text-[#bbb8c6] text-base"></i>
                <div className="absolute bottom-[55%] left-1/2 -translate-x-1/2 mb-2 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                  <div className="bg-gray-800 text-white text-xs px-2 py-2 rounded">Edit</div>
                  <div className="w-2 h-2 rotate-45 bg-gray-800 mt-[-4px]"></div>
                </div>
              </button>
            </td>
          </tr>

          {/* Row 2 */}
          <tr>
            <td className="py-[6.5px] ps-4 pr-[6.5px] text-[#009333] font-medium cursor-pointer hover:text-green-800">
              Reminder For Sent Invoices
            </td>
            <td className="p-[6.5px]">
              You can send this reminder to your customers manually, from a sent (but not overdue) details page.
            </td>
            <td className="p-[6.5px] text-center"></td>
            <td className="p-[6.5px] text-center relative group">
              <button
                className="px-1.5 py-0.5 rounded-sm border border-[#ebeaf2] bg-white transition duration-150 cursor-pointer"
                onClick={() => openModal(invoiceReminders.paymentExpected)}
              >
                <i className="ri-pencil-line text-[#bbb8c6] text-base"></i>
                <div className="absolute bottom-[55%] left-1/2 -translate-x-1/2 mb-2 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                  <div className="bg-gray-800 text-white text-xs px-2 py-2 rounded">Edit</div>
                  <div className="w-2 h-2 rotate-45 bg-gray-800 mt-[-4px]"></div>
                </div>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    {/* Automated Reminders */}
    <div className="mt-8 pt-0">
      <h2 className="text-[16px] font-medium ms-1 mb-3">Automated Reminders</h2>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full table-fixed text-sm text-left">
          <thead className="text-gray-500 font-semibold border-b border-gray-200">
            <tr>
              <th className="ps-3.5 pr-[6.5px] py-[6.5px] text-[11px] text-[#6c718a] w-[30%]">NAME</th>
              <th className="p-[6.5px] text-[11px] text-[#6c718a] w-[50%]">SCHEDULE</th>
              <th className="p-[6.5px] text-[11px] text-[#6c718a] w-[10%] text-center">STATUS</th>
              <th className="p-[6.5px] text-[11px] text-[#6c718a] w-[10%] text-center">ACTIONS</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200 text-[13px]">
            {/* Section: Expected Payment Date */}
            <tr className="bg-[#f9f9fb]">
              <td colSpan={4} className="px-4 py-3 text-[12px]">
                Reminders Based on Expected Payment Date
              </td>
            </tr>
            <tr>
              <td className="py-[6.5px] ps-4 pr-[6.5px] text-[#009333] cursor-pointer hover:text-green-800">
                <div className="flex items-center gap-1">
                  {invoiceReminders.paymentExpected.name}
                  <i className="ri-information-2-fill text-[16px] text-[#bdbbbc] cursor-pointer"></i>
                </div>
              </td>
              <td className="p-[6.5px]">
                Remind me {invoiceReminders.paymentExpected.scheduleDays} day(s)
                {invoiceReminders.paymentExpected.scheduleTime}
                {invoiceReminders.paymentExpected.scheduleBasis}
              </td>
              <td className="p-[6.5px] text-center">
                <Toggle
                  name="paymentExpectedInvoice"
                  checked={invoiceReminders.paymentExpected.enabled}
                  onChange={() => openModal(invoiceReminders.paymentExpected)}
                />
              </td>
              <td className="p-[6.5px] text-center relative group">
                <button
                  className="px-1.5 py-0.5 rounded-sm border border-[#ebeaf2] bg-white transition duration-150 cursor-pointer"
                  onClick={() => openModal(invoiceReminders.paymentExpected)}
                >
                  <i className="ri-pencil-line text-[#bbb8c6] text-base"></i>
                  <div className="absolute bottom-[55%] left-1/2 -translate-x-1/2 mb-2 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                    <div className="bg-gray-800 text-white text-xs px-2 py-2 rounded">Edit</div>
                    <div className="w-2 h-2 rotate-45 bg-gray-800 mt-[-4px]"></div>
                  </div>
                </button>
              </td>
            </tr>

            {/* Section: Due Date */}
            <tr className="bg-gray-50 font-medium">
              <td colSpan={4} className="p-[6.5px] ps-4">
                Reminders Based on Due Date
              </td>
            </tr>

            {Object.keys(invoiceReminders)
              .filter((key) => key.startsWith("reminder"))
              .map((key) => {
                const reminder = invoiceReminders[key];
                return (
                  <tr key={key}>
                    <td className="py-[6.5px] ps-4 pr-[6.5px] text-[#009333] cursor-pointer hover:text-green-800">
                      {reminder.name}
                    </td>
                    <td className="p-[6.5px]">
                      Remind me {reminder.scheduleDays} day(s) {reminder.scheduleTime} {reminder.scheduleBasis}
                    </td>
                    <td className="p-[6.5px] text-center">
                      <Toggle
                        name={key}
                        checked={reminder.enabled}
                        onChange={() => openModal(reminder)}
                      />
                    </td>
                    <td className="p-[6.5px] text-center relative group">
                      <button
                        className="px-1.5 py-0.5 rounded border border-gray-300 bg-white transition duration-150 cursor-pointer"
                        onClick={() => openModal(reminder)}
                      >
                        <i className="ri-more-2-line text-gray-600 text-base"></i>
                        <div className="absolute bottom-[74%] left-1/2 -translate-x-1/2 mb-2 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                          <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded">More</div>
                          <div className="w-2 h-2 rotate-45 bg-gray-800 mt-[-4px]"></div>
                        </div>
                      </button>
                    </td>
                  </tr>
                );
              })}

            {/* New Reminder Row */}
            <tr>
              <td colSpan={4} className="px-4 py-2 cursor-pointer">
                <div className="inline-flex items-center space-x-2 text-sm font-medium">
                  <i className="ri-add-circle-fill text-lg leading-none text-[#009333] hover:text-green-800" />
                  <span className="leading-none">New Reminder</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
);


      case "bills":
        return (
          <div className="p-4">
            <h2 className="text-[16px] font-medium ms-1 mb-3">
              Automated Reminders
            </h2>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-sm text-left">
                <thead className=" text-gray-500 font-semibold">
                  <tr>
                    <th className="px-4 py-2 text-[11px] text-[#6c718a] w-20%">
                      NAME
                    </th>
                    <th className="px-4 py-2 text-[11px] text-[#6c718a] w-40%">
                      SCHEDULE
                    </th>
                    <th className="px-4 py-2 text-[11px] text-[#6c718a] w-20% text-center">
                      STATUS
                    </th>
                    <th className="px-4 py-2 text-[11px] text-[#6c718a] w-20% text-center">
                      ACTIONS
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200 bg-white text-[13px]">
                  {/* Section: Expected Payment Date */}
                  <tr className="bg-[#f9f9fb] font-medium">
                    <td colSpan={4} className="px-4 py-2">
                      Reminders Based on Expected Payment Date
                    </td>
                  </tr>
                  <tr>
                    <td className="py-[6.5px] ps-4 pr-[6.5px] text-[#009333] cursor-pointer hover:text-green-800">
                      <div className="flex items-center gap-1">
                        {billReminders.paymentExpected.name}
                        <i className="ri-information-2-fill text-lg text-gray-400" />
                      </div>
                    </td>
                    <td className="p-[6.5px]">
                      {billReminders.paymentExpected.scheduleDays} day(s)
                      {billReminders.paymentExpected.scheduleTime}
                    </td>
                    <td className="p-[6.5px] text-center">
                      <Toggle
                        name="paymentExpectedBill"
                        checked={billReminders.paymentExpected.enabled}
                        onChange={() =>
                          openModal(billReminders.paymentExpected)
                        } // Open modal on toggle click
                      />
                    </td>
                    <td className="p-[6.5px] text-center relative group">
                      <button
                        className="px-1.5 py-0.5 rounded-sm border border-[#ebeaf2] transition duration-150 cursor-pointer bg-white"
                        onClick={() => openModal(billReminders.paymentExpected)}
                      >
                        <i className="ri-pencil-line text-[#bbb8c6] text-base"></i>

                        {/* Tooltip with arrow */}
                        <div className="absolute bottom-[55%] left-1/2 -translate-x-1/2 mb-2 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                          <div className="bg-gray-800 text-white text-xs px-2 py-2 rounded">
                            Edit
                          </div>
                          <div className="w-2 h-2 rotate-45 bg-gray-800 mt-[-4px]"></div>
                        </div>
                      </button>
                    </td>
                  </tr>

                  {/* Section: Due Date */}
                  <tr className="bg-gray-50 font-medium">
                    <td colSpan={4} className="p-[6.5px] ps-4">
                      Reminders Based on Due Date
                    </td>
                  </tr>
                  <tr>
                    <td className="py-[6.5px] ps-4 pr-[6.5px] text-[#009333] hover:text-green-800 cursor-pointer">
                      {billReminders.defaultReminder.name}
                    </td>
                    <td className="p-[6.5px]">
                      Reminder will be sent{" "}
                      {billReminders.defaultReminder.scheduleDays} day(s){" "}
                      {billReminders.defaultReminder.scheduleTime} the{" "}
                      {billReminders.defaultReminder.scheduleBasis}.
                    </td>
                    <td className="p-[6.5px] text-center">
                      <Toggle
                        name="defaultReminderBill"
                        checked={billReminders.defaultReminder.enabled}
                        onChange={() =>
                          openModal(billReminders.defaultReminder)
                        } // Open modal on toggle click
                      />
                    </td>
                    <td className="p-[6.5px] text-center relative group">
                      <button
                        className="px-1.5 py-0.5 rounded border border-gray-300 bg-white transition duration-150 cursor-pointer"
                        onClick={() => openModal(billReminders.defaultReminder)}
                      >
                        <i className="ri-more-2-line text-gray-600 text-base"></i>

                        {/* Tooltip with arrow */}
                        <div className="absolute bottom-[74%] left-1/2 -translate-x-1/2 mb-2 flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                          <div className="bg-gray-800 text-white text-xs px-2 py-1 rounded">
                            More
                          </div>
                          <div className="w-2 h-2 rotate-45 bg-gray-800 mt-[-4px]"></div>
                        </div>
                      </button>
                    </td>
                  </tr>

                  {/* Add New Reminder */}
                   <tr>
                      <td colSpan={4} className="px-4 py-2 cursor-pointer">
                        <div className="inline-flex items-center space-x-2 text-sm font-medium ">
                          <i className="ri-add-circle-fill text-lg leading-none text-[#009333] hover:text-green-800" />
                          <span className="leading-none">New Reminder</span>
                        </div>
                      </td>
                    </tr>
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
      <div className="bg-white  z-10">
        {/* Header */}
        <div className="px-4 py-2.5 ">
          <h2 className="text-2xl font-bold text-gray-800">Reminders</h2>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap border-b border-gray-200 px-4 mt-1">
          {["invoices", "bills"].map((tab) => (
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
              {tab
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Tab Content */}
      <div className="flex-grow overflow-y-auto px-4 ">
        {renderTabContent()}
      </div>

      {/* Modal */}
      {currentReminder && (
        <ReminderModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onSave={handleSaveReminder}
          initialDetails={currentReminder}
        />
      )}
    </div>
  );
};

export default Reminders;
