import {
  FiHome,
  FiPlusSquare,
  FiUser,
  FiLogOut,
  FiAward,
  FiDollarSign,
  FiShield,
} from "react-icons/fi";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toplikeLogo from "/Images/toplike.png"; // Assuming image exists, using text fallback if not

const Sidebar = ({ sidebarCollapsed, setSidebarCollapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.clear();
    navigate("/login");
  };

  const navItems = [
    { icon: FiHome, label: "Feed", path: "/dashboard" },
    { icon: FiPlusSquare, label: "Create Post", path: "/posts/create" },
    { icon: FiAward, label: "Leaderboard", path: "/leaderboard" },
    { icon: FiDollarSign, label: "Wallet", path: "/wallet" },
    { icon: FiUser, label: "Profile", path: "/profile" },
    { icon: FiShield, label: "Get Verified", path: "/verified" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:flex flex-col fixed inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out glass-nav border-r border-white/5 ${
          sidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        {/* Logo Area */}
        <div className="h-20 flex items-center justify-center border-b border-white/5">
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 group-hover:bg-purple-500/20 transition">
              <span className="text-xl font-bold text-fuchsia-400">T</span>
            </div>
            {!sidebarCollapsed && (
              <span className="text-xl font-bold text-white tracking-tight">
                TopLike
              </span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                  isActive
                    ? "text-white bg-gradient-to-r from-purple-600/20 to-fuchsia-600/10 border border-purple-500/20 shadow-[0_4px_20px_-4px_rgba(168,85,247,0.4)]"
                    : "text-purple-200/60 hover:text-white hover:bg-white/5"
                }`}
                title={sidebarCollapsed ? item.label : ""}
              >
                {isActive && (
                   <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-fuchsia-500 rounded-r-full shadow-[0_0_10px_#d946ef]"/>
                )}

                <item.icon
                  className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                    isActive ? "text-fuchsia-400" : "text-purple-300/50 group-hover:text-purple-200"
                  } ${sidebarCollapsed ? "mx-auto" : "mr-3"}`}
                />
                {!sidebarCollapsed && (
                  <span className={`font-medium tracking-wide ${isActive ? "text-white" : ""}`}>{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/5 bg-black/20 backdrop-blur-md">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center justify-center p-2 mb-2 rounded-lg text-purple-300/50 hover:bg-white/5 hover:text-white transition-colors"
          >
            {sidebarCollapsed ? "→" : "← Collapse"}
          </button>
          
          <button
            onClick={handleLogout}
            className={`w-full flex items-center ${
              sidebarCollapsed ? "justify-center" : "px-4"
            } py-3 rounded-xl text-red-400/80 hover:bg-red-500/10 hover:text-red-300 transition-all duration-300 border border-transparent hover:border-red-500/20`}
          >
            <FiLogOut className={`w-5 h-5 ${sidebarCollapsed ? "" : "mr-3"}`} />
            {!sidebarCollapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
