import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Bell,
  LogOut,
  Settings,
  Search,
  Calendar,
  CheckSquare,
  LayoutDashboard,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { DUMMY_NOTIFICATIONS } from "../../data/dummyData";

export default function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const unreadCount = DUMMY_NOTIFICATIONS.filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (
    location.pathname.includes("/login") ||
    location.pathname.includes("/register")
  ) {
    return null;
  }

  const navLinks = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    { name: "Calendar", path: "/calendar", icon: <Calendar size={18} /> },
    { name: "To-Do", path: "/todo", icon: <CheckSquare size={18} /> },
  ];

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200"
          : "bg-white border-b border-slate-100"
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-[#3b52f6] rounded-lg flex items-center justify-center shadow-md shadow-blue-100 group-hover:bg-[#2563eb] transition-colors">
              <span className="text-white font-bold text-sm">BQ</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[#1e293b] text-lg leading-tight tracking-tight">
                Classroom
              </span>
              <span className="text-[10px] text-[#3b52f6] font-bold uppercase tracking-wider leading-none">
                Education
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center bg-[#f8fafc] p-1 rounded-xl border border-slate-200/60">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  location.pathname === link.path
                    ? "bg-[#2563eb] text-white shadow-md shadow-blue-200"
                    : "text-[#64748b] hover:text-[#1e293b] hover:bg-white"
                }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="hidden lg:flex items-center relative group">
              <Search
                size={18}
                className="absolute left-3 text-slate-400 group-focus-within:text-[#2563eb] transition-colors"
              />
              <input
                type="text"
                placeholder="Search resources..."
                className="pl-10 pr-4 py-2 bg-[#f1f5f9] border-none rounded-xl text-sm w-48 focus:w-64 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none text-slate-700"
              />
            </div>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowUserMenu(false);
                }}
                className={`p-2.5 rounded-xl transition-all relative ${
                  showNotifications
                    ? "bg-blue-50 text-[#2563eb]"
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                <Bell size={22} />
                {unreadCount > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-[#ef4444] rounded-full border-2 border-white"></span>
                )}
              </button>

              {/* Notification Dropdown with Animation */}
              <div
                className={`absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transition-all duration-200 origin-top-right ${
                  showNotifications
                    ? "opacity-100 scale-100 translate-y-0 visible"
                    : "opacity-0 scale-95 -translate-y-2 invisible"
                }`}
              >
                <div className="px-4 py-4 border-b border-slate-50 flex justify-between items-center">
                  <h3 className="font-bold text-[#1e293b]">Notifications</h3>
                  <button className="text-[11px] font-bold text-[#2563eb] hover:underline">
                    Mark all as read
                  </button>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {DUMMY_NOTIFICATIONS.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-slate-50 transition-colors ${
                        !notification.read
                          ? "bg-[#eff6ff] border-l-4 border-l-[#3b82f6]"
                          : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <p
                          className={`text-sm ${!notification.read ? "font-bold text-[#1e293b]" : "text-slate-600"}`}
                        >
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-[#3b82f6] rounded-full"></div>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {notification.message}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-2 font-semibold uppercase tracking-tight">
                        {new Date(notification.timestamp).toLocaleTimeString(
                          [],
                          { hour: "2-digit", minute: "2-digit" },
                        )}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* User Profile Dropdown with Animation */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 p-0.5 rounded-xl hover:bg-slate-100 transition-colors"
              >
                <div className="w-9 h-9 rounded-lg bg-[#dbeafe] flex items-center justify-center text-[#2563eb] font-bold shadow-sm border border-blue-100">
                  {user?.name?.charAt(0) || "A"}
                </div>
              </button>

              <div
                className={`absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transition-all duration-200 origin-top-right ${
                  showUserMenu
                    ? "opacity-100 scale-100 translate-y-0 visible"
                    : "opacity-0 scale-95 -translate-y-2 invisible"
                }`}
              >
                <div className="p-4 bg-[#f8fafc] border-b border-slate-100">
                  <p className="font-bold text-[#1e293b] text-sm">
                    {user?.name || "Alex"}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    alex.student@bq.edu
                  </p>
                </div>
                <div className="p-2">
                  <Link
                    to="/settings"
                    className="flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-blue-50 hover:text-[#2563eb] rounded-lg transition text-sm font-medium"
                  >
                    <Settings size={16} /> Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-lg transition text-sm font-medium mt-1"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
