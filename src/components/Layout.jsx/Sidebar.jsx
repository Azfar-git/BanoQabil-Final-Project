import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext"; // Double check path!
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

export default function Sidebar({ isOpen, onToggle }) {
  const location = useLocation();
  const { darkMode, toggleTheme } = useTheme();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`fixed md:relative z-50 h-screen transition-all duration-300 ease-in-out flex flex-col border-r ${
          darkMode
            ? "bg-gray-900 border-gray-800 text-white"
            : "bg-white border-gray-200 text-gray-900"
        } ${isOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full md:w-20 md:translate-x-0"}`}
      >
        <div className="h-16 flex items-center px-6 mb-4 mt-2">
          <div
            className={`flex items-center gap-3 transition-all ${!isOpen && "md:opacity-0 md:scale-0"}`}
          >
            <div className="bg-blue-600 p-1.5 rounded-lg shrink-0">
              <BookOpen className="text-white" size={20} />
            </div>
            <span className="font-bold text-lg whitespace-nowrap italic">
              BQ Classroom
            </span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.label}
                to={item.href}
                className={`flex items-center gap-4 px-3 py-2.5 rounded-xl transition-all group ${
                  isActive
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                    : darkMode
                      ? "text-gray-400 hover:bg-gray-800 hover:text-white"
                      : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                }`}
              >
                <div className="shrink-0">
                  <Icon size={20} />
                </div>
                <span
                  className={`text-sm font-medium transition-opacity ${isOpen ? "opacity-100" : "opacity-0 md:hidden"}`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div
          className={`p-4 border-t ${darkMode ? "border-gray-800" : "border-gray-100"}`}
        >
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-xl transition-all ${
              darkMode
                ? "hover:bg-gray-800 text-yellow-400"
                : "hover:bg-gray-100 text-indigo-600"
            }`}
          >
            <div className={`shrink-0 ${!isOpen && "md:mx-auto"}`}>
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </div>
            {isOpen && (
              <span className="text-sm font-medium">
                {darkMode ? "Light" : "Dark"} Mode
              </span>
            )}
          </button>
        </div>
      </aside>

      {/* The Hamburger Button */}
      <button
        onClick={onToggle}
        className={`fixed top-4 z-[60] p-2 rounded-xl border transition-all duration-300 ${
          isOpen ? "left-56 md:left-[238px]" : "left-4"
        } ${darkMode ? "bg-gray-800 border-gray-700 text-white hover:bg-gray-700" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 shadow-md"}`}
      >
        <Menu size={20} />
      </button>
    </>
  );
}
