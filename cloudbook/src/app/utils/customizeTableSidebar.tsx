import React, { useState, useEffect } from 'react';
import { Input } from './form-controls';


interface Field {
    id: string ;
    label: string;
    visible: boolean;
}

interface CustomizeTableContentProps {
    fields: Field[];
    onFieldChange: (id: string) => void;
    onReset: () => void;
    onApply: () => void;
    onClose: () => void;  
}

function CustomizeTableContent({ fields, onFieldChange, onReset, onApply, onClose }: CustomizeTableContentProps) {
    const [searchQuery, setSearchQuery] = useState('');
   
    const [hasChanges, setHasChanges] = useState(false);

   
    const filteredFields = fields.filter((field) =>
        field.label.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const visibleFields = filteredFields.filter((field) => field.visible);
    const hiddenFields = filteredFields.filter((field) => !field.visible);

    const totalVisibleFieldsCount = fields.filter((field) => field.visible).length;
    const totalFieldsCount = fields.length;

    
    useEffect(() => {
      
    }, [fields]); 

    const handleFieldChange = (id: string) => {
        onFieldChange(id);
        setHasChanges(true); 
    };

    const handleReset = () => {
        onReset();
        setHasChanges(false); 
    };

    const handleApply = () => {
        onApply();
        setHasChanges(false); 
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="filter-header">
                <h5 className="">Customize table</h5>
                <button onClick={onClose} className="cursor-pointer">
                    <i className="ri-close-line "></i>
                </button>
            </div>

            {/* Search Bar */}
            <div className="px-4 pt-4 pb-1 ">
                <div className="relative">
                    <Input
                        type="text"
                        name="searchfields"
                        placeholder="Search fields here..."
                        value={searchQuery}
                        className=" pl-9 pr-4 "
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    />
                    <div className="absolute top-[4px] left-0 pl-3 flex items-center pointer-events-none text-[#585858] ">
                        <i className="ri-search-line "></i>
                    </div>
                </div>
            </div>

            {/* Fields List */}
            <div className="flex-1 overflow-y-auto px-4">
                {/* Fields visible in table */}
                <div className="mb-3 cursor-pointer">
                    <h3 className="text-sm font-semibold text-[#12344d]  my-[10px]  flex items-center ">
                        <span>Fields visible in table</span>
                        <span className="text-sm text-[#12344d] font-normal bg-[#ebeff3] rounded-[4px] px-[6px] py-[2.5px] ml-[10px]">{totalVisibleFieldsCount}/{totalFieldsCount}</span>
                    </h3>
                    {visibleFields.length > 0 ? (
                        <div className="space-y-2">
                            {visibleFields.map((field) => (
                                <div key={field.id} className="flex items-center">
                                    <i className="ri-draggable text-[18px] text-[#4c6578]"></i>
                                    <input
                                        type="checkbox"
                                        id={`field-${field.id}`}
                                        checked={field.visible}
                                        onChange={() => handleFieldChange(field.id)}
                                        className="form-checkbox h-4 w-4  ml-[10px] cursor-pointer"
                                    />
                                    <label htmlFor={`field-${field.id}`} className="ml-2 text-sm text-[#3c3c3c] cursor-pointer">
                                        {field.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">No visible fields found matching your search.</p>
                    )}
                </div>

                {/* Fields not shown in table */}
                <div className="cursor-pointer">
                    <h3 className="text-sm font-semibold text-[#12344d] pb-1 my-[10px]">Fields not shown in table</h3>
                    {hiddenFields.length > 0 ? (
                        <div className="space-y-3">
                            {hiddenFields.map((field) => (
                                <div key={field.id} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`field-${field.id}`}
                                        checked={field.visible}
                                        onChange={() => handleFieldChange(field.id)}
                                        className="form-checkbox h-4 w-4  cursor-pointer"
                                    />
                                    
                                    <label htmlFor={`field-${field.id}`} className="ml-2 text-sm text-[#3c3c3c] cursor-pointer">
                                        {field.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">No hidden fields found matching your search.</p>
                    )}
                </div>
            </div>

            {/* Footer Buttons */}
            <div className="px-4 py-3 border-t border-gray-200 flex justify-between items-center ">
                {hasChanges && ( 
                    <button
                        onClick={handleReset}
                        className="text-sm text-green-600 hover:text-green-800 font-medium transition duration-200 ease-in-out cursor-pointer"
                    >
                        Reset to default
                    </button>
                )}
                <div className="flex space-x-2 ml-auto">
                    <button
                        onClick={onClose}
                        className="btn-sm btn-light"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleApply}
                        className="btn-sm btn-primary"
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CustomizeTableContent;