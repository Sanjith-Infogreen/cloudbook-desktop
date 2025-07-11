"use client";
import { useEffect, useState, useRef, RefObject } from "react";
import Layout from "../../../components/Layout";
import { useRouter } from "next/navigation";
import FilterSidebar from "@/app/utils/filterSIdebar";
import SearchableSelect, { Option } from "@/app/utils/searchableSelect";
import CustomizeTableContent from "@/app/utils/customizeTableSidebar";
import { Input, RadioGroup, CheckboxGroup } from "@/app/utils/form-controls";
import ConfirmationModal from "@/app/utils/confirmationModal/page";


interface Contact {
  id: number;
  contactID: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  type: string; 
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

type TabKey = "all" | "customer" | "vendor" | "lead" | "other";

const ContactList = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isViewDropdownOpen, setViewDropdownOpen] = useState(false);
  const [isContactDropdownOpen, setContactDropdownOpen] = useState(false);
  const viewRef = useRef(null);
  const contactRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

 
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [companyOptions, setCompanyOptions] = useState<Option[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContactData = async () => {
      try {
        const [contactsResponse, companiesResponse] = await Promise.all([
          fetch("http://localhost:4000/contacts"), 
          fetch("http://localhost:4000/companyOptions"), 
        ]);

        if (!contactsResponse.ok) {
          throw new Error(`HTTP error! Status: ${contactsResponse.status} from /contacts`);
        }
        if (!companiesResponse.ok) {
          throw new Error(`HTTP error! Status: ${companiesResponse.status} from /companyOptions`);
        }

        const contactsData: Contact[] = await contactsResponse.json();
        const companiesData: Option[] = await companiesResponse.json();

        setContacts(contactsData);
        setCompanyOptions(companiesData);
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

    fetchContactData();
  }, []);

  const handleDelete = () => {
    console.log("Deleting contacts with IDs:", selectedIds);
   
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
      contactRef.current &&
      !(contactRef.current as any).contains(e.target)
    ) {
      setContactDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [fields, setFields] = useState([
    { id: "contactID", label: "Contact ID", visible: true },
    { id: "firstName", label: "First Name", visible: true },
    { id: "lastName", label: "Last Name", visible: true },
    { id: "email", label: "Email", visible: true },
    { id: "phone", label: "Phone", visible: true },
    { id: "company", label: "Company", visible: true },
    { id: "type", label: "Contact Type", visible: true },
    { id: "status", label: "Status", visible: true }, 
    { id: "address", label: "Address", visible: false },
    { id: "lastContacted", label: "Last Contacted", visible: false },
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
          "contactID",
          "firstName",
          "lastName",
          "email",
          "phone",
          "company",
          "type",
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
      setSelectedIds(filteredContacts.map((p) => p.id));
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
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [selectedContactType, setSelectedContactType] = useState<string | null>(null);
  const [selectedContactStatus, setSelectedContactStatus] = useState<string | null>(null);

  const handleCompanyChange = (value: string | string[] | null) => {
    console.log("Selected Company:", value);
    setSelectedCompany(value as string | null);
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
      selectedCompany,
      selectedContactType,
      selectedContactStatus,
    });
    setIsFilterSidebarOpen(false);
  };

  const handleResetFilters = () => {
    console.log("Resetting filters");
    setSelectedCompany(null);
    setSelectedContactType(null);
    setSelectedContactStatus(null);
  };

  const tabs: TabKey[] = ["all", "customer", "vendor", "lead", "other"];

 
  const counts: Record<TabKey, number> = {
    all: contacts.length,
    customer: contacts.filter(c => c.type.toLowerCase() === 'customer').length,
    vendor: contacts.filter(c => c.type.toLowerCase() === 'vendor').length,
    lead: contacts.filter(c => c.status.toLowerCase() === 'lead').length,
    other: contacts.filter(c => c.type.toLowerCase() === 'other').length,
  };

  const router = useRouter();

  const filteredContacts =
    activeTab === "all"
      ? contacts
      : contacts.filter((c) => {
          if (activeTab === "lead") {
            return c.status.toLowerCase() === 'lead';
          }
          return c.type.toLowerCase() === activeTab;
        });

  useEffect(() => {
    setSelectAll(
      filteredContacts.length > 0 &&
      selectedIds.length === filteredContacts.length
    );
  }, [selectedIds, filteredContacts]);

  if (loading) {
    return <Layout pageTitle="Contact List">Loading contacts...</Layout>;
  }

  if (error) {
    return <Layout pageTitle="Contact List">Error: {error}</Layout>;
  }

  return (
    <Layout pageTitle="Contact List">
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
                        ? "All Contacts"
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
                  Import Contacts
                </button>
                <button className="px-2 border-l border-[#cfd7df] hover:bg-[#ebeff3] cursor-pointer">
                  <i className="ri-arrow-down-s-line"></i>
                </button>
              </div>
              <button
                className="btn-sm btn-primary ml-2 text-sm"
                onClick={() => router.push("/modules/contact/new")}
              >
                <i className="ri-add-fill mr-1"></i>
                <span className="text-sm">Add Contact</span>
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
                      setSelectedIds(filteredContacts.map((p) => p.id));
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
                    title="Delete selected contacts?"
                    message="These contacts will be permanently deleted and cannot be recovered."
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
                name="contactSearch"
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
                    <label className="filter-label">Contact Type</label>
                    <RadioGroup
                      name="contactType"
                      options={[
                        
                        { value: "Customer", label: "Customer" },
                        { value: "Vendor", label: "Vendor" },
                        { value: "Other", label: "Other" },
                      ]}
                     
                    />
                  </div>
                  <div>
                    <label className="filter-label">Contact Status</label>
                    <RadioGroup
                      name="contactStatus"
                      options={[
                        
                        { value: "Active", label: "Active" },
                        { value: "Inactive", label: "Inactive" },
                        { value: "Lead", label: "Lead" },
                      ]}
                      
                    />
                  </div>
                  <div>
                    <label htmlFor="company-select" className="filter-label">
                      Company
                    </label>
                    <SearchableSelect
                      id="company-select"
                      name="company"
                      options={companyOptions}
                      placeholder="Select Company"
                      searchable
                      onChange={handleCompanyChange}
                      initialValue={selectedCompany}
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
              <div className=" fixed top-42 left-1/2 transform -translate-x-1/2 z- badge-selected">
                {selectedIds.length} Contacts selected
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
                          <span>Contact ID</span>
                          <i
                            className={`dropdown-icon-hover ri-arrow-down-s-fill cursor-pointer ${isContactDropdownOpen ? 'bg-[#c9d1d7]' : ''
                              }`}
                            onClick={() => setContactDropdownOpen(prev => !prev)} ref={contactRef}
                          ></i>
                        </div>
                        {isContactDropdownOpen && (
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
                          <span>First Name</span>
                          <i className="dropdown-icon-hover ri-arrow-down-s-fill"></i>
                        </div>
                      </th>
                      <th className="th-cell">
                        <div className="flex justify-between items-center gap-1">
                          <span>Last Name</span>
                          <i className="dropdown-icon-hover ri-arrow-down-s-fill"></i>
                        </div>
                      </th>
                      <th className="th-cell">
                        <div className="flex justify-between items-center gap-1">
                          <span>Email</span>
                          <i className="dropdown-icon-hover ri-arrow-down-s-fill"></i>
                        </div>
                      </th>
                      <th className="th-cell">
                        <div className="flex justify-between items-center gap-1">
                          <span>Phone</span>
                          <i className="dropdown-icon-hover ri-arrow-down-s-fill"></i>
                        </div>
                      </th>
                      <th className="th-cell">
                        <div className="flex justify-between items-center gap-1">
                          <span>Company</span>
                          <i className="dropdown-icon-hover ri-arrow-down-s-fill"></i>
                        </div>
                      </th>
                      <th className="th-cell">
                        <div className="flex justify-between items-center gap-1">
                          <span>Type</span>
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
                    {filteredContacts.map((c, index) => (
                      <tr
                        key={c.id}
                        className={`tr-hover group ${selectedIds.includes(c.id) ? "bg-[#e5f2fd] hover:bg-[#f5f7f9]" : ""
                          }`}
                      >
                        <td className="td-cell">
                          <CheckboxGroup
                            name="selectall"
                            value="selectAll"
                            checked={selectedIds.includes(c.id)}
                            onChange={() => handleCheckboxChange(c.id)}
                          />
                        </td>
                        <td className="td-cell">
                          <span className="float-left">{index + 1}</span>
                          <span className="float-right">
                            <i className="ri-pencil-fill edit-icon opacity-0 group-hover:opacity-100"></i>
                          </span>
                        </td>
                        <td className="td-cell">{c.contactID}</td>
                        <td className="td-cell">{c.firstName}</td>
                        <td className="td-cell">{c.lastName}</td>
                        <td className="td-cell">{c.email}</td>
                        <td className="td-cell">{c.phone}</td>
                        <td className="td-cell">{c.company}</td>
                        <td className="td-cell">
                          <span className={`px-2 py-1 rounded-full text-xs ${c.type === 'Customer' ? 'bg-blue-100 text-blue-800' :
                              c.type === 'Vendor' ? 'bg-purple-100 text-purple-800' :
                                'bg-gray-100 text-gray-800'
                            }`}>
                            {c.type}
                          </span>
                        </td>
                        <td className="last-td-cell">
                          <span className={`px-2 py-1 rounded-full text-xs ${c.status === 'Active' ? 'bg-green-100 text-green-800' :
                              c.status === 'Inactive' ? 'bg-red-100 text-red-800' :
                                'bg-yellow-100 text-yellow-800'
                            }`}>
                            {c.status}
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
          Showing <span className="text-red-600">{filteredContacts.length}</span> of <span className="text-blue-600">{contacts.length}</span>
        </span>
      </footer>
    </Layout>
  );
};

export default ContactList;