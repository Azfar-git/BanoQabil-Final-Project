import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  Inbox,
  Calendar,
  CheckSquare,
  BarChart3,
  Settings,
  Menu,
  Moon,
  Sun,
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Classroom", icon: BookOpen, href: "/classroom" },
  { label: "Inbox", icon: Inbox, href: "/notifications" },
  { label: "Calendar", icon: Calendar, href: "/calendar" },
  { label: "To-Do", icon: CheckSquare, href: "/todo" },
  { label: "Grades", icon: BarChart3, href: "/grades" },
  { label: "Settings", icon: Settings, href: "/settings/profile" },
];

export default function Sidebar({
  isOpen,
  onToggle,
  isDarkMode,
  onThemeToggle,
}) {
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={onToggle}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:relative z-50 h-screen transition-all duration-300 ease-in-out flex flex-col shadow-2xl md:shadow-none ${
          isDarkMode
            ? "bg-gray-900 border-gray-800 text-white"
            : "bg-white border-gray-200 text-gray-900"
        } border-r ${
          isOpen
            ? "w-64 translate-x-0"
            : "w-0 -translate-x-full md:w-20 md:translate-x-0"
        }`}
      >
        {/* Header - Brand Name */}
        <div className="h-16 flex items-center px-6 mb-4 mt-2">
          <div
            className={`flex items-center gap-3 transition-all duration-300 ${!isOpen && "md:opacity-0 md:scale-0"}`}
          >
            <div className="bg-blue-600 p-1.5 rounded-lg shrink-0 shadow-lg shadow-blue-500/30">
              <BookOpen className="text-white" size={20} />
            </div>
            <span className="font-extrabold text-lg tracking-tight whitespace-nowrap">
              BQ Classroom
            </span>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 space-y-1 custom-scrollbar">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.href);

            return (
              <Link
                key={item.label}
                to={item.href}
                className={`flex items-center gap-4 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                    : isDarkMode
                      ? "text-gray-400 hover:bg-gray-800 hover:text-white"
                      : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                }`}
              >
                <div
                  className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${!isOpen && "md:mx-auto"}`}
                >
                  <Icon size={20} />
                </div>

                <span
                  className={`text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                    isOpen ? "opacity-100" : "opacity-0 md:hidden"
                  }`}
                >
                  {item.label}
                </span>

                {/* Collapsed Tooltip */}
                {!isOpen && (
                  <div
                    className={`fixed left-20 px-2 py-1 rounded bg-gray-800 text-white text-xs invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all z-[70] ml-2 shadow-xl border border-gray-700 hidden md:block`}
                  >
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer Section: Theme Toggle & Version */}
        <div
          className={`p-4 border-t ${isDarkMode ? "border-gray-800" : "border-gray-100"}`}
        >
          {/* Theme Toggle Button */}
          <button
            onClick={onThemeToggle}
            className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-xl transition-all mb-4 ${
              isDarkMode
                ? "hover:bg-gray-800 text-yellow-400"
                : "hover:bg-gray-100 text-indigo-600"
            }`}
          >
            <div className={`shrink-0 ${!isOpen && "md:mx-auto"}`}>
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </div>
            <span
              className={`text-sm font-medium whitespace-nowrap ${!isOpen && "md:hidden"}`}
            >
              {isDarkMode ? "Light Mode" : "Dark Mode"}
            </span>
          </button>

          <div
            className={`flex items-center gap-3 transition-all ${!isOpen && "md:justify-center"}`}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shrink-0 flex items-center justify-center text-[10px] text-white font-bold">
              BQ
            </div>
            {isOpen && (
              <div className="overflow-hidden">
                <p className="text-[10px] uppercase tracking-widest font-bold opacity-50">
                  Version
                </p>
                <p className="text-xs font-semibold">1.2.0-PRO</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Persistent Hamburger Toggle */}
      <button
        onClick={onToggle}
        className={`fixed top-4 z-[60] p-2 rounded-xl border transition-all duration-300 group ${
          isOpen ? "left-56 md:left-[238px]" : "left-4"
        } ${
          isDarkMode
            ? "bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
            : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-blue-600"
        } shadow-lg shadow-black/5`}
      >
        <Menu
          size={20}
          className={`transition-transform duration-500 ${isOpen ? "rotate-180" : "rotate-0"}`}
        />
      </button>
    </>
  );
}
