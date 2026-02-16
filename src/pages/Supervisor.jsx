import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/config";

export default function Supervisor() {
  const [classes, setClasses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [studentsList, setStudentsList] = useState([]);
  const [campuses, setCampuses] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    campus: "",
    teacher: "",
    time: "",
    students: [],
  });

  useEffect(() => {
    fetchClasses();
    fetchTeachers();
    fetchStudents();
    fetchCampuses();
  }, []);

  const fetchTeachers = async () => {
    const q = query(
      collection(db, "users"),
      where("roleName", "==", "teacher"),
    );

    const snapshot = await getDocs(q);
    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setTeachers(list);
  };
  const fetchCampuses = async () => {
    const snapshot = await getDocs(collection(db, "campuses"));

    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setCampuses(list);
  };

  const fetchStudents = async () => {
    const q = query(
      collection(db, "users"),
      where("roleName", "==", "student"),
    );

    const snapshot = await getDocs(q);
    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setStudentsList(list);
  };

  const fetchClasses = async () => {
    const snapshot = await getDocs(collection(db, "classes"));
    const list = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setClasses(list);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleStudentToggle = (studentName) => {
    setFormData((prev) => {
      const alreadySelected = prev.students.includes(studentName);

      if (alreadySelected) {
        return {
          ...prev,
          students: prev.students.filter((s) => s !== studentName),
        };
      } else {
        return {
          ...prev,
          students: [...prev.students, studentName],
        };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const classData = {
      title: formData.name,
      campus: formData.campus,
      timing: formData.time,
      instructorName: formData.teacher,
      students: formData.students.map((s, index) => ({
        id: index + 1,
        name: s,
      })),
      studentCount: formData.students.length,
      status: "active",
    };

    if (editingId) {
      await updateDoc(doc(db, "classes", editingId), {
        ...classData,
        updatedAt: new Date(),
      });
      setEditingId(null);
    } else {
      await addDoc(collection(db, "classes"), {
        ...classData,
        createdAt: new Date(),
      });
    }

    setFormData({
      name: "",
      campus: "",
      teacher: "",
      time: "",
      students: [],
    });

    fetchClasses();
  };

  // 🔥 Delete Class
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "classes", id));
    fetchClasses();
  };

  return (
    <div className="p-6 min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      <h1
        className="text-2xl font-bold font-(--font-heading)
          bg-gradient-to-r from-blue-600 to-purple-600
          bg-clip-text text-transparent"
      >
        Supervisor - Create Class
      </h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Class Name"
            value={formData.name}
            onChange={handleChange}
            className="p-2 rounded border dark:bg-gray-700"
            required
          />

          <select
            name="campus"
            value={formData.campus}
            onChange={handleChange}
            className="p-2 rounded border dark:bg-gray-700"
            required
          >
            <option value="">Select Campus</option>

            {campuses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.location})
              </option>
            ))}
          </select>

          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className="p-2 rounded border dark:bg-gray-700"
            required
          />

          <select
            name="teacher"
            value={formData.teacher}
            onChange={handleChange}
            className="p-2 rounded border dark:bg-gray-700"
            required
          >
            <option value="">Select Teacher</option>

            {teachers.map((t) => (
              <option key={t.id} value={t.name}>
                {t.name}
              </option>
            ))}
          </select>

          <div className="border rounded p-3 max-h-40 overflow-y-auto dark:bg-gray-700">
            {studentsList.map((s) => (
              <label
                key={s.id}
                className="flex items-center gap-2 mb-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={formData.students.includes(s.name)}
                  onChange={() => handleStudentToggle(s.name)}
                />
                {s.name}
              </label>
            ))}
          </div>
        </div>

        {/* BUTTON DESIGN SAME */}
        <button
          className="group relative rounded-lg mt-3 p-[2px] 
          bg-gradient-to-r from-blue-500 to-purple-600 
          hover:from-blue-600 hover:to-purple-600 
          transition duration-300"
        >
          <span
            className="flex h-full w-full items-center justify-center 
            rounded-md bg-gray-900 px-4 py-2 text-white 
            group-hover:bg-transparent"
          >
            {editingId ? "Update Class" : "Create Class"}
          </span>
        </button>
      </form>

      {/* TABLE */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">Class List</h2>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th>Name</th>
              <th>Campus</th>
              <th>Teacher</th>
              <th>Time</th>
              <th>Students</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((cls) => (
              <tr key={cls.id} className="border-b">
                <td>{cls.title}</td>
                <td>{cls.campus}</td>
                <td>{cls.instructorName}</td>
                <td>{cls.timing}</td>
                <td>{cls.students?.map((s) => s.name).join(", ")}</td>
                <td className="flex gap-2 py-2">
                  <button
                    onClick={() => {
                      setFormData({
                        name: cls.title,
                        campus: cls.campus,
                        teacher: cls.instructorName,
                        time: cls.timing,
                        students: cls.students?.map((s) => s.name) || [],
                      });
                      setEditingId(cls.id);
                    }}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(cls.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
