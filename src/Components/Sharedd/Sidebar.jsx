import { FiUser, FiHome } from "react-icons/fi";
import { FaRegSquarePlus } from "react-icons/fa6";
import { FaRegCircleUser } from "react-icons/fa6";
import { BsWallet } from "react-icons/bs";
import { LuPanelLeftClose, LuPanelRightClose, LuSearch } from "react-icons/lu";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({
  notifications = [],
  sidebarCollapsed,
  setSidebarCollapsed,
}) => {
  const location = useLocation();

  // Helper function to check if path matches
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside
      className={`hidden md:flex h-screen fixed top-0 left-0 bg-white shadow-sm flex-col transition-all duration-300 ease-in-out overflow-hidden ${
        sidebarCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo and Collapse Button */}
      <div
        className={`flex items-center py-5 border-b border-gray-200 ${
          sidebarCollapsed ? "justify-center px-0" : "justify-between px-6"
        } py-5 border-b border-gray-200`}
      >
        {!sidebarCollapsed && (
          <h1 className="text-2xl font-extrabold text-purple-700 whitespace-nowrap">
            TopLike
          </h1>
        )}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-2 rounded-md text-gray-600 cursor-pointer hover:text-purple-600 hover:bg-gray-100 transition-colors"
        >
          {sidebarCollapsed ? (
            <LuPanelRightClose className="h-5 w-5" />
          ) : (
            <LuPanelLeftClose className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-hidden">
        {[
          {
            path: "/dashboard",
            icon: <FiHome className="h-5 w-5" />,
            label: "Home",
          },
          {
            path: "/search",
            icon: <LuSearch className="h-5 w-5" />,
            label: "Search",
          },
          {
            path: "/posts/create",
            icon: <FaRegSquarePlus className="h-5 w-5" />,
            label: "Post",
          },
          {
            path: "/wallet",
            icon: <BsWallet className="h-5 w-5" />,
            label: "Wallet",
          },
        ].map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center rounded-md px-3 py-3 text-sm font-medium 
              transition-colors duration-200
              ${
                isActive(item.path)
                  ? "bg-purple-100 text-purple-600"
                  : "text-gray-600 hover:bg-purple-50 hover:text-purple-600"
              }
              ${sidebarCollapsed ? "justify-center" : ""}`}
          >
            <span
              className={`transition-all duration-300 ${
                sidebarCollapsed ? "" : "mr-3"
              }`}
            >
              {item.icon}
            </span>
            {!sidebarCollapsed && (
              <span className="whitespace-nowrap transition-opacity duration-300">
                {item.label}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* User Profile */}
      <div className="px-3 py-4 border-t border-gray-200">
        <Link
          to="/profile"
          className={`flex items-center rounded-md px-3 py-3 text-sm font-medium transition-colors duration-200 ${
            isActive("/profile")
              ? "bg-purple-100 text-purple-600"
              : "text-gray-600 hover:bg-purple-50 hover:text-purple-600"
          } ${sidebarCollapsed ? "justify-center" : ""}`}
        >
          <FaRegCircleUser
            className={`h-5 w-5 transition-all duration-300 ${
              sidebarCollapsed ? "" : "mr-3"
            }`}
          />
          {!sidebarCollapsed && (
            <span className="whitespace-nowrap transition-opacity duration-300">
              Profile
            </span>
          )}
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
