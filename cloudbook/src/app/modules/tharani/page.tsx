"use client";
// pages/index.jsx or app/page.jsx
import { useState } from 'react';
import ConfirmationModal from '@/app/utils/confirmationModal/page';
import ToastMessage from '@/app/utils/toaster/page';
import Layout from '@/app/components/Layout';
export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPurpose, setModalPurpose] = useState<'delete' | 'leave' | null>(null); // To distinguish modal actions
  const [toast, setToast] = useState<{ message: string; type: 'info' | 'success' | 'error' | 'warning' }>({ message: '', type: 'info' });

  // --- Modal Handlers ---
  const handleOpenModal = (purpose: 'delete' | 'leave') => {
    setModalPurpose(purpose);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalPurpose(null); // Reset purpose
    console.log('Modal closed, action cancelled.');
  };

  const handleConfirmAction = () => {
    if (modalPurpose === 'delete') {
      console.log('Action confirmed! Deleting item...');
      setToast({ message: 'Item successfully deleted!', type: 'success' });
    } else if (modalPurpose === 'leave') {
      console.log('Action confirmed! Leaving page...');
      setToast({ message: 'You have successfully left!', type: 'success' });
      // In a real app, you might redirect the user here
    }
    setIsModalOpen(false); // Close the modal after confirmation
    setModalPurpose(null); // Reset purpose
  };

  // --- Toast Handlers ---
  const handleShowToast = (message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    setToast({ message, type });
  };

  const handleClearToast = () => {
    setToast({ message: '', type: 'info' }); // Clear the message to hide the toast
  };

  const getModalContent = (): {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    iconName?: "delete" | "leave";
  } => {
    if (modalPurpose === 'delete') {
      return {
        title: "Delete this file?",
        message: "This file will be permanently deleted from your device and cannot be recovered.",
        confirmText: "Yes, Delete",
        cancelText: "No, Keep",
        iconName: "delete",
      };
    } else if (modalPurpose === 'leave') {
      return {
        title: "Leave without saving?",
        message: "You have unsaved changes. If you leave now, your progress will be lost and cannot be recovered.",
        confirmText: "Yes, Leave",
        cancelText: "No, Stay",
        iconName: "leave",

      };
    }
    return { title: "", message: "", iconName: undefined };
  };

  const modalProps = getModalContent();

  return (
    <Layout>
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome to My App</h1>
      <p className="text-md text-gray-600 mb-8">Click the buttons below to trigger a confirmation modal or a toast message.</p>

      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => handleOpenModal('delete')}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Delete Item (Open Modal)
        </button>

        <button
          onClick={() => handleOpenModal('leave')}
          className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Leave Page (Open Modal)
        </button>

        <button
          onClick={() => handleShowToast('This is a general information toast!', 'info')}
          className="px-6 py-3 bg-purple-600 text-white font-medium rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Show Info Toast
        </button>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={() => handleShowToast('Something went wrong!', 'error')}
          className="px-6 py-3 bg-red-600 text-white font-medium rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Show Error Toast
        </button>
        <button
          onClick={() => handleShowToast('Action completed successfully!', 'success')}
          className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Show Success Toast
        </button>
        <button
          onClick={() => handleShowToast('Please review your changes.', 'warning')}
          className="px-6 py-3 bg-yellow-600 text-white font-medium rounded-lg shadow-md hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
        >
          Show Warning Toast
        </button>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmAction}
        title={modalProps.title}
        message={modalProps.message}
        confirmText={modalProps.confirmText}
        cancelText={modalProps.cancelText}
        iconName={modalProps.iconName}
      />

      {/* Toast Message */}
      <ToastMessage
        message={toast.message}
        type={toast.type}
        onClose={handleClearToast}
      />
    </div>
    </Layout>
  );
}