import { useState } from "react";
import { FiBell } from "react-icons/fi";

const Header = () => {

  // sample notification
  const [Notification] = useState([
    {
      id: 1,
      text: "Your submission got 50 new likes!",
      time: "2h ago",
      read: false,
    },
    {
      id: 2,
      text: "New contest starts in 3 hours!",
      time: "5h ago",
      read: true,
    },
  ]);

  return (
    <>
      <header className="sticky w-full top-0 bg-white shadow-sm py-3 px-4 md:hidden">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-extrabold text-purple-700">TopLike</h1>
          <button className="p-2 text-gray-600 bg-gray-100 rounded-full relative hover:bg-gray-200">
            <FiBell className="h-5 w-5" />
          </button>
        </div>
      </header>
    </>
  );
};

export default Header;
