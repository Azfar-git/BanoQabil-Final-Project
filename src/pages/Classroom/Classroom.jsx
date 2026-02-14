import React, { useState, useEffect, createContext, useContext } from "react";
import { useParams, NavLink, Outlet } from "react-router-dom";
import toast from "react-hot-toast";
import { db } from "../../firebase/config";
import {
  doc,
  onSnapshot,
  collection,
  query,
  orderBy,
  addDoc,
  updateDoc,
  deleteDoc,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  writeBatch,
  increment,
} from "firebase/firestore";
import { mockUser } from "../../data/mockData";
import { MapPin, Calendar, Clock, Users, Layout } from "lucide-react";

const ClassroomContext = createContext(null);
export const useClassroom = () => useContext(ClassroomContext);

const Classroom = ({ darkMode }) => {
  const { id } = useParams();

  const theme = {
    bg: darkMode ? "bg-[#0f1117]" : "bg-[#f3f4f6]",
    surface: darkMode ? "bg-[#1e212b]" : "bg-white",
    border: darkMode ? "border-[#2d3242]" : "border-gray-200",
    textPrimary: darkMode ? "text-gray-100" : "text-gray-900",
    textSecondary: darkMode ? "text-gray-400" : "text-gray-500",
    input: darkMode
      ? "bg-[#151821] text-white border-[#2d3242]"
      : "bg-gray-50 text-gray-900 border-gray-200",
    divider: darkMode ? "border-gray-800" : "border-gray-100",
    hover: darkMode ? "hover:bg-gray-800" : "hover:bg-gray-100",
    accent: "text-blue-500",
    accentBg: "bg-blue-600",
  };

  const [classData, setClassData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [roster, setRoster] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Listen to class document
  useEffect(() => {
    if (!id) return;
    const unsubClass = onSnapshot(doc(db, "classes", id), (docSnap) => {
      setClassData(
        docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null,
      );
      setLoading(false);
    });
    return () => unsubClass();
  }, [id]);

  // 2. Listen to posts
  useEffect(() => {
    if (!id) return;
    const postsRef = collection(db, "classes", id, "posts");
    const qPosts = query(postsRef, orderBy("createdAt", "desc"));
    const unsubPosts = onSnapshot(qPosts, (snapshot) => {
      const fetchedPosts = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      const sorted = fetchedPosts.sort((a, b) =>
        a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1,
      );
      setPosts(sorted);
    });
    return () => unsubPosts();
  }, [id]);

  // 3. Set roster directly from classData.students (full objects)
  useEffect(() => {
    if (classData?.students && Array.isArray(classData.students)) {
      setRoster(classData.students);
    } else {
      setRoster([]);
    }
  }, [classData]);

  // 4. Listen to chat
  useEffect(() => {
    if (!id) return;
    const unsubChat = onSnapshot(
      query(collection(db, "classes", id, "chat"), orderBy("timestamp", "asc")),
      (snapshot) => {
        setMessages(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      },
    );
    return () => unsubChat();
  }, [id]);

  // --- Handlers with batch writes ---

  // studentObject must contain id, name, email
  const handleAddStudent = async (studentObject) => {
    if (!studentObject?.id) return;
    try {
      const batch = writeBatch(db);
      const classRef = doc(db, "classes", id);
      const userRef = doc(db, "users", studentObject.id);
      batch.update(classRef, {
        students: arrayUnion(studentObject),
        studentCount: increment(1),
      });
      batch.update(userRef, { enrolledClasses: arrayUnion(id) });
      await batch.commit();
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  const handleRemoveStudent = async (studentId) => {
    if (!studentId || !window.confirm("Remove this student from the class?"))
      return;
    try {
      // We need the full object to remove it via arrayUnion/arrayRemove.
      // Find the student object from current roster.
      const studentObj = roster.find((s) => s.id === studentId);
      if (!studentObj) return;

      const batch = writeBatch(db);
      const classRef = doc(db, "classes", id);
      const userRef = doc(db, "users", studentId);
      batch.update(classRef, {
        students: arrayRemove(studentObj),
        studentCount: increment(-1),
      });
      batch.update(userRef, { enrolledClasses: arrayRemove(id) });
      await batch.commit();
    } catch (error) {
      console.error("Error removing student:", error);
    }
  };

  // Inside Classroom.jsx, replace the handleCreatePost function:

  const handleCreatePost = async (content, attachments, pinned, dueDate) => {
    if (!content.trim() && attachments.length === 0) return;
    try {
      const postRef = await addDoc(collection(db, "classes", id, "posts"), {
        author: mockUser.name,
        authorId: mockUser.id,
        roleName: mockUser.role,
        content,
        createdAt: serverTimestamp(),
        pinned,
        dueDate: dueDate || null, // store due date if provided
        likes: [],
        comments: [],
        submissions: [],
        resources: attachments,
      });
      console.log("✅ Post created:", postRef.id);

      // Notifications (same as before, but we can optionally include due date in message)
      if (
        classData?.students &&
        Array.isArray(classData.students) &&
        classData.students.length > 0
      ) {
        const batch = writeBatch(db);
        const classTitle = classData.title || "your class";
        const trimmedContent =
          content.substring(0, 100) + (content.length > 100 ? "..." : "");
        let notifiedCount = 0;

        const allRecipients = [
          ...classData.students.map((s) => (typeof s === "object" ? s.id : s)),
        ];
        if (!allRecipients.includes(mockUser.id)) {
          allRecipients.push(mockUser.id);
        }

        allRecipients.forEach((recipientId) => {
          const userIdStr = String(recipientId);
          if (!userIdStr) return;

          let title, message;
          if (userIdStr === String(mockUser.id)) {
            title = `You posted in ${classTitle}`;
            message = `Your post: ${trimmedContent}`;
          } else {
            title = `New post in ${classTitle}`;
            message = trimmedContent;
            if (dueDate) {
              message += ` (Due: ${new Date(dueDate).toLocaleString()})`;
            }
          }

          const notifRef = doc(collection(db, "notifications"));
          batch.set(notifRef, {
            userId: userIdStr,
            title,
            message,
            read: false,
            createdAt: serverTimestamp(),
            link: `/classroom/${id}/stream`,
            classId: id,
            postId: postRef.id,
          });
          notifiedCount++;
        });

        if (notifiedCount > 0) {
          await batch.commit();
          console.log(
            `✅ Notifications created for ${notifiedCount} recipients`,
          );
          if (typeof toast !== "undefined")
            toast.success(`Notified ${notifiedCount} people`);
        }
      }
    } catch (error) {
      console.error("❌ Error creating post/notifications:", error);
      if (typeof toast !== "undefined") {
        toast.error("Failed to create notifications. Check console.");
      } else {
        alert("Failed to create notifications. See console.");
      }
    }
  };

  const handleDeletePost = async (postId) => {
    if (window.confirm("Delete this post?")) {
      await deleteDoc(doc(db, "classes", id, "posts", postId));
    }
  };

  const handleToggleLike = async (postId, likes = []) => {
    const hasLiked = likes.includes(mockUser.id);
    await updateDoc(doc(db, "classes", id, "posts", postId), {
      likes: hasLiked ? arrayRemove(mockUser.id) : arrayUnion(mockUser.id),
    });
  };

  const handlePostComment = async (postId, commentText) => {
    if (!commentText.trim()) return;
    await updateDoc(doc(db, "classes", id, "posts", postId), {
      comments: arrayUnion({
        id: Date.now().toString(),
        userId: mockUser.id,
        userName: mockUser.name,
        text: commentText,
        timestamp: new Date().toISOString(),
      }),
    });
  };

  const handleSubmitWork = async (postId, submissionFiles) => {
    await updateDoc(doc(db, "classes", id, "posts", postId), {
      submissions: arrayUnion({
        studentId: mockUser.id,
        studentName: mockUser.name,
        attachments: submissionFiles,
        submittedAt: new Date().toISOString(),
        grade: null,
      }),
    });
  };

  const handleAssignGrade = async (postId, studentId, submissions, grade) => {
    const updated = submissions.map((s) =>
      s.studentId === studentId ? { ...s, grade } : s,
    );
    await updateDoc(doc(db, "classes", id, "posts", postId), {
      submissions: updated,
    });
  };

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;
    await addDoc(collection(db, "classes", id, "chat"), {
      userId: mockUser.id,
      userName: mockUser.name,
      userRole: mockUser.role,
      text,
      timestamp: serverTimestamp(),
    });
  };

  const isTeacher = mockUser.role === "teacher";
  const isSupervisor = mockUser.role === "supervisor";

  const value = {
    classData,
    posts,
    roster, // now full objects
    messages,
    mockUser,
    theme,
    classId: id,
    canPost: isTeacher,
    canSubmit: !isTeacher && !isSupervisor,
    canGrade: isTeacher,
    handlers: {
      onAddStudent: handleAddStudent,
      onRemoveStudent: handleRemoveStudent,
      onCreatePost: handleCreatePost,
      onDeletePost: handleDeletePost,
      onToggleLike: handleToggleLike,
      onPostComment: handlePostComment,
      onSubmitWork: handleSubmitWork,
      onAssignGrade: handleAssignGrade,
      onSendMessage: handleSendMessage,
    },
  };

  if (loading) {
    return (
      <div className={`h-screen flex items-center justify-center ${theme.bg}`}>
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <ClassroomContext.Provider value={value}>
      <div className={`min-h-screen ${theme.bg} ${theme.textPrimary}`}>
        {/* Banner */}
        <div className="relative h-64 md:h-72 w-full overflow-hidden shadow-lg">
          <div
            className="absolute inset-0"
            style={{ backgroundColor: classData?.color || "#2563eb" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 w-full p-8 max-w-7xl mx-auto z-10 text-white">
            <span className="px-3 py-1 rounded-md text-[10px] font-bold bg-white/10 backdrop-blur-md border border-white/20 uppercase tracking-widest">
              {classData?.courseCode}
            </span>
            <h1 className="text-4xl md:text-5xl font-black mt-2">
              {classData?.name}
            </h1>
            <div className="flex flex-wrap gap-6 mt-4 text-white/90 text-sm font-medium">
              <span className="flex items-center gap-2">
                <MapPin size={16} /> {classData?.campus || "Main Campus"}
              </span>
              <span className="flex items-center gap-2">
                <Calendar size={16} /> {classData?.semester || "Spring 2026"}
              </span>
              <span className="flex items-center gap-2">
                <Clock size={16} /> {classData?.schedule}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div
          className={`border-b sticky top-0 z-20 ${theme.surface} ${theme.border}`}
        >
          <div className="max-w-7xl mx-auto px-6 flex gap-8">
            {["stream", "people", "chat"].map((tab) => (
              <NavLink
                key={tab}
                to={tab}
                className={({ isActive }) =>
                  `py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${
                    isActive
                      ? "border-blue-500 text-blue-500"
                      : "border-transparent text-gray-400"
                  }`
                }
              >
                {tab}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="hidden lg:block space-y-6">
            <div
              className={`p-6 rounded-2xl border ${theme.surface} ${theme.border}`}
            >
              <h3
                className={`text-xs font-black uppercase tracking-widest mb-4 ${theme.textSecondary}`}
              >
                Course Info
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Users size={18} className="text-blue-500" />
                  <div>
                    <p className="text-sm font-bold">
                      {roster.length} Students
                    </p>
                    <p className="text-[10px] opacity-50">Enrolled Members</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Layout size={18} className="text-indigo-500" />
                  <div>
                    <p className="text-sm font-bold">{posts.length} Posts</p>
                    <p className="text-[10px] opacity-50">Total Activity</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-3">
            <Outlet />
          </div>
        </div>
      </div>
    </ClassroomContext.Provider>
  );
};

export default Classroom;
