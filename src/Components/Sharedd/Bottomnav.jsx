import { FiHome, FiPlusSquare, FiUser, FiAward, FiDollarSign } from "react-icons/fi";
import { Link, useLocation } from "react-router-dom";

const Bottomnav = () => {
  const location = useLocation();

  const navItems = [
    { icon: FiHome, label: "Feed", path: "/dashboard" },
    { icon: FiAward, label: "Rank", path: "/leaderboard" },
    { icon: FiPlusSquare, label: "Post", path: "/posts/create" },
    { icon: FiDollarSign, label: "Wallet", path: "/wallet" },
    { icon: FiUser, label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-nav border-t border-white/10 pb-1">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 group ${
                isActive ? "text-fuchsia-400" : "text-purple-300/40"
              }`}
            >
              <div
                className={`p-2 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-purple-500/10 transform -translate-y-1 shadow-lg shadow-purple-500/5 ring-1 ring-purple-500/20"
                    : "group-active:scale-95"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive ? "stroke-[2.5px] fill-purple-500/10" : "stroke-[2px]"}`} />
              </div>
              <span className={`text-[10px] mt-1 font-medium tracking-wide ${isActive ? "text-white" : "text-purple-300/50"}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Bottomnav;
