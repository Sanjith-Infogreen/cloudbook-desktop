import React from 'react';
import Layout from './components/Layout';

export default function DesktopPage() {
  return (
      <Layout>
      <div className=" font-sans antialiased   flex flex-col items-center">

       <div className="bg-white  w-full  overflow-hidden">

         <header className="bg-green-600   text-white p-2  ">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <h1 className="text-xl font-medium mb-2 sm:mb-0">Billing Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-lg hidden sm:block">Welcome, Sanjith !</span>
              <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-semibold text-xl">S</div>
            </div>
          </div>
        </header>

         <main className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

           <div className="lg:col-span-2 flex flex-col space-y-6">

             <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-green-100 p-6 rounded-xl shadow-md flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Total Revenue</p>
                  <p className="text-3xl font-extrabold text-green-900 mt-1">$12,345.67</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 10v1m0-8a5.972 5.972 0 00-2.768-.962M12 8a5.972 5.972 0 012.768-.962m0 0A9.956 9.956 0 0012 2c-5.523 0-10 4.477-10 10s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
                </svg>
              </div>

               <div className="bg-yellow-100 p-6 rounded-xl shadow-md flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-700">Outstanding Bills</p>
                  <p className="text-3xl font-extrabold text-yellow-900 mt-1">$2,100.50</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>

               <div className="bg-blue-100 p-6 rounded-xl shadow-md flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Paid Bills (Month)</p>
                  <p className="text-3xl font-extrabold text-blue-900 mt-1">158</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div className="bg-blue-100 p-6 rounded-xl shadow-md flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Paid Bills (Month)</p>
                  <p className="text-3xl font-extrabold text-blue-900 mt-1">158</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div className="bg-blue-100 p-6 rounded-xl shadow-md flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Paid Bills (Month)</p>
                  <p className="text-3xl font-extrabold text-blue-900 mt-1">158</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div className="bg-blue-100 p-6 rounded-xl shadow-md flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Paid Bills (Month)</p>
                  <p className="text-3xl font-extrabold text-blue-900 mt-1">158</p>
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
            </section>

             <section className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Transactions</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">Invoice ID</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Name</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">INV-001</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Acme Corp.</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">$500.00</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Paid</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">2024-07-01</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">INV-002</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Global Solutions</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">$750.00</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">2024-06-28</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">INV-003</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">Innovate LLC</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">$300.00</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Overdue</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">2024-06-25</td>
                    </tr>
                    {/* More rows can be added here */}
                  </tbody>
                </table>
              </div>
            </section>
          </div>

          {/* Right Column: Revenue Chart & Quick Actions */}
          <div className="lg:col-span-1 flex flex-col space-y-6">
            {/* Revenue Chart Placeholder */}
            <section className="bg-white p-6 rounded-xl shadow-md flex-grow">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Revenue Trend (Last 6 Months)</h2>
              <img src="https://placehold.co/600x400/E0F2F7/2C5282?text=Revenue+Chart" alt="Revenue Chart Placeholder" className="w-full h-auto rounded-lg object-cover" />
              <p className="text-sm text-gray-500 mt-4 text-center">A visual representation of your billing revenue over time.</p>
            </section>

            {/* Quick Actions */}
            <section className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                  Create New Bill
                </button>
                <button className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                  Manage Clients
                </button>
                <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                  View Reports
                </button>
                <button className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
                  Settings
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
    </Layout>
  );
}
