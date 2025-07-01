'use client'; 

import React, { useState } from 'react';
import CommonModal from '@/app/utils/common-modal';

const Page: React.FC = () => {
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

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
    </div>
  );
};

export default Page;
