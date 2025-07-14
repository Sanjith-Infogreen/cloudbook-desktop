import { Input } from '@/app/utils/form-controls';
import React, { ReactNode, useState, useEffect } from 'react';
interface SubscriptionProps {
  activeReport?: string | null;
  activeCategory?: string | null;
}
const Subscription: React.FC<SubscriptionProps> = ({ activeReport, activeCategory }) => {
  return (
    <div className="flex flex-col bg-gray-100 ">
       <div className="flex justify-between items-center p-6">
  <h5 className="text-[16px] font-bold text-gray-800">Subscriptions</h5>
  <button className="bg-[#009333] text-[14px]  text-white py-1 px-2 rounded">
    Manage Subscriptions
  </button>
</div>
      <div className="p-2 bg-gray-100 flex-grow overflow-y-auto max-h-[calc(100vh-125px)] h-[calc(100vh-125px)]">
        {/* PLAN DETAILS */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-4 mx-2">
          <h3 className="text-[14px]  mb-3 text-[#009333]"><i className="ri-map-line mr-2"></i> PLAN DETAILS</h3>
          <div className="flex justify-between items-center mb-2">
            <span className="text-[14px] font-medium">Plan Name</span>
            <span className="text-[#BD7400] font-semibold text-lg">Monthly Plan ( ₹799 ) </span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md mb-4 mx-2">
      <h3 className="text-[14px] mb-3 text-[#009333] flex items-center">
        <i className="ri ri-line-chart-line mr-2"></i> USAGE STATS
      </h3>
      <div className="grid grid-cols-3 gap-4">
        {/* Sales */}
        <div className="flex flex-col items-center p-2 border border-gray-200 rounded-lg">
          <div className="text-2xl text-[#009333] mb-1">
            <i className="ri ri-shopping-cart-line"></i>
          </div>
          <p className="text-[14px] text-center font-medium">Sales</p>
          <span className="text-gray-600 text-[12px]"><span className='text-[#009333]'>320</span> / 1000 used</span>
        </div>
        {/* Purchases */}
        <div className="flex flex-col items-center p-2 border border-gray-200 rounded-lg">
          <div className="text-2xl text-[#009333] mb-1">
            <i className="ri ri-exchange-dollar-line"></i>
          </div>
          <p className="text-[14px] text-center font-medium">Purchases</p>
          <span className="text-gray-600 text-[12px]"><span className='text-[#009333]'>20</span>  / 1000 used</span>
        </div>
        {/* Users */}
        <div className="flex flex-col items-center p-2 border border-gray-200 rounded-lg">
          <div className="text-2xl text-[#009333] mb-1">
            <i className="ri ri-user-3-line"></i>
          </div>
          <p className="text-[14px] text-center font-medium">Users</p>
          <span className="text-gray-600 text-[12px]"><span className='text-[#009333]'>1</span>  / 2 used</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-4">
        {/* Custom Reports */}
        <div className="flex flex-col items-center p-2 border border-gray-200 rounded-lg">
          <div className="text-2xl text-[#009333] mb-1">
            <i className="ri ri-file-chart-line"></i>
          </div>
          <p className="text-[14px] text-center font-medium">Custom Reports</p>
          <span className="text-gray-600 text-[12px]">0 / 0 used</span>
        </div>
        {/* API Limit (per day) */}
        <div className="flex flex-col items-center p-2 border border-gray-200 rounded-lg">
          <div className="text-2xl text-[#009333] mb-1">
            <i className="ri ri-code-s-slash-line"></i>
          </div>
          <p className="text-[14px] text-center font-medium">API Limit (per day)</p>
          <span className="text-gray-600 text-[12px]">0 / 1000 used</span>
        </div>
      </div>
    </div>
        {/* OTHER MODULES */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-4 mx-2">
          <h3 className="text-[14px]   mb-3 text-[#009333]"><i className="ri-shape-fill  mr-2"></i> OTHER MODULES</h3>
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-[14px]">WorkFlow</span>
              <span className="text-gray-800 font-medium">0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[14px]">Web Tab</span>
              <span className="text-gray-800 font-medium">0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[14px]">SMS Credits</span>
              <span className="text-gray-800 font-medium">0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[14px]">Snail Mail Credits</span>
              <span className="text-gray-800 font-medium">0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[14px]">Document Scans</span>
              <span className="text-gray-800 font-medium">0</span>
            </div>
          </div>
        </div>
        {/* FEATURES */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-4 mx-2">
          <h3 className="text-[14px]   mb-3 text-[#009333]"><i className="ri-list-check mr-2"></i> FEATURES</h3>
          <div className="mb-8">
            <h5 className=" font-semibold  text-md   mb-1 text-[15px] text-[#009333]">SALES</h5>
            <div className="grid grid-cols-2 gap-y-1 gap-x-4 text-gray-800 text-[14px]">
              <span className="p-1"><i className="ri-check-double-fill text-[#009333]"></i> Manage Invoices</span>
              <span className="p-1"><i className="ri-check-double-fill text-[#009333]"></i> Manage Clients</span>
              <span className="p-1"><i className="ri-check-double-fill text-[#009333]"></i> Sales Orders</span>
              <span className="p-1"><i className="ri-check-double-fill text-[#009333]"></i> Quotes</span>
              <span className="p-1"><i className="ri-check-double-fill text-[#009333]"></i> Recurring Invoices</span>
              <span className="p-1"><i className="ri-check-double-fill text-[#009333]"></i> Credit Notes</span>
              <span className="p-1"><i className="ri-check-double-fill text-[#009333]"></i> Delivery Challans</span>
              <span className="p-1"><i className="ri-check-double-fill text-[#009333]"></i> e-Way Bills</span>
              <span className="p-1"><i className="ri-check-double-fill text-[#009333]"></i> Bill Of Supply</span>
              <span className="p-1"><i className="ri-check-double-fill text-[#009333]"></i> Invoice Customization</span>
              <span className="p-1"><i className="ri-check-double-fill text-[#009333]"></i> Multi-lingual Invoicing</span>
            </div>
          </div>
          {/* PURCHASES */}
          <div className="mb-8">
            <h5 className=" font-semibold  text-md   mb-1 text-[15px] text-[#009333]">PURCHASES</h5>
            <div className="grid grid-cols-2 gap-y-1 gap-x-4 text-gray-800 text-[14px]">
              <span className="p-1"><i className="ri-check-double-fill text-[#009333]"></i> Bills</span>
              <span className="p-1"><i className="ri-check-double-fill text-[#009333]"></i> Purchase Orders</span>
              <span className="p-1"><i className="ri-check-double-fill text-[#009333]"></i> Debit Notes</span>
              <span className="p-1"><i className="ri-check-double-fill text-[#009333]"></i> Vendor Credit Notes</span>
              <span className="p-1"><i className="ri-check-double-fill text-[#009333]"></i> Expenses & Mileage Tracking</span>
            </div>
          </div>
          {/* BANKING */}
          <div className="mb-8">
            <h5 className=" font-semibold  text-md   mb-1 text-[15px] text-[#009333]">BANKING</h5>
            <div className="grid grid-cols-2 gap-y-1 gap-x-4 text-gray-800 text-[14px]">
              <span className="p-1"><i className="ri-check-double-fill text-[#009333]"></i> Import Bank and Credit Card Statements</span>
              <span className="p-1"><i className="ri-check-double-fill text-[#009333]"></i> Add Multiple Bank and Credit Card Accounts</span>
              <span className="p-1"><i className="ri-check-double-fill text-[#009333]"></i> Bank Rules & Reconciliation</span>
              <span className="p-1"><i className="ri-check-double-fill text-[#009333]"></i> Direct Bank Feeds via Partner Banks</span>
            </div>
          </div>
          {/* REPORTS */}
          <div className="mb-8">
            <h5 className=" font-semibold  text-md   mb-1 text-[15px] text-[#009333]">REPORTS</h5>
            <div className="grid grid-cols-2 gap-y-1 gap-x-4 text-gray-800 text-[14px]">
              <span className="p-1"><i className="ri-check-double-fill text-[#009333]"></i> Schedule Reports</span>
              <span className="p-1"><i className="ri-check-double-fill text-[#009333]"></i> Stock Tracking</span>
              <span className="p-1"><i className="ri-check-double-fill text-[#009333]"></i> Reports</span>
              <span className="p-1"><i className="ri-check-double-fill text-[#009333]"></i> Custom Financial Report Generator</span>
            </div>
          </div>
          {/* GST RETURNS */}
          <div className="mb-8">
            <h5 className=" font-semibold  text-md   mb-1 text-[15px] text-[#009333]">GST RETURNS</h5>
            <div className="grid grid-cols-2 gap-y-1 gap-x-4 text-gray-800 text-[14px]">
              <span className="p-1"><i className="ri-check-double-fill text-[#009333]"></i> GST</span>
              <span className="p-1"><i className="ri-check-double-fill text-[#009333]"></i> Track GST</span>
              <span className="p-1"><i className="ri-check-double-fill text-[#009333]"></i> GST Returns</span>
              <span className="p-1"><i className="ri-check-double-fill text-[#009333]"></i> GST Filing</span>
              <span className="p-1"><i className="ri-check-double-fill text-[#009333]"></i> GST Payments</span>
            </div>
          </div>
          {/* ACCOUNTANT */}
          <div className="mb-8">
            <h5 className=" font-semibold  text-md   mb-1 text-[15px] text-[#009333]">ACCOUNTANT</h5>
            <div className="grid grid-cols-2 gap-y-1 gap-x-4 text-gray-800 text-[14px]">
              <span className="p-1"><i className="ri-check-double-fill text-[#009333]"></i> Manual Journals</span>
              <span className="p-1"><i className="ri-check-double-fill text-[#009333]"></i> Chart of Accounts & Sub-accounts</span>
              <span className="p-1"><i className="ri-check-double-fill text-[#009333]"></i> Journal Templates</span>
              <span className="p-1"><i className="ri-check-double-fill text-[#009333]"></i> Recurring journals</span>
              <span className="p-1"><i className="ri-check-double-fill text-[#009333]"></i> Online/Offline Payments</span>
              <span className="p-1"><i className="ri-check-double-fill text-[#009333]"></i> Transaction Locking</span>
            </div>
          </div>
          {/* GENERAL */}
          <div className="mb-8">
            <h5 className=" font-semibold  text-md   mb-1 text-[15px] text-[#009333]">GENERAL</h5>
            <div className="grid grid-cols-2 gap-y-1 gap-x-4 text-gray-800 text-[14px]">
              <span className="p-1"><i className="ri-check-double-fill text-[#009333]"></i> Audit Trail</span>
              <span className="p-1"><i className="ri-check-double-fill text-[#009333]"></i> Manage Items</span>
              <span className="p-1"><i className="ri-check-double-fill text-[#009333]"></i> Predefined User Roles</span>
              <span className="p-1"><i className="ri-check-double-fill text-[#009333]"></i> Bulk Updates</span>
              <span className="p-1"><i className="ri-check-double-fill text-[#009333]"></i> Customer Portal</span>
              <span className="p-1"><i className="ri-check-double-fill text-[#009333]"></i> Generate Payment Links</span>
            </div>
          </div>
          {/* CUSTOM AUTOMATION */}
          <div className="mb-8">
            <h5 className=" font-semibold  text-md   mb-1   text-[15px] text-[#009333]">CUSTOM AUTOMATION</h5>
            <div className="grid grid-cols-2 gap-y-1 gap-x-4 text-gray-800 text-[14px]">
              <span className="p-1"><i className="ri-check-double-fill text-[#009333]"></i> Custom View</span>
              <span className="p-1"><i className="ri-check-double-fill text-[#009333]"></i> Automate Payment Reminders</span>
              <span className="p-1"><i className="ri-check-double-fill text-[#009333]"></i> Automatic Exchange Rates</span>
              <span className="p-1"><i className="ri-check-double-fill text-[#009333]"></i> Timesheet Approvals</span>
              <span className="p-1"><i className="ri-check-double-fill text-[#009333]"></i> Timesheet - Customer Approvals</span>
            </div>
          </div>
          {/* SUPPORT */}
          <div className="mb-8">
            <h5 className=" font-semibold  text-md   mb-1 text-[15px] text-[#009333]">SUPPORT</h5>
            <div className="grid grid-cols-2 gap-y-1 gap-x-4 text-gray-800 text-[14px]">
              <span className="p-1"><i className="ri-check-double-fill text-[#009333]"></i> Email</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Subscription;