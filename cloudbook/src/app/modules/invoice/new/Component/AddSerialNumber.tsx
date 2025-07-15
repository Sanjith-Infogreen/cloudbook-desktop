"use client";
import useInputValidation from "@/app/utils/inputValidations";
import { useState, KeyboardEvent } from "react";

export interface SerialItem {
  serialNumber: string;
}

interface Props {
  /** Show / hide modal */
  isOpen: boolean;
  /** Close modal (Cancel or X) */
  onClose: () => void;
  /**
   * Prop‑drilled list from the parent.
   * The parent is the *single source of truth*.
   */
  serialNumbers: SerialItem[];
  /**
   * Fires whenever this modal wants to mutate the list.
   * Pass the *next* array back to the parent.
   */
  onSerialsChange: (next: SerialItem[]) => void;
}

const AddSerialNumberModal: React.FC<Props> = ({
  isOpen,
  onClose,
  serialNumbers,
  onSerialsChange,
}) => {
  const [input, setInput] = useState("");
  const [duplicateError, setDuplicateError] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useInputValidation();
  const addSerial = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    // Check for duplicate (excluding current edit index)
    const exists = serialNumbers.some(
      (s, idx) => s.serialNumber === trimmed && idx !== editingIndex
    );
    if (exists) {
      setDuplicateError(true);
      return;
    }

    const updated = [...serialNumbers];

    if (editingIndex !== null) {
      // Update existing serial
      updated[editingIndex] = { serialNumber: trimmed };
    } else {
      // Add new serial
      updated.push({ serialNumber: trimmed });
    }

    onSerialsChange(updated);
    setInput("");
    setEditingIndex(null);
    setDuplicateError(false);
  };

  const handleEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") addSerial();
  };

  const deleteSerial = (serial: string) =>
    onSerialsChange(serialNumbers.filter((s) => s.serialNumber !== serial));

  const editSerialNumber = (serial: string) => {
    const index = serialNumbers.findIndex((s) => s.serialNumber === serial);
    if (index !== -1) {
      setEditingIndex(index);
      setInput(serial);
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
          <span className="text-[16px] text-[#212529]">Add Serial Number</span>
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
                  placeholder="Enter serial number"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleEnter}
                />
                <button
                  onClick={addSerial}
                  className="btn-sm btn-primary px-2"
                  disabled={!input.trim()}
                >
                  {editingIndex !== null ? "Update" : "Save"}
                </button>
              </div>

              {duplicateError && (
                <div className="text-red-500 text-sm">
                  Serial number already exists.
                </div>
              )}

              {/* table */}
              <div className="overflow-x-auto">
                <div className="max-h-[calc(100vh-210px)] border-r border-l  border-gray-100 rounded-md">
                  <table className="w-full h-full overflow-y-auto  ">
                    <thead className="bg-[#fafcfc] sticky top-0 shadow-[inset_0_1px_0_#efefef,inset_0_-1px_0_#efefef] z-10 rounded-t-md">
                      <tr className="divide-x divide-[#efefef]">
                        <th className="text-left px-2 py-2 text-xs font-medium text-gray-600">
                          S.No
                        </th>
                        <th className="text-left px-2 py-2 text-xs font-medium text-gray-600">
                          Serial Numbers
                        </th>
                        <th className="px-2 py-2  text-center text-xs font-medium text-gray-600">
                          Option
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {serialNumbers.length === 0 ? (
                        <tr >
                          <td
                            colSpan={3}
                            className="py-4 text-center text-gray-400 "
                          >
                            No serial numbers added yet
                          </td>
                        </tr>
                      ) : (
                        serialNumbers.map((s, i) => (
                          <tr
                            key={s.serialNumber}
                            className="hover:bg-[#f8faf9] divide-x divide-[#efefef]"
                          >
                            <td className="px-2 py-2 border-b border-[#efefef] text-sm text-gray-900">
                              {i + 1}
                            </td>
                            <td className="px-2 py-2 border-b border-[#efefef] text-sm text-gray-900">
                              {s.serialNumber}
                            </td>
                            <td className="px-2 py-2 border-b border-[#efefef] text-sm text-gray-900 text-center">
                              <button
                                onClick={() => editSerialNumber(s.serialNumber)}
                                className="text-gary-600"
                                title="Edit"
                              >
                                <i className="ri-pencil-line"></i>
                              </button>
                              <button
                                onClick={() => deleteSerial(s.serialNumber)}
                                className="text-red-600 ms-3"
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

export default AddSerialNumberModal;
