import { useContext, useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  where,
  query,
} from "firebase/firestore";
import { db } from "../firebase/config";
import Modal from "../components/Modal";
import { roles as userRoles } from "../constants/index";
import RolesContext from "../context/rolesContext/rolesContext";

export default function Students() {
  const { roles } = useContext(RolesContext);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [courses, setCourses] = useState([]);
  const [campuses, setCampuses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [students, setStudents] = useState([]);

  //fetch student working
  const fetchStudents = async () => {
    const q = query(
      collection(db, "users"),
      where("roleName", "==", "student"),
    );
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setStudents(data);
  };

  useEffect(() => {
    fetchStudents();
    fetchCourses();
    fetchCampuses();
    fetchTeachers();
  }, []);

  //fetch teacher working

  const fetchTeachers = async () => {
    const q = query(
      collection(db, "users"),
      where("roleName", "==", "teacher"),
    );
    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setTeachers(data);
  };

  const fetchCourses = async () => {
    const querySnapshot = await getDocs(collection(db, "courses"));
    const list = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCourses(list);
  };

  const fetchCampuses = async () => {
    const querySnapshot = await getDocs(collection(db, "campuses"));
    const list = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCampuses(list);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const getRole = roles.find((item) => item.name === userRoles.student);
    const form = e.target;

    const studentData = {
      name: form.name.value,
      email: form.email.value,
      course: form.course.value,
      campus: form.campus.value,
      date: form.date.value,
      time: form.time.value,
      teacher: form.teacher.value,
      roleName: getRole.name,
      roleId: getRole.id,
    };

    if (editing) {
      // UPDATE
      const studentRef = doc(db, "users", editing.id);
      await updateDoc(studentRef, studentData);
    } else {
      // ADD
      await addDoc(collection(db, "users"), {
        ...studentData,
        createdAt: new Date(),
      });
    }

    setOpen(false);
    setEditing(null);
    form.reset();
    fetchStudents();
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this student?")) {
      await deleteDoc(doc(db, "users", id));
      fetchStudents();
    }
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1
          className="
            text-2xl  font-bold font-(--font-heading)
            bg-gradient-to-r from-blue-600 to-purple-600
            bg-clip-text text-transparent
          "
        >
          Students
        </h1>

        <button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          className="bg-linear-to-r from-blue-600 to-purple-600
            text-white px-6 py-3 rounded-lg font-(--font-body)"
        >
          + Add Student
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-500">
              <th>Name</th>
              <th>Email</th>
              <th>Course</th>
              <th>Campus</th>
              <th>Date</th>
              <th>Time</th>
              <th>Teacher</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {students.map((s) => (
              <tr key={s.id}>
                <td className="py-2">{s.name}</td>
                <td>{s.email}</td>
                <td>{s.course}</td>
                <td>{s.campus}</td>
                <td>{s.date}</td>
                <td>{s.time}</td>
                <td>{s.teacher}</td>
                <td className="flex gap-4 py-2">
                  <button
                    onClick={() => {
                      setEditing(s);
                      setOpen(true);
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal
        title={editing ? "Edit Student" : "Add Student"}
        isOpen={open}
        onClose={() => {
          setOpen(false);
          setEditing(null);
        }}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            defaultValue={editing?.name}
            placeholder="Student Name"
            className="w-full p-3 rounded-lg border"
            required
          />

          <input
            name="email"
            type="email"
            defaultValue={editing?.email}
            placeholder="Email"
            className="w-full p-3 rounded-lg border"
            required
          />

          <select
            name="course"
            defaultValue={editing?.course}
            className="w-full p-3 rounded-lg border"
            required
          >
            <option value="">Select Course</option>

            {courses.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            name="campus"
            defaultValue={editing?.campus}
            className="w-full p-3 rounded-lg border"
            required
          >
            <option value="">Select Campus</option>

            {campuses.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <input
            name="date"
            type="date"
            defaultValue={editing?.date}
            className="w-full p-3 rounded-lg border"
            required
          />

          <input
            name="time"
            type="time"
            defaultValue={editing?.time}
            className="w-full p-3 rounded-lg border"
            required
          />

          <select
            name="teacher"
            defaultValue={editing?.teacher}
            className="w-full p-3 rounded-lg border"
            required
          >
            <option>Select Teacher</option>

            {teachers.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="w-full bg-linear-to-r from-blue-600 to-purple-600
              text-white py-3 rounded-lg font-(--font-body)"
          >
            {editing ? "Update Student" : "Save Student"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
