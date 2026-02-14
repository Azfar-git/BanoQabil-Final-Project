import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/config";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setAuthUser(currentUser);

        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));

        if (userDoc.exists()) {
          setUserData(userDoc.data());
        }
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (!authUser || !userData) {
    return <div className="pt-24 text-center">Loading...</div>;
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="container-custom max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-white">
          Dashboard
        </h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Welcome, {userData.fullName}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Student Dashboard
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Classroom Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div
              onClick={() => navigate("/classroom")}
              className="cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl p-6 shadow-lg hover:scale-105 transition-all duration-300"
            >
              <h3 className="text-xl font-bold mb-2">My Classroom</h3>
              <p className="opacity-90">
                Access your lectures, materials and assignments
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage; 
