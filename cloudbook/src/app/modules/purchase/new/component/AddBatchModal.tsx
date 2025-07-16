"use client";
import DatePicker from "@/app/utils/commonDatepicker";
import useInputValidation from "@/app/utils/inputValidations";
import { useState, KeyboardEvent } from "react";

export interface BatchItem {
  batchNumber: string;
  expDate: string | undefined;
  stock: string;
  mrp: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  batchNumbers: BatchItem[];
  onBatchNumberChange: (next: BatchItem[]) => void;
}

const AddBatchModal: React.FC<Props> = ({
  isOpen,
  onClose,
  batchNumbers,
  onBatchNumberChange,
}) => {
  const [batchNumber, setBatchNumber] = useState("");
  const [expDate, setExpDate] = useState<string | undefined>("");
  const [stock, setStock] = useState("");
  const [mrp, setMrp] = useState("");
  const [duplicateError, setDuplicateError] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useInputValidation();
  const addBatch = () => {
    const trimmed = batchNumber.trim();
    if (!trimmed) return;

    // Check for duplicate (excluding current editing index)
    const exists = batchNumbers.some(
      (b, idx) => b.batchNumber === trimmed && idx !== editingIndex
    );
    if (exists) {
      setDuplicateError(true);
      return;
    }

    const newItem: BatchItem = {
      batchNumber: trimmed,
      expDate: expDate,
      stock: stock.trim(),
      mrp: mrp.trim(),
    };

    const updated = [...batchNumbers];

    if (editingIndex !== null) {
      updated[editingIndex] = newItem;
    } else {
      updated.push(newItem);
    }

    onBatchNumberChange(updated);

    // Reset state
    setBatchNumber("");
    setExpDate("");
    setStock("");
    setMrp("");
    setEditingIndex(null);
    setDuplicateError(false);
  };

  const handleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") addBatch();
  };

  const deleteSerial = (serial: string) =>
    onBatchNumberChange(batchNumbers.filter((s) => s.batchNumber !== serial));

  const editBatchNumber = (batch: string) => {
    const index = batchNumbers.findIndex((s) => s.batchNumber === batch);
    if (index !== -1) {
      const item = batchNumbers[index];
      setEditingIndex(index);
      setBatchNumber(item.batchNumber);
      setExpDate(item.expDate);
      setStock(item.stock);
      setMrp(item.mrp);
      setDuplicateError(false);
    }
  };

  if (!isOpen) return null;

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
          <span className="text-[16px] text-[#212529]">Add Batch Number</span>
          <button
            onClick={onClose}
            className="absolute -top-[10px] -right-[10px] text-gray-500 hover:text-gray-700 bg-[#909090] hover:bg-[#cc0000] rounded-full w-[30px] h-[30px] border-2 border-white"
          >
            <i className="ri-close-line text-white"></i>
          </button>
        </div>

        {/* Table */}

        <main className="flex-1  overflow-hidden mt-2">
          <div className="px-1">
            <div className="p-4 space-y-4">
              {/* input row (no <form>) */}
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 block w-full h-[35px] px-[0.75rem] py-[0.375rem] text-[#212529] bg-white border border-[#cbcbcb] rounded-md leading-[1.5] focus:outline-none focus:border-[#009333] alphanumeric no_space all_uppercase"
                  placeholder="Enter batch number"
                  value={batchNumber}
                  onChange={(e) => setBatchNumber(e.target.value)}
                  onKeyDown={handleEnter}
                />

                <DatePicker
                  id="expDate"
                  name="expDate"
                  onChange={(e) => setExpDate(e)}
                  selected={expDate}
                  className=" w-[50%]"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 block w-full h-[35px] px-[0.75rem] py-[0.375rem] text-[#212529] bg-white border border-[#cbcbcb] rounded-md leading-[1.5] focus:outline-none focus:border-[#009333]  no_space only_number"
                  placeholder="Enter stock value"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  onKeyDown={handleEnter}
                />
                <input
                  type="text"
                  className="flex-1 block w-full h-[35px] px-[0.75rem] py-[0.375rem] text-[#212529] bg-white border border-[#cbcbcb] rounded-md leading-[1.5] focus:outline-none focus:border-[#009333]  no_space only_number"
                  placeholder="Enter MRP"
                  value={mrp}
                  onChange={(e) => setMrp(e.target.value)}
                  onKeyDown={handleEnter}
                />
              </div>
              <div className="flex items-center justify-center">
                <button
                  onClick={addBatch}
                  className="btn-sm btn-primary px-2 w-full py-2"
                  disabled={!batchNumber.trim()}
                >
                  {editingIndex !== null ? "Update" : "Save"}
                </button>
              </div>

              {/* table */}
              <div className="overflow-x-auto">
                <div className="max-h-[calc(100vh-210px)] border-r border-l border-b  border-[#efefef] rounded-md">
                  <table className="w-full h-full overflow-y-auto  ">
                    <thead className="bg-[#fafcfc] sticky top-0 shadow-[inset_0_1px_0_#efefef,inset_0_-1px_0_#efefef] z-10 rounded-t-md">
                      <tr className="divide-x divide-[#efefef]">
                        <th className="text-left px-2 py-2 text-xs font-medium text-gray-600">
                          S.No
                        </th>
                        <th className="text-left px-2 py-2 text-xs font-medium text-gray-600">
                          Batch Numbers
                        </th>
                        <th className="px-2 py-2  text-center text-xs font-medium text-gray-600">
                          Exp Date
                        </th>
                        <th className="px-2 py-2  text-center text-xs font-medium text-gray-600">
                          Stock
                        </th>
                        <th className="px-2 py-2  text-center text-xs font-medium text-gray-600">
                          MRP
                        </th>
                        <th className="px-2 py-2  text-center text-xs font-medium text-gray-600">
                          Option
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#efefef]">
                      {batchNumbers.length === 0 ? (
                        <tr>
                          <td
                            colSpan={3}
                            className="py-4 text-center text-gray-400"
                          >
                            No Batch numbers added yet
                          </td>
                        </tr>
                      ) : (
                        batchNumbers.map((s, i) => (
                          <tr
                            key={s.batchNumber}
                            className="hover:bg-[#f8faf9] divide-x divide-[#efefef]"
                          >
                            <td className="px-2 py-2 text-sm text-gray-900">
                              {i + 1}
                            </td>
                            <td className="px-2 py-2 text-sm text-gray-900">
                              {s.batchNumber}
                            </td>
                            <td className="px-2 py-2 text-sm text-gray-900">
                              {s.expDate}
                            </td>
                            <td className="px-2 py-2 text-sm text-gray-900">
                              {s.stock}
                            </td>
                            <td className="px-2 py-2 text-sm text-gray-900">
                              {s.mrp}
                            </td>
                            <td className="px-2 py-2 text-sm text-gray-900 text-center">
                              <button
                                onClick={() => editBatchNumber(s.batchNumber)}
                                className="text-gray-600 cursor-pointer"
                                title="Edit"
                              >
                                <i className="ri-pencil-line"></i>
                              </button>
                              <button
                                onClick={() => deleteSerial(s.batchNumber)}
                                className="text-red-600 ms-3 cursor-pointer"
                                title="Delete"
                              >
                                <i className="ri-delete-bin-line"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AddBatchModal;
