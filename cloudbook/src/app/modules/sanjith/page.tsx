 'use client';

import { useState } from 'react';
import Layout from '@/app/components/Layout';  
import SearchableSelect, { Option } from '@/app/utils/searchableSelect';  
import FilterSidebar from '@/app/utils/filterSIdebar';  

const Page: React.FC = () => {
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);  

  const [selectedFruit, setSelectedFruit] = useState<string | null>(null);
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['india', 'canada']);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedMultiColors, setSelectedMultiColors] = useState<string[]>([]);

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
    setSelectedCountries(value as string[]);
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
    alert('Add New functionality would go here!');
  };

  const handleRefreshOptions = () => {
    alert('Refresh options functionality would go here!');
  };

  // Sidebar specific handlers
  const handleOpenFilterSidebar = () => {
    setIsFilterSidebarOpen(true);
  };

  const handleCloseFilterSidebar = () => {
    setIsFilterSidebarOpen(false);
  };

  const handleApplyFilters = () => {
    console.log('Applying filters:', {
      selectedFruit,
      selectedCountries,
      selectedColor,
      selectedMultiColors,
    });
    // Here you would typically apply the filters to your data and then close the sidebar
    setIsFilterSidebarOpen(false);
  };

  const handleResetFilters = () => {
    console.log('Resetting filters');
    setSelectedFruit(null);
    setSelectedCountries([]); // Reset to empty array for multi-select
    setSelectedColor(null);
    setSelectedMultiColors([]); // Reset to empty array for multi-select
    // Optionally close sidebar after reset, or keep it open for user to re-select
    // setIsFilterSidebarOpen(false);
  };

  return (
    <Layout pageTitle="Usage Page">
      <div className="p-8 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Searchable Select Examples</h1>

        {/* Button to open the filter sidebar */}
        <button
          className="btn btn-primary mb-6"
          onClick={handleOpenFilterSidebar}
        >
          Open Filters
        </button>

        <hr className="my-6" />

        {/* Existing content of your page (if any) can go here */}
        <p className="text-gray-700">
          This is the main content area. Click the "Open Filters" button to see the filter sidebar.
        </p>

        {/* Filter Sidebar */}
        <FilterSidebar
          isOpen={isFilterSidebarOpen}
          onClose={handleCloseFilterSidebar}
          onApply={handleApplyFilters}
          onReset={handleResetFilters}
          title="Apply Your Filters"
        >
          {/* Content to be placed inside the sidebar */}
          <div className="space-y-4">
            {/* Single Select Fruit */}
            <div>
              <label htmlFor="fruit-select" className="filter-label">
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

            {/* Multi-Select Countries */}
            <div>
              <label htmlFor="country-select-multi" className="filter-label">
                Select Countries 
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
                multiple
              />
              {selectedCountries.length > 0 && (
                <p className="mt-2 text-sm text-gray-600">Currently selected: {selectedCountries.join(', ')}</p>
              )}
            </div>

            {/* Non-searchable Single Select Color */}
            <div>
              <label htmlFor="color-select" className="filter-label">
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

            {/* Multi-Select Colors (Non-Searchable) */}
            <div>
              <label htmlFor="multi-color-select" className="filter-label">
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
                multiple
              />
              {selectedMultiColors.length > 0 && (
                <p className="mt-2 text-sm text-gray-600">Currently selected: {selectedMultiColors.join(', ')}</p>
              )}
            </div>

            {/* Disabled Select */}
            <div>
              <label htmlFor="disabled-select" className="filter-label">
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

            {/* Select with an error */}
            <div>
              <label htmlFor="error-select" className="filter-label">
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
        </FilterSidebar>
      </div>
    </Layout>
  );
};

export default Page;