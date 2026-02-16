import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate(); // ✅ only once

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      // 🔐 Firebase Auth Login
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );

      // 🔎 Firestore se user data lao
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();

        // 💾 localStorage me save karo
        localStorage.setItem("user", JSON.stringify(userData));

        navigate("/");
      } else {
        setError("User data not found in Firestore");
      }
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={handleLogin}
      className="max-w-md mx-auto mt-32 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-6 text-center">Dashboard Login</h2>

      {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

      <input
        type="email"
        placeholder="Email"
        className="w-full mb-4 p-3 rounded border dark:bg-gray-700"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full mb-6 p-3 rounded border dark:bg-gray-700"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}
