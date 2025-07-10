 "use client";

import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import Layout from "@/app/components/Layout"; // Assuming Layout is in the components folder

import DatePicker from "@/app/utils/commonDatepicker"; // Corrected path
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store"; // Assuming these paths are correct
import { Input } from "@/app/utils/form-controls"; // Corrected path
import useInputValidation from "@/app/utils/inputValidations"; // Corrected path

import FilterSidebar from "@/app/utils/filterSIdebar"; // Corrected path

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
  error?: string;
}

// FormField component for consistent styling
const FormField = ({
  label,
  required = false,
  children,
  className = "",
  error,
}: FormFieldProps) => (
  <div
    className={` flex flex-col md:flex-row md:items-center gap-2 md:gap-4 ${className}`}
  >
    <label className="form-label w-50">
      {label}
      {required && <span className="form-required text-red-500">*</span>}
    </label>
    <div className="flex flex-col w-3/4 flex-grow">
      {children}
      {error && (
        <div className="error-message text-red-500 text-sm mt-1">{error}</div>
      )}
    </div>
  </div>
);

// Define the structure for a bill item
interface BillItem {
  id: number;
  date: string;
  billNumber: string;
  companyName: string; // Changed from purpose
  address: string; // New field added
  total: number;
  paid: number;
  balance: number | string; // Can be number or empty string for input
}

const NewBulkReceipt = () => {
  useInputValidation(); // Custom hook for input validation
  const [date, setDate] = useState<string | undefined>("01/07/2025");
  const dispatch = useDispatch<AppDispatch>();
  const typeHead = useSelector((state: RootState) => state.typeHead.typeHead); // Assuming this state exists
  const [bills, setBills] = useState<BillItem[]>([]);

  const formRef = useRef<HTMLFormElement>(null);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const handleOpenFilterSidebar = () => {
    setIsFilterSidebarOpen(true);
  };

  const handleCloseFilterSidebar = () => {
    setIsFilterSidebarOpen(false);
  };
  
  const handleApplyFilters = () => {
    // Logic to apply filters goes here
    console.log('Applying filters');
    setIsFilterSidebarOpen(false);
  };

  const handleResetFilters = () => {
    // Logic to reset filters goes here
    console.log('Resetting filters');
      
  };
  const sampleBills: BillItem[] = [
    {
      id: 1,
      date: "01/01/2025",
      billNumber: "B001",
      companyName: "Velan Stores",
      address: "123, Anna Salai, Chennai",
      total: 1500.0,
      paid: 1000.0,
      balance: 500.0,
    },
    {
      id: 2,
      date: "02/15/2025",
      billNumber: "B002",
      companyName: "Murugan Traders",
      address: "45, Gandhi Road, Coimbatore",
      total: 2500.5,
      paid: 2000.0,
      balance: 500.5,
    },
    {
      id: 3,
      date: "03/10/2025",
      billNumber: "B003",
      companyName: "Kumaran Agencies",
      address: "8, Bharathi Street, Madurai",
      total: 500.0,
      paid: 500.0,
      balance: 0.0,
    },
    {
      id: 4,
      date: "04/05/2025",
      billNumber: "B004",
      companyName: "Saravana Textiles",
      address: "21, Market Road, Salem",
      total: 3200.75,
      paid: 3000.0,
      balance: 200.75,
    },
    {
      id: 5,
      date: "05/20/2025",
      billNumber: "B005",
      companyName: "Meenakshi Sweets",
      address: "7, Kaliamman Koil Street, Trichy",
      total: 800.0,
      paid: 750.0,
      balance: 50.0,
    },
    {
      id: 6,
      date: "06/01/2025",
      billNumber: "B006",
      companyName: "Sri Krishna Bhavan",
      address: "10, East Coast Road, Pondicherry",
      total: 1200.0,
      paid: 1100.0,
      balance: 100.0,
    },
    {
      id: 7,
      date: "07/10/2025",
      billNumber: "B007",
      companyName: "Aarthi Pharma",
      address: "32, Perumal Koil Street, Vellore",
      total: 450.0,
      paid: 450.0,
      balance: 0.0,
    },
    {
      id: 8,
      date: "08/22/2025",
      billNumber: "B008",
      companyName: "Ganesh Electronics",
      address: "50, Raja Street, Erode",
      total: 1800.0,
      paid: 1500.0,
      balance: 300.0,
    },
    {
      id: 9,
      date: "09/05/2025",
      billNumber: "B009",
      companyName: "Lakshmi Stores",
      address: "15, M.G. Road, Tirunelveli",
      total: 950.0,
      paid: 900.0,
      balance: 50.0,
    },
    {
      id: 10,
      date: "10/18/2025",
      billNumber: "B010",
      companyName: "Balaji Automobiles",
      address: "28, Bypass Road, Thanjavur",
      total: 5000.0,
      paid: 4800.0,
      balance: 200.0,
    },
    {
      id: 11,
      date: "11/30/2025",
      billNumber: "B011",
      companyName: "Amman Readymades",
      address: "60, North Car Street, Kanchipuram",
      total: 700.0,
      paid: 650.0,
      balance: 50.0,
    },
    {
      id: 12,
      date: "12/12/2025",
      billNumber: "B012",
      companyName: "Sivakami Printers",
      address: "9, Railway Feeder Road, Dindigul",
      total: 300.0,
      paid: 300.0,
      balance: 0.0,
    },
    {
      id: 13,
      date: "01/25/2026",
      billNumber: "B013",
      companyName: "Periyar Provision",
      address: "2, Main Road, Cuddalore",
      total: 1100.0,
      paid: 1000.0,
      balance: 100.0,
    },
    {
      id: 14,
      date: "02/08/2026",
      billNumber: "B014",
      companyName: "Muthu Opticals",
      address: "17, Kamaraj Salai, Sivakasi",
      total: 600.0,
      paid: 550.0,
      balance: 50.0,
    },
    {
      id: 15,
      date: "03/19/2026",
      billNumber: "B015",
      companyName: "Bharathi Books",
      address: "42, School Road, Thoothukudi",
      total: 250.0,
      paid: 250.0,
      balance: 0.0,
    },
    {
      id: 16,
      date: "04/01/2026",
      billNumber: "B016",
      companyName: "Raja Bakery",
      address: "3, Temple Street, Kumbakonam",
      total: 400.0,
      paid: 350.0,
      balance: 50.0,
    },
    {
      id: 17,
      date: "05/14/2026",
      billNumber: "B017",
      companyName: "Chettinad Tiles",
      address: "88, Bypass Road, Karaikudi",
      total: 2200.0,
      paid: 2000.0,
      balance: 200.0,
    },
    {
      id: 18,
      date: "06/28/2026",
      billNumber: "B018",
      companyName: "Kovai Motors",
      address: "1, Avinashi Road, Tiruppur",
      total: 750.0,
      paid: 700.0,
      balance: 50.0,
    },
    {
      id: 19,
      date: "07/07/2026",
      billNumber: "B019",
      companyName: "Theni Dairy",
      address: "25, Market Street, Theni",
      total: 180.0,
      paid: 180.0,
      balance: 0.0,
    },
    {
      id: 20,
      date: "08/11/2026",
      billNumber: "B020",
      companyName: "Salem Steels",
      address: "99, Industrial Estate, Villupuram",
      total: 3500.0,
      paid: 3200.0,
      balance: 300.0,
    },
    {
      id: 21,
      date: "09/03/2026",
      billNumber: "B021",
      companyName: "Nagai Fisheries",
      address: "5, Beach Road, Nagapattinam",
      total: 600.0,
      paid: 600.0,
      balance: 0.0,
    },
    {
      id: 22,
      date: "10/16/2026",
      billNumber: "B022",
      companyName: "Puducherry Paints",
      address: "14, French Street, Puducherry",
      total: 900.0,
      paid: 850.0,
      balance: 50.0,
    },
    {
      id: 23,
      date: "11/29/2026",
      billNumber: "B023",
      companyName: "Krishnagiri Granites",
      address: "77, Quarry Road, Krishnagiri",
      total: 4000.0,
      paid: 3800.0,
      balance: 200.0,
    },
    {
      id: 24,
      date: "12/01/2026",
      billNumber: "B024",
      companyName: "Dharmapuri Furnitures",
      address: "33, Byepass Road, Dharmapuri",
      total: 1600.0,
      paid: 1500.0,
      balance: 100.0,
    },
    {
      id: 25,
      date: "01/15/2027",
      billNumber: "B025",
      companyName: "Erode Garments",
      address: "11, Textiles Road, Erode",
      total: 1200.0,
      paid: 1200.0,
      balance: 0.0,
    },
  ];
  // Load sample data on component mount
  useEffect(() => {
    setBills(sampleBills);
  }, []);

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const form = formRef.current;
    if (!form) return;

    console.log("Form submitted! Check console for data.");
    console.log("Current Bills Data:", bills);
  };

  const handleBillBalanceChange = (id: number, value: string) => {
    const regex = /^\d*\.?\d{0,2}$/;
    if (value === "" || regex.test(value)) {
      setBills((prevBills) =>
        prevBills.map((bill) =>
          bill.id === id ? { ...bill, balance: value } : bill
        )
      );
    }
  };

  const totalSum = bills.reduce((sum, bill) => sum + (bill.total || 0), 0);
  const paidSum = bills.reduce((sum, bill) => sum + (bill.paid || 0), 0);
  const balanceSum = bills.reduce(
    (sum, bill) =>
      sum + (typeof bill.balance === "number" ? bill.balance : 0),
    0
  );

  return (
    <Layout>
      <div className="flex-1 flex flex-col">
        <main id="main-content" className="flex-1 overflow-y-auto">
          <form ref={formRef} onSubmit={handleSubmit} autoComplete="off">
            {/* Header section with title and date picker */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 py-2">
              <div className="lg:pr-4 mt-1">
                <span className="in-page-title text-lg font-medium text-[#009333]">
                  Bulk Receipt New
                </span>
              </div>
              <div className="flex justify-end">
                <FormField label="" className="w-full lg:w-1/2">
                  <DatePicker
                    name="date"
                    id="date"
                    selected={date}
                    initialDate={date}
                    onChange={(e) => {
                      setDate(e);
                    }}
                    className="w-full"
                  />
                </FormField>
                <button
                  className="btn-sm btn-visible-hover ml-3"
                  onClick={handleOpenFilterSidebar}
                  type="button"  
                >
                  <i className="ri-filter-3-fill"></i>
                </button>
                <FilterSidebar
                  isOpen={isFilterSidebarOpen}
                  onClose={handleCloseFilterSidebar}
                  onApply={handleApplyFilters}
                  onReset={handleResetFilters}
                  title="Apply Your Filters"
                >
                  {/* Content to be placed inside the sidebar */}
                  <div className="space-y-1">
                    <div>
                      <label className="filter-label">Area</label>
                      <Input
                        name="area"
                        placeholder="Enter Area"
                      />
                    </div>
                  </div>
                </FilterSidebar>
              </div>
            </div>

            {/* Table section */}
            <div className="h-[calc(100vh-160px)] max-h-[calc(100vh-160px)] overflow-y-auto pr-2 pl-2 mb-2 relative rounded-lg">
              <table className="w-full text-sm rounded-lg">
                <thead className="bg-[#f8f9fa] text-left text-[#12344d] sticky-table-header">
                  <tr>
                    
                    <th className="th-cell w-[5%]">S.no</th><th className="th-cell w-[8%]">Bill Number</th><th className="th-cell w-[10%]">Date</th><th className="th-cell w-[15%]">Company Name</th><th className="th-cell w-[25%]">Address</th><th className="th-cell w-[12%] text-right">Amount</th><th className="th-cell w-[12%] text-right text-right">Balance</th><th className="last-th-cell w-[13%] text-right">Paid</th>
                  </tr>
                </thead>
                <tbody id="productTableBody">
                  {bills.length > 0 ? (
                    bills.map((bill, index) => (
                      <tr key={bill.id} className="border-b border-gray-200">
                        <td className="td-cell">{index + 1}</td>
                        <td className="td-cell">{bill.billNumber}</td>
                        <td className="td-cell">{bill.date}</td>
                        <td className="td-cell">{bill.companyName}</td>
                        
                        <td className="td-cell">{bill.address}</td>
                       
                        <td className="td-cell text-right">
                          {bill.total.toLocaleString("en-IN", {
                            style: "currency",
                            currency: "INR",
                          })}
                        </td>
                        <td className="td-cell text-right text-[#ed1515]">
                          {bill.paid.toLocaleString("en-IN", {
                            style: "currency",
                            currency: "INR",
                          })}
                        </td>
                        <td className="last-td-cell">
                          <Input
                            name={`balance-${bill.id}`}
                            placeholder="Enter Balance"
                            className="form-control number_with_decimal text-right"
                            value={bill.balance.toString()}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                              handleBillBalanceChange(bill.id, e.target.value)
                            }
                          />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="p-4 text-center text-gray-500">
                        Select a supplier to view bills.
                      </td>
                    </tr>
                  )}
                </tbody>
              
                {bills.length > 0 && (
                  <tfoot className="bg-[#ebeff3] text-right text-[14px] text-[#212529] sticky-table-footer">
                    <tr>
                      <td colSpan={5} className="p-2 text-right font-bold">
                        Total:
                      </td>
                      <td className="text-right font-bold text-[#2408c4]">
                        {totalSum.toLocaleString("en-IN", {
                          style: "currency",
                          currency: "INR",
                        })}
                      </td>
                      <td className="text-right font-bold">
                        {paidSum.toLocaleString("en-IN", {
                          style: "currency",
                          currency: "INR",
                        })}
                      </td>
                      <td className="p-2 text-right"> 
                      </td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </form>
        </main>

        {/* Footer with action buttons */}
        <footer className="bg-[#ebeff3] py-3 h-[56.9px] px-4 flex justify-start gap-2">
          <button onClick={handleSubmit} className="btn-sm btn-primary" type="submit">
            Save
          </button>
          <button className="btn-secondary btn-sm" type="button">Cancel</button>
        </footer>
      </div>
    </Layout>
  );
};

export default NewBulkReceipt;
