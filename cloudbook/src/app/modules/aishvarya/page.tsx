'use client'; 

import React, { useState } from 'react';
import CommonModal from '@/app/utils/common-modal';
import { Input, RadioGroup, CheckboxGroup, Toggle } from "@/app/utils/form-controls";


const Page: React.FC = () => {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);


    const [form, setForm] = useState({
      owner: "New",
      address: "",
      features: ["AC"],
      termsAccepted: false,
    });


      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
          ...prev,
          [name]: type === "checkbox" && !e.target.value ? checked : value,
        }));
      };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 font-inter">
     <button
        id="ModalBtn"
        onClick={openModal}
        className="flex items-center bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer">
        Open Configuration Modal
      </button>

      <CommonModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
      />



       <form className="space-y-6 p-6 mt-4 mx-auto bg-white shadow rounded">
            <div>
              <label className="block text-sm font-medium mb-1">Owner</label>
              <RadioGroup
                name="owner"
                options={[{ value: "New", label: "New" }, { value: "Existing", label: "Existing" }]}
                defaultValue={form.owner}
                onChange={(e) => setForm((prev) => ({ ...prev, owner: e.target.value }))}
              />
            </div>
      
            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <Input
                name="address"
                placeholder="Enter Address"
                value={form.address}
                onChange={handleChange}
              />
            </div>
      
            <div>
              <label className="block text-sm font-medium mb-1">Features</label>
              <CheckboxGroup
                name="features"
                options={[
                  { value: "AC", label: "AC" },
                  { value: "WiFi", label: "WiFi" },
                  { value: "Parking", label: "Parking" },
                ]}
                defaultValues={form.features}
                onChange={(values) => setForm((prev) => ({ ...prev, features: values }))}
              />
            </div>
      
            <div>
              <Toggle
                name="termsAccepted"
                checked={form.termsAccepted}
                onChange={(e) => setForm((prev) => ({ ...prev, termsAccepted: e.target.checked }))}
                label="Accept Terms & Conditions"
              />
            </div>
      
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
              Submit
            </button>
          </form>
    </div>

  );
};

export default Page;
