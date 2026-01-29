import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Inbox,
  Calendar,
  CheckSquare,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const menuItems = [
  { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { label: 'Classroom', icon: BookOpen, href: '/classroom' },
  { label: 'Inbox', icon: Inbox, href: '/notifications' },
  { label: 'Calendar', icon: Calendar, href: '/calendar' },
  { label: 'To-Do', icon: CheckSquare, href: '/todo' },
  { label: 'Grades', icon: BarChart3, href: '/grades' },
  { label: 'Settings', icon: Settings, href: '/settings/profile' },
];

export default function Sidebar({ isOpen, onToggle }) {
  const location = useLocation();

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`bg-white border-r border-gray-200 transition-all duration-300 ${
          isOpen ? 'w-64' : 'w-0'
        } md:w-64 flex flex-col overflow-hidden`}
      >
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-bold text-xl text-gray-900">Classes</h2>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.startsWith(item.href);
            return (
              <Link
                key={item.label}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  isActive
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <p className="text-xs text-gray-600">Google Classroom v1.0</p>
        </div>
      </aside>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed left-64 top-20 transform -translate-x-1/2 bg-white border border-gray-200 rounded-full p-1 shadow-md hover:shadow-lg transition md:hidden z-30"
      >
        {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>
    </>
  );
}
