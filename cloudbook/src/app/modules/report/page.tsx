"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Layout from "../../components/Layout";
import MonthlyReport from "./components/MonthlyReport";
import LeaveReport from "./components/LeaveReport";

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
        { name: "Sales Summary", icon: "ri-file-list-line" },
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
    router.push(`?${newSearchParams.toString()}`); // Corrected: Removed extra arguments
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
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-[240px] h-[100vh] bg-[#f8f9fa] border-[#ebeff3] px-3 flex flex-col space-y-4">
         <div className="mt-2">
           <h1 className="text-[18px] sm:text-[20px] font-medium text-[#009333]">Reports</h1>
         </div>

          <div className="relative">
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

          <div className="flex flex-col gap-4 text-sm bg-[#f8f9fa] overflow-y-auto pr-2 max-h-[calc(100vh-160px)]">
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
          {/* Corrected comparison: activeReport will now be "Trip Summary" */}
          {activeCategory === "Leave" && activeReport === "Monthly Report" && (
            <MonthlyReport
              activeReport={activeReport}
              activeCategory={activeCategory}
            />
          )}

          {activeCategory === "Leave" && activeReport === "Leave Report" && (
            <LeaveReport
              activeReport={activeReport}
              activeCategory={activeCategory}
            />
          )}

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
