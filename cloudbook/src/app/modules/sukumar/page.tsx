// app/expense/new/page.tsx
"use client";

import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import Layout from "../../components/Layout";

import { useSearchParams } from "next/navigation";
import DatePicker from "@/app/utils/commonDatepicker";
import TableShimmer from "@/app/utils/tableShimmer";
import CommonTypeahead from "@/app/utils/commonTypehead";

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

const NewExpense = () => {
  // Initialize expenseCategory with an empty string
  const [date, setDate] = useState<string | undefined>("01/07/2025");
  const [toDate, setToDate] = useState<string | undefined>("02/07/2025");
  const data = [
    {
      id: 1,
      name: "Aaaaaaaaaaaaaaaa",
      description:
        "This is a detailed description for Aaaaaaaaaaaaaaaa item with more information about its features and usage.",
    },
    {
      id: 2,
      name: "Ad Agency Solutions",
      description:
        "Professional advertising and marketing solutions for businesses of all sizes.",
    },
    {
      id: 3,
      name: "Anil Alta Technologies",
      description: "Advanced technology solutions and IT services provider.",
    },
    {
      id: 4,
      name: "Anil Maggie Foods",
      description:
        "Quality food products and catering services for various occasions.",
    },
    {
      id: 5,
      name: "Anil Kumar Enterprises",
      description:
        "Multi-business enterprise offering various commercial services.",
    },
    {
      id: 6,
      name: "Arun Suppliers",
      description:
        "Reliable supplier of industrial and commercial goods and materials.",
    },
    {
      id: 7,
      name: "Asdfasf Industries",
      description:
        "Manufacturing and industrial solutions provider with quality products.",
    },
    {
      id: 8,
      name: "Alpha Beta Corp",
      description: "Corporate solutions and business consulting services.",
    },
    {
      id: 9,
      name: "Amazing Products Ltd",
      description: "Innovative product development and distribution company.",
    },
    {
      id: 10,
      name: "Advance Systems",
      description:
        "Advanced system integration and technical support services.",
    },
  ];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log("From Date:", date + "\n" + "To Date:", toDate);
  };
 const handleAddNewName = () => {
        console.log("Add new name clicked");
        // Handle add new logic here
    };

  return (
    <Layout pageTitle="Expense New">
      <div className="flex-1">
        <main id="main-content" className="flex-1 overflow-y-auto">
          <div className="px-4 py-6 h-[calc(100vh-103px)] overflow-y-auto">
            <label htmlFor="date">From Date</label>
            <DatePicker
              name="date"
              id="date"
              selected={date}
              initialDate={date}
              onChange={(e) => {
                setDate(e);
              }}
              className="w-1/4"
            />
            <br />
            <label htmlFor="toDate">To Date</label>
            <DatePicker
              name="toDate"
              id="toDate"
              selected={toDate}
              initialDate={toDate}
              disablePast={true}
              onChange={(e) => {
                setToDate(e);
              }}
              className="w-1/4"
            />

            <br />
            <table className="w-full">
              <thead className="sticky-table-header">
                <tr>
                  <th className="th-cell" id="checkboxColumn">
                    <input
                      type="checkbox"
                      id="selectAll"
                      className="form-check"
                    />
                  </th>
                  <th className="th-cell">
                    <div className="flex justify-between items-center gap-1">
                      <span>S.No.</span>
                    </div>
                  </th>
                  <th className="th-cell">
                    <div className="flex justify-between items-center gap-1">
                      <span>TripSheetId</span>
                      <i className="dropdown-icon-hover ri-arrow-down-s-fill"></i>
                    </div>
                  </th>
                  <th className="th-cell">
                    <div className="flex justify-between items-center gap-1">
                      <span>ExpenseCategory</span>
                      <i className="dropdown-icon-hover ri-arrow-down-s-fill"></i>
                    </div>
                  </th>
                  <th className="th-cell">
                    <div className="flex justify-between items-center gap-1">
                      <span>Amount</span>
                      <i className="dropdown-icon-hover ri-arrow-down-s-fill"></i>
                    </div>
                  </th>
                  <th className="th-cell">
                    <div className="flex justify-between items-center gap-1">
                      <span>Remarks</span>
                      <i className="dropdown-icon-hover ri-arrow-down-s-fill"></i>
                    </div>
                  </th>
                  <th className="th-cell">
                    <div className="flex justify-between items-center gap-1">
                      <span>ExpenseDate</span>
                      <i className="dropdown-icon-hover ri-arrow-down-s-fill"></i>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <TableShimmer rows={10} columns={7} loading={true} />
              </tbody>
            </table>

            <br />

           <div className="grid grid-cols-2">
 <CommonTypeahead
              name="name"
              className="w-1/2"
              placeholder="Enter name"
              data={data}
              required={true}
              searchFields={["name"]}
              displayField="name"
              minSearchLength={1}
              onAddNew={handleAddNewName}
            />
           </div>
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

export default NewExpense;
