"use client";

import { useEffect, useState } from "react";
import Layout from "../../../components/Layout";
import { useRouter } from "next/navigation";
import FilterSidebar from "@/app/utils/filterSIdebar";
import SearchableSelect, { Option } from "@/app/utils/searchableSelect";
import {
  Input,
  RadioGroup,
  CheckboxGroup,
  Toggle,
} from "@/app/utils/form-controls";

// Define tab key types
type TabKey = "all" | "pending" | "completed" | "cancelled";

const PurchaseList = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("all");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setSelectAll(checked);
    if (checked) {
      setSelectedIds(filteredPurchases.map((p) => p.id));
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

  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['india', 'canada']);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedMultiColors, setSelectedMultiColors] = useState<string[]>([]);

  const supplierOptions: Option[] = [
    { value: 'abc_motors', label: 'ABC Motors Ltd' },
    { value: 'xyz_auto_parts', label: 'XYZ Auto Parts' },
    { value: 'chennai_garage_supplies', label: 'Chennai Garage Supplies' },
    { value: 'south_india_lubricants', label: 'South India Lubricants' },
    { value: 'madurai_vehicle_parts', label: 'Madurai Vehicle Parts' },
    { value: 'coimbatore_auto_hub', label: 'Coimbatore Auto Hub' },
    { value: 'salem_motors', label: 'Salem Motors' },
    { value: 'trichy_auto_solutions', label: 'Trichy Auto Solutions' },
    { value: 'erode_vehicle_store', label: 'Erode Vehicle Store' },
    { value: 'vellore_auto_parts', label: 'Vellore Auto Parts' },
    { value: 'thanjavur_motors', label: 'Thanjavur Motors' },
    { value: 'dindigul_auto_center', label: 'Dindigul Auto Center' },
    { value: 'tirunelveli_parts', label: 'Tirunelveli Parts' },
    { value: 'kanyakumari_auto', label: 'Kanyakumari Auto' },
    { value: 'karur_vehicle_hub', label: 'Karur Vehicle Hub' },
    { value: 'namakkal_motors', label: 'Namakkal Motors' },
    { value: 'dharmapuri_auto', label: 'Dharmapuri Auto' },
    { value: 'krishnagiri_parts', label: 'Krishnagiri Parts' },
    { value: 'hosur_auto_center', label: 'Hosur Auto Center' },
    { value: 'cuddalore_motors', label: 'Cuddalore Motors' },
    { value: 'villupuram_auto', label: 'Villupuram Auto' },
    { value: 'nagapattinam_parts', label: 'Nagapattinam Parts' },
    { value: 'mayiladuthurai_motors', label: 'Mayiladuthurai Motors' },
    { value: 'pudukkottai_auto', label: 'Pudukkottai Auto' },
    { value: 'sivaganga_parts', label: 'Sivaganga Parts' },
    { value: 'ramanathapuram_motors', label: 'Ramanathapuram Motors' },
    { value: 'thoothukudi_auto', label: 'Thoothukudi Auto' },
    { value: 'tirupur_vehicle_hub', label: 'Tirupur Vehicle Hub' },
    { value: 'nilgiris_auto_parts', label: 'Nilgiris Auto Parts' },
    { value: 'perambalur_motors', label: 'Perambalur Motors' },
    { value: 'ariyalur_auto', label: 'Ariyalur Auto' },
    { value: 'kallakurichi_parts', label: 'Kallakurichi Parts' },
    { value: 'ranipet_motors', label: 'Ranipet Motors' },
    { value: 'tirupattur_auto', label: 'Tirupattur Auto' },
    { value: 'chengalpattu_parts', label: 'Chengalpattu Parts' },
  ];





  const handleSupplierChange = (value: string | string[] | null) => {
    console.log('Selected Supplier:', value);
    setSelectedSupplier(value as string | null);
  };

  const handleAddNewItem = () => {
    alert('Add New functionality would go here!');
  };



  // Sidebar specific handlers
  const handleOpenFilterSidebar = () => {
    setIsFilterSidebarOpen(true);
  };

  const handleCloseFilterSidebar = () => {
    setIsFilterSidebarOpen(false);
  };

  const handleApplyFilters = () => {
    console.log('Applying filters:', {
      selectedSupplier,
      selectedCountries,
      selectedColor,
      selectedMultiColors,
    });
    // Here you would typically apply the filters to your data and then close the sidebar
    setIsFilterSidebarOpen(false);
  };

  const handleResetFilters = () => {
    console.log('Resetting filters');
    setSelectedSupplier(null);
    setSelectedCountries([]); // Reset to empty array for multi-select
    setSelectedColor(null);
    setSelectedMultiColors([]); // Reset to empty array for multi-select
    // Optionally close sidebar after reset, or keep it open for user to re-select
    // setIsFilterSidebarOpen(false);
  };





  const tabs: TabKey[] = ["all", "pending", "completed", "cancelled"];

  const counts: Record<TabKey, number> = {
    all: 35,
    pending: 12,
    completed: 20,
    cancelled: 3,
  };

  const router = useRouter();

  const purchases = [
    { id: 1, poNumber: "PO-2024-001", supplier: "ABC Motors Ltd", orderDate: "15/01/2024", totalAmount: 45000, status: "Pending", deliveryDate: "25/01/2024", category: "Spare Parts" },
    { id: 2, poNumber: "PO-2024-002", supplier: "XYZ Auto Parts", orderDate: "18/01/2024", totalAmount: 32000, status: "Completed", deliveryDate: "28/01/2024", category: "Tyres" },
    { id: 3, poNumber: "PO-2024-003", supplier: "Chennai Garage Supplies", orderDate: "20/01/2024", totalAmount: 15000, status: "Pending", deliveryDate: "30/01/2024", category: "Tools" },
    { id: 4, poNumber: "PO-2024-004", supplier: "South India Lubricants", orderDate: "22/01/2024", totalAmount: 8500, status: "Completed", deliveryDate: "02/02/2024", category: "Oils" },
    { id: 5, poNumber: "PO-2024-005", supplier: "Madurai Vehicle Parts", orderDate: "25/01/2024", totalAmount: 67000, status: "Cancelled", deliveryDate: "05/02/2024", category: "Engine Parts" },
    { id: 6, poNumber: "PO-2024-006", supplier: "Coimbatore Auto Hub", orderDate: "28/01/2024", totalAmount: 23000, status: "Pending", deliveryDate: "08/02/2024", category: "Accessories" },
    { id: 7, poNumber: "PO-2024-007", supplier: "Salem Motors", orderDate: "30/01/2024", totalAmount: 41000, status: "Completed", deliveryDate: "10/02/2024", category: "Brake Parts" },
    { id: 8, poNumber: "PO-2024-008", supplier: "Trichy Auto Solutions", orderDate: "02/02/2024", totalAmount: 19000, status: "Pending", deliveryDate: "12/02/2024", category: "Electrical" },
    { id: 9, poNumber: "PO-2024-009", supplier: "Erode Vehicle Store", orderDate: "05/02/2024", totalAmount: 35000, status: "Completed", deliveryDate: "15/02/2024", category: "Suspension" },
    { id: 10, poNumber: "PO-2024-010", supplier: "Vellore Auto Parts", orderDate: "08/02/2024", totalAmount: 28000, status: "Pending", deliveryDate: "18/02/2024", category: "Filters" },
    { id: 11, poNumber: "PO-2024-011", supplier: "Thanjavur Motors", orderDate: "10/02/2024", totalAmount: 52000, status: "Completed", deliveryDate: "20/02/2024", category: "Transmission" },
    { id: 12, poNumber: "PO-2024-012", supplier: "Dindigul Auto Center", orderDate: "12/02/2024", totalAmount: 16000, status: "Pending", deliveryDate: "22/02/2024", category: "Cooling System" },
    { id: 13, poNumber: "PO-2024-013", supplier: "Tirunelveli Parts", orderDate: "15/02/2024", totalAmount: 39000, status: "Completed", deliveryDate: "25/02/2024", category: "Exhaust System" },
    { id: 14, poNumber: "PO-2024-014", supplier: "Kanyakumari Auto", orderDate: "18/02/2024", totalAmount: 21000, status: "Cancelled", deliveryDate: "28/02/2024", category: "Body Parts" },
    { id: 15, poNumber: "PO-2024-015", supplier: "Karur Vehicle Hub", orderDate: "20/02/2024", totalAmount: 44000, status: "Pending", deliveryDate: "02/03/2024", category: "Interior" },
    { id: 16, poNumber: "PO-2024-016", supplier: "Namakkal Motors", orderDate: "22/02/2024", totalAmount: 31000, status: "Completed", deliveryDate: "05/03/2024", category: "Lighting" },
    { id: 17, poNumber: "PO-2024-017", supplier: "Dharmapuri Auto", orderDate: "25/02/2024", totalAmount: 18000, status: "Pending", deliveryDate: "08/03/2024", category: "Safety Equipment" },
    { id: 18, poNumber: "PO-2024-018", supplier: "Krishnagiri Parts", orderDate: "28/02/2024", totalAmount: 27000, status: "Completed", deliveryDate: "10/03/2024", category: "Fuel System" },
    { id: 19, poNumber: "PO-2024-019", supplier: "Hosur Auto Center", orderDate: "02/03/2024", totalAmount: 36000, status: "Pending", deliveryDate: "12/03/2024", category: "Steering" },
    { id: 20, poNumber: "PO-2024-020", supplier: "Cuddalore Motors", orderDate: "05/03/2024", totalAmount: 49000, status: "Completed", deliveryDate: "15/03/2024", category: "Clutch Parts" },
    { id: 21, poNumber: "PO-2024-021", supplier: "Villupuram Auto", orderDate: "08/03/2024", totalAmount: 22000, status: "Cancelled", deliveryDate: "18/03/2024", category: "Batteries" },
    { id: 22, poNumber: "PO-2024-022", supplier: "Nagapattinam Parts", orderDate: "10/03/2024", totalAmount: 33000, status: "Pending", deliveryDate: "20/03/2024", category: "Radiator" },
    { id: 23, poNumber: "PO-2024-023", supplier: "Mayiladuthurai Motors", orderDate: "12/03/2024", totalAmount: 25000, status: "Completed", deliveryDate: "22/03/2024", category: "Alternator" },
    { id: 24, poNumber: "PO-2024-024", supplier: "Pudukkottai Auto", orderDate: "15/03/2024", totalAmount: 38000, status: "Pending", deliveryDate: "25/03/2024", category: "Starter Motor" },
    { id: 25, poNumber: "PO-2024-025", supplier: "Sivaganga Parts", orderDate: "18/03/2024", totalAmount: 29000, status: "Completed", deliveryDate: "28/03/2024", category: "Air Filter" },
    { id: 26, poNumber: "PO-2024-026", supplier: "Ramanathapuram Motors", orderDate: "20/03/2024", totalAmount: 42000, status: "Pending", deliveryDate: "30/03/2024", category: "Shock Absorbers" },
    { id: 27, poNumber: "PO-2024-027", supplier: "Thoothukudi Auto", orderDate: "22/03/2024", totalAmount: 17000, status: "Completed", deliveryDate: "01/04/2024", category: "Wipers" },
    { id: 28, poNumber: "PO-2024-028", supplier: "Tirupur Vehicle Hub", orderDate: "25/03/2024", totalAmount: 34000, status: "Pending", deliveryDate: "05/04/2024", category: "Mirrors" },
    { id: 29, poNumber: "PO-2024-029", supplier: "Nilgiris Auto Parts", orderDate: "28/03/2024", totalAmount: 46000, status: "Completed", deliveryDate: "08/04/2024", category: "Gaskets" },
    { id: 30, poNumber: "PO-2024-030", supplier: "Perambalur Motors", orderDate: "30/03/2024", totalAmount: 24000, status: "Pending", deliveryDate: "10/04/2024", category: "Belts" },
    { id: 31, poNumber: "PO-2024-031", supplier: "Ariyalur Auto", orderDate: "02/04/2024", totalAmount: 37000, status: "Completed", deliveryDate: "12/04/2024", category: "Hoses" },
    { id: 32, poNumber: "PO-2024-032", supplier: "Kallakurichi Parts", orderDate: "05/04/2024", totalAmount: 26000, status: "Pending", deliveryDate: "15/04/2024", category: "Sensors" },
    { id: 33, poNumber: "PO-2024-033", supplier: "Ranipet Motors", orderDate: "08/04/2024", totalAmount: 43000, status: "Completed", deliveryDate: "18/04/2024", category: "Valves" },
    { id: 34, poNumber: "PO-2024-034", supplier: "Tirupattur Auto", orderDate: "10/04/2024", totalAmount: 30000, status: "Pending", deliveryDate: "20/04/2024", category: "Pistons" },
    { id: 35, poNumber: "PO-2024-035", supplier: "Chengalpattu Parts", orderDate: "12/04/2024", totalAmount: 48000, status: "Completed", deliveryDate: "22/04/2024", category: "Bearings" },
  ];

  const filteredPurchases = activeTab === "all" ? purchases : purchases.filter((p) => p.status.toLowerCase() === activeTab);

  useEffect(() => {
    setSelectAll(
      filteredPurchases.length > 0 &&
      selectedIds.length === filteredPurchases.length
    );
  }, [selectedIds, filteredPurchases]);

  return (
    <Layout pageTitle="Purchase List">
      <main className="flex-1">
        <div className="overflow-y-hidden h-[calc(100vh-103px)]">
          {/* Tabs */}
          <div className="flex justify-between items-center bg-white px-1.5 mt-[5px] ml-2 whitespace-nowrap">
            <ul className="flex flex-nowrap text-sm font-medium text-center">
              {tabs.map((tab) => (
                <li key={tab}>
                  <button onClick={() => setActiveTab(tab)} className={`tab ${activeTab === tab ? "bg-[#ebeff3] text-[#384551]" : "hover:text-[#6689b8] hover:bg-[#f5f7f9]"}`}>
                    <span className="flex items-center gap-1">
                      {tab === "all" ? "All Orders" : tab.charAt(0).toUpperCase() + tab.slice(1)}
                      {activeTab === tab && (
                        <>
                          <span className="ml-2 counter-badge">{counts[tab]}</span>
                          <i className="ri-close-fill font-bold px-1 rounded hover:bg-[#dce0e5]" onClick={(e) => { e.stopPropagation(); setActiveTab("all"); }}></i>
                        </>
                      )}
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex items-center flex-shrink-0 ml-auto">
              <button id="openSidebarCustomize" className="btn-sm btn-hover-ct">
                <i className="ri-equalizer-line mr-1"></i>
                <span className="text-sm">Customize Table</span>
              </button>

              <div className="inline-flex border border-[#cfd7df] text-[#12375d] rounded overflow-hidden bg-white text-sm ml-2">
                <button className="flex items-center py-1 px-2 hover:bg-[#ebeff3] cursor-pointer">
                  <i className="ri-download-line mr-1"></i>
                  Import Orders
                </button>
                <button className="px-2 border-l border-[#cfd7df] hover:bg-[#ebeff3] cursor-pointer">
                  <i className="ri-arrow-down-s-line"></i>
                </button>
              </div>

              <button className="btn-sm btn-primary ml-2 text-sm" onClick={() => router.push('/modules/purchase/new')} >
                <i className="ri-add-fill mr-1"></i>
                <span className="text-sm">Add Purchase</span>
              </button>
            </div>
          </div>

          {/* View Mode / Bulk Actions / Search */}
          <div className="flex justify-between items-center px-1.5 py-1.5 bg-[#ebeff3]">
            <div className="flex items-center space-x-2 ml-2">
              {/* First 3 buttons (shown when no checkbox is selected) */}
              {!selectedIds.length && (
                <>
                  <button className="btn-sm btn-hover">
                    <i className="ri-table-fill mr-1"></i>
                    <span className="text-sm">Table</span>
                    <i className="ri-arrow-down-s-line ml-1"></i>
                  </button>

                  <div className="relative inline-block">
                    <button id="viewModeBtn" className="btn-sm btn-visible-hover">
                      <i className="ri-layout-5-line"></i>
                    </button>
                  </div>

                  <button
                    className="btn-sm btn-visible-hover"
                    id="bulkActionsBtn"
                    onClick={() => {
                      setSelectAll(true);
                      setSelectedIds(filteredPurchases.map((p) => p.id));
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
                  <button className="btn-sm btn-hover" id="deleteBtn">
                    <i className="ri-delete-bin-6-line mr-1"></i>
                    Delete
                  </button>
                  <button className="btn-sm btn-visible-hover" id="cancelSelectionBtn" onClick={() => setSelectedIds([])}>
                    <i className="ri-close-line mr-1"></i>
                    Cancel Bulk Actions
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center relative space-x-2">
              <input className="form-control !h-[31px]" type="text" placeholder="Enter PO Number" />
              <button className="btn-sm btn-visible-hover" onClick={handleOpenFilterSidebar}>
                <i className="ri-sort-desc" ></i>
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
                  {/* Single Select Fruit */}

                  

                  <div>
                    <label className="filter-label">PO Number</label>
                    <Input
                      name="poNumber"
                      placeholder="Enter PO Number"
                      
                    />
                  </div>

                  <div>
                    <label className="filter-label">Status</label>
                    <RadioGroup
                      name="status"
                      options={[
                        { value: "All", label: "All" },
                        { value: "Pending", label: "Pending" },
                        { value: "Completed", label: "Completed" },
                        { value: "Cancelled", label: "Cancelled" },
                      ]}
                      
                    />
                  </div>

                  <div>
                    <label htmlFor="supplier-select" className="filter-label">
                      Supplier Name
                    </label>
                    <SearchableSelect
                      id="supplier-select"
                      name="supplier"
                      options={supplierOptions}
                      placeholder="Select Supplier Name"
                      searchable
                      onChange={handleSupplierChange}
                      initialValue={selectedSupplier}
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
              <div className=" fixed top-42 left-1/2 transform -translate-x-1/2 z-50  badge-selected">
                {selectedIds.length} Purchase Orders selected
              </div>
            )}

            <div className="mx-2 h-[calc(100vh-187px)] overflow-hidden rounded-lg bg-white">
              <div className="h-full overflow-y-auto">
                <table className="w-full">
                  <thead className="sticky-table-header">
                    <tr>
                      <th className="th-cell" id="checkboxColumn">
                        <input
                          type="checkbox"
                          id="selectAll"
                          className="form-check"
                          checked={selectAll}
                          onChange={handleSelectAll}
                        />

                         <CheckboxGroup
                            name="features"
                            options={[
                              { value: "AC"} 
                             
                            ]}
                            onChange={(values: string[]) => {
                              // handle checkbox group value changes here if needed
                            }}
                          />

                      </th>
                      <th className="th-cell">
                        <div className="flex justify-between items-center gap-1">
                          <span>S.No.</span>
                        </div>
                      </th>
                      <th className="th-cell">
                        <div className="flex justify-between items-center gap-1">
                          <span>PO Number</span>
                          <i className="dropdown-icon-hover ri-arrow-down-s-fill"></i>
                        </div>
                      </th>
                      <th className="th-cell">
                        <div className="flex justify-between items-center gap-1">
                          <span>Supplier Name</span>
                          <i className="dropdown-icon-hover ri-arrow-down-s-fill"></i>
                        </div>
                      </th>
                      <th className="th-cell">
                        <div className="flex justify-between items-center gap-1">
                          <span>Order Date</span>
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
                      <th className="th-cell">
                        <div className="flex justify-between items-center gap-1">
                          <span>Delivery Date</span>
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
                    {filteredPurchases.map((purchase, index) => (
                      <tr
                        key={purchase.id}
                        className={`tr-hover group ${selectedIds.includes(purchase.id) ? "bg-[#e5f2fd] hover:bg-[#f5f7f9]" : ""
                          }`}
                      >
                        <td className="td-cell">
                          <input
                            type="checkbox"
                            className="form-check"
                            checked={selectedIds.includes(purchase.id)}
                            onChange={() => handleCheckboxChange(purchase.id)}
                          />
                        </td>
                        <td className="td-cell">
                          <span className="float-left">{index + 1}</span>
                          <span className="float-right">
                            <i className="ri-pencil-fill edit-icon opacity-0 group-hover:opacity-100"></i>
                          </span>
                        </td>
                        <td className="td-cell">{purchase.poNumber}</td>
                        <td className="td-cell">{purchase.supplier}</td>
                        <td className="td-cell">{purchase.orderDate}</td>
                        <td className="td-cell">₹{purchase.totalAmount.toLocaleString()}</td>
                        <td className="td-cell">
                          <span className={`px-2 py-1 rounded-full text-xs ${purchase.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            purchase.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                            {purchase.status}
                          </span>
                        </td>
                        <td className="td-cell">{purchase.deliveryDate}</td>
                        <td className="last-td-cell">{purchase.category}</td>
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
          Showing <span className="text-red-600">35</span> of <span className="text-blue-600">35</span>
        </span>
      </footer>
    </Layout>
  );
};

export default PurchaseList;