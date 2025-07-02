// app/utils/form-controls.tsx
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
    <div id={id} className="flex flex-col" {...(required ? { "data-validate": "required" } : {})} {...props}>
      <div className="flex flex-wrap items-center gap-6">
        {options.map((option) => (
          <label key={option.value} className="inline-flex items-center text-sm">
            <input
              type="radio"
              name={name}
              value={option.value}
              className="form-radio text-[#009333] focus:ring-[#009333]"
              checked={selectedValue === option.value}
              onChange={handleChange}
            />
            <span className="ml-2">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

// Checkbox Group Component
export const CheckboxGroup = ({
  name,
  options,
  defaultValues = [],
  onChange: externalOnChange,
  ...props
}: {
  name: string;
  options: { value: string; label: string }[];
  defaultValues?: string[];
  onChange?: (values: string[]) => void;
  [key: string]: any;
}) => {
  const [selectedValues, setSelectedValues] = useState<string[]>(defaultValues);

  useEffect(() => {
    setSelectedValues(defaultValues);
  }, [defaultValues]);

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
        <label key={option.value} className="inline-flex items-center text-sm">
          <input
            type="checkbox"
            name={name}
            value={option.value}
           className="form-checkbox text-[#009333] focus:ring-2 focus:ring-[#009333] focus:outline-none"

            checked={selectedValues.includes(option.value)}
            onChange={handleChange}
          />
          <span className="ml-2">{option.label}</span>
        </label>
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
  <label className="inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      className="sr-only peer"
      {...props}
    />
  <div className="w-7.5 h-4 bg-white rounded-full border border-gray-300 peer-checked:bg-[#009333] transition-colors relative after:content-[''] after:absolute after:top-[0.125rem] after:left-[0.125rem] after:w-2.5 after:h-2.5 after:bg-[#bfbfbf] after:rounded-full after:shadow after:transition-transform peer-checked:after:translate-x-3.5 peer-checked:after:bg-white" />

    {label && <span className="ml-3 text-sm">{label}</span>}
  </label>
);
