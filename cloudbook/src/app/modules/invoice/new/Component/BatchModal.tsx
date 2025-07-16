"use client";

import { useState } from "react";

interface BatchItem {
  batchNumber: string;
  expDate: string;
  mrp: string;
  stock: string;
}

interface Props {
  modalData: BatchItem[];
  initialBatchNumber?: string;
  onClose: () => void;
  onSave: (selectedItem: BatchItem | null) => void;
}

const BatchModal: React.FC<Props> = ({
  modalData,
  initialBatchNumber,
  onClose,
  onSave,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(() => {
    if (!initialBatchNumber) return null;
    const idx = modalData.findIndex((i) => i.batchNumber === initialBatchNumber);
    return idx === -1 ? null : idx;
  });

  const handleRowClick = (index: number) => {
    setSelectedIndex(index);
    onSave(modalData[index]);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-md w-full max-w-[40%] h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative border-b border-[#dee2e6] px-4 py-2 bg-[#f8f8f8] rounded-tl-md">
          <span className="text-[16px] text-[#212529]">Select Batch Number</span>
          <button
            onClick={onClose}
            className="absolute -top-[10px] -right-[10px] text-gray-500 hover:text-gray-700 bg-[#909090] hover:bg-[#cc0000] rounded-full w-[30px] h-[30px] border-2 border-white"
          >
            <i className="ri-close-line text-white"></i>
          </button>
        </div>

        {/* Table */}

        <main className="flex-1  overflow-auto mt-4 px-4 ">
          <div className="max-h-[calc(100vh-287px)]  border-r border-l border-b border-gray-100 rounded-md">
            <table className="w-full h-full overflow-y-auto  ">
              <thead className="bg-[#fafcfc] sticky top-0 shadow-[inset_0_1px_0_#efefef,inset_0_-1px_0_#efefef] z-10 rounded-t-md">
                <tr className="divide-x divide-[#efefef]">
                  <th className="text-center px-2 py-2 text-xs font-medium text-gray-600"></th>
                  <th className="text-left px-2 py-2 text-xs font-medium text-gray-600">
                    Batch Number
                  </th>
                  <th className="text-left px-2 py-2 text-xs font-medium text-gray-600">
                    Exp Date
                  </th>
                  <th className="text-left px-2 py-2 text-xs font-medium text-gray-600">
                    Stock
                  </th>
                  <th className="text-left px-2 py-2 text-xs font-medium text-gray-600">
                    MRP
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#efefef]">
                {modalData.map((item, index) => (
                  <tr
                    key={item.mrp}
                    className="hover:bg-[#f8faf9] divide-x divide-[#efefef]"
                    onClick={() => handleRowClick(index)}
                  >
                    <td className="text-center px-2 py-2 ">
                      <input
                        type="radio"
                        name="serialNumberRadio"
                        className="form-radio "
                        checked={index === selectedIndex}
                        onClick={(e) => e.stopPropagation()}
                        onChange={() => handleRowClick(index)}
                      />
                    </td>
                    <td className="px-2 py-2  text-sm font-medium">
                      {item.batchNumber}
                    </td>
                    <td className="px-2 py-2  text-sm font-medium">
                      {item.expDate}
                    </td>
                    <td className="px-2 py-2  text-sm font-medium">
                      {item.stock}
                    </td>
                    <td className="px-2 py-2 text-green-600 text-sm font-medium ">
                      ₹{item.mrp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BatchModal;
