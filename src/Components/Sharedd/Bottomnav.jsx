import { useState } from "react";
import { FiHome, FiUser } from "react-icons/fi";
import { FaRegSquarePlus } from "react-icons/fa6";
import { BsWallet } from "react-icons/bs";
import { LuSearch } from "react-icons/lu";

const Bottomnav = () => {
  const [activeTab, setActiveTab] = useState("home");
  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex justify-around pb-5">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center py-3 px-4 ${
              activeTab === "home" ? "text-purple-600" : "text-gray-500"
            }`}
          >
            <FiHome className="h-5 w-5" />
            <span className="text-xs mt-1">Home</span>
          </button>
          <button
            onClick={() => setActiveTab("contest")}
            className={`flex flex-col items-center py-3 px-4 ${
              activeTab === "contest" ? "text-purple-600" : "text-gray-500"
            }`}
          >
            <LuSearch className="h-5 w-5" />
            <span className="text-xs mt-1">Search</span>
          </button>
          <button
            onClick={() => setActiveTab("submit")}
            className={`flex flex-col items-center py-3 px-4 ${
              activeTab === "contest" ? "text-purple-600" : "text-gray-500"
            }`}
          >
            <FaRegSquarePlus className="h-5 w-5" />
            <span className="text-xs mt-1">Post</span>
          </button>
          <button
            onClick={() => setActiveTab("wallet")}
            className={`flex flex-col items-center py-3 px-4 ${
              activeTab === "wallet" ? "text-purple-600" : "text-gray-500"
            }`}
          >
            <BsWallet className="h-5 w-5" />
            <span className="text-xs mt-1">Wallet</span>
          </button>
          <button
            onClick={() => setActiveTab("profile")}
            className={`flex flex-col items-center py-3 px-4 ${
              activeTab === "profile" ? "text-purple-600" : "text-gray-500"
            }`}
          >
            <FiUser className="h-5 w-5" />
            <span className="text-xs mt-1">Profile</span>
          </button>
        </div>
      </nav>
    </>
  );
};

export default Bottomnav;
