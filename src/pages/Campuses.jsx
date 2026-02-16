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


export default function Campuses() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [campuses, setCampuses] = useState([]);

  const fetchCampuses = async () => {
  const querySnapshot = await getDocs(collection(db, "campuses"));
  const data = querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
  setCampuses(data);
};

useEffect(() => {
  fetchCampuses();
}, []);


  const handleSubmit = async (e) => {
  e.preventDefault();
  const form = e.target;

  const campusData = {
    name: form.name.value,
    location: form.location.value,
  };

  if (editing) {
    // UPDATE
    const campusRef = doc(db, "campuses", editing.id);
    await updateDoc(campusRef, campusData);
  } else {
    // ADD
    await addDoc(collection(db, "campuses"), {
      ...campusData,
      createdAt: new Date(),
    });
  }

  setOpen(false);
  setEditing(null);
  form.reset();
  fetchCampuses(); // refresh data
};


  const handleDelete = async (id) => {
  if (confirm("Are you sure you want to delete this campus?")) {
    await deleteDoc(doc(db, "campuses", id));
    fetchCampuses();
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
          Campuses
        </h1>

        <button
          onClick={() => {
            setEditing(null);
            setOpen(true);
          }}
          className="bg-gradient-to-r from-blue-600 to-purple-600
            text-white px-6 py-3 rounded-lg font-(--font-body)"
        >
          + Add Campus
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="text-gray-500">
              <th>Name</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {campuses.map((c) => (
              <tr key={c.id}>
                <td className="py-2">{c.name}</td>
                <td>{c.location}</td>
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
        title={editing ? "Edit Campus" : "Add Campus"}
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
            placeholder="Campus Name"
            className="w-full p-3 rounded-lg border"
            required
          />

          <input
            name="location"
            defaultValue={editing?.location}
            placeholder="Location"
            className="w-full p-3 rounded-lg border"
            required
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600
              text-white py-3 rounded-lg font-(--font-body)"
          >
            {editing ? "Update Campus" : "Save Campus"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
