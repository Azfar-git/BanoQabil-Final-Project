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

export default function Teachers() {
  const { roles } = useContext(RolesContext);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [teachers, setTeachers] = useState([]);

  const [courses, setCourses] = useState([]);
  const [campuses, setCampuses] = useState([]);

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

  useEffect(() => {
    fetchTeachers();
    fetchCourses();
    fetchCampuses();
  }, []);

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
    const getRole = roles.find((item) => item.name === userRoles.teacher);
    const form = e.target;

    const teacherData = {
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value,
      gender: form.gender.value,
      qualification: form.qualification.value,
      experience: form.experience.value,
      specialization: form.specialization.value,
      course: form.course.value,
      campus: form.campus.value,
      joiningDate: form.joiningDate.value,
      status: form.status.value,
      roleName: getRole.name,
      roleId: getRole.id,
    };

    if (editing) {
      const teacherRef = doc(db, "users", editing.id);
      await updateDoc(teacherRef, teacherData);
    } else {
      await addDoc(collection(db, "users"), {
        ...teacherData,
        createdAt: new Date(),
      });
    }

    setOpen(false);
    setEditing(null);
    form.reset();
    fetchTeachers();
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this teacher?")) {
      await deleteDoc(doc(db, "users", id));
      fetchTeachers();
    }
  };

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1
          className="text-2xl font-bold font-(--font-heading)
          bg-gradient-to-r from-blue-600 to-purple-600
          bg-clip-text text-transparent"
        >
          Teachers
        </h1>

        <button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          className="bg-gradient-to-r from-blue-600 to-purple-600
            text-white px-6 py-3 rounded-lg font-(--font-body)"
        >
          + Add Teacher
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500">
              <th className="py-3">Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Course</th>
              <th>Campus</th>
              <th>Qualification</th>
              <th>Experience</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {teachers.map((t) => (
              <tr key={t.id}>
                <td className="py-3 font-medium">{t.name}</td>
                <td>{t.email}</td>
                <td>{t.phone}</td>
                <td>{t.course}</td>
                <td>{t.campus}</td>
                <td>{t.qualification}</td>
                <td>{t.experience}</td>
                <td>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${
                      t.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {t.status}
                  </span>
                </td>
                <td className="flex gap-3 py-3">
                  <button
                    onClick={() => {
                      setEditing(t);
                      setOpen(true);
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(t.id)}
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
        title={editing ? "Edit Teacher" : "Add Teacher"}
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
            placeholder="Teacher Name"
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

          <input
            name="phone"
            defaultValue={editing?.phone}
            placeholder="Phone Number"
            className="w-full p-3 rounded-lg border"
            required
          />

          <select
            name="gender"
            defaultValue={editing?.gender}
            className="w-full p-3 rounded-lg border"
            required
          >
            <option value="">Select Gender</option>
            <option>Male</option>
            <option>Female</option>
          </select>

          <input
            name="qualification"
            defaultValue={editing?.qualification}
            placeholder="Qualification (e.g., BS CS)"
            className="w-full p-3 rounded-lg border"
            required
          />

          <input
            name="experience"
            defaultValue={editing?.experience}
            placeholder="Experience (e.g., 3 years)"
            className="w-full p-3 rounded-lg border"
            required
          />

          <input
            name="specialization"
            defaultValue={editing?.specialization}
            placeholder="Specialization (e.g., React, AI)"
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
            name="joiningDate"
            type="date"
            defaultValue={editing?.joiningDate}
            className="w-full p-3 rounded-lg border"
            required
          />

          <select
            name="status"
            defaultValue={editing?.status}
            className="w-full p-3 rounded-lg border"
            required
          >
            <option value="">Select Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg"
          >
            {editing ? "Update Teacher" : "Save Teacher"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
