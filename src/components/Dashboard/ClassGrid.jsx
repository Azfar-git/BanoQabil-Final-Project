import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, MoreVertical, LogOut, Clock, ChevronRight } from 'lucide-react';

const ClassGrid = () => {
  const [classes, setClasses] = useState([]);
  const [activeMenu, setActiveMenu] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setClasses([
      { id: 1, name: 'Introduction to Web Development', teacher: 'JOHN DOE', code: 'WEB101', section: '5P', color: '#2563eb', students: 24 },
      { id: 2, name: 'Data Structures', teacher: 'JANE SMITH', code: 'CS201', section: '3P', color: '#10b981', students: 18 },
      { id: 3, name: 'Advanced Mathematics', teacher: 'ROBERT JOHNSON', code: 'MATH301', section: '2P', color: '#7c3aed', students: 22 },
    ]);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
      {classes.map((item) => (
        <div
          key={item.id}
          onClick={() => navigate(`/classroom/${item.id}`)}
          className="class-card-pro group"
          style={{ '--glow-color': `${item.color}33` }} // 33 is roughly 20% opacity for the glow
        >
          {/* Top Row: Code Tag & Menu */}
          <div className="flex justify-between items-center">
            <span 
              className="px-3 py-1 rounded-lg text-[11px] font-black tracking-widest uppercase border transition-colors duration-300" 
              style={{ 
                color: item.color, 
                borderColor: `${item.color}40`, 
                backgroundColor: `${item.color}08` 
              }}
            >
              {item.code}
            </span>
            
            <div className="relative">
              <button 
                onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === item.id ? null : item.id); }}
                className="p-1.5 rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition-all"
              >
                <MoreVertical size={20} />
              </button>

              {activeMenu === item.id && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 shadow-2xl border border-slate-100 dark:border-slate-700 rounded-xl py-2 z-50">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setClasses(classes.filter(c => c.id !== item.id)); }}
                    className="flex items-center gap-3 px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 w-full transition-colors"
                  >
                    <LogOut size={16} /> Leave Environment
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Body: High Impact Typography */}
          <div className="mt-8 flex-grow">
            <h3 className="text-slate-900 dark:text-white font-black text-2xl leading-[1.15] mb-2">
              {item.name}
            </h3>
            <p className="text-[12px] font-bold text-slate-400 tracking-[0.2em] uppercase">
              {item.teacher}
            </p>
          </div>

          {/* Footer: Balanced Stats */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                <span className="text-sm font-black text-slate-800 dark:text-slate-100">{item.students}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-slate-300 group-hover:text-slate-500 transition-colors" />
                <span className="text-sm font-black text-slate-800 dark:text-slate-100">{item.section}</span>
              </div>
            </div>
            
            <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
               <ChevronRight size={18} style={{ color: item.color }} strokeWidth={3} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ClassGrid;