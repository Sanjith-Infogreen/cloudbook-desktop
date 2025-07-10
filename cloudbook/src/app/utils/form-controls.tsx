"use client";

import React, { useState, useEffect } from "react";

// Input Component
export const Input = ({
  name,
  placeholder,
  type = "text",
  className = "",
  readOnly="",
  ...props
}: {
  name: string;
  placeholder?: string;
  type?: string;
  className?: string;
  readonly?:boolean;
  [key: string]: any;
}) => (
  <input
    type={type}
    name={name}
    placeholder={placeholder}
    className={`form-control ${className}`}
    readOnly={readOnly}
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
    <div id={id} className="flex flex-col mt-2" {...(required ? { "data-validate": "required" } : {})}>
      <div className="flex flex-wrap items-center space-x-6 ">
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
  value,

  // Make 'checked' and 'onChange' optional
  checked: controlledChecked, // Rename to avoid conflict with internal state
  onChange: controlledOnChange, // Rename to avoid conflict with internal handler
  defaultChecked = false, // Add defaultChecked for uncontrolled behavior
  ...props
}: {
  name: string;
  value: string;

  checked?: boolean; // Now optional
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void; // Now optional
  defaultChecked?: boolean; // New optional prop
  [key: string]: any;
}) => {
  // Determine if the component is being used in a controlled manner
  // It's controlled if 'controlledChecked' (the 'checked' prop) is provided.
  const isControlled = typeof controlledChecked === 'boolean';


  const [internalChecked, setInternalChecked] = useState<boolean>(defaultChecked);
 
  const checkboxChecked = isControlled ? controlledChecked : internalChecked;
 
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
     if (isControlled && controlledOnChange) {
      controlledOnChange(event);
    } else {
      setInternalChecked(event.target.checked);
    }
  };

  return (
    <label className="inline-flex items-center cursor-pointer" {...props}>
      <input
        type="checkbox"
        name={name}
        value={value}
        className="form-checkbox cursor-pointer"
        checked={checkboxChecked} // Dynamically determined checked state
        onChange={handleInputChange} // Dynamically determined change handler
      />

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
  <label className="relative inline-flex items-center cursor-pointer mt-2">
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
