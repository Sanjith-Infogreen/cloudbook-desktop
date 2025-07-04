 "use client";

import React, { useState, useEffect } from "react";

// Input Component
export const Input = ({
  name,
  placeholder,
  type = "text",
  className = "",
  ...props
}: {
  name: string;
  placeholder?: string;
  type?: string;
  className?: string;
  [key: string]: any;
}) => (
  <input
    type={type}
    name={name}
    placeholder={placeholder}
    className={`form-control ${className}`}
    {...props}
  />
);

// Radio Group Component
export const RadioGroup = ({
  name,
  options,
  required = false,
  id,
  defaultValue,
  onChange: externalOnChange,
  ...props
}: {
  name: string;
  options: { value: string; label: string }[];
  required?: boolean;
  id?: string;
  defaultValue?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  [key: string]: any;
}) => {
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue || "");

  useEffect(() => {
    setSelectedValue(defaultValue || "");
  }, [defaultValue]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    setSelectedValue(newValue);
    if (externalOnChange) externalOnChange(event);
  };

  return (
    <div id={id} className="flex flex-col" {...(required ? { "data-validate": "required" } : {})}>
      <div className="flex flex-wrap items-center gap-6">
        {options.map((option) => (
          <label key={option.value} className="inline-flex items-center text-sm cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option.value}
              className="form-radio h-4 w-4 text-green-600 border-gray-300 focus:ring-green-500 rounded-full"
              checked={selectedValue === option.value}
              onChange={handleChange}
              {...props}
            />
            <span className="ml-2 text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};


export const CheckboxGroup = ({
  name,
  value, // The single value this checkbox represents
  label, // Optional: for displaying a label next to the checkbox
  defaultChecked = false, // Use defaultChecked for initial state
  onChange: externalOnChange,
  ...props
}: {
  name: string;
  value: string;
  label?: string;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  [key: string]: any;
}) => {
  // Initialize state directly with defaultChecked.
  const [isChecked, setIsChecked] = useState<boolean>(defaultChecked);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setIsChecked(checked);
    if (externalOnChange) externalOnChange(checked);
  };

  return (
    <label className="inline-flex items-center" {...props}>
      <input
        type="checkbox"
        name={name}
        value={value}
        className="form-checkbox"
        checked={isChecked}
        onChange={handleChange}
      />
      {label && <span className="ml-2">{label}</span>}
    </label>
  );
};
// Toggle Component
export const Toggle = ({
  name,
  checked,
  onChange,
  label,
  ...props
}: {
  name: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  [key: string]: any;
}) => (
    <label className="relative inline-flex items-center cursor-pointer">
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

      {label && <span className="ml-3 text-sm font-medium text-gray-900">{label}</span>}
    </label>
);