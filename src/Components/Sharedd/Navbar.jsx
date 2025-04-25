import {
  FiBell,
  FiUser,
  FiMenu,
  FiX,
  FiHome,
  FiStar,
  FiDollarSign,
} from "react-icons/fi";
import { FaRegSquarePlus } from "react-icons/fa6";
import { BsWallet } from "react-icons/bs";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Navbar = ({
  notifications = [],
  sidebarCollapsed,
  setSidebarCollapsed,
}) => {
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Desktop Sidebar (shown on medium screens and up) */}

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
              <FiMenu className="h-5 w-5" />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <Link
            to="#"
            className={`flex items-center text-gray-600 hover:bg-purple-50 hover:text-purple-600 rounded-md px-3 py-3 text-sm font-medium ${
              sidebarCollapsed ? "justify-center" : ""
            }`}
          >
            <FiHome className={`h-5 w-5 ${sidebarCollapsed ? "" : "mr-3"}`} />
            {!sidebarCollapsed && "Home"}
          </Link>
          <Link
            to="#"
            className={`flex items-center text-gray-600 hover:bg-purple-50 hover:text-purple-600 rounded-md px-3 py-3 text-sm font-medium ${
              sidebarCollapsed ? "justify-center" : ""
            }`}
          >
            <FiStar className={`h-5 w-5 ${sidebarCollapsed ? "" : "mr-3"}`} />
            {!sidebarCollapsed && "Context"}
          </Link>
          <Link
            to="#"
            className={`flex items-center text-gray-600 hover:bg-purple-50 hover:text-purple-600 rounded-md px-3 py-3 text-sm font-medium ${
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
            className={`flex items-center text-gray-600 hover:bg-purple-50 hover:text-purple-600 rounded-md px-3 py-3 text-sm font-medium ${
              sidebarCollapsed ? "justify-center" : ""
            }`}
          >
            <BsWallet className={`h-5 w-5 ${sidebarCollapsed ? "" : "mr-3"}`} />
            {!sidebarCollapsed && "Wallet"}
          </Link>
        </nav>

        {/* User Profile and Notifications */}
        <div className="px-3 py-4 border-t border-gray-200">
          <Link
            to="#"
            className={`flex items-center ${
              sidebarCollapsed ? "justify-center" : "justify-between"
            }`}
          >
            <div className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 rounded-md p-1 flex-1">
              <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                <FiUser className="h-4 w-4" />
              </div>
              {!sidebarCollapsed && (
                <span className="text-sm font-medium truncate">@User123</span>
              )}
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
