 // pages/settings.tsx
"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Layout from "../../components/Layout";

// Import your setting components
import ProfileSettings from "./components/profileSettings";
import Branding from "./components/branding";
import RolesList from "./components/role";
import Subscription from "./components/subscription";

const SettingsPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const setting = searchParams.get("setting");

  const settingCategories = [
    {
      title: "Organization",
      items: [
        { name: "Profile", icon: "ri-user-settings-line" },
        { name: "Branding", icon: "ri-palette-line" },
        { name: "Currencies", icon: "ri-currency-line" },
        { name: "Opening Balances", icon: "ri-bank-line" },
        { name: "Subscription", icon: "ri-bill-line" },
      ],
    },
    {
      title: "Management",
      items: [
        { name: "Users", icon: "ri-group-line" },
        { name: "Roles", icon: "ri-shield-user-line" },
      ],
    },
    {
      title: "Preferences",
      items: [
        { name: "General", icon: "ri-settings-3-line" },
        { name: "Customers and Vendors", icon: "ri-contacts-book-line" },
        { name: "Accountant", icon: "ri-calculator-line" },
        { name: "Projects", icon: "ri-projector-line" },
        { name: "Timesheet", icon: "ri-time-line" },
        { name: "Customer Portal", icon: "ri-external-link-line" },
      ],
    },
    {
      title: "Sales",
      items: [
        { name: "Quotes", icon: "ri-file-text-line" },
        { name: "Sales Orders", icon: "ri-file-list-3-line" },
        { name: "Delivery Challans", icon: "ri-truck-line" },
        { name: "Invoices", icon: "ri-bill-line" }, // Invoices
        { name: "Recurring Invoices", icon: "ri-repeat-line" },
        { name: "Credit Notes", icon: "ri-money-rupee-circle-line" },
        { name: "Delivery Notes", icon: "ri-truck-line" },
        { name: "Packing Slips", icon: "ri-archive-line" },
      ],
    },
    {
      title: "Purchases",
      items: [
        { name: "Expenses", icon: "ri-wallet-line" },
        { name: "Bills", icon: "ri-receipt-line" },
        { name: "Purchase Orders", icon: "ri-shopping-cart-line" },
        { name: "Vendor Credits", icon: "ri-bank-card-line" },
      ],
    },
    {
      title: "Customisation",
      items: [
        { name: "Digital Signature", icon: "ri-quill-pen-line" },
        { name: "Transaction Number", icon: "ri-hashtag" },
        { name: "PDF Templates", icon: "ri-file-pdf-line" },
      ],
    },
    {
      title: "Alerts",
      items: [
        { name: "Reminders", icon: "ri-alarm-line" },
        { name: "Email Notifications", icon: "ri-mail-line" },
        { name: "SMS Notifications", icon: "ri-message-2-line" },
      ],
    },
  ];

  const initialActiveCategory =
    (category as string) || settingCategories[0].title;
  const initialActiveSetting =
    (setting as string) || settingCategories[0].items[0].name;

  const [searchTerm, setSearchTerm] = useState("");
  const [activeSetting, setActiveSetting] = useState<string | null>(
    initialActiveSetting
  );
  const [activeCategory, setActiveCategory] = useState<string | null>(
    initialActiveCategory
  );

  useEffect(() => {
    if (category) {
      setActiveCategory(category);
    }
    if (setting) {
      setActiveSetting(setting);
    } else if (category && !setting) {
      const foundCategory = settingCategories.find(
        (cat) => cat.title === category
      );
      if (foundCategory && foundCategory.items.length > 0) {
        setActiveSetting(foundCategory.items[0].name);
      } else {
        setActiveSetting(null);
      }
    }
  }, [category, setting, settingCategories]);

  const handleSettingClick = (settingName: string, categoryTitle: string) => {
    setActiveSetting(settingName);
    setActiveCategory(categoryTitle);
    const newSearchParams = new URLSearchParams();
    newSearchParams.set("category", categoryTitle);
    newSearchParams.set("setting", settingName);
    router.push(`?${newSearchParams.toString()}`);
  };

  const handleCategoryClick = (categoryTitle: string) => {
    setActiveCategory(categoryTitle);
    const defaultSetting =
      settingCategories.find((cat) => cat.title === categoryTitle)?.items[0]
        ?.name || null;
    setActiveSetting(defaultSetting);
    const newSearchParams = new URLSearchParams();
    newSearchParams.set("category", categoryTitle);
    if (defaultSetting) {
      newSearchParams.set("setting", defaultSetting);
    }
    router.push(`?${newSearchParams.toString()}`);
  };

  const filteredCategories = settingCategories
    .map((category) => ({
      ...category,
      items: category.items.filter((item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((category) => category.items.length > 0);

  // Component to render based on activeSetting
  const renderSettingComponent = () => {
    switch (activeSetting) {
      case "Profile":
        return <ProfileSettings activeReport={activeSetting} activeCategory={activeCategory} />;
      case "Branding":
        return <Branding activeReport={activeSetting} activeCategory={activeCategory} />;
      case "Roles":
        // This is the change: pass the props here
        return <RolesList activeReport={activeSetting} activeCategory={activeCategory} />;
      case "Subscription":
        return <Subscription activeReport={activeSetting} activeCategory={activeCategory} />;
      default:
        return (
          <div className="p-4 text-center text-gray-600">
            Select a setting from the sidebar.
          </div>
        );
    }
  };

  return (
    <Layout pageTitle="Settings">
      <div className="flex mt[-2px]">
        {/* Sidebar */}
        <aside className="w-[240px] bg-[#f8f9fa] border-[#ebeff3] px-3 flex flex-col space-y-4">
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
                      className={`cursor-pointer setting-list-item p-1 rounded transition-colors duration-200 ${
                        activeSetting === item.name &&
                        activeCategory === category.title
                          ? "bg-[#f0f0f0] text-[#009333] rounded-[5px]"
                          : "hover:bg-gray-100"
                      }`}
                      onClick={() =>
                        handleSettingClick(item.name, category.title)
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
                No settings found matching "{searchTerm}"
              </div>
            )}
          </div>
        </aside>
        <div className="flex-1">
          {/* Render the active setting component here */}
          {renderSettingComponent()}
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;