import React from "react";
import { useNavigate } from "react-router-dom";
import { Users, Circle } from "lucide-react";

const ClassTable = ({ classes }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full overflow-hidden">
      <table className="w-full text-left border-separate border-spacing-y-3">
        <thead>
          <tr className="text-slate-400">
            <th className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em]">Environment</th>
            <th className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-center">Roster</th>
            <th className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-center">Workload</th>
            <th className="px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-right">Instructor</th>
          </tr>
        </thead>
        <tbody>
          {classes.map((classItem) => (
            <tr
              key={classItem.id}
              onClick={() => navigate(`/classroom/${classItem.id}`)}
              className="group bg-white dark:bg-slate-900/50 hover:shadow-md transition-all cursor-pointer border-y border-slate-100 dark:border-slate-800"
            >
              {/* Name & ID */}
              <td className="px-4 py-5 rounded-l-2xl border-l border-y border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-10 rounded-full" style={{ backgroundColor: classItem.color }} />
                  <div>
                    <div className="text-sm font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {classItem.name}
                    </div>
                    <div className="text-[10px] font-bold text-slate-400 tracking-tighter uppercase">
                      ID: {classItem.code}
                    </div>
                  </div>
                </div>
              </td>

              {/* Student Count */}
              <td className="px-4 py-5 border-y border-slate-100 dark:border-slate-800 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <Users size={14} className="text-slate-400" />
                  <span className="text-xs font-black">{classItem.students}</span>
                </div>
              </td>

              {/* Status/Tasks */}
              <td className="px-4 py-5 border-y border-slate-100 dark:border-slate-800 text-center">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    {classItem.assignments || 0} Modules
                  </span>
                  <div className="flex items-center gap-1">
                    <Circle size={6} fill={classItem.ungraded > 0 ? "#ef4444" : "#10b981"} className="border-none" />
                    <span className="text-[9px] font-black uppercase text-slate-400">
                      {classItem.ungraded > 0 ? `${classItem.ungraded} Action Items` : "Optimized"}
                    </span>
                  </div>
                </div>
              </td>

              {/* Instructor */}
              <td className="px-4 py-5 rounded-r-2xl border-r border-y border-slate-100 dark:border-slate-800 text-right">
                <span className="text-xs font-black text-slate-500 uppercase tracking-tight">
                  {classItem.teacher}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ClassTable;