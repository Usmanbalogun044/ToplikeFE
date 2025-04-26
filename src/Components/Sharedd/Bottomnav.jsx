import { Link, useLocation } from "react-router-dom";
import { FiHome, FiUser } from "react-icons/fi";
import { FaRegSquarePlus } from "react-icons/fa6";
import { BsWallet } from "react-icons/bs";
import { LuSearch } from "react-icons/lu";

const Bottomnav = () => {
  const location = useLocation();

  // Helper function to check if path matches
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex justify-around pb-5">
        <Link
          to="/dashboard"
          className={`flex flex-col items-center py-3 px-4 ${
            isActive("/dashboard") ? "text-purple-600" : "text-gray-500"
          }`}
        >
          <FiHome className="h-5 w-5" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link
          to="/search"
          className={`flex flex-col items-center py-3 px-4 ${
            isActive("/search") ? "text-purple-600" : "text-gray-500"
          }`}
        >
          <LuSearch className="h-5 w-5" />
          <span className="text-xs mt-1">Search</span>
        </Link>
        <Link
          to="/posts/create"
          className={`flex flex-col items-center py-3 px-4 ${
            isActive("/posts/create") ? "text-purple-600" : "text-gray-500"
          }`}
        >
          <FaRegSquarePlus className="h-5 w-5" />
          <span className="text-xs mt-1">Post</span>
        </Link>
        <Link
          to="/wallet"
          className={`flex flex-col items-center py-3 px-4 ${
            isActive("/wallet") ? "text-purple-600" : "text-gray-500"
          }`}
        >
          <BsWallet className="h-5 w-5" />
          <span className="text-xs mt-1">Wallet</span>
        </Link>
        <Link
          to="/profile"
          className={`flex flex-col items-center py-3 px-4 ${
            isActive("/profile") ? "text-purple-600" : "text-gray-500"
          }`}
        >
          <FiUser className="h-5 w-5" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </nav>
  );
};

export default Bottomnav;
