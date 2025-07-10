"use client";

import { ReactNode } from 'react';

type ConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  iconName?: 'delete' | 'leave'; // Keep this for predefined icons
  defaultIcon?: ReactNode; // New prop for custom icon passed in
};

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  iconName,
  defaultIcon, // Destructure the new prop
}: ConfirmationModalProps) => {
  if (!isOpen) return null;

  const iconClass =
    iconName === 'delete'
      ? 'ri-delete-bin-line'
      : iconName === 'leave'
        ? 'ri-logout-box-line'
        : 'ri-information-line';

  const outerBgColor =
    iconName === 'delete'
      ? 'bg-[#f9ecec]'
      : iconName === 'leave'
        ? 'bg-[#e9f7ec]'
        : 'bg-blue-100';

  const middleBgColor =
    iconName === 'delete'
      ? 'bg-[#f9d6d7]'
      : iconName === 'leave'
        ? 'bg-[#c8edd2]'
        : 'bg-blue-200';

  const innerBgColor =
    iconName === 'delete'
      ? 'bg-[#d4333a]'
      : iconName === 'leave'
        ? 'bg-[#1c8d4b]'
        : 'bg-blue-600';

  const iconColorClass = 'text-white';


  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="relative max-w-[470px] w-full text-center">
      <div className="bg-white rounded-[20px]  p-8 relative max-w-[470px] w-full text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#0f0f0f]  cursor-pointer"
        >
          <i className="ri-close-line text-2xl"></i>
        </button>



        <div className="relative mx-auto flex items-center justify-center w-[67px] h-[67px] mb-4">
          {/* Outer Light Red Circle */}
          <div className={`absolute w-[66px] h-[66px] rounded-full ${outerBgColor} opacity-70`}></div>

          {/* Middle Soft Red Circle */}
          <div className={`absolute w-[46px] h-[46px] rounded-full ${middleBgColor} opacity-90`}></div>

          {/* Inner Icon Circle */}
          <div className={`z-10 w-[30px] h-[30px] rounded-full flex items-center justify-center ${innerBgColor}`}>
            <i className={`${iconClass} ${iconColorClass}`}></i>
          </div>
        </div>



        {/* Title and Message */}
        <h3 className="text-xl font-semibold text-gray-900 mb-2.5">{title}</h3>
        <p className="text-sm text-gray-500 mb-6 px-4">{message}</p>

        {/* Buttons */}
        <div className={`flex justify-center space-x-2 `}>
          <button
            onClick={onClose}
            className="px-6 py-2 w-full text-black cursor-pointer text-sm font-medium bg-white border border-[#d5d5d5] rounded-lg "
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            // Dynamic button color based on iconName (or default to blue)
            className={`px-6 py-2 w-full cursor-pointer text-sm font-medium text-white rounded-lg ${iconName === 'leave' ? 'bg-green-600 ' : 'bg-[#d53635] '}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;