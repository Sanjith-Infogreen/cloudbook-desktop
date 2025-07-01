 'use client';

import { useState } from 'react'; 
import SearchableSelect, { Option } from '@/app/utils/searchableSelect';

const Page: React.FC = () => {
  const [selectedFruit, setSelectedFruit] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>('india'); // Example with an initial value
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const fruitOptions: Option[] = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'orange', label: 'Orange' },
    { value: 'grape', label: 'Grape' },
    { value: 'strawberry', label: 'Strawberry' },
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

  const handleFruitChange = (value: string | null) => {
    console.log('Selected Fruit:', value);
    setSelectedFruit(value);
  };

  const handleCountryChange = (value: string | null) => {
    console.log('Selected Country:', value);
    setSelectedCountry(value);
  };

  const handleColorChange = (value: string | null) => {
    console.log('Selected Color:', value);
    setSelectedColor(value);
  };

  const handleAddNewItem = () => {
    // Using a custom modal or message box instead of alert()
    // For this example, we'll log to console or simulate a message
    console.log('Add New button clicked!');
    // In a real application, you might open a modal or navigate to a creation page
  };

  const handleRefreshOptions = () => {
    // Using a custom modal or message box instead of alert()
    console.log('Refresh options clicked!');
    // In a real application, you would re-fetch your options data here
  };

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-6">Searchable Select Examples</h1>

      {/* Basic Searchable Select */}
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

      {/* Select with initial value and refresh option */}
      <div className="mb-6">
        <label htmlFor="country-select" className="block text-sm font-medium text-gray-700 mb-1">
          Select a Country (Initial Value & Refresh)
        </label>
        <SearchableSelect
          id="country-select"
          name="country"
          options={countryOptions}
          placeholder="Pick a country"
          searchable
          onChange={handleCountryChange}
          initialValue={selectedCountry}
          onRefresh={handleRefreshOptions}
          required
        />
        {selectedCountry && <p className="mt-2 text-sm text-gray-600">Currently selected: {selectedCountry}</p>}
      </div>

      <hr className="my-6" />

      {/* Non-searchable Select */}
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
