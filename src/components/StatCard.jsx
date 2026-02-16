export default function StatCard({ title, value }) {
  return (
    <div
      className="
        bg-white dark:bg-gray-800
        rounded-xl p-6 shadow-lg
        hover:shadow-xl
        transition-shadow
      "
    >
      <h3 className="text-sm font-(--font-body) text-gray-500 dark:text-gray-300">
        {title}
      </h3>

      <p
        className="mt-2 text-3xl font-(--font-heading)
        bg-gradient-to-r from-blue-600 to-purple-600 dark:text-white
        bg-clip-text text-transparent"
      >
        {value}
      </p>
    </div>
  );
}
