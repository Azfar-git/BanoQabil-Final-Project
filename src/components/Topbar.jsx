import DarkModeToggle from "./DarkModeToggle";
export default function Topbar() {
  return (
    <header className="h-16 bg-white dark:bg-gray-800 shadow px-6 flex items-center justify-between">
      <h2
        className="text-2xl font-bold font-(--font-heading)
          bg-gradient-to-r from-blue-600 to-purple-600
          bg-clip-text text-transparent"
      >
        Admin Dashboard
      </h2>

      <div
        className="flex gap-[30px] text-1 font-bold font-(--font-heading)
          bg-gradient-to-r from-blue-600 to-purple-600
          bg-clip-text text-transparent"
      >
        <DarkModeToggle />
      </div>
    </header>
  );
}
