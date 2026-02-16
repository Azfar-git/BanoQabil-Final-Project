import { useTheme } from "../context/ThemeContext";

export default function DarkModeToggle() {
  const { dark, setDark } = useTheme();

  return (
    <button
      onClick={() => setDark(!dark)}
      className="group relative rounded-lg p-[2px] 
      bg-gradient-to-r from-blue-500 to-purple-600 
      hover:from-blue-600 hover:to-purple-600 
      transition duration-300 hover:scale-105"
    >
      <span
        className="flex h-full w-full items-center justify-center 
        rounded-md bg-gray-900 px-4 py-2 text-white 
        group-hover:bg-transparent"
      >
        {dark ? "Light Mode" : "Dark Mode"}
      </span>
    </button>
  );
}
