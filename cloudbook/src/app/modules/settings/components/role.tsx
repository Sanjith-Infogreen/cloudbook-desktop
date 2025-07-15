"use client";

import { useState } from "react";
import { Input, CheckboxGroup } from "@/app/utils/form-controls";

// Existing Types
type CustomerPermissions = {
  fullAccess: boolean;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  assignOwner: boolean;
};

type VendorPermissions = {
  fullAccess: boolean;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  // NO assignOwner here
};

type ItemPermissions = {
  fullAccess: boolean;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  
};

// NEW TYPES based on the image
type InventoryAdjustmentsPermissions = {
  fullAccess: boolean;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  approve: boolean; // Present in image
};

type PriceListPermissions = {
  fullAccess: boolean;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  // No 'approve' here as per image
};

type BankingPermissions = {
  fullAccess: boolean;
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
  // No 'assignOwner' or 'approve' here as per image
};

// Updated main Permissions type to include new sections
type Permissions = {
  customers: CustomerPermissions;
  vendors: VendorPermissions;
  items: ItemPermissions;
  inventoryAdjustments: InventoryAdjustmentsPermissions; // New section
  priceList: PriceListPermissions;                       // New section
  banking: BankingPermissions;                           // New section
};

export default function RolesList() {
  const [showNewRole, setShowNewRole] = useState(false);

  const roles = [
    {
      name: "Admin",
      description: "Unrestricted access to all modules.",
    },
    {
      name: "Staff",
      description: "Access to all modules except reports, settings and accountant.",
    },
    {
      name: "Staff (Assigned Customers Only)",
      description:
        "Access to all modules, transactions and data of assigned customers and all vendors except banking, reports, settings and accountant.",
    },
    {
      name: "TimesheetStaff",
      description: "TimesheetStaff Role",
    },
  ];

  // Initialize state for all permissions, including the new sections
  const [permissions, setPermissions] = useState<Permissions>({
    customers: {
      fullAccess: true,
      view: true,
      create: true,
      edit: true,
      delete: true,
      assignOwner: true,
    },
    vendors: {
      fullAccess: true,
      view: true,
      create: true,
      edit: true,
      delete: true,
    },
    items: {
      fullAccess: false,
      view: false,
      create: false,
      edit: false,
      delete: false,
      
    },
    inventoryAdjustments: { // Initial state for Inventory Adjustments
      fullAccess: false,
      view: false,
      create: false,
      edit: false,
      delete: false,
      approve: false,
    },
    priceList: { // Initial state for Price List
      fullAccess: false,
      view: false,
      create: false,
      edit: false,
      delete: false,
    },
    banking: { // Initial state for Banking
      fullAccess: false,
      view: false,
      create: false,
      edit: false,
      delete: false,
    },
  });

  function handleCheckboxChange<
    Section extends keyof Permissions,
    Permission extends keyof Permissions[Section]
  >(section: Section, permission: Permission) {
    setPermissions((prev) => {
      const currentSection = prev[section];
      const newValue = !currentSection[permission];

      if (permission === "fullAccess") {
        const updatedPermissions = Object.keys(currentSection).reduce((acc, key) => {
          // Type assertion to 'any' here is a common pattern when dealing with Object.keys and dynamic property assignment
          // because TypeScript struggles to maintain the exact type mapping.
          (acc as any)[key] = newValue;
          return acc;
        }, {} as Permissions[Section]); // Assert initial empty object as the correct section type

        return {
          ...prev,
          [section]: updatedPermissions,
        };
      }

      const updatedSection = {
        ...currentSection,
        [permission]: newValue,
      };

      // Filter out 'fullAccess' when checking individual permissions
      const allIndividualPermissionsEnabled = (
        Object.entries(updatedSection) as [keyof Permissions[Section], boolean][]
      )
        .filter(([key]) => key !== "fullAccess")
        .every(([_, val]) => val === true);

      // Only update fullAccess if the changed permission is not fullAccess itself
      if (permission !== "fullAccess") {
        updatedSection.fullAccess = allIndividualPermissionsEnabled;
      }

      return {
        ...prev,
        [section]: updatedSection,
      };
    });
  }

  return (
    <div className=" flex flex-col">
      {showNewRole ? (
        // New Role Form View
        <>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200  px-6 pb-3 pt-2">
            <div className="flex items-center gap-2">
              <button onClick={() => setShowNewRole(false)}>
                <i className="ri-arrow-left-line text-xl cursor-pointer"></i>
              </button>
              <h1 className="text-xl">New Role</h1>
            </div>
          </div>

          {/* Form Body */}
          <div className="h-[calc(100vh-153px)] overflow-y-auto px-13.5 py-6  space-y-6">
            <div className="flex items-start gap-4 mb-4">
              <label className="w-[10%] form-label">
                Role Name<span className="text-red-500">*</span>
              </label>
              <Input
                name="rolename"
                placeholder="Enter Role Name"
                className="!w-[40%]"
              />
            </div>

            <div className="flex items-start gap-4">
              <label className="w-[10%] form-label">Description</label>
              <textarea
                className="w-[40%] px-[0.75rem] py-[0.375rem] text-[#212529] bg-white border border-[#cbcbcb] rounded-md leading-[1.5] focus:outline-none focus:border-[#009333]"
                rows={3}
                placeholder="Role description "
              ></textarea>
            </div>

            <div className="p-4  bg-green-50  rounded">
              <label className="flex items-center gap-2 font-semibold text-[15px]">
                <CheckboxGroup name="select" value="select" />
                This role is for Accountant users
              </label>
              <p className="text-[14px] pl-6">
                If you mark this option, all users who are added with this role
                will be an accountant user.
              </p>
            </div>

            {/* Contacts Table (Existing) */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full">
                <thead>
                  {/* First row - Just "Contacts" header */}
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th
                      colSpan={8}
                      className="px-4 py-3 text-left text-sm font-medium text-gray-900"
                    >
                      Contacts
                    </th>
                  </tr>

                  {/* Second row - Column headers with empty first cell */}
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 border-r border-gray-200"></th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 border-r border-gray-200">
                      Full Access
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 border-r border-gray-200">
                      View
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 border-r border-gray-200">
                      Create
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 border-r border-gray-200">
                      Edit
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 border-r border-gray-200">
                      Delete
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 border-r border-gray-200">
                      Assign Owner
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-900"></th>
                  </tr>
                </thead>
                <tbody>
                  {/* Customers Row */}
                  <tr className="">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-200">
                      Customers
                    </td>
                    <td className="px-4 py-3 text-center border-b  border-r border-gray-200">
                      <CheckboxGroup
                        name="selectCustomerFullAccess"
                        value="selectCustomerFullAccess"
                        checked={permissions.customers.fullAccess}
                        onChange={() =>
                          handleCheckboxChange("customers", "fullAccess")
                        }
                      />
                    </td>
                    <td className="px-4 py-3 text-center border-b border-r border-gray-200">
                      <CheckboxGroup
                        name="selectCustomerView"
                        value="selectCustomerView"
                        checked={permissions.customers.view}
                        onChange={() =>
                          handleCheckboxChange("customers", "view")
                        }
                      />
                    </td>
                    <td className="px-4 py-3 text-center border-b border-r border-gray-200">
                      <CheckboxGroup
                        name="selectCustomerCreate"
                        value="selectCustomerCreate"
                        checked={permissions.customers.create}
                        onChange={() =>
                          handleCheckboxChange("customers", "create")
                        }
                      />
                    </td>
                    <td className="px-4 py-3 text-center border-b border-r border-gray-200">
                      <CheckboxGroup
                        name="selectCustomerEdit"
                        value="selectCustomerEdit"
                        checked={permissions.customers.edit}
                        onChange={() =>
                          handleCheckboxChange("customers", "edit")
                        }
                      />
                    </td>
                    <td className="px-4 py-3 text-center border-b border-r border-gray-200">
                      <CheckboxGroup
                        name="selectCustomerDelete"
                        value="selectCustomerDelete"
                        checked={permissions.customers.delete}
                        onChange={() =>
                          handleCheckboxChange("customers", "delete")
                        }
                      />
                    </td>
                    <td className="px-4 py-3 text-center border-b border-r border-gray-200">
                      <CheckboxGroup
                        name="selectCustomerassignOwner"
                        value="selectCustomerassignOwner"
                        checked={permissions.customers.assignOwner}
                        onChange={() =>
                          handleCheckboxChange("customers", "assignOwner")
                        }
                      />
                    </td>
                    <td className="px-4 py-3  border-b border-gray-200">
                      <button className="text-[#009333] hover:text-blue-800 text-sm font-medium">
                        More Permissions
                      </button>
                    </td>
                  </tr>
                  <tr className="border-b border-gray-200">
                    <td className="border-r border-gray-200"></td>
                    <td colSpan={7} className="px-4 py-3">
                      <label className="inline-flex items-center">
                        <CheckboxGroup name="select" value="select" />
                        <span className="ml-2 text-sm text-gray-700">
                          Allow users to handle the data and transactions for
                          assigned customers only.
                        </span>
                      </label>
                    </td>
                  </tr>

                  {/* Vendors Row */}
                  <tr className=" ">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-200">
                      Vendors
                    </td>
                    <td className="px-4 py-3 text-center border-b  border-r border-gray-200">
                      <CheckboxGroup
                        name="selectVendorFullAccess"
                        value="selectVendorFullAccess"
                        checked={permissions.vendors.fullAccess}
                        onChange={() =>
                          handleCheckboxChange("vendors", "fullAccess")
                        }
                      />
                    </td>
                    <td className="px-4 py-3 text-center border-b border-r border-gray-200">
                      <CheckboxGroup
                        name="selectVendorview"
                        value="selectVendorview"
                        checked={permissions.vendors.view}
                        onChange={() => handleCheckboxChange("vendors", "view")}
                      />
                    </td>
                    <td className="px-4 py-3 text-center border-b border-r border-gray-200">
                      <CheckboxGroup
                        name="selectVendorcreate"
                        value="selectVendorcreate"
                        checked={permissions.vendors.create}
                        onChange={() =>
                          handleCheckboxChange("vendors", "create")
                        }
                      />
                    </td>
                    <td className="px-4 py-3 text-center border-b border-r border-gray-200">
                      <CheckboxGroup
                        name="selectVendoredit"
                        value="selectVendoredit"
                        checked={permissions.vendors.edit}
                        onChange={() => handleCheckboxChange("vendors", "edit")}
                      />
                    </td>
                    <td className="px-4 py-3 text-center border-b border-r border-gray-200">
                      <CheckboxGroup
                        name="selectVendoredelete"
                        value="selectVendoredelete"
                        checked={permissions.vendors.delete}
                        onChange={() =>
                          handleCheckboxChange("vendors", "delete")
                        }
                      />
                    </td>
                    <td className=" border-b border-r border-gray-200">
                      {/* Empty cell for 'Assign Owner' as it's not applicable for Vendors */}
                    </td>
                    <td className="px-4 py-3  border-b border-gray-200">
                      <button className="text-[#009333] hover:text-blue-800 text-sm font-medium">
                        More Permissions
                      </button>
                    </td>
                  </tr>
                  <tr className="">
                    <td className="border-r border-gray-200"></td>
                    <td colSpan={7} className="px-4 py-3">
                      <label className="inline-flex items-center">
                        <CheckboxGroup name="select" value="select" />
                        <span className="ml-2 text-sm text-gray-700">
                          Allow users to add, edit and delete vendor's bank
                          account details.
                        </span>
                      </label>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Items Table (New section based on image) */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mt-6">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th colSpan={8} className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                                Items
                            </th>
                        </tr>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-4 py-3 border-r border-gray-200"></th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 border-r border-gray-200">
                                Full Access
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 border-r border-gray-200">
                                View
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 border-r border-gray-200">
                                Create
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 border-r border-gray-200">
                                Edit
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 border-r border-gray-200">
                                Delete
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 border-r border-gray-200">
                                Approve
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-gray-900"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Item Row */}
                        <tr className="border-b border-gray-200">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-200">
                                Item
                            </td>
                            <td className="px-4 py-3 text-center border-r border-gray-200">
                                <CheckboxGroup
                                    name="selectItemFullAccess"
                                    value="selectItemFullAccess"
                                    checked={permissions.items.fullAccess}
                                    onChange={() => handleCheckboxChange('items', 'fullAccess')}
                                />
                            </td>
                            <td className="px-4 py-3 text-center border-r border-gray-200">
                                <CheckboxGroup
                                    name="selectItemView"
                                    value="selectItemView"
                                    checked={permissions.items.view}
                                    onChange={() => handleCheckboxChange('items', 'view')}
                                />
                            </td>
                            <td className="px-4 py-3 text-center border-r border-gray-200">
                                <CheckboxGroup
                                    name="selectItemCreate"
                                    value="selectItemCreate"
                                    checked={permissions.items.create}
                                    onChange={() => handleCheckboxChange('items', 'create')}
                                />
                            </td>
                            <td className="px-4 py-3 text-center border-r border-gray-200">
                                <CheckboxGroup
                                    name="selectItemEdit"
                                    value="selectItemEdit"
                                    checked={permissions.items.edit}
                                    onChange={() => handleCheckboxChange('items', 'edit')}
                                />
                            </td>
                            <td className="px-4 py-3 text-center border-r border-gray-200">
                                <CheckboxGroup
                                    name="selectItemDelete"
                                    value="selectItemDelete"
                                    checked={permissions.items.delete}
                                    onChange={() => handleCheckboxChange('items', 'delete')}
                                />
                            </td>
                            <td className=" border-r border-gray-200">
                               
                            </td>
                            <td className="px-4 py-3">
                                <button className="text-[#009333] hover:text-blue-800 text-sm font-medium">
                                    More Permissions
                                </button>
                            </td>
                        </tr>

                        {/* Inventory Adjustments Row */}
                        <tr className="border-b border-gray-200">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-200">
                                Inventory Adjustments
                            </td>
                            <td className="px-4 py-3 text-center border-r border-gray-200">
                                <CheckboxGroup
                                    name="selectInventoryAdjustmentsFullAccess"
                                    value="selectInventoryAdjustmentsFullAccess"
                                    checked={permissions.inventoryAdjustments.fullAccess}
                                    onChange={() => handleCheckboxChange('inventoryAdjustments', 'fullAccess')}
                                />
                            </td>
                            <td className="px-4 py-3 text-center border-r border-gray-200">
                                <CheckboxGroup
                                    name="selectInventoryAdjustmentsView"
                                    value="selectInventoryAdjustmentsView"
                                    checked={permissions.inventoryAdjustments.view}
                                    onChange={() => handleCheckboxChange('inventoryAdjustments', 'view')}
                                />
                            </td>
                            <td className="px-4 py-3 text-center border-r border-gray-200">
                                <CheckboxGroup
                                    name="selectInventoryAdjustmentsCreate"
                                    value="selectInventoryAdjustmentsCreate"
                                    checked={permissions.inventoryAdjustments.create}
                                    onChange={() => handleCheckboxChange('inventoryAdjustments', 'create')}
                                />
                            </td>
                            <td className="px-4 py-3 text-center border-r border-gray-200">
                                <CheckboxGroup
                                    name="selectInventoryAdjustmentsEdit"
                                    value="selectInventoryAdjustmentsEdit"
                                    checked={permissions.inventoryAdjustments.edit}
                                    onChange={() => handleCheckboxChange('inventoryAdjustments', 'edit')}
                                />
                            </td>
                            <td className="px-4 py-3 text-center border-r border-gray-200">
                                <CheckboxGroup
                                    name="selectInventoryAdjustmentsDelete"
                                    value="selectInventoryAdjustmentsDelete"
                                    checked={permissions.inventoryAdjustments.delete}
                                    onChange={() => handleCheckboxChange('inventoryAdjustments', 'delete')}
                                />
                            </td>
                            <td className="px-4 py-3 text-center border-r border-gray-200">
                                <CheckboxGroup
                                    name="selectInventoryAdjustmentsApprove"
                                    value="selectInventoryAdjustmentsApprove"
                                    checked={permissions.inventoryAdjustments.approve}
                                    onChange={() => handleCheckboxChange('inventoryAdjustments', 'approve')}
                                />
                            </td>
                            <td className="px-4 py-3">
                                <button className="text-[#009333] hover:text-blue-800 text-sm font-medium">
                                    More Permissions
                                </button>
                            </td>
                        </tr>

                        {/* Price List Row */}
                        <tr className="">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-200">
                                Price List
                            </td>
                            <td className="px-4 py-3 text-center border-r border-gray-200">
                                <CheckboxGroup
                                    name="selectPriceListFullAccess"
                                    value="selectPriceListFullAccess"
                                    checked={permissions.priceList.fullAccess}
                                    onChange={() => handleCheckboxChange('priceList', 'fullAccess')}
                                />
                            </td>
                            <td className="px-4 py-3 text-center border-r border-gray-200">
                                <CheckboxGroup
                                    name="selectPriceListView"
                                    value="selectPriceListView"
                                    checked={permissions.priceList.view}
                                    onChange={() => handleCheckboxChange('priceList', 'view')}
                                />
                            </td>
                            <td className="px-4 py-3 text-center border-r border-gray-200">
                                <CheckboxGroup
                                    name="selectPriceListCreate"
                                    value="selectPriceListCreate"
                                    checked={permissions.priceList.create}
                                    onChange={() => handleCheckboxChange('priceList', 'create')}
                                />
                            </td>
                            <td className="px-4 py-3 text-center border-r border-gray-200">
                                <CheckboxGroup
                                    name="selectPriceListEdit"
                                    value="selectPriceListEdit"
                                    checked={permissions.priceList.edit}
                                    onChange={() => handleCheckboxChange('priceList', 'edit')}
                                />
                            </td>
                            <td className="px-4 py-3 text-center border-r border-gray-200">
                                <CheckboxGroup
                                    name="selectPriceListDelete"
                                    value="selectPriceListDelete"
                                    checked={permissions.priceList.delete}
                                    onChange={() => handleCheckboxChange('priceList', 'delete')}
                                />
                            </td>
                            <td className="px-4 py-3 text-center border-r border-gray-200">
                                {/* No Approve for Price List as per image */}
                            </td>
                            <td className="px-4 py-3">
                                <button className="text-[#009333] hover:text-blue-800 text-sm font-medium">
                                    More Permissions
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Banking Table (New section based on image) */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mt-6">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th colSpan={7} className="px-4 py-3 text-left text-sm font-medium text-gray-900">
                                Banking
                            </th>
                        </tr>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-4 py-3 border-r border-gray-200"></th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 border-r border-gray-200">
                                Full Access
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 border-r border-gray-200">
                                View
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 border-r border-gray-200">
                                Create
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 border-r border-gray-200">
                                Edit
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-gray-900 border-r border-gray-200">
                                Delete
                            </th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-gray-900"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Banking Row */}
                        <tr className="">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900 border-r border-gray-200">
                                Banking
                            </td>
                            <td className="px-4 py-3 text-center border-r border-gray-200">
                                <CheckboxGroup
                                    name="selectBankingFullAccess"
                                    value="selectBankingFullAccess"
                                    checked={permissions.banking.fullAccess}
                                    onChange={() => handleCheckboxChange('banking', 'fullAccess')}
                                />
                            </td>
                            <td className="px-4 py-3 text-center border-r border-gray-200">
                                <CheckboxGroup
                                    name="selectBankingView"
                                    value="selectBankingView"
                                    checked={permissions.banking.view}
                                    onChange={() => handleCheckboxChange('banking', 'view')}
                                />
                            </td>
                            <td className="px-4 py-3 text-center border-r border-gray-200">
                                <CheckboxGroup
                                    name="selectBankingCreate"
                                    value="selectBankingCreate"
                                    checked={permissions.banking.create}
                                    onChange={() => handleCheckboxChange('banking', 'create')}
                                />
                            </td>
                            <td className="px-4 py-3 text-center border-r border-gray-200">
                                <CheckboxGroup
                                    name="selectBankingEdit"
                                    value="selectBankingEdit"
                                    checked={permissions.banking.edit}
                                    onChange={() => handleCheckboxChange('banking', 'edit')}
                                />
                            </td>
                            <td className="px-4 py-3 text-center border-r border-gray-200">
                                <CheckboxGroup
                                    name="selectBankingDelete"
                                    value="selectBankingDelete"
                                    checked={permissions.banking.delete}
                                    onChange={() => handleCheckboxChange('banking', 'delete')}
                                />
                            </td>
                            <td className="px-4 py-3">
                                <button className="text-[#009333] hover:text-blue-800 text-sm font-medium">
                                    More Permissions
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            
          </div>

          <footer className="bg-[#ebeff3] py-3 h-[53.9px] px-4 flex justify-start gap-2">
              <button type="submit" className="btn-sm btn-primary">Save</button>
              <button type="button" className="btn-sm btn-secondary">Cancel</button>
          </footer>
        </>
      ) : (
        // Existing Roles List View
        <>
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-gray-200 mb-4 px-6 pb-3 pt-2">
                        <h1 className="text-xl">Roles</h1>
                        <button className="btn-sm btn-primary" onClick={() => setShowNewRole(true)}>
                            New Role
                        </button>
                    </div>

                    {/* Roles Table */}
                    <div className="px-6 flex-1 overflow-auto">
                        <div className="overflow-x-auto border rounded bg-white">
                            <table className="min-w-full text-sm divide-y divide-gray-200">
                                <thead className="bg-gray-50 text-left">
                                    <tr>
                                        <th className="px-4 py-2 font-medium text-gray-700 flex items-center gap-1">
                                            Role Name <i className="ri-expand-up-down-fill text-gray-500 text-sm"></i>
                                        </th>

                                        <th className="px-4 py-2 font-medium text-gray-700">Description</th>
                                        <th className="px-4 py-2 text-right font-medium text-gray-700">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {roles.map((role, index) => (
                                        <tr key={index} className="hover:bg-gray-50 cursor-pointer">
                                            <td className="px-4 py-2 text-green-600  cursor-pointer">
                                                {role.name}
                                            </td>
                                            <td className="px-4 py-2 text-gray-600">{role.description}</td>
                                            <td className="px-4 py-2 text-right">
                                                <div className="inline-flex border rounded overflow-hidden divide-x divide-gray-300 ">
                                                    <button className="px-3  text-xs text-gray-700 hover:bg-gray-50 bg-gray-100 cursor-pointer">
                                                        Edit
                                                    </button>
                                                    <button className="px-3  text-xs text-gray-700 hover:bg-gray-50 bg-gray-100 cursor-pointer">
                                                        Clone
                                                    </button>
                                                    <button className="px-3  text-xs text-gray-700 hover:bg-gray-50 bg-gray-100 cursor-pointer">
                                                        <i className="ri-delete-bin-line text-base"></i>
                                                    </button>
                                                </div>
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
      )}
    </div>
  );
}