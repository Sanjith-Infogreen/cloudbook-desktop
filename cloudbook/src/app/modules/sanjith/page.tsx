 'use client';

import { useState } from 'react';
import SearchableSelect, { Option } from '@/app/utils/searchableSelect'; // Adjust path if needed

const Page: React.FC = () => {
  const [selectedFruit, setSelectedFruit] = useState<string | null>(null);
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['india', 'canada']); // Array for multiple
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedMultiColors, setSelectedMultiColors] = useState<string[]>([]); // New state for multi-select color

  const fruitOptions: Option[] = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'orange', label: 'Orange' },
    { value: 'grape', label: 'Grape' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'mango', label: 'Mango' },
    { value: 'pineapple', label: 'Pineapple' },
    { value: 'blueberry', label: 'Blueberry' },
    { value: 'watermelon', label: 'Watermelon' },
    { value: 'kiwi', label: 'Kiwi' },
    { value: 'peach', label: 'Peach' },
    { value: 'cherry', label: 'Cherry' },
    { value: 'papaya', label: 'Papaya' },
    { value: 'plum', label: 'Plum' },
    { value: 'raspberry', label: 'Raspberry' },
  ];
  
  const countryOptions: Option[] = [
    { value: 'usa', label: 'United States' },
    { value: 'canada', label: 'Canada' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'india', label: 'India' },
    { value: 'australia', label: 'Australia' },
    { value: 'germany', label: 'Germany' },
  ];

  const colorOptions: Option[] = [
    { value: 'red', label: 'Red' },
    { value: 'blue', label: 'Blue' },
    { value: 'green', label: 'Green' },
    { value: 'yellow', label: 'Yellow' },
    { value: 'purple', label: 'Purple' },
  ];

  const handleFruitChange = (value: string | string[] | null) => {
    console.log('Selected Fruit:', value);
    setSelectedFruit(value as string | null);  
  };

  const handleCountryChange = (value: string | string[] | null) => {
    console.log('Selected Countries:', value);
    setSelectedCountries(value as string[]); // Cast for multi-select state
  };

  const handleColorChange = (value: string | string[] | null) => {
    console.log('Selected Color:', value);
    setSelectedColor(value as string | null);
  };

  const handleMultiColorChange = (value: string | string[] | null) => {
    console.log('Selected Multi-Colors:', value);
    setSelectedMultiColors(value as string[]);
  };

  const handleAddNewItem = () => {
    console.log('Add New button clicked!');
    alert('Add New functionality would go here!');
  };

  const handleRefreshOptions = () => {
    console.log('Refresh options clicked!');
    alert('Refresh options functionality would go here!');
    // In a real app, you would refetch options here.
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Searchable Select Examples</h1>

      {/* Single Select Fruit */}
      <div className="mb-6">
        <label htmlFor="fruit-select" className="block text-sm font-medium text-gray-700 mb-1">
          Select a Fruit (Searchable)
        </label>
        <SearchableSelect
          id="fruit-select"
          name="fruit"
          options={fruitOptions}
          placeholder="Choose a fruit"
          searchable
          onChange={handleFruitChange}
          initialValue={selectedFruit}
          onAddNew={handleAddNewItem}
        />
        {selectedFruit && <p className="mt-2 text-sm text-gray-600">Currently selected: {selectedFruit}</p>}
      </div>

      <hr className="my-6" />

      {/* Multi-Select Countries */}
      <div className="mb-6">
        <label htmlFor="country-select-multi" className="block text-sm font-medium text-gray-700 mb-1">
          Select Countries (Multi-Select, Initial Value & Refresh)
        </label>
        <SearchableSelect
          id="country-select-multi"
          name="countries"
          options={countryOptions}
          placeholder="Pick countries"
          searchable
          onChange={handleCountryChange}
          initialValue={selectedCountries}
          onRefresh={handleRefreshOptions}
          multiple // Enable multiple selection
        />
        {selectedCountries.length > 0 && (
          <p className="mt-2 text-sm text-gray-600">Currently selected: {selectedCountries.join(', ')}</p>
        )}
      </div>

      <hr className="my-6" />

      {/* Non-searchable Single Select Color */}
      <div className="mb-6">
        <label htmlFor="color-select" className="block text-sm font-medium text-gray-700 mb-1">
          Select a Color (Non-Searchable)
        </label>
        <SearchableSelect
          id="color-select"
          name="color"
          options={colorOptions}
          placeholder="Choose a color"
          searchable={false}
          onChange={handleColorChange}
          initialValue={selectedColor}
        />
        {selectedColor && <p className="mt-2 text-sm text-gray-600">Currently selected: {selectedColor}</p>}
      </div>

      <hr className="my-6" />

      {/* Multi-Select Colors (Non-Searchable) */}
      <div className="mb-6">
        <label htmlFor="multi-color-select" className="block text-sm font-medium text-gray-700 mb-1">
          Select Multiple Colors (Non-Searchable)
        </label>
        <SearchableSelect
          id="multi-color-select"
          name="multi-colors"
          options={colorOptions}
          placeholder="Choose multiple colors"
          searchable={false}
          onChange={handleMultiColorChange}
          initialValue={selectedMultiColors}
          multiple // Enable multiple selection
        />
        {selectedMultiColors.length > 0 && (
          <p className="mt-2 text-sm text-gray-600">Currently selected: {selectedMultiColors.join(', ')}</p>
        )}
      </div>

      <hr className="my-6" />

      {/* Disabled Select */}
      <div className="mb-6">
        <label htmlFor="disabled-select" className="block text-sm font-medium text-gray-700 mb-1">
          Disabled Select
        </label>
        <SearchableSelect
          id="disabled-select"
          name="disabled-item"
          options={[{ value: 'disabled-option', label: 'This option is disabled' }]}
          placeholder="Cannot select"
          disabled
          initialValue="disabled-option"
        />
      </div>

      <hr className="my-6" />

      {/* Select with an error */}
      <div className="mb-6">
        <label htmlFor="error-select" className="block text-sm font-medium text-gray-700 mb-1">
          Select with Error
        </label>
        <SearchableSelect
          id="error-select"
          name="error-item"
          options={[{ value: 'valid', label: 'Valid Option' }]}
          placeholder="Select something"
          error="This field is required!"
          required
        />
      </div>
    </div>
  );
};

export default Page;