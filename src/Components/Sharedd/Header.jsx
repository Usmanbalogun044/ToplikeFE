import { useState, useEffect } from "react";
import { FiBell, FiX, FiCheck, FiTrash2 } from "react-icons/fi";

const Header = () => {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch(
          "https://api.toplike.app/api/notifications",
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
        `https://api.toplike.app/api/notifications/delete/${id}`,
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
    <header className="sticky w-full top-0 bg-white shadow-sm py-3 px-4 z-50 flex justify-between items-center">
      {/* Logo: only visible on mobile */}
      <h1 className="text-2xl font-extrabold text-purple-700 md:hidden">
        TopLike
      </h1>

      {/* Spacer for desktop alignment */}
      <div className="hidden md:block flex-1" />

      {/* Notification Bell (shared for mobile & desktop) */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition relative text-gray-600 cursor-pointer"
        >
          <FiBell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs h-5 w-5 flex items-center justify-center rounded-full">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Notification Dropdown */}
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-50">
            <div className="p-3 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="font-medium">Notifications</h3>
              <div className="flex space-x-2">
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-purple-600 cursor-pointer hover:text-purple-800"
                  disabled={unreadCount === 0}
                >
                  Mark all read
                </button>
                <button
                  onClick={() => setShowDropdown(false)}
                  className="text-gray-500 cursor-pointer hover:text-gray-700"
                >
                  <FiX size={16} />
                </button>
              </div>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-sm">Loading...</div>
              ) : error ? (
                <div className="p-4 text-red-500 text-sm">{error}</div>
              ) : notifications.length === 0 ? (
                <div className="p-4 text-gray-500 text-sm">
                  No notifications yet
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border-b border-gray-100 hover:bg-gray-50 ${
                      !notification.read ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex justify-between">
                      <p className="text-sm">{notification.text}</p>
                      <div className="flex space-x-2">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-green-600 hover:text-green-800"
                            title="Mark as read"
                          >
                            <FiCheck size={14} />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-red-500 hover:text-red-700"
                          title="Delete"
                        >
                          <FiTrash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {notification.time}
                    </p>
                  </div>
                ))
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-2 border-t border-gray-200 text-center bg-gray-50">
                <button className="text-xs text-purple-600 hover:text-purple-800">
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
