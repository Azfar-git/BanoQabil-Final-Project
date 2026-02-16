import { NavLink } from "react-router-dom";

const menu = [
  { name: "Dashboard", path: "/" },
  { name: "Teachers", path: "/teachers" },
  { name: "Students", path: "/students" },
  { name: "Courses", path: "/courses" },
  { name: "Campuses", path: "/campuses" },
  { name: "Supervisor", path: "/Supervisor" },
  { name: "Admin Access", path: "/AdminAccess" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg">
      <div
        className="p-6 text-xl font-bold font-(--font-heading)
        bg-gradient-to-r from-blue-600 to-purple-600
        bg-clip-text text-transparent"
      >
        BanoQabil
      </div>

      <nav className="flex flex-col gap-2 px-4">
        {menu.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `px-4 py-2 rounded-lg font-(--font-body)
               ${
                 isActive
                   ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                   : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
               }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
