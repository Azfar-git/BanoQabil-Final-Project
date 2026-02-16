import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import Modal from "../components/Modal";

export default function Courses() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [courses, setCourses] = useState([]);

  // 🔹 READ
  const fetchCourses = async () => {
    const querySnapshot = await getDocs(collection(db, "courses"));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCourses(data);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // 🔹 ADD & UPDATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;

    const courseData = {
      name: form.name.value,
      duration: form.duration.value,
      description: form.description.value,
    };

    if (editing) {
      // UPDATE
      const courseRef = doc(db, "courses", editing.id);
      await updateDoc(courseRef, courseData);
    } else {
      // ADD
      await addDoc(collection(db, "courses"), {
        ...courseData,
        createdAt: new Date(),
      });
    }

    setOpen(false);
    setEditing(null);
    form.reset();
    fetchCourses();
  };

  // 🔹 DELETE
  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this course?")) {
      await deleteDoc(doc(db, "courses", id));
      fetchCourses();
    }
  };

  return (
    <div className="space-y-12">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Courses
        </h1>

        <button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg"
        >
          + Add Course
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-500">
              <th>Name</th>
              <th>Duration</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {courses.map((c) => (
              <tr key={c.id}>
                <td className="py-2">{c.name}</td>
                <td>{c.duration}</td>
                <td>{c.description}</td>
                <td className="flex gap-4 py-2">
                  <button
                    onClick={() => {
                      setEditing(c);
                      setOpen(true);
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c.id)}
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
        title={editing ? "Edit Course" : "Add Course"}
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
            placeholder="Course Name"
            className="w-full p-3 rounded-lg border"
            required
          />

          <input
            name="duration"
            defaultValue={editing?.duration}
            placeholder="Duration (e.g., 3 months)"
            className="w-full p-3 rounded-lg border"
            required
          />

          <textarea
            name="description"
            defaultValue={editing?.description}
            placeholder="Course Description"
            className="w-full p-3 rounded-lg border"
            required
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg"
          >
            {editing ? "Update Course" : "Save Course"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
