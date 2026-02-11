import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSkeleton from "../Common/LoadingSkeleton";
import {
  ChevronDown,
  ArrowUpRight,
  Hash,
  Users,
  BookOpen,
  AlertCircle,
} from "lucide-react";

const ClassTable = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("name");
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setClasses([
        {
          id: 1,
          name: "Introduction to Web Development",
          teacher: "John Doe",
          code: "WEB101",
          section: "5th Period",
          students: 24,
          assignments: 5,
          ungraded: 2,
          color: "#2563eb",
        },
        {
          id: 2,
          name: "Data Structures",
          teacher: "Jane Smith",
          code: "CS201",
          section: "3rd Period",
          students: 18,
          assignments: 3,
          ungraded: 1,
          color: "#10b981",
        },
        {
          id: 3,
          name: "Advanced Mathematics",
          teacher: "Robert Johnson",
          code: "MATH301",
          section: "2nd Period",
          students: 22,
          assignments: 8,
          ungraded: 3,
          color: "#7c3aed",
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const sortedClasses = [...classes].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "students") return b.students - a.students;
    if (sortBy === "ungraded") return b.ungraded - a.ungraded;
    return 0;
  });

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      {/* Header Area */}
      <div className="p-6 flex justify-between items-center border-b border-slate-100 dark:border-slate-800">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Academic Overview
          </h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">
            Global Class Management
          </p>
        </div>

        <div className="relative group">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="appearance-none pl-4 pr-10 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 
                       rounded-xl text-xs font-black text-slate-700 dark:text-slate-200 cursor-pointer focus:ring-2 focus:ring-blue-500/20 outline-none"
          >
            <option value="name">SORT BY NAME</option>
            <option value="students">SORT BY CAPACITY</option>
            <option value="ungraded">SORT BY UNGRADED</option>
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-800/50">
              <th className="table-head-pro">Class Name</th>
              <th className="table-head-pro">Teacher</th>
              <th className="table-head-pro text-center">Students</th>
              <th className="table-head-pro text-center">Tasks</th>
              <th className="table-head-pro text-right pr-10">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y-0">
            {sortedClasses.map((classItem) => (
              <tr
                key={classItem.id}
                onClick={() => navigate(`/classroom/${classItem.id}`)}
                className="table-row-pro group"
              >
                {/* Class Name + Code */}
                <td className="px-6 py-5">
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                      {classItem.name}
                    </span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Hash
                        size={10}
                        style={{ color: classItem.color }}
                        strokeWidth={4}
                      />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        {classItem.code}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Teacher */}
                <td className="px-6 py-5">
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">
                    {classItem.teacher}
                  </span>
                </td>

                {/* Students */}
                <td className="px-6 py-5 text-center">
                  <div className="inline-flex items-center gap-1.5">
                    <Users size={14} className="text-slate-300" />
                    <span className="text-sm font-black text-slate-800 dark:text-slate-100">
                      {classItem.students}
                    </span>
                  </div>
                </td>

                {/* Assignments */}
                <td className="px-6 py-5 text-center">
                  <div className="inline-flex items-center gap-1.5">
                    <BookOpen size={14} className="text-slate-300" />
                    <span className="text-sm font-black text-slate-800 dark:text-slate-100">
                      {classItem.assignments}
                    </span>
                  </div>
                </td>

                {/* Ungraded Status */}
                <td className="px-6 py-5 text-right pr-10">
                  <div className="flex items-center justify-end gap-3">
                    {classItem.ungraded > 0 ? (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/50 rounded-lg">
                        <AlertCircle size={12} className="text-red-500" />
                        <span className="text-[11px] font-black text-red-600 dark:text-red-400 uppercase">
                          {classItem.ungraded} Ungraded
                        </span>
                      </div>
                    ) : (
                      <span className="text-[11px] font-black text-slate-300 uppercase italic tracking-widest">
                        All Clear
                      </span>
                    )}
                    <ArrowUpRight
                      size={16}
                      className="text-slate-200 group-hover:text-blue-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all opacity-0 group-hover:opacity-100"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClassTable;
