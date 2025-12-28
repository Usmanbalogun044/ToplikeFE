import { Outlet } from "react-router-dom";
import Sidebar from "../../Components/Sharedd/Sidebar";
import Bottomnav from "../../Components/Sharedd/Bottomnav";
import { useState } from "react";

const Layout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex flex-col min-h-screen md:flex-row text-white relative isolate">
      {/* Animated Background */}
      <div className="premium-bg"></div>

      {/* Sidebar */}
      <div className="z-20">
        <Sidebar {...{ sidebarCollapsed, setSidebarCollapsed }} />
      </div>

      {/* Main Content Area */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out pb-20 md:pb-0 z-10 ${
          sidebarCollapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        <Outlet />
      </div>

      {/* Bottom Navigation */}
      <div className="z-30 block md:hidden">
         <Bottomnav />
      </div>
    </div>
  );
};

export default Layout;
