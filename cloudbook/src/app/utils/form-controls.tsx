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
      <div className="flex flex-wrap items-center space-x-6 space-y-3">
        {options.map((option) => (
          <label key={option.value} className="inline-flex items-center text-sm cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option.value}
              className="form-radio cursor-pointer"
              checked={selectedValue === option.value}
              onChange={handleChange}
              {...props}
            />
            <span className="ml-1.5 text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};


export const CheckboxGroup = ({
  name,
  options,
  defaultValues = [],
  onChange: externalOnChange,
  ...props
}: {
  name: string;
  options: { value: any }[];
  defaultValues?: string[];
  onChange?: (values: string[]) => void;
  [key: string]: any;
}) => {
  // Initialize state directly with defaultValues.
  // This value will only be used on the first render.
  const [selectedValues, setSelectedValues] = useState<string[]>(defaultValues);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const newSelected = event.target.checked
      ? [...selectedValues, value]
      : selectedValues.filter((v) => v !== value);

    setSelectedValues(newSelected);
    if (externalOnChange) externalOnChange(newSelected);
  };

  return (
    <div className="flex flex-wrap gap-4" {...props}>
      {options.map((option) => (
        <input
          key={option.value}
          type="checkbox"
          name={name}
          value={option.value}
          className="form-checkbox"
          checked={selectedValues.includes(option.value)}
          onChange={handleChange}
         
        />

      ))}
    </div>
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