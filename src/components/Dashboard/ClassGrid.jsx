import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  MoreVertical,
  LogOut,
  Trash2,
  Clock,
  ChevronRight,
} from "lucide-react";
import { db } from "../../firebase/config";
import { doc, deleteDoc, updateDoc, increment } from "firebase/firestore";
import { mockUser } from "../../data/mockData";

const ClassGrid = ({ classes, darkMode }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const navigate = useNavigate();

  const handleDelete = async (e, classId) => {
    e.stopPropagation();
    if (window.confirm("Delete this class permanently?")) {
      try {
        await deleteDoc(doc(db, "classes", classId));
        setActiveMenu(null);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleLeave = async (e, classId) => {
    e.stopPropagation();
    if (window.confirm("Leave this class?")) {
      try {
        const classRef = doc(db, "classes", classId);
        await updateDoc(classRef, { studentCount: increment(-1) });
        setActiveMenu(null);
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {classes.map((item) => (
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
          {/* Top Row: Code + Menu */}
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
                  className={`absolute right-0 mt-2 w-32 rounded-xl py-1 z-50 border-2 shadow-2xl
                  ${darkMode ? "bg-gray-700 border-gray-600" : "bg-white border-slate-100"}`}
                >
                  {mockUser.role === "teacher" ? (
                    <button
                      onClick={(e) => handleDelete(e, item.id)}
                      className={`flex items-center gap-2 px-4 py-2 text-xs font-bold w-full
                        ${darkMode ? "text-red-400 hover:bg-red-600/20" : "text-red-600 hover:bg-red-50"}`}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  ) : (
                    <button
                      onClick={(e) => handleLeave(e, item.id)}
                      className={`flex items-center gap-2 px-4 py-2 text-xs font-bold w-full
                        ${darkMode ? "text-orange-400 hover:bg-orange-600/20" : "text-orange-600 hover:bg-orange-50"}`}
                    >
                      <LogOut size={14} /> Leave
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Class Title + Teacher */}
          <div className="mb-8">
            <h3
              className={`${darkMode ? "text-gray-100" : "text-slate-900"} font-black text-xl mb-1`}
            >
              {item.name}
            </h3>
            <p
              className={`${darkMode ? "text-gray-400" : "text-slate-400"} text-[11px] font-bold uppercase tracking-widest`}
            >
              {item.teacher}
            </p>
          </div>

          {/* Bottom Row: Students + Section */}
          <div
            className={`flex items-center justify-between pt-5 border-t-2
            ${darkMode ? "border-gray-700" : "border-slate-50"}`}
          >
            <div className="flex gap-4">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border
                ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-slate-50 border-slate-100 text-slate-700"}`}
              >
                <Users
                  size={14}
                  className={`${darkMode ? "text-gray-400" : "text-slate-400"}`}
                />
                <span className="text-xs font-black">{item.students ?? 0}</span>
              </div>
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border
                ${darkMode ? "bg-gray-700 border-gray-600 text-gray-200" : "bg-slate-50 border-slate-100 text-slate-700"}`}
              >
                <Clock
                  size={14}
                  className={`${darkMode ? "text-gray-400" : "text-slate-400"}`}
                />
                <span className="text-xs font-black">
                  {item.section || "N/A"}
                </span>
              </div>
            </div>
            <ChevronRight
              size={20}
              style={{ color: item.color }}
              strokeWidth={3}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClassGrid;
