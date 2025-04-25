import { useState } from "react";
import {
  FiHome,
  FiAward,
  FiUser,
  FiBell,
  FiBarChart2,
  FiHeart,
} from "react-icons/fi";
import { FaNairaSign } from "react-icons/fa6";
import { FaRegSquarePlus } from "react-icons/fa6";
import { Link, Outlet } from "react-router-dom";
import Navbar from "../../Components/Sharedd/Navbar";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notifications] = useState([
    {
      id: 1,
      text: "Your submission got 50 new votes!",
      time: "2h ago",
      read: false,
    },
    {
      id: 2,
      text: "New contest starts in 3 hours",
      time: "5h ago",
      read: true,
    },
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 md:flex-row">
      {/* Header */}
      <Navbar
        notifications={notifications}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />

      {/* Main Content Area */}
      <div className="flex-1 transition-all duration-300 pb-16 md:pb-0">
        {/* Header - Only shown on mobile */}
        <header className="md:hidden bg-white shadow-sm py-3 px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-extrabold text-purple-700">TopLike</h1>
            <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 relative">
              <FiBell className="h-5 w-5" />
              {notifications.some((n) => !n.read) && (
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              )}
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Wallet Balance
                    </p>
                    <p className="text-2xl font-bold mt-1">₦25,000</p>
                  </div>
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                    <FaNairaSign className="h-6 w-6" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Current Votes
                    </p>
                    <p className="text-2xl font-bold mt-1">1,240</p>
                  </div>
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                    <FiBarChart2 className="h-6 w-6" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Ranking</p>
                    <p className="text-2xl font-bold mt-1">#12</p>
                  </div>
                  <div className="p-3 rounded-full bg-green-100 text-green-600">
                    <FiAward className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </div>

            {/* Current Contest */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-bold">Weekly Contest #42</h2>
                <p className="text-gray-600 mt-1">Theme: "Best Hustle Story"</p>
              </div>
              <div className="p-6">
                <div className="mb-4">
                  <div className="flex justify-between text-sm font-medium mb-1">
                    <span>Time Remaining</span>
                    <span>2d 14h 23m</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: "35%" }}
                    ></div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between text-sm font-medium mb-1">
                    <span>Prize Pool</span>
                    <span>₦100,000</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: "72%" }}
                    ></div>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-medium transition">
                    Submit Entry
                  </button>
                  <button className="flex-1 border border-purple-600 text-purple-600 hover:bg-purple-50 py-3 px-4 rounded-lg font-medium transition">
                    View Entries
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Winners */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-bold">Recent Winners</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="p-6 flex items-center">
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                      <FiUser className="h-6 w-6 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">@Winner{item}</p>
                      <p className="text-sm text-gray-500">
                        ₦
                        {item === 1
                          ? "100,000"
                          : item === 2
                          ? "75,000"
                          : "50,000"}
                      </p>
                    </div>
                    <button className="text-purple-600 hover:text-purple-800 text-sm font-medium">
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Feed */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-bold">Your Activity</h2>
              </div>
              <div className="divide-y divide-gray-200">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="p-6">
                    <div className="flex items-start">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-4">
                        <FiHeart className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">
                          You received {item * 15} new votes
                        </p>
                        <p className="text-sm text-gray-500">
                          {item} day{item !== 1 ? "s" : ""} ago
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
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
              <FiAward className="h-5 w-5" />
              <span className="text-xs mt-1">Contest</span>
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
              <FaNairaSign className="h-5 w-5" />
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
      </div>
    </div>
  );
};

export default Dashboard;
