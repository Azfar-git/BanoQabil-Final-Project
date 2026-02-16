import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  // const navigate = useNavigate();

  // const handleLogout = async () => {
  //   try {
  //     await signOut(auth); // 🔐 Firebase logout
  //     localStorage.removeItem("user"); // 🧹 Clear localStorage
  //     navigate("/login"); // 🔁 Redirect to login
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // };

  return (
    <header className="h-16 bg-white dark:bg-gray-800 shadow flex items-center justify-end px-6">
      <button
        // onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-1 rounded"
      >
        Logout
      </button>
    </header>
  );
}
