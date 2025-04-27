import { Outlet } from "react-router-dom";
import Sidebar from "../../Components/Sharedd/Sidebar";
import Bottomnav from "../../Components/Sharedd/Bottomnav";
import { useState } from "react";

const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex flex-col min-h-screen md:flex-row">
      {/* Sidebar */}
      <Sidebar {...{ sidebarCollapsed, setSidebarCollapsed }} />

      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out pb-16 md:pb-0 ${
          sidebarCollapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        <Outlet />
      </div>

      {/* Bottom Navigation */}
      <Bottomnav />
    </div>
  );
};

export default Layout;
