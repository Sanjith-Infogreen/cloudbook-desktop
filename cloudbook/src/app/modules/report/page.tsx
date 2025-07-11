 "use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Layout from "../../components/Layout";

import ProductSalesReport from "./components/ProductSalesReport";
import StockValueReport from "./components/StockValueReport";
import SalesProfitReport from "./components/SalesProfitReport";

import CustomerBalanceReport from "./components/CustomerBalanceReport";
import SupplierBalanceReport from "./components/SupplierBalanceReport";
import StatementReport from "./components/StatementReport";

import DaybookReport from "./components/DaybookReport";
import CashbookReport from "./components/CashbookReport";
import TrailBalanceReport from "./components/TrailBalanceReport";

import CustomerSummaryReport from "./components/CustomerSummaryReport";
import SupplierSummaryReport from "./components/SupplierSummaryReport";
import GSTR1Report from "./components/GSTR1Report";
import B2BReport from "./components/B2BReport";
import B2CReport from "./components/B2CReport";
import ProductSalesGSTReport from "./components/ProductSalesGSTReport";
import SalesSummaryReport from "./components/SalesSummaryReport";
import PurchaseSummaryReport from "./components/PurchaseSummaryReport";

import AllSalesExcelReport from "./components/AllSalesExcelReport";
import AllPurchaseExcelReport from "./components/AllPurchaseExcelReport";
 

const ReportsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const report = searchParams.get("report");

  const reportCategories = [
    {
      title: "Product",
      items: [
        { name: "Product Sales Report", icon: "ri-file-list-line" },
        { name: "Stock Value Report", icon: "ri-file-list-line" },
        { name: "Sales Profit Report", icon: "ri-file-list-line" },
      ],
    },
    {
      title: "Outstanding",
      items: [
        { name: "Customer Balance", icon: "ri-file-list-line" },
        { name: "Supplier Balance", icon: "ri-file-list-line" },
        { name: "Statement", icon: "ri-file-list-line" },
      ],
    },
    {
      title: "Accounts",
      items: [
        { name: "Daybook", icon: "ri-file-list-line" },
        { name: "Cashbook", icon: "ri-file-list-line" },
        { name: "Trail Balance", icon: "ri-file-list-line" },
      ],
    },
    {
      title: "GST",
      items: [
        { name: "Customer Summary", icon: "ri-file-list-line" },
        { name: "Supplier Summary", icon: "ri-file-list-line" },
        { name: "GSTR1", icon: "ri-file-list-line" },
        { name: "B2B", icon: "ri-file-list-line" },
        { name: "B2C", icon: "ri-file-list-line" },
        { name: "Product Sales", icon: "ri-file-list-line" },
        { name: "Sales Summary", icon: "ri-file-list-line" },
        { name: "Purchase Summary", icon: "ri-file-list-line" },
      ],
    },
    {
      title: "Excel Download",
      items: [
        { name: "All Sales Excel", icon: "ri-file-list-line" },
        { name: "All Purchase Excel", icon: "ri-file-list-line" },
      ],
    },
  ];

  const initialActiveCategory =
    (category as string) || reportCategories[0].title;
  const initialActiveReport =
    (report as string) || reportCategories[0].items[0].name;

  const [searchTerm, setSearchTerm] = useState("");
  const [activeReport, setActiveReport] = useState<string | null>(
    initialActiveReport
  );
  const [activeCategory, setActiveCategory] = useState<string | null>(
    initialActiveCategory
  );

  useEffect(() => {
    if (category) {
      setActiveCategory(category);
    }
    if (report) {
      setActiveReport(report);
    } else if (category && !report) {
      const foundCategory = reportCategories.find(
        (cat) => cat.title === category
      );
      if (foundCategory && foundCategory.items.length > 0) {
        setActiveReport(foundCategory.items[0].name);
      } else {
        setActiveReport(null);
      }
    }
  }, [category, report, reportCategories]);

  const handleReportClick = (reportName: string, categoryTitle: string) => {
    setActiveReport(reportName);
    setActiveCategory(categoryTitle);
    const newSearchParams = new URLSearchParams();
    newSearchParams.set("category", categoryTitle);
    newSearchParams.set("report", reportName);
    router.push(`?${newSearchParams.toString()}`);
  };

  const handleCategoryClick = (categoryTitle: string) => {
    setActiveCategory(categoryTitle);
    const defaultReport =
      reportCategories.find((cat) => cat.title === categoryTitle)?.items[0]
        ?.name || null;
    setActiveReport(defaultReport);
    const newSearchParams = new URLSearchParams();
    newSearchParams.set("category", categoryTitle);
    if (defaultReport) {
      newSearchParams.set("report", defaultReport);
    }
    router.push(`?${newSearchParams.toString()}`); // Corrected: Removed extra arguments
  };

  const filteredCategories = reportCategories
    .map((category) => ({
      ...category,
      items: category.items.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((category) => category.items.length > 0);

  return (
    <Layout pageTitle="Reports">
      <div className="flex mt[-2px]">
        {/* Sidebar */}
        <aside className="w-[240px] h-[100vh] bg-[#f8f9fa] border-[#ebeff3] px-3 flex flex-col space-y-4">
          
          <div className="relative mt-2">
            <div className="flex items-center overflow-hidden ">
              <i className="ri-search-line absolute left-2 text-sm"></i>
              <input
                type="text"
                placeholder="Search here..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-control pl-7"
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 text-sm bg-[#f8f9fa] overflow-y-auto pr-2 max-h-[calc(100vh-120px)] report-scrollbar">
            {filteredCategories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <p
                  className="font-semibold text-gray-700 py-1 cursor-pointer"
                  onClick={() => handleCategoryClick(category.title)}
                >
                  {category.title}
                </p>
                <ul className="space-y-1 ">
                  {category.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className={`cursor-pointer report-list-item p-1 rounded transition-colors duration-200 ${
                        activeReport === item.name &&
                        activeCategory === category.title
                          ? "bg-[#f0f0f0] text-[#009333] rounded-[5px]"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() =>
                        handleReportClick(item.name, category.title)
                      }
                    >
                      <i className={`${item.icon} text-lg me-2`}></i>
                      {item.name}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            {filteredCategories.length === 0 && searchTerm && (
              <div className="text-center text-gray-500 py-4">
                No reports found matching "{searchTerm}"
              </div>
            )}
          </div>
        </aside>
        <div className="flex-1">
          {/*
            Pass activeReport and activeCategory as props to the report components.
            You'll need to define similar interfaces for all other report components
            if they also expect these props.
          */}
          {activeReport === "Product Sales Report" && (
            <ProductSalesReport
              activeReport={activeReport}
              activeCategory={activeCategory}
            />
          )}

          {activeReport === "Stock Value Report" && (
            <StockValueReport
              activeReport={activeReport}
              activeCategory={activeCategory}
            />
          )}

          {activeReport === "Stock Value Report" && <StockValueReport activeReport={activeReport} activeCategory={activeCategory} />}
          {activeReport === "Sales Profit Report" && <SalesProfitReport activeReport={activeReport} activeCategory={activeCategory} />}

          {activeReport === "Customer Balance" && <CustomerBalanceReport activeReport={activeReport} activeCategory={activeCategory} />}
          {activeReport === "Supplier Balance" && <SupplierBalanceReport activeReport={activeReport} activeCategory={activeCategory} />}
          {activeReport === "Statement" && <StatementReport activeReport={activeReport} activeCategory={activeCategory} />}

          {activeReport === "Daybook" && <DaybookReport activeReport={activeReport} activeCategory={activeCategory} />}
          {activeReport === "Cashbook" && <CashbookReport activeReport={activeReport} activeCategory={activeCategory} />}
          {activeReport === "Trail Balance" && <TrailBalanceReport activeReport={activeReport} activeCategory={activeCategory} />}

          {activeReport === "Customer Summary" && <CustomerSummaryReport activeReport={activeReport} activeCategory={activeCategory} />}
          {activeReport === "Supplier Summary" && <SupplierSummaryReport activeReport={activeReport} activeCategory={activeCategory} />}
          {activeReport === "GSTR1" && <GSTR1Report activeReport={activeReport} activeCategory={activeCategory} />}
          {activeReport === "B2B" && <B2BReport activeReport={activeReport} activeCategory={activeCategory} />}
          {activeReport === "B2C" && <B2CReport activeReport={activeReport} activeCategory={activeCategory} />}
          {activeReport === "Product Sales" && <ProductSalesGSTReport activeReport={activeReport} activeCategory={activeCategory} />}
          {activeReport === "Sales Summary" && <SalesSummaryReport activeReport={activeReport} activeCategory={activeCategory} />}
          {activeReport === "Purchase Summary" && <PurchaseSummaryReport activeReport={activeReport} activeCategory={activeCategory} />}

          {activeReport === "All Sales Excel" && <AllSalesExcelReport activeReport={activeReport} activeCategory={activeCategory} />}
          {activeReport === "All Purchase Excel" && <AllPurchaseExcelReport activeReport={activeReport} activeCategory={activeCategory} />}

          {!activeReport && (
            <div className="flex-1 flex items-center justify-center text-gray-500 text-lg">
              Select a report from the sidebar to view its content.
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default ReportsPage;