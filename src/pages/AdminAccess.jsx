import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/config";
import {
  doc,
  setDoc,
  collection,
  getDocs,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
function AdminAccess() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const [pagesAccess, setPagesAccess] = useState({
    dashboard: false,
    students: false,
    teachers: false,
    courses: false,
  });

  const handleDeleteUser = async (id) => {
    try {
      await deleteDoc(doc(db, "users", id));
      alert("User deleted successfully ✅");
      fetchUsers(); // refresh list
    } catch (error) {
      console.log(error.message);
    }
  };

  const [users, setUsers] = useState([]);

  const handleCheckbox = (e) => {
    setPagesAccess({
      ...pagesAccess,
      [e.target.name]: e.target.checked,
    });
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );

      await setDoc(doc(db, "users", userCredential.user.uid), {
        name,
        email,
        pagesAccess,
        createdAt: serverTimestamp(),
      });

      alert("User Created Successfully ✅");

      fetchUsers(); // refresh list

      setEmail("");
      setPassword("");
      setName("");
    } catch (error) {
      console.log(error.message);
    }
  };

  const fetchUsers = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const usersArray = [];

    querySnapshot.forEach((doc) => {
      usersArray.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    setUsers(usersArray);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h2
        className="text-2xl font-bold font-(--font-heading)
            bg-gradient-to-r from-blue-600 to-purple-600
            bg-clip-text text-transparent"
      >
        Create User
      </h2>

      <div className="max-w-2xl mx-auto mb-12">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
          {/* Heading: Montserrat & Gradient */}
          <h2 className="font-['Montserrat'] text-2xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Create New User
          </h2>

          <form
            onSubmit={handleCreateUser}
            className="font-['Inter'] space-y-6"
          >
            {/* Inputs Section */}
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Page Access Section */}
            <div className="pt-4">
              <h4 className="font-['Montserrat'] font-bold text-gray-800 dark:text-white mb-4">
                Page Access Permissions
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {["dashboard", "students", "teachers", "courses"].map(
                  (item) => (
                    <label
                      key={item}
                      className="flex items-center space-x-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        name={item}
                        onChange={handleCheckbox}
                        className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-600 dark:text-gray-400 capitalize group-hover:text-blue-600 transition-colors">
                        {item}
                      </span>
                    </label>
                  ),
                )}
              </div>
            </div>

            {/* Submit Button: Theme Gradient */}
            <div className="pt-6">
              <button
                type="submit"
                className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-10 rounded-lg font-medium hover:opacity-90 hover:shadow-lg"
              >
                Create User Account
              </button>
            </div>
          </form>
        </div>
      </div>

      <hr />

      <h2
        className="text-2xl  font-bold font-(--font-heading)
            bg-gradient-to-r from-blue-600 to-purple-600
            bg-clip-text text-transparent"
      >
        All Users
      </h2>

      {users.map((user) => (
        <div
          key={user.id}
          style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}
        >
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Dashboard Access: {user.pagesAccess?.dashboard ? "Yes" : "No"}</p>
          <p>Students Access: {user.pagesAccess?.students ? "Yes" : "No"}</p>
          <p>Teachers Access: {user.pagesAccess?.teachers ? "Yes" : "No"}</p>
          <p>Courses Access: {user.pagesAccess?.courses ? "Yes" : "No"}</p>
          <button
            onClick={() => handleDeleteUser(user.id)}
            style={{
              background: "red",
              color: "white",
              padding: "5px 10px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default AdminAccess;
