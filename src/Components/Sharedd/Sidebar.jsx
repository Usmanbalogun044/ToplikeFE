import { FiUser, FiHome } from "react-icons/fi";
import { FaRegSquarePlus } from "react-icons/fa6";
import { FaRegCircleUser } from "react-icons/fa6";
import { BsWallet } from "react-icons/bs";
import { LuPanelLeftClose, LuPanelRightClose, LuSearch } from "react-icons/lu";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Sidebar = ({
  notifications = [],
  sidebarCollapsed,
  setSidebarCollapsed,
}) => {
  return (
    <>
      {/* Desktop Sidebar for Large screen */}
      <div
        className={`hidden md:flex h-screen sticky top-0 bg-white shadow-sm flex-col transition-all duration-300 ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Logo and Collapse Button */}
        <div
          className={`flex items-center ${
            sidebarCollapsed ? "justify-center px-0" : "justify-between px-6"
          } py-5 border-b border-gray-200`}
        >
          {!sidebarCollapsed && (
            <h1 className="text-2xl font-extrabold text-purple-700">TopLike</h1>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-md text-gray-500 hover:text-purple-600 hover:bg-gray-100"
          >
            {sidebarCollapsed ? (
              <LuPanelRightClose className="h-5 w-5 cursor-pointer" />
            ) : (
              <LuPanelLeftClose className="h-5 w-5 cursor-pointer" />
            )}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <Link
            to="#"
            className={`flex items-center text-gray-600 rounded-md px-3 py-3 text-sm font-medium hover:bg-purple-50 hover:text-purple-600 ${
              sidebarCollapsed ? "justify-center" : ""
            }`}
          >
            <FiHome className={`h-5 w-5 ${sidebarCollapsed ? "" : "mr-3"}`} />
            {!sidebarCollapsed && "Home"}
          </Link>
          <Link
            to="#"
            className={`flex items-center text-gray-600 rounded-md px-3 py-3 text-sm font-medium hover:bg-purple-50 hover:text-purple-600 ${
              sidebarCollapsed ? "justify-center" : ""
            }`}
          >
            <LuSearch className={`h-5 w-5 ${sidebarCollapsed ? "" : "mr-3"}`} />
            {!sidebarCollapsed && "Search"}
          </Link>
          <Link
            to="#"
            className={`flex items-center text-gray-600 rounded-md px-3 py-3 text-sm font-medium hover:bg-purple-50 hover:text-purple-600 ${
              sidebarCollapsed ? "justify-center" : ""
            }`}
          >
            <FaRegSquarePlus
              className={`h-5 w-5 ${sidebarCollapsed ? "" : "mr-3"}`}
            />
            {!sidebarCollapsed && "Post"}
          </Link>
          <Link
            to="#"
            className={`flex items-center text-gray-600 rounded-md px-3 py-3 text-sm font-medium hover:bg-purple-50 hover:text-purple-600 ${
              sidebarCollapsed ? "justify-center" : ""
            }`}
          >
            <BsWallet className={`h-5 w-5 ${sidebarCollapsed ? "" : "mr-3"}`} />
            {!sidebarCollapsed && "Wallet"}
          </Link>
        </nav>

        {/* User Profile */}
        <div className="px-3 py-4 border-t border-gray-200">
          <Link
            to="#"
            className={`flex items-center text-gray-600 hover:bg-purple-50 hover:text-purple-600 rounded-md px-3 py-3 text-sm font-medium ${
              sidebarCollapsed ? "justify-center" : ""
            }`}
          >
            <FaRegCircleUser
              className={`h-5 w-5 text-purple-600 ${
                sidebarCollapsed ? "" : "mr-3"
              }`}
            />

            {!sidebarCollapsed && "Alucard"}
          </Link>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
