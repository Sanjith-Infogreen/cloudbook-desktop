// app/expense/new/page.tsx
"use client";

import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import Layout from "../../components/Layout";

import { useSearchParams } from "next/navigation";
import DatePicker from "@/app/utils/commonDatepicker";

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
  const [date,setDate]=useState<string | undefined>("01/07/2025")
  const [toDate,setToDate]=useState<string | undefined>("01/07/2025")

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
  };

  

 function parseDMYtoJSDate(dateString: string | undefined): Date | undefined {
    if (!dateString) return undefined;
    const parts = dateString.split("/");
    if (parts.length === 3) {
      const [day, month, year] = parts.map(Number);
      return new Date(year, month - 1, day);
    }
    return undefined;
  }



  return (
    <Layout pageTitle="Expense New">
      <div className="flex-1">
        <main id="main-content" className="flex-1 overflow-y-auto">
          <div className="px-4 py-6 h-[calc(100vh-103px)] overflow-y-auto">
           
           <DatePicker name="date" id="date"  selected={parseDMYtoJSDate(date)}  onChange={(e)=>{
            setDate(e);
            
           }} className="w-1/4"/>




           <DatePicker name="toDate" id="toDate"  selected={parseDMYtoJSDate(toDate)}  onChange={(e)=>{
            setToDate(e);
            
           }} className="w-1/4"/>
          </div>
        </main>
        <footer className="bg-[#ebeff3] py-3 h-[56.9px] px-4 flex justify-start gap-2">
          <button onClick={handleSubmit} className="btn-sm btn-primary">
            Save
          </button>
          <button
            className="btn-secondary btn-sm"
            
          >
            Cancel
          </button>
        </footer>
      </div>
    </Layout>
  );
};

export default NewExpense;