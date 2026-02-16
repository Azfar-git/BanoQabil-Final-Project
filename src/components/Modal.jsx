export default function Modal({ title, isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white dark:bg-gray-800 rounded-xl w-full max-w-lg p-6 shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold font-(--font-heading)">{title}</h2>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 text-xl"
          >
            ×
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
