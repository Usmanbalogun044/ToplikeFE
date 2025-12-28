import { useState, useEffect } from "react";
import { FiBell, FiX, FiCheck, FiTrash2 } from "react-icons/fi";
import { API_URL } from "../../config";

const Header = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          `${API_URL}/notifications`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (!response.ok) throw new Error("Failed to load notifications");
        const data = await response.json();
        setNotifications(data.notifications || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const deleteNotification = async (id) => {
    try {
      const response = await fetch(
        `${API_URL}/notifications/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (!response.ok) throw new Error("Delete failed");
      setNotifications(notifications.filter((n) => n.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky w-full top-0 glass-nav z-40 flex justify-between items-center py-3 px-4 md:hidden">
      {/* Logo: only visible on mobile (since Sidebar handles desktop) */}
      <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-400 tracking-wide">
        TopLike
      </h1>

      {/* Spacer for desktop alignment */}
      <div className="hidden md:block flex-1" />

      {/* Notification Bell */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition relative text-purple-200 cursor-pointer border border-white/5"
        >
          <FiBell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-fuchsia-500 text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full shadow-lg shadow-fuchsia-500/50">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Notification Dropdown */}
        {showDropdown && (
          <div className="absolute right-0 mt-3 w-80 glass-panel rounded-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-3 border-b border-white/5 flex justify-between items-center bg-black/40 backdrop-blur-md">
              <h3 className="font-semibold text-white">Notifications</h3>
              <div className="flex space-x-3">
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-brand font-medium cursor-pointer hover:text-fuchsia-300 transition"
                  disabled={unreadCount === 0}
                >
                  Mark all read
                </button>
                <button
                  onClick={() => setShowDropdown(false)}
                  className="text-gray-400 cursor-pointer hover:text-white transition"
                >
                  <FiX size={16} />
                </button>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto custom-scrollbar bg-black/20">
              {loading ? (
                <div className="p-4 text-center text-sm text-purple-300/50">Loading...</div>
              ) : error ? (
                <div className="p-4 text-red-400 text-sm">{error}</div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-purple-300/30 text-sm text-center flex flex-col items-center gap-2">
                  <FiBell size={24} className="opacity-20"/>
                  No notifications yet
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border-b border-white/5 hover:bg-white/5 transition-colors ${
                      !notification.read ? "bg-purple-900/20" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <p className={`text-sm flex-1 mr-2 ${!notification.read ? "text-white font-medium" : "text-purple-200/70"}`}>
                        {notification.text}
                      </p>
                      <div className="flex space-x-2 shrink-0">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-fuchsia-500 hover:text-fuchsia-400 transition"
                            title="Mark as read"
                          >
                            <FiCheck size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-red-400/70 hover:text-red-400 transition"
                          title="Delete"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <p className="text-[10px] text-purple-400/50 mt-1 uppercase tracking-wide font-medium">
                      {notification.time}
                    </p>
                  </div>
                ))
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-2 border-t border-white/5 text-center bg-black/40 backdrop-blur-md">
                <button className="text-xs text-brand hover:text-fuchsia-300 font-medium transition">
                  View All Notifications
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
