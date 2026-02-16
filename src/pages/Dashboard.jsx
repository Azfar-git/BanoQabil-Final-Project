import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore"; // query aur where add kiya
import { db } from "../firebase/config";
import StatCard from "../components/StatCard";

export default function Dashboard() {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    courses: 0,
    campuses: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 1. Students Count
        const studentQ = query(
          collection(db, "users"),
          where("roleName", "==", "student"),
        );
        const studentSnap = await getDocs(studentQ);

        // 2. Teachers Count
        const teacherQ = query(
          collection(db, "users"),
          where("roleName", "==", "teacher"),
        );
        const teacherSnap = await getDocs(teacherQ);

        // 3. Courses & Campuses
        const coursesSnap = await getDocs(collection(db, "courses"));
        const campusesSnap = await getDocs(collection(db, "campuses"));

        // State Update
        setStats({
          students: studentSnap.size, // .size property count deti hai
          teachers: teacherSnap.size,
          courses: coursesSnap.size,
          campuses: campusesSnap.size,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="space-y-12">
      <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <StatCard title="Total Students" value={stats.students} />
        <StatCard title="Total Teachers" value={stats.teachers} />
        <StatCard title="Courses" value={stats.courses} />
        <StatCard title="Campuses" value={stats.campuses} />
      </div>
    </div>
  );
}
