import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Bell,
  LogOut,
  Settings,
  Search,
  Calendar,
  CheckSquare,
  LayoutDashboard,
  RefreshCw,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { db } from "../../firebase/config";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  updateDoc,
  doc,
  writeBatch,
  getDocs,
} from "firebase/firestore";

export default function Navbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loadingNotifs, setLoadingNotifs] = useState(true);
  const [notifError, setNotifError] = useState(null);

  const { user, logout } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Subscribe to user's notifications
  useEffect(() => {
    if (!user?.id) {
      setLoadingNotifs(false);
      return;
    }

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", user.id),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const notifs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setNotifications(notifs);
        setLoadingNotifs(false);
        setNotifError(null);
      },
      (error) => {
        console.error("Notifications error:", error);
        // Check if it's an index error
        if (error.code === "failed-precondition" || error.message.includes("index")) {
          setNotifError(
            <div>
              <p className="text-sm">Need to create a Firestore index.</p>
              <a
                href={`https://console.firebase.google.com/v1/r/project/${db.app.options.projectId}/firestore/indexes`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline text-xs"
              >
                Click here to create the required index
              </a>
            </div>
          );
        } else {
          setNotifError("Failed to load notifications. Check console.");
        }
        setLoadingNotifs(false);
      }
    );

    return () => unsub();
  }, [user?.id]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = async () => {
    if (unreadCount === 0) return;
    try {
      const batch = writeBatch(db);
      notifications.forEach((notif) => {
        if (!notif.read) {
          const notifRef = doc(db, "notifications", notif.id);
          batch.update(notifRef, { read: true });
        }
      });
      await batch.commit();
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleNotificationClick = async (notif) => {
    try {
      if (!notif.read) {
        await updateDoc(doc(db, "notifications", notif.id), { read: true });
      }
      if (notif.link) {
        navigate(notif.link);
      }
      setShowNotifications(false);
    } catch (error) {
      console.error("Error handling notification click:", error);
    }
  };

  // Manual refresh function (fallback if onSnapshot fails)
  const refreshNotifications = useCallback(async () => {
    if (!user?.id) return;
    setLoadingNotifs(true);
    try {
      const q = query(
        collection(db, "notifications"),
        where("userId", "==", user.id),
        orderBy("createdAt", "desc")
      );
      const snapshot = await getDocs(q);
      const notifs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setNotifications(notifs);
      setNotifError(null);
    } catch (error) {
      console.error("Manual refresh error:", error);
      setNotifError("Manual refresh failed.");
    } finally {
      setLoadingNotifs(false);
    }
  }, [user?.id]);

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
          ? darkMode
            ? "bg-gray-800/90 backdrop-blur-md shadow-lg"
            : "bg-white/90 backdrop-blur-md shadow-sm border-b border-slate-200"
          : darkMode
            ? "bg-gray-900"
            : "bg-white"
      }`}
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-[#3b52f6] rounded-lg flex items-center justify-center shadow-md group-hover:bg-[#2563eb] transition-colors">
              <span className="text-white font-bold text-sm">BQ</span>
            </div>
            <div className="flex flex-col">
              <span
                className={`font-bold text-lg leading-tight tracking-tight ${
                  darkMode ? "text-white" : "text-[#1e293b]"
                }`}
              >
                Classroom
              </span>
              <span className="text-[10px] text-[#3b52f6] font-bold uppercase tracking-wider leading-none">
                Education
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div
            className={`hidden md:flex items-center p-1 rounded-xl transition-all ${
              darkMode ? "bg-gray-800 shadow-inner" : "bg-slate-100/80"
            }`}
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  location.pathname === link.path
                    ? "bg-[#2563eb] text-white shadow-md shadow-blue-500/20"
                    : darkMode
                      ? "text-gray-400 hover:text-white"
                      : "text-[#64748b] hover:text-[#1e293b]"
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
                className={`absolute left-3 transition-colors ${
                  darkMode ? "text-gray-500" : "text-slate-400"
                } group-focus-within:text-[#2563eb]`}
              />
              <input
                type="text"
                placeholder="Search resources..."
                className={`pl-10 pr-4 py-2 rounded-xl text-sm w-48 focus:w-64 transition-all outline-none border-none ${
                  darkMode
                    ? "bg-gray-800 text-white placeholder-gray-500 focus:bg-gray-700"
                    : "bg-[#f1f5f9] text-slate-700 placeholder-slate-400 focus:bg-slate-200/50"
                }`}
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
                    ? "bg-blue-500/10 text-[#2563eb]"
                    : darkMode
                      ? "text-gray-400 hover:bg-gray-800 hover:text-white"
                      : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                <Bell size={22} />
                {unreadCount > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-[#ef4444] rounded-full border-2 border-white dark:border-gray-900"></span>
                )}
              </button>

              {/* Notification Menu */}
              <div
                className={`absolute right-0 mt-3 w-80 rounded-2xl shadow-2xl border-none overflow-hidden transition-all duration-200 origin-top-right z-[60] ${
                  showNotifications
                    ? "opacity-100 scale-100 translate-y-0 visible"
                    : "opacity-0 scale-95 -translate-y-2 invisible"
                } ${
                  darkMode
                    ? "bg-gray-800 text-white"
                    : "bg-white text-slate-900 shadow-xl"
                }`}
              >
                <div
                  className={`px-4 py-4 border-b flex justify-between items-center ${
                    darkMode ? "border-gray-700" : "border-slate-100"
                  }`}
                >
                  <h3 className="font-bold">Notifications</h3>
                  <div className="flex gap-2">
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllRead}
                        className="text-[11px] font-bold text-[#2563eb]"
                      >
                        Mark all as read
                      </button>
                    )}
                    <button
                      onClick={refreshNotifications}
                      className="p-1 rounded-full hover:bg-gray-500/20 transition"
                      title="Refresh"
                    >
                      <RefreshCw size={14} />
                    </button>
                  </div>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {loadingNotifs ? (
                    <div className="p-4 text-center text-sm opacity-70">Loading...</div>
                  ) : notifError ? (
                    <div className="p-4 text-center text-sm text-red-500">
                      {typeof notifError === "string" ? notifError : notifError}
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm opacity-70">No notifications</div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`p-4 transition-colors cursor-pointer ${
                          !notification.read
                            ? darkMode
                              ? "bg-gray-700/30"
                              : "bg-blue-50/50"
                            : darkMode
                              ? "hover:bg-gray-700/50"
                              : "hover:bg-slate-50"
                        }`}
                      >
                        <p
                          className={`text-sm ${
                            !notification.read ? "font-bold" : "font-medium"
                          }`}
                        >
                          {notification.title}
                        </p>
                        <p
                          className={`text-xs mt-1 ${
                            darkMode ? "text-gray-400" : "text-slate-500"
                          }`}
                        >
                          {notification.message}
                        </p>
                        <p className="text-[10px] mt-1 opacity-50">
                          {notification.createdAt?.toDate
                            ? notification.createdAt.toDate().toLocaleString()
                            : "Just now"}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowUserMenu(!showUserMenu);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 p-0.5 rounded-xl"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                  {user?.name?.charAt(0) || "A"}
                </div>
              </button>

              <div
                className={`absolute right-0 mt-3 w-56 rounded-2xl shadow-2xl border-none overflow-hidden transition-all duration-200 origin-top-right z-[60] ${
                  showUserMenu
                    ? "opacity-100 scale-100 translate-y-0 visible"
                    : "opacity-0 scale-95 -translate-y-2 invisible"
                } ${darkMode ? "bg-gray-800" : "bg-white shadow-xl"}`}
              >
                <div
                  className={`p-4 ${darkMode ? "bg-gray-700/50" : "bg-slate-50"}`}
                >
                  <p
                    className={`font-bold text-sm ${
                      darkMode ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {user?.name || "Alex"}
                  </p>
                  <p className="text-xs text-slate-500 truncate">
                    {user?.email || "alex.student@bq.edu"}
                  </p>
                </div>
                <div className="p-2">
                  <Link
                    to="/settings"
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium ${
                      darkMode
                        ? "text-gray-300 hover:bg-gray-700"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <Settings size={16} /> Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-3 py-2 text-rose-500 hover:bg-rose-500/10 rounded-lg text-sm font-medium mt-1"
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