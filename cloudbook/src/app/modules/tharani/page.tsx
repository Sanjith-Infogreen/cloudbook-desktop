"use client";
import { useState, useEffect } from 'react';
import ConfirmationModal from '@/app/utils/confirmationModal/page';

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    console.log('Modal closed, action cancelled.');
  };

  const handleConfirmAction = () => {
    // Perform the action after confirmation
    alert('Action confirmed! Deleting item...');
    setIsModalOpen(false); // Close the modal after confirmation
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome to My App</h1>
      <p className="text-md text-gray-600 mb-8">Click the button below to trigger a confirmation modal.</p>

      <button
        onClick={handleOpenModal}
        className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Delete Item
      </button>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmAction}
        title="Confirm Deletion"
        message="Are you sure you want to delete this item? This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="No, Keep"
      />
    </div>
  );
}