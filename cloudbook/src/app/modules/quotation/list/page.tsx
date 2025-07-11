"use client";
import { useEffect, useState, useRef, RefObject } from "react";
import Layout from "../../../components/Layout";
import { useRouter } from "next/navigation";
import FilterSidebar from "@/app/utils/filterSIdebar";
import SearchableSelect, { Option } from "@/app/utils/searchableSelect";
import CustomizeTableContent from "@/app/utils/customizeTableSidebar";
import { Input, RadioGroup, CheckboxGroup } from "@/app/utils/form-controls";
import ConfirmationModal from "@/app/utils/confirmationModal/page";


interface Quotation {
    id: number;
    quotationNumber: string;
    customer: string;
    quotationDate: string;
    expiryDate: string;
    totalAmount: number;
    status: string;
    category: string;
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

type TabKey = "all" | "draft" | "sent" | "accepted" | "rejected"; 

const QuotationList = () => { 
    const [activeTab, setActiveTab] = useState<TabKey>("all");
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [selectAll, setSelectAll] = useState(false);
    const [isViewDropdownOpen, setViewDropdownOpen] = useState(false);
    const [isQuotationDropdownOpen, setQuotationDropdownOpen] = useState(false); 
    const viewRef = useRef(null);
    const quotationRef = useRef(null); 
    const [isModalOpen, setIsModalOpen] = useState(false);


    const [quotations, setQuotations] = useState<Quotation[]>([]); 
    const [quotationsCustomerOptions, setquotationsCustomerOptions] = useState<Option[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchQuotationData = async () => { 
            try {
                const [quotationsResponse, customersResponse] = await Promise.all([
                    fetch("http://localhost:4000/quotations"), 
                    fetch("http://localhost:4000/quotationsCustomerOptions"),
                ]);

                if (!quotationsResponse.ok) {
                    throw new Error(`HTTP error! Status: ${quotationsResponse.status} from /quotations`); 
                }
                if (!customersResponse.ok) {
                    throw new Error(`HTTP error! Status: ${customersResponse.status} from /quotationsCustomerOptions`);
                }

                const quotationsData: Quotation[] = await quotationsResponse.json(); 
                const customersData: Option[] = await customersResponse.json();

                setQuotations(quotationsData); 
                setquotationsCustomerOptions(customersData);
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

        fetchQuotationData();
    }, []);

    const handleDelete = () => {
        console.log("Deleting quotations with IDs:", selectedIds); 
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
            quotationRef.current && 
            !(quotationRef.current as any).contains(e.target)
        ) {
            setQuotationDropdownOpen(false); 
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleButtonRef = useRef<HTMLButtonElement>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [fields, setFields] = useState([
        { id: "quotationNumber", label: "Quotation Number", visible: true }, 
        { id: "customer", label: "Customer", visible: true },
        { id: "quotationDate", label: "Quotation Date", visible: true }, 
        { id: "expiryDate", label: "Expiry Date", visible: true }, 
        { id: "totalAmount", label: "Total Amount", visible: true },
        { id: "status", label: "Status", visible: true },
        { id: "category", label: "Category", visible: true },
        { id: "items", label: "Items", visible: false },
        { id: "paymentTerms", label: "Payment Terms", visible: false },
        { id: "notes", label: "Notes", visible: false },
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
                    "quotationNumber", 
                    "customer",
                    "quotationDate", 
                    "expiryDate", 
                    "totalAmount",
                    "status",
                    "category",
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
            setSelectedIds(filteredQuotations.map((p) => p.id)); 
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
    const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
    const [selectedQuotationStatus, setSelectedQuotationStatus] = useState<string | null>(null); 

    const handleCustomerChange = (value: string | string[] | null) => {
        console.log("Selected Customer:", value);
        setSelectedCustomer(value as string | null);
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
            selectedCustomer,
            selectedQuotationStatus, 
        });
        setIsFilterSidebarOpen(false);
    };

    const handleResetFilters = () => {
        console.log("Resetting filters");
        setSelectedCustomer(null);
        setSelectedQuotationStatus(null); 
    };

    const tabs: TabKey[] = ["all", "draft", "sent", "accepted", "rejected"]; 

  
    const counts: Record<TabKey, number> = {
        all: quotations.length,
        draft: quotations.filter(q => q.status.toLowerCase() === 'draft').length,
        sent: quotations.filter(q => q.status.toLowerCase() === 'sent').length,
        accepted: quotations.filter(q => q.status.toLowerCase() === 'accepted').length,
        rejected: quotations.filter(q => q.status.toLowerCase() === 'rejected').length,
    };

    const router = useRouter();

    const filteredQuotations = 
        activeTab === "all"
            ? quotations
            : quotations.filter((q) => q.status.toLowerCase() === activeTab); 

    useEffect(() => {
        setSelectAll(
            filteredQuotations.length > 0 &&
            selectedIds.length === filteredQuotations.length
        );
    }, [selectedIds, filteredQuotations]);

    if (loading) {
        return <Layout pageTitle="Quotation List">Loading quotations...</Layout>; 
    }

    if (error) {
        return <Layout pageTitle="Quotation List">Error: {error}</Layout>; 
    }

    return (
        <Layout pageTitle="Quotation List"> 
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
                                                ? "All Quotations" 
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
                                    Import Quotations
                                </button>
                                <button className="px-2 border-l border-[#cfd7df] hover:bg-[#ebeff3] cursor-pointer">
                                    <i className="ri-arrow-down-s-line"></i>
                                </button>
                            </div>
                            <button
                                className="btn-sm btn-primary ml-2 text-sm"
                                onClick={() => router.push("/modules/quotation/new")}
                            >
                                <i className="ri-add-fill mr-1"></i>
                                <span className="text-sm">Add Quotation</span>
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
                                            setSelectedIds(filteredQuotations.map((p) => p.id)); 
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
                                        title="Delete this file?"
                                        message="This file will be permanently deleted from your device and cannot be recovered."
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
                                name="quotationSearch" 
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
                                        <label className="filter-label">Quotation Number</label> 
                                        <Input
                                            name="quotationNumber" 
                                            placeholder="Enter Quotation Number" 
                                        />
                                    </div>
                                    <div>
                                        <label className="filter-label">Status</label>
                                        <RadioGroup
                                            name="status"
                                            options={[
                                                { value: "All", label: "All" },
                                                { value: "Draft", label: "Draft" },
                                                { value: "Sent", label: "Sent" },

                                            ]}
                                            
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="customer-select" className="filter-label">
                                            Customer Name
                                        </label>
                                        <SearchableSelect
                                            id="customer-select"
                                            name="customer"
                                            options={quotationsCustomerOptions}
                                            placeholder="Select Customer Name"
                                            searchable
                                            onChange={handleCustomerChange}
                                            initialValue={selectedCustomer}
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
                                {selectedIds.length} Quotations selected 
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
                                                    <span>Quotation Number</span> 
                                                    <i
                                                        className={`dropdown-icon-hover ri-arrow-down-s-fill cursor-pointer ${isQuotationDropdownOpen ? 'bg-[#c9d1d7]' : ''
                                                            }`}
                                                        onClick={() => setQuotationDropdownOpen(prev => !prev)} ref={quotationRef} 
                                                    ></i>
                                                </div>
                                                {isQuotationDropdownOpen && ( 
                                                    <div className="absolute right-0 mt-1 w-60 bg-white rounded-sm z-50 shadow-[0_4px_16px_#27313a66]">
                                                        <ul className="text-sm text-[#12344d] font-normal py-1">
                                                            <li className="flex items-center  px-4 py-2 hover:bg-[#ebeff3] cursor-pointer">
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
                                                    <span>Customer Name</span>
                                                    <i className="dropdown-icon-hover ri-arrow-down-s-fill"></i>
                                                </div>
                                            </th>
                                            <th className="th-cell">
                                                <div className="flex justify-between items-center gap-1">
                                                    <span>Quotation Date</span> 
                                                    <i className="dropdown-icon-hover ri-arrow-down-s-fill"></i>
                                                </div>
                                            </th>
                                            <th className="th-cell">
                                                <div className="flex justify-between items-center gap-1">
                                                    <span>Expiry Date</span> 
                                                    <i className="dropdown-icon-hover ri-arrow-down-s-fill"></i>
                                                </div>
                                            </th>
                                            <th className="th-cell">
                                                <div className="flex justify-between items-center gap-1">
                                                    <span>Total Amount</span>
                                                    <i className="dropdown-icon-hover ri-arrow-down-s-fill"></i>
                                                </div>
                                            </th>
                                            <th className="th-cell">
                                                <div className="flex justify-between items-center gap-1">
                                                    <span>Status</span>
                                                    <i className="dropdown-icon-hover ri-arrow-down-s-fill"></i>
                                                </div>
                                            </th>
                                            <th className="last-th-cell">
                                                <div className="flex justify-between items-center gap-1">
                                                    <span>Category</span>
                                                    <i className="dropdown-icon-hover ri-arrow-down-s-fill"></i>
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredQuotations.map((quotation, index) => ( 
                                            <tr key={quotation.id} className={`tr-hover group ${selectedIds.includes(quotation.id) ? "bg-[#e5f2fd] hover:bg-[#f5f7f9]" : ""}`}>
                                                <td className="td-cell">
                                                    <CheckboxGroup
                                                        name="selectall"
                                                        value="selectAll"
                                                        checked={selectedIds.includes(quotation.id)}
                                                        onChange={() => handleCheckboxChange(quotation.id)}
                                                    />
                                                </td>
                                                <td className="td-cell">
                                                    <span className="float-left">{index + 1}</span>
                                                    <span className="float-right">
                                                        <i className="ri-pencil-fill edit-icon opacity-0 group-hover:opacity-100"></i>
                                                    </span>
                                                </td>
                                                <td className="td-cell">{quotation.quotationNumber}</td> 
                                                <td className="td-cell">{quotation.customer}</td>
                                                <td className="td-cell">{quotation.quotationDate}</td> 
                                                <td className="td-cell">{quotation.expiryDate}</td> 
                                                <td className="td-cell">₹{quotation.totalAmount.toLocaleString()}</td>
                                                <td className="td-cell">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${quotation.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                                                        quotation.status === 'Sent' ? 'bg-blue-100 text-blue-800' : 
                                                            quotation.status === 'Draft' ? 'bg-purple-100 text-gray-800' : 
                                                                'bg-red-100 text-red-800'
                                                        }`}>
                                                        {quotation.status}
                                                    </span>
                                                </td>
                                                <td className="last-td-cell">{quotation.category}</td>
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
                    Showing <span className="text-red-600">{filteredQuotations.length}</span> of <span className="text-blue-600">{quotations.length}</span> 
                </span>
            </footer>
        </Layout>
    );
};

export default QuotationList;