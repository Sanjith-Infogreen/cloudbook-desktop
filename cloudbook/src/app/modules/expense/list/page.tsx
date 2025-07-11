"use client";
import { useEffect, useState, useRef, RefObject } from "react";
import Layout from "../../../components/Layout";
import { useRouter } from "next/navigation";
import FilterSidebar from "@/app/utils/filterSIdebar";
import SearchableSelect, { Option } from "@/app/utils/searchableSelect";
import CustomizeTableContent from "@/app/utils/customizeTableSidebar";
import { Input, RadioGroup, CheckboxGroup } from "@/app/utils/form-controls";
import ConfirmationModal from "@/app/utils/confirmationModal/page";


interface Expense {
    id: number;
    expenseID: string;
    category: string; 
    vendor: string;
    expenseDate: string;
    amount: number;
    status: string; 
}

interface SidebarProps {
    children: React.ReactNode;
    isOpen: boolean;
    onClose: () => void;
    toggleButtonRef: RefObject<HTMLButtonElement | null>;
}

function Sidebar({ isOpen, onClose, children, toggleButtonRef }: SidebarProps) {
    const sidebarRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (isOpen) {
            const handleClickOutside = (event: MouseEvent) => {
                if (toggleButtonRef.current && toggleButtonRef.current.contains(event.target as Node)) {
                    return;
                }
                if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
                    onClose();
                }
            };
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }
    }, [isOpen, onClose, toggleButtonRef]);
    return (
        <>
            <div
                ref={sidebarRef}
                className={`fixed top-0 right-0 offcanvas-sidebar h-[calc(100vh-90px)] z-50
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
            >
                {children}
            </div>
        </>
    );
}

type TabKey = "all" | "paid" | "pending" | "reimbursed";

const ExpenseList = () => {
    const [activeTab, setActiveTab] = useState<TabKey>("all");
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState(false);
    const [isViewDropdownOpen, setViewDropdownOpen] = useState(false);
    const [isExpenseDropdownOpen, setExpenseDropdownOpen] = useState(false);
    const viewRef = useRef(null);
    const expenseRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // --- State for fetched data ---
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [vendorOptions, setVendorOptions] = useState<Option[]>([]);
    const [categoryOptions, setCategoryOptions] = useState<Option[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchExpenseData = async () => {
            try {
                const [expensesResponse, vendorsResponse, categoriesResponse] = await Promise.all([
                    fetch("http://localhost:4000/expenses"), 
                    fetch("http://localhost:4000/vendorOptions"), 
                    fetch("http://localhost:4000/categoryOptions"), 
                ]);

                if (!expensesResponse.ok) {
                    throw new Error(`HTTP error! Status: ${expensesResponse.status} from /expenses`);
                }
                if (!vendorsResponse.ok) {
                    throw new Error(`HTTP error! Status: ${vendorsResponse.status} from /vendorOptions`);
                }
                if (!categoriesResponse.ok) {
                    throw new Error(`HTTP error! Status: ${categoriesResponse.status} from /categoryOptions`);
                }

                const expensesData: Expense[] = await expensesResponse.json();
                const vendorsData: Option[] = await vendorsResponse.json();
                const categoriesData: Option[] = await categoriesResponse.json();

                setExpenses(expensesData);
                setVendorOptions(vendorsData);
                setCategoryOptions(categoriesData);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("An unknown error occurred while fetching data.");
                }
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchExpenseData();
    }, []);

    const handleDelete = () => {
        console.log("Deleting expenses with IDs:", selectedIds);
       
        setIsModalOpen(false);
        setSelectedIds([]);
       
    };

    const handleClickOutside = (e: MouseEvent) => {
        if (
            viewRef.current &&
            !(viewRef.current as any).contains(e.target)
        ) {
            setViewDropdownOpen(false);
        }
        if (
            expenseRef.current &&
            !(expenseRef.current as any).contains(e.target)
        ) {
            setExpenseDropdownOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleButtonRef = useRef<HTMLButtonElement>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [fields, setFields] = useState([
        { id: "expenseID", label: "Expense ID", visible: true },
        { id: "category", label: "Category", visible: true },
        { id: "vendor", label: "Vendor", visible: true },
        { id: "expenseDate", label: "Expense Date", visible: true },
        { id: "amount", label: "Amount", visible: true },
        { id: "status", label: "Status", visible: true },
        { id: "description", label: "Description", visible: false },
        { id: "paidThrough", label: "Paid Through", visible: false },
    ]);

    const toggleSidebar = () => {
        setIsSidebarOpen((prev) => !prev);
    };

    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    const handleFieldChange = (id: string) => {
        setFields((prevFields) =>
            prevFields.map((field) =>
                field.id === id ? { ...field, visible: !field.visible } : field
            )
        );
    };

    const handleReset = () => {
        setFields(
            fields.map((field) => ({
                ...field,
                visible: [
                    "expenseID",
                    "category",
                    "vendor",
                    "expenseDate",
                    "amount",
                    "status",
                ].includes(field.id),
            }))
        );
    };

    const handleApply = () => {
        console.log("Applied settings:", fields);
        closeSidebar();
    };

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setSelectAll(checked);
        if (checked) {
            setSelectedIds(filteredExpenses.map((p) => p.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleCheckboxChange = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
    const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedExpenseStatus, setSelectedExpenseStatus] = useState<string | null>(null);
    const [minAmount, setMinAmount] = useState<string>('');
    const [maxAmount, setMaxAmount] = useState<string>('');

    const handleVendorChange = (value: string | string[] | null) => {
        console.log("Selected Vendor:", value);
        setSelectedVendor(value as string | null);
    };

    const handleCategoryChange = (value: string | string[] | null) => {
        console.log("Selected Category:", value);
        setSelectedCategory(value as string | null);
    };

    const handleAddNewItem = () => {
        alert("Add New functionality would go here!");
    };

    const handleOpenFilterSidebar = () => {
        setIsFilterSidebarOpen(true);
    };

    const handleCloseFilterSidebar = () => {
        setIsFilterSidebarOpen(false);
    };

    const handleApplyFilters = () => {
        console.log("Applying filters:", {
            selectedVendor,
            selectedCategory,
            selectedExpenseStatus,
            minAmount,
            maxAmount
        });
        setIsFilterSidebarOpen(false);
    };

    const handleResetFilters = () => {
        console.log("Resetting filters");
        setSelectedVendor(null);
        setSelectedCategory(null);
        setSelectedExpenseStatus(null);
        setMinAmount('');
        setMaxAmount('');
    };

    const tabs: TabKey[] = ["all", "paid", "pending", "reimbursed"];


    const counts: Record<TabKey, number> = {
        all: expenses.length,
        paid: expenses.filter(e => e.status.toLowerCase() === 'paid').length,
        pending: expenses.filter(e => e.status.toLowerCase() === 'pending').length,
        reimbursed: expenses.filter(e => e.status.toLowerCase() === 'reimbursed').length,
    };

    const router = useRouter();

    const filteredExpenses =
        activeTab === "all"
            ? expenses
            : expenses.filter((e) => e.status.toLowerCase() === activeTab);

    useEffect(() => {
        setSelectAll(
            filteredExpenses.length > 0 &&
            selectedIds.length === filteredExpenses.length
        );
    }, [selectedIds, filteredExpenses]);

    if (loading) {
        return <Layout pageTitle="Expense List">Loading expenses...</Layout>;
    }

    if (error) {
        return <Layout pageTitle="Expense List">Error: {error}</Layout>;
    }

    return (
        <Layout pageTitle="Expense List">
            <main className="flex-1">
                <div className="overflow-y-hidden h-[calc(100vh-103px)]">
                    {/* Tabs */}
                    <div className="flex justify-between items-center bg-white px-1.5 mt-[5px] ml-2 whitespace-nowrap">
                        <ul className="flex flex-nowrap text-sm font-medium text-center">
                            {tabs.map((tab) => (
                                <li key={tab}>
                                    <button
                                        onClick={() => setActiveTab(tab)}
                                        className={`tab ${activeTab === tab
                                            ? "bg-[#ebeff3] text-[#384551]"
                                            : "hover:text-[#6689b8] hover:bg-[#f5f7f9]"
                                            }`}
                                    >
                                        <span className="flex items-center gap-1">
                                            {tab === "all"
                                                ? "All Expenses"
                                                : tab.charAt(0).toUpperCase() + tab.slice(1)}
                                            {activeTab === tab && (
                                                <>
                                                    <span className="ml-2 counter-badge">
                                                        {counts[tab]}
                                                    </span>
                                                    <i
                                                        className="ri-close-fill font-bold px-1 rounded hover:bg-[#dce0e5]"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setActiveTab("all");
                                                        }}
                                                    ></i>
                                                </>
                                            )}
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <div className="flex items-center flex-shrink-0 ml-auto">
                            <button
                                id="openSidebarCustomize"
                                ref={toggleButtonRef}
                                className="btn-sm btn-hover-ct"
                                onClick={toggleSidebar}
                            >
                                <i className="ri-equalizer-line mr-1"></i>
                                <span className="text-sm">Customize Table</span>
                            </button>
                            {/* Sidebar component call */}
                            <Sidebar
                                isOpen={isSidebarOpen}
                                onClose={closeSidebar}
                                toggleButtonRef={toggleButtonRef}
                            >
                                <CustomizeTableContent
                                    fields={fields}
                                    onFieldChange={handleFieldChange}
                                    onReset={handleReset}
                                    onApply={handleApply}
                                    onClose={closeSidebar}
                                />
                            </Sidebar>
                            <div className="inline-flex border border-[#cfd7df] text-[#12375d] rounded overflow-hidden bg-white text-sm ml-2">
                                <button className="flex items-center py-1 px-2 hover:bg-[#ebeff3] cursor-pointer">
                                    <i className="ri-download-line mr-1"></i>
                                    Import Expenses
                                </button>
                                <button className="px-2 border-l border-[#cfd7df] hover:bg-[#ebeff3] cursor-pointer">
                                    <i className="ri-arrow-down-s-line"></i>
                                </button>
                            </div>
                            <button
                                className="btn-sm btn-primary ml-2 text-sm"
                                onClick={() => router.push("/modules/expense/new")}
                            >
                                <i className="ri-add-fill mr-1"></i>
                                <span className="text-sm">Add Expense</span>
                            </button>
                        </div>
                    </div>
                    <div className="flex justify-between items-center px-1.5 py-1.5 bg-[#ebeff3]">
                        <div className="flex items-center space-x-2 ml-2">
                            {!selectedIds.length && (
                                <>
                                    <button className="btn-sm btn-hover">
                                        <i className="ri-table-fill mr-1"></i>
                                        <span className="text-sm">Table</span>
                                        <i className="ri-arrow-down-s-line ml-1"></i>
                                    </button>
                                    <div className="relative inline-block" ref={viewRef}>
                                        <button
                                            onClick={() => setViewDropdownOpen(prev => !prev)}
                                            className={`btn-sm btn-visible-hover ${isViewDropdownOpen ? 'bg-[#c9d1d7] ' : ''
                                                }`}
                                        >
                                            <i className="ri-line-height "></i>
                                        </button>
                                        {isViewDropdownOpen && (
                                            <div className="absolute z-50 mt-1 w-40 bg-white rounded-sm shadow-[0_4px_16px_#27313a66]">
                                                <ul className="text-sm text-[#12344d] py-2">
                                                    <li className="px-4 py-1.5 hover:bg-[#ebeff3] cursor-pointer flex items-center gap-1.5">
                                                        <i className="ri-line-height"></i> Compact
                                                    </li>
                                                    <li className="px-4 py-1.5 hover:bg-[#ebeff3] cursor-pointer flex items-center gap-1.5">
                                                        <i className="ri-line-height"></i> Comfortable
                                                    </li>
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        className="btn-sm btn-visible-hover"
                                        id="bulkActionsBtn"
                                        onClick={() => {
                                            setSelectAll(true);
                                            setSelectedIds(filteredExpenses.map((p) => p.id));
                                        }}
                                    >
                                        <i className="ri-stack-fill mr-1"></i>
                                        Bulk Actions
                                    </button>
                                </>
                            )}
                            {/* Bulk action buttons (shown when at least 1 is selected) */}
                            {selectedIds.length > 0 && (
                                <div className="bulk-actions flex items-center space-x-2">
                                    <button className="btn-sm btn-hover" id="printBtn">
                                        <i className="ri-printer-line mr-1"></i>
                                        Print
                                    </button>
                                    <button className="btn-sm btn-hover" id="summaryBtn">
                                        <i className="ri-sticky-note-line mr-1"></i>
                                        Summary
                                    </button>
                                    <button className="btn-sm btn-hover" id="downloadBtn">
                                        <i className="ri-arrow-down-line mr-1"></i>
                                        Download
                                    </button>
                                    <button className="btn-sm btn-hover" id="deleteBtn" onClick={() => setIsModalOpen(true)}>
                                        <i className="ri-delete-bin-6-line mr-1"></i>
                                        Delete
                                    </button>
                                    <ConfirmationModal
                                        isOpen={isModalOpen}
                                        onClose={() => setIsModalOpen(false)}
                                        onConfirm={handleDelete}
                                        title="Delete selected expenses?"
                                        message="These expenses will be permanently deleted and cannot be recovered."
                                        confirmText="Yes, Delete"
                                        cancelText="No, Keep"
                                        iconName="delete"
                                    />
                                    <button className="btn-sm btn-visible-hover" id="cancelSelectionBtn" onClick={() => setSelectedIds([])}>
                                        <i className="ri-close-line mr-1"></i>
                                        Cancel Bulk Actions
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="flex items-center relative space-x-2">
                            <Input
                                name="expenseSearch"
                                placeholder="Search here..."
                                className="!h-[31px] "
                            />
                            <button className="btn-sm btn-visible-hover" onClick={handleOpenFilterSidebar}>
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
                                <div className="space-y-4">
                                    <div>
                                        <label className="filter-label">Expense ID</label>
                                        <Input
                                            name="expenseID"
                                            placeholder="Enter Expense ID"
                                        />
                                    </div>
                                    <div>
                                        <label className="filter-label">Status</label>
                                        <RadioGroup
                                            name="status"
                                            options={[
                                                
                                                { value: "Paid", label: "Paid" },
                                                { value: "Pending", label: "Pending" },
                                                { value: "Reimbursed", label: "Reimbursed" },
                                            ]}
                                            
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="vendor-select" className="filter-label">
                                            Vendor
                                        </label>
                                        <SearchableSelect
                                            id="vendor-select"
                                            name="vendor"
                                            options={vendorOptions}
                                            placeholder="Select Vendor"
                                            searchable
                                            onChange={handleVendorChange}
                                            initialValue={selectedVendor}
                                            onAddNew={handleAddNewItem}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="category-select" className="filter-label">
                                            Category
                                        </label>
                                        <SearchableSelect
                                            id="category-select"
                                            name="category"
                                            options={categoryOptions}
                                            placeholder="Select Category"
                                            searchable
                                            onChange={handleCategoryChange}
                                            initialValue={selectedCategory}
                                            onAddNew={handleAddNewItem}
                                        />
                                    </div>
                                    
                                </div>
                            </FilterSidebar>
                        </div>
                    </div>
                    {/* Table */}
                    <div className="bg-[#ebeff3]">
                        {selectedIds.length > 1 && (
                            <div className=" fixed top-42 left-1/2 transform -translate-x-1/2 z-29 badge-selected">
                                {selectedIds.length} Expenses selected
                            </div>
                        )}
                        <div className="mx-2 h-[calc(100vh-187px)] overflow-hidden rounded-lg bg-white">
                            <div className="h-full overflow-y-auto">
                                <table className="w-full">
                                    <thead className="sticky-table-header">
                                        <tr>
                                            <th className="th-cell" id="checkboxColumn">
                                                <CheckboxGroup
                                                    name="selectall"
                                                    value="selectAll"
                                                    checked={selectAll}
                                                    onChange={handleSelectAll}
                                                />
                                            </th>
                                            <th className="th-cell">
                                                <div className="flex justify-between items-center gap-1">
                                                    <span>S.No.</span>
                                                </div>
                                            </th>
                                            <th className="th-cell relative" >
                                                <div className="flex justify-between items-center gap-1">
                                                    <span>Expense ID</span>
                                                    <i
                                                        className={`dropdown-icon-hover ri-arrow-down-s-fill cursor-pointer ${isExpenseDropdownOpen ? 'bg-[#c9d1d7]' : ''
                                                            }`}
                                                        onClick={() => setExpenseDropdownOpen(prev => !prev)} ref={expenseRef}
                                                    ></i>
                                                </div>
                                                {isExpenseDropdownOpen && (
                                                    <div className="absolute right-0 mt-1 w-60 bg-white rounded-sm z-50 shadow-[0_4px_16px_#27313a66]">
                                                        <ul className="text-sm text-[#12344d] font-normal py-1">
                                                            <li className="flex items-center px-4 py-2 hover:bg-[#ebeff3] cursor-pointer">
                                                                <i className="ri-sort-asc mr-2"></i> Sort ascending A → Z
                                                            </li>
                                                            <li className="flex items-center px-4 py-2 hover:bg-[#ebeff3] cursor-pointer">
                                                                <i className="ri-sort-desc mr-2"></i> Sort descending Z → A
                                                            </li>
                                                            <li className="border-t border-gray-200 my-1"></li>
                                                            <li className="relative flex items-center px-4 py-2 hover:bg-[#ebeff3] cursor-pointer group">
                                                                <i className="ri-insert-column-right mr-2"></i> Add column to the right
                                                                <span className="ml-auto "><i className="ri-arrow-right-s-fill"></i></span>
                                                            </li>
                                                            <li className="relative flex items-center px-4 py-2 hover:bg-[#ebeff3] cursor-pointer group">
                                                                <i className="ri-insert-column-left mr-2"></i> Add column to the left
                                                                <span className="ml-auto "><i className="ri-arrow-right-s-fill"></i></span>
                                                            </li>
                                                            <li className="border-t border-gray-200 my-1"></li>
                                                            <li className="flex items-center px-4 py-2 hover:bg-[#ebeff3] cursor-pointer">
                                                                <i className="ri-arrow-left-right-line mr-2"></i> Collapse column
                                                            </li>
                                                            <li className="flex items-center px-4 py-2 hover:bg-[#ebeff3] cursor-pointer">
                                                                <i className="ri-delete-bin-line mr-2"></i> Remove column
                                                            </li>
                                                            <li className="flex items-center px-4 py-2 hover:bg-[#ebeff3] cursor-pointer">
                                                                <i className="ri-table-line mr-2"></i> Edit all columns
                                                            </li>
                                                            <li className="flex items-center px-4 py-2 hover:bg-[#ebeff3] cursor-pointer">
                                                                <i className="ri-pencil-line mr-2"></i> Rename field
                                                            </li>
                                                            <li className="border-t border-gray-200 my-1"></li>
                                                            <li className="flex items-center px-4 py-2 hover:bg-[#ebeff3] cursor-pointer">
                                                                <i className="ri-filter-3-fill mr-2"></i> Add as filter
                                                            </li>
                                                        </ul>
                                                    </div>
                                                )}
                                            </th>
                                            <th className="th-cell">
                                                <div className="flex justify-between items-center gap-1">
                                                    <span>Category</span>
                                                    <i className="dropdown-icon-hover ri-arrow-down-s-fill"></i>
                                                </div>
                                            </th>
                                            <th className="th-cell">
                                                <div className="flex justify-between items-center gap-1">
                                                    <span>Vendor</span>
                                                    <i className="dropdown-icon-hover ri-arrow-down-s-fill"></i>
                                                </div>
                                            </th>
                                            <th className="th-cell">
                                                <div className="flex justify-between items-center gap-1">
                                                    <span>Expense Date</span>
                                                    <i className="dropdown-icon-hover ri-arrow-down-s-fill"></i>
                                                </div>
                                            </th>
                                            <th className="th-cell">
                                                <div className="flex justify-between items-center gap-1">
                                                    <span>Amount</span>
                                                    <i className="dropdown-icon-hover ri-arrow-down-s-fill"></i>
                                                </div>
                                            </th>
                                            <th className="last-th-cell">
                                                <div className="flex justify-between items-center gap-1">
                                                    <span>Status</span>
                                                    <i className="dropdown-icon-hover ri-arrow-down-s-fill"></i>
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredExpenses.map((expense, index) => (
                                            <tr
                                                key={expense.id}
                                                className={`tr-hover group ${selectedIds.includes(expense.id) ? "bg-[#e5f2fd] hover:bg-[#f5f7f9]" : ""
                                                    }`}
                                            >
                                                <td className="td-cell">
                                                    <CheckboxGroup
                                                        name="selectall"
                                                        value="selectAll"
                                                        checked={selectedIds.includes(expense.id)}
                                                        onChange={() => handleCheckboxChange(expense.id)}
                                                    />
                                                </td>
                                                <td className="td-cell">
                                                    <span className="float-left">{index + 1}</span>
                                                    <span className="float-right">
                                                        <i className="ri-pencil-fill edit-icon opacity-0 group-hover:opacity-100"></i>
                                                    </span>
                                                </td>
                                                <td className="td-cell">{expense.expenseID}</td>
                                                <td className="td-cell">{expense.category}</td>
                                                <td className="td-cell">{expense.vendor}</td>
                                                <td className="td-cell">{expense.expenseDate}</td>
                                                <td className="td-cell">₹{expense.amount.toLocaleString()}</td>
                                                <td className="last-td-cell">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${expense.status === 'Paid' ? 'bg-green-100 text-green-800' :
                                                        expense.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-blue-100 text-blue-800'
                                                        }`}>
                                                        {expense.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <footer className="footer-list">
                <span className="text-sm">
                    Showing <span className="text-red-600">{filteredExpenses.length}</span> of <span className="text-blue-600">{expenses.length}</span>
                </span>
            </footer>
        </Layout>
    );
};

export default ExpenseList;