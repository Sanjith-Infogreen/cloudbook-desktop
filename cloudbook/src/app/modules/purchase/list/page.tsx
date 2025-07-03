// app/expense/new/page.tsx
"use client";

import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import Layout from "../../../components/Layout";

import { useSearchParams } from "next/navigation";
import DatePicker from "@/app/utils/commonDatepicker";
import TableShimmer from "@/app/utils/tableShimmer";
import CommonTypeahead from "@/app/utils/commonTypehead";
import { useDispatch, useSelector } from "react-redux";
import { setTypeHead } from "@/store/typeHead/typehead";
import { AppDispatch, RootState } from "@/store/store";

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
  const dispatch = useDispatch<AppDispatch>();
  const typeHead = useSelector((state: RootState) => state.typeHead.typeHead);

useEffect(()=>{
  if(typeHead.length===0){
    fetchTypeHead()
  }
},[])


  const fetchTypeHead = async () => {
  try {
    const res = await fetch("http://localhost:4000/typeHeadData");

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();
    dispatch(setTypeHead(data))

    
    
  } catch (error) {
    console.error("Fetch error:", error);
  }
};

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log("From Date:", date + "\n" + "To Date:", toDate);
  };
  const handleAddNewName = () => {
    console.log("Add new name clicked");
    // Handle add new logic here
  };
  const handleNameSelect = (name: any) => {
    console.log("Selected name:", name);
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
                placeholder="Enter name"
                data={typeHead}
                required={true}
                searchFields={["name"]}
                displayField="name"
                minSearchLength={1}
                onAddNew={handleAddNewName}
                onSelect={handleNameSelect}
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
