import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  MoreVertical,
  Trash2,
  Clock,
  ChevronRight,
  Archive,
  RotateCcw,
  X,
} from "lucide-react";
import { db } from "../../firebase/config";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { mockUser } from "../../data/mockData";

// Confirmation Modal Component
const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, actionColor = "red", darkMode }) => {
  if (!isOpen) return null;

  const colorClasses = {
    red: {
      button: darkMode ? "bg-red-600 hover:bg-red-700" : "bg-red-600 hover:bg-red-700",
      text: darkMode ? "text-red-400" : "text-red-600",
    },
    yellow: {
      button: darkMode ? "bg-yellow-600 hover:bg-yellow-700" : "bg-yellow-600 hover:bg-yellow-700",
      text: darkMode ? "text-yellow-400" : "text-yellow-600",
    },
    green: {
      button: darkMode ? "bg-green-600 hover:bg-green-700" : "bg-green-600 hover:bg-green-700",
      text: darkMode ? "text-green-400" : "text-green-600",
    },
  };

  const currentColor = colorClasses[actionColor] || colorClasses.red;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div
        className={`w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <div className={`px-6 py-4 border-b flex justify-between items-center ${
          darkMode ? "border-gray-700" : "border-gray-100"
        }`}>
          <h3 className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
            {title}
          </h3>
          <button
            onClick={onClose}
            className={`p-1 rounded-full transition-colors ${
              darkMode ? "hover:bg-gray-700 text-gray-400" : "hover:bg-gray-100 text-gray-500"
            }`}
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          <p className={`text-sm mb-6 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
            {message}
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-colors border ${
                darkMode
                  ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                  : "border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 py-2.5 rounded-lg font-bold text-sm text-white transition-colors ${currentColor.button}`}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ClassGrid = ({ classes, darkMode }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [modalState, setModalState] = useState({
    isOpen: false,
    action: null,
    classId: null,
  });
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, "classes", modalState.classId));
      setModalState({ isOpen: false, action: null, classId: null });
      setActiveMenu(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleArchive = async () => {
    try {
      await updateDoc(doc(db, "classes", modalState.classId), { status: "archived" });
      setModalState({ isOpen: false, action: null, classId: null });
      setActiveMenu(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUnarchive = async () => {
    try {
      await updateDoc(doc(db, "classes", modalState.classId), { status: "active" });
      setModalState({ isOpen: false, action: null, classId: null });
      setActiveMenu(null);
    } catch (err) {
      console.error(err);
    }
  };

  const openModal = (action, classId) => {
    setModalState({ isOpen: true, action, classId });
  };

  const getModalContent = () => {
    switch (modalState.action) {
      case "delete":
        return {
          title: "Delete Class",
          message: "Are you sure you want to delete this class permanently? This action cannot be undone.",
          actionColor: "red",
          onConfirm: handleDelete,
        };
      case "archive":
        return {
          title: "Archive Class",
          message: "Are you sure you want to archive this class? It will be moved to archived status.",
          actionColor: "yellow",
          onConfirm: handleArchive,
        };
      case "unarchive":
        return {
          title: "Unarchive Class",
          message: "Are you sure you want to unarchive this class? It will become active again.",
          actionColor: "green",
          onConfirm: handleUnarchive,
        };
      default:
        return null;
    }
  };

  const modalContent = getModalContent();

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {classes.map((item) => {
          const isArchived = item.status === "archived";

          return (
            <div
              key={item.id}
              onClick={() => navigate(`/classroom/${item.id}`)}
              className={`relative group rounded-[24px] p-6 transition-all duration-300 cursor-pointer border-2
                ${
                  darkMode
                    ? "bg-gray-800 border-gray-700 hover:border-blue-400 hover:shadow-xl"
                    : "bg-white border-slate-200 hover:border-blue-400 hover:shadow-xl"
                }`}
            >
              {/* Top Row: Code + Menu (only for teachers) */}
              <div className="flex justify-between items-center mb-6">
                <span
                  className="px-3 py-1 rounded-lg text-[10px] font-black uppercase border-2"
                  style={{
                    color: item.color,
                    borderColor: `${item.color}30`,
                    backgroundColor: `${item.color}08`,
                  }}
                >
                  {item.code}
                </span>

                {/* Only teachers see the menu */}
                {mockUser.role === "teacher" && (
                  <div className="relative">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenu(activeMenu === item.id ? null : item.id);
                      }}
                      className={`p-1.5 rounded-lg hover:bg-slate-100
                        ${darkMode ? "text-gray-300 hover:bg-gray-700" : "text-slate-400"}`}
                    >
                      <MoreVertical size={18} />
                    </button>

                    {activeMenu === item.id && (
                      <div
                        className={`absolute right-0 mt-2 w-36 rounded-xl py-1 z-50 border-2 shadow-2xl
                          ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-slate-100"}`}
                      >
                        {isArchived ? (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openModal("unarchive", item.id);
                              setActiveMenu(null);
                            }}
                            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold w-full
                              ${darkMode ? "text-green-400 hover:bg-green-600/20" : "text-green-600 hover:bg-green-50"}`}
                          >
                            <RotateCcw size={14} /> Unarchive
                          </button>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openModal("archive", item.id);
                              setActiveMenu(null);
                            }}
                            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold w-full
                              ${darkMode ? "text-yellow-400 hover:bg-yellow-600/20" : "text-yellow-600 hover:bg-yellow-50"}`}
                          >
                            <Archive size={14} /> Archive
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openModal("delete", item.id);
                            setActiveMenu(null);
                          }}
                          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold w-full
                            ${darkMode ? "text-red-400 hover:bg-red-600/20" : "text-red-600 hover:bg-red-50"}`}
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Class Title + Teacher */}
              <div className="mb-8">
                <h3
                  className={`${darkMode ? "text-gray-100" : "text-slate-900"} font-black text-xl mb-1 truncate`}
                  title={item.name}
                >
                  {item.name}
                </h3>
                <p
                  className={`${darkMode ? "text-gray-400" : "text-slate-400"} text-[11px] font-bold uppercase tracking-widest truncate`}
                  title={item.teacher}
                >
                  {item.teacher}
                </p>
              </div>

              {/* Bottom Row: Students + Timing (stacked) */}
              <div
                className={`flex items-center justify-between pt-5 border-t-2
                  ${darkMode ? "border-gray-700" : "border-slate-50"}`}
              >
                <div className="flex flex-col gap-2">
                  {/* Students chip */}
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border w-fit
                      ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-slate-50 border-slate-100 text-slate-700"}`}
                  >
                    <Users
                      size={14}
                      className={`${darkMode ? "text-gray-400" : "text-slate-400"}`}
                    />
                    <span className="text-xs font-black">{item.students ?? 0}</span>
                  </div>

                  {/* Timing chip */}
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border w-fit
                      ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-slate-50 border-slate-100 text-slate-700"}`}
                  >
                    <Clock
                      size={14}
                      className={`${darkMode ? "text-gray-400" : "text-slate-400"}`}
                    />
                    <span className="text-xs font-black">
                      {item.timing || "N/A"}
                    </span>
                  </div>
                </div>
                <ChevronRight
                  size={20}
                  style={{ color: item.color }}
                  strokeWidth={3}
                  className="flex-shrink-0"
                />
              </div>

              {/* Status badge for archived classes */}
              {isArchived && (
                <div className="absolute top-16 right-6">
                  <span className="text-[8px] font-bold uppercase bg-gray-500/20 text-gray-500 px-2 py-0.5 rounded-full">
                    Archived
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Confirmation Modal */}
      {modalContent && (
        <ConfirmModal
          isOpen={modalState.isOpen}
          onClose={() => setModalState({ isOpen: false, action: null, classId: null })}
          title={modalContent.title}
          message={modalContent.message}
          actionColor={modalContent.actionColor}
          onConfirm={modalContent.onConfirm}
          darkMode={darkMode}
        />
      )}
    </>
  );
};

export default ClassGrid;