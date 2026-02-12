import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../firebase/config";
import {
  doc,
  onSnapshot,
  collection,
  addDoc,
  query,
  orderBy,
  serverTimestamp,
  updateDoc,
  arrayUnion,
  arrayRemove,
  deleteDoc,
  where,
  getDocs,
} from "firebase/firestore";
import { mockUser } from "../../data/mockData";
import {
  Heart,
  MessageCircle,
  Link as LinkIcon,
  FileText,
  X,
  Trash2,
  Paperclip,
  MapPin,
  Calendar,
  Clock,
  Send,
  Upload,
  Users,
  CheckCircle,
  Award,
  Layout,
} from "lucide-react";

const Classroom = ({ darkMode }) => {
  const { id } = useParams();

  // Refs
  const postFileInputRef = useRef(null);
  const submissionFileInputRef = useRef(null);

  // State
  const [classData, setClassData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("stream"); // "stream" or "roster"

  // Create Post State
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostFiles, setNewPostFiles] = useState([]);
  const [newPostLinks, setNewPostLinks] = useState([]);

  // Interaction State
  const [activeSubmissionPostId, setActiveSubmissionPostId] = useState(null);
  const [viewSubmissionsPostId, setViewSubmissionsPostId] = useState(null);
  const [subFiles, setSubFiles] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);

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
  };

  useEffect(() => {
    if (!id) return;

    // Fetch Class Metadata
    const unsubClass = onSnapshot(doc(db, "classes", id), (docSnap) => {
      setClassData(
        docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null,
      );
      setLoading(false);
    });

    // Fetch Stream Posts
    const postsRef = collection(db, "classes", id, "posts");
    const qPosts = query(postsRef, orderBy("createdAt", "desc"));
    const unsubPosts = onSnapshot(qPosts, (snapshot) =>
      setPosts(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }))),
    );

    // Fetch Roster (Enrolled Students)
    const fetchRoster = async () => {
      const usersRef = collection(db, "users");
      const qRoster = query(
        usersRef,
        where("enrolledClasses", "array-contains", id),
      );
      const querySnapshot = await getDocs(qRoster);
      setRoster(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      );
    };

    fetchRoster();

    return () => {
      unsubClass();
      unsubPosts();
    };
  }, [id]);

  // --- Handlers ---
  const handleCreatePost = async () => {
    if (!newPostContent.trim() && newPostFiles.length === 0) return;
    try {
      await addDoc(collection(db, "classes", id, "posts"), {
        author: mockUser.name,
        authorId: mockUser.id,
        role: mockUser.role,
        content: newPostContent,
        createdAt: serverTimestamp(),
        likes: [],
        comments: [],
        submissions: [],
        resources: { files: newPostFiles, links: newPostLinks },
      });
      setNewPostContent("");
      setNewPostFiles([]);
      setNewPostLinks([]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleLike = async (postId, likes = []) => {
    const postRef = doc(db, "classes", id, "posts", postId);
    await updateDoc(postRef, {
      likes: likes.includes(mockUser.id)
        ? arrayRemove(mockUser.id)
        : arrayUnion(mockUser.id),
    });
  };

  const handlePostComment = async (postId) => {
    if (!commentText.trim()) return;
    const postRef = doc(db, "classes", id, "posts", postId);
    const newComment = {
      id: Date.now().toString(),
      userId: mockUser.id,
      userName: mockUser.name,
      text: commentText,
      timestamp: new Date().toISOString(),
    };
    await updateDoc(postRef, { comments: arrayUnion(newComment) });
    setCommentText("");
  };

  const handleSubmitWork = async (postId) => {
    if (subFiles.length === 0) return alert("Attach work first.");
    const postRef = doc(db, "classes", id, "posts", postId);
    await updateDoc(postRef, {
      submissions: arrayUnion({
        studentId: mockUser.id,
        studentName: mockUser.name,
        files: subFiles,
        submittedAt: new Date().toISOString(),
        grade: null,
      }),
    });
    setSubFiles([]);
    setActiveSubmissionPostId(null);
  };

  const handleAssignGrade = async (postId, studentId) => {
    const grade = prompt("Enter Grade (e.g., A, 95%):");
    if (!grade) return;
    const postRef = doc(db, "classes", id, "posts", postId);
    const post = posts.find((p) => p.id === postId);
    const updatedSubmissions = post.submissions.map((s) =>
      s.studentId === studentId ? { ...s, grade } : s,
    );
    await updateDoc(postRef, { submissions: updatedSubmissions });
  };

  if (loading)
    return (
      <div className={`h-screen flex items-center justify-center ${theme.bg}`}>
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );

  return (
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

      {/* Navigation Tabs */}
      <div
        className={`border-b sticky top-0 z-20 ${theme.surface} ${theme.border}`}
      >
        <div className="max-w-7xl mx-auto px-6 flex gap-8">
          <button
            onClick={() => setActiveTab("stream")}
            className={`py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === "stream" ? "border-blue-500 text-blue-500" : "border-transparent text-gray-400"}`}
          >
            Stream
          </button>
          <button
            onClick={() => setActiveTab("roster")}
            className={`py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${activeTab === "roster" ? "border-blue-500 text-blue-500" : "border-transparent text-gray-400"}`}
          >
            Class Roster
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Stats/Info Card */}
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
                  <p className="text-sm font-bold">{roster.length} Students</p>
                  <p className="text-[10px] opacity-50">Enrolled Members</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Layout size={18} className="text-indigo-500" />
                <div>
                  <p className="text-sm font-bold">{posts.length} Posts</p>
                  <p className="text-[10px] opacity-50">
                    Total Stream Activity
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Content Feed */}
        <div className="lg:col-span-3">
          {activeTab === "stream" ? (
            <div className="space-y-6">
              {/* Teacher Post Creator */}
              {mockUser.role === "teacher" && (
                <div
                  className={`p-6 rounded-2xl border ${theme.surface} ${theme.border}`}
                >
                  <textarea
                    className="w-full bg-transparent outline-none resize-none mb-4 text-lg"
                    placeholder="Announce something or assign work..."
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                  />
                  <div className="flex flex-wrap gap-2 mb-4">
                    {newPostFiles.map((f, i) => (
                      <span
                        key={i}
                        className="flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500/10 text-blue-500 text-[10px] font-bold"
                      >
                        <FileText size={12} /> {f}{" "}
                        <X
                          size={14}
                          className="cursor-pointer"
                          onClick={() =>
                            setNewPostFiles(
                              newPostFiles.filter((_, idx) => idx !== i),
                            )
                          }
                        />
                      </span>
                    ))}
                  </div>
                  <div
                    className={`flex justify-between items-center border-t pt-4 ${theme.divider}`}
                  >
                    <div className="flex gap-2">
                      <button
                        onClick={() => postFileInputRef.current.click()}
                        className={`p-2 rounded-full ${theme.hover}`}
                      >
                        <Paperclip size={20} />
                      </button>
                      <input
                        type="file"
                        hidden
                        ref={postFileInputRef}
                        onChange={(e) =>
                          setNewPostFiles([
                            ...newPostFiles,
                            e.target.files[0].name,
                          ])
                        }
                      />
                      <button
                        onClick={() => {
                          const l = prompt("URL:");
                          if (l) setNewPostLinks([...newPostLinks, l]);
                        }}
                        className={`p-2 rounded-full ${theme.hover}`}
                      >
                        <LinkIcon size={20} />
                      </button>
                    </div>
                    <button
                      onClick={handleCreatePost}
                      className="bg-blue-600 px-6 py-2 rounded-xl text-white font-bold text-sm shadow-lg shadow-blue-500/20"
                    >
                      Post to Stream
                    </button>
                  </div>
                </div>
              )}

              {/* Posts Map */}
              {posts.map((post) => (
                <div
                  key={post.id}
                  className={`p-6 rounded-2xl border ${theme.surface} ${theme.border}`}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center font-bold text-blue-500">
                        {post.author[0]}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold">{post.author}</h4>
                        <p className={`text-xs ${theme.textSecondary}`}>
                          {post.createdAt?.toDate
                            ? post.createdAt.toDate().toLocaleDateString()
                            : "Just now"}
                        </p>
                      </div>
                    </div>
                    {post.authorId === mockUser.id && (
                      <button
                        onClick={async () =>
                          await deleteDoc(
                            doc(db, "classes", id, "posts", post.id),
                          )
                        }
                        className="text-red-500/30 hover:text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                  <p className="text-sm mb-4 whitespace-pre-wrap leading-relaxed">
                    {post.content}
                  </p>

                  {/* Resource Grid */}
                  {post.resources?.files?.length > 0 && (
                    <div
                      className={`grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6 p-4 rounded-xl ${theme.input}`}
                    >
                      {post.resources.files.map((file, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 p-2 bg-white/5 rounded-lg border border-white/5"
                        >
                          <FileText className="text-blue-500" size={16} />
                          <span className="text-xs font-medium truncate">
                            {file}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-6 pt-4 border-t border-gray-800/10">
                    <button
                      onClick={() => handleToggleLike(post.id, post.likes)}
                      className={`flex items-center gap-1 text-xs font-bold ${post.likes?.includes(mockUser.id) ? "text-red-500" : theme.textSecondary}`}
                    >
                      <Heart
                        size={18}
                        fill={
                          post.likes?.includes(mockUser.id)
                            ? "currentColor"
                            : "none"
                        }
                      />{" "}
                      {post.likes?.length || 0}
                    </button>
                    <button
                      onClick={() =>
                        setActiveCommentPostId(
                          activeCommentPostId === post.id ? null : post.id,
                        )
                      }
                      className={`flex items-center gap-1 text-xs font-bold ${theme.textSecondary}`}
                    >
                      <MessageCircle size={18} /> {post.comments?.length || 0}
                    </button>

                    {mockUser.role === "teacher" ? (
                      <button
                        onClick={() =>
                          setViewSubmissionsPostId(
                            viewSubmissionsPostId === post.id ? null : post.id,
                          )
                        }
                        className="ml-auto text-xs font-black text-blue-500 uppercase flex items-center gap-1"
                      >
                        <Users size={16} /> {post.submissions?.length || 0}{" "}
                        Submissions
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          setActiveSubmissionPostId(
                            activeSubmissionPostId === post.id ? null : post.id,
                          )
                        }
                        className="ml-auto flex items-center gap-2 text-xs font-bold text-blue-500"
                      >
                        <Upload size={16} />{" "}
                        {post.submissions?.some(
                          (s) => s.studentId === mockUser.id,
                        )
                          ? "Update Submission"
                          : "Turn In Work"}
                      </button>
                    )}
                  </div>

                  {/* Teacher View: Grades Drawer */}
                  {viewSubmissionsPostId === post.id && (
                    <div
                      className={`mt-4 space-y-2 p-4 rounded-xl ${theme.input}`}
                    >
                      {post.submissions?.map((s, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5"
                        >
                          <span className="text-xs font-bold">
                            {s.studentName}
                          </span>
                          <div className="flex items-center gap-4">
                            {s.grade ? (
                              <span className="text-xs font-black text-emerald-500">
                                {s.grade}
                              </span>
                            ) : (
                              <button
                                onClick={() =>
                                  handleAssignGrade(post.id, s.studentId)
                                }
                                className="text-[10px] font-bold text-blue-500 flex items-center gap-1"
                              >
                                <Award size={14} /> Grade
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Comment Thread */}
                  {(activeCommentPostId === post.id ||
                    post.comments?.length > 0) && (
                    <div className="mt-6 pt-6 border-t border-gray-800/10 space-y-4">
                      {post.comments?.map((c) => (
                        <div key={c.id} className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-[10px] font-bold">
                            {c.userName[0]}
                          </div>
                          <div
                            className={`flex-1 p-3 rounded-2xl text-xs ${theme.input}`}
                          >
                            <p className="font-bold mb-1">{c.userName}</p>
                            <p>{c.text}</p>
                          </div>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <input
                          className={`flex-1 px-4 py-2 rounded-full text-xs outline-none border ${theme.input} ${theme.border}`}
                          placeholder="Type a comment..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && handlePostComment(post.id)
                          }
                        />
                        <button
                          onClick={() => handlePostComment(post.id)}
                          className="p-2 text-blue-500"
                        >
                          <Send size={18} />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Submission Form */}
                  {activeSubmissionPostId === post.id && (
                    <div
                      className={`mt-4 p-6 rounded-2xl border-2 border-dashed ${theme.border} bg-blue-500/5 text-center`}
                    >
                      <p className="text-xs font-bold mb-4">
                        Select assignment files
                      </p>
                      <button
                        onClick={() => submissionFileInputRef.current.click()}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold"
                      >
                        <Upload size={14} className="inline mr-1" /> Browse
                      </button>
                      <input
                        type="file"
                        hidden
                        ref={submissionFileInputRef}
                        onChange={(e) =>
                          setSubFiles([...subFiles, e.target.files[0].name])
                        }
                      />
                      {subFiles.length > 0 && (
                        <button
                          onClick={() => handleSubmitWork(post.id)}
                          className="mt-4 block mx-auto text-xs underline font-bold"
                        >
                          Confirm {subFiles.length} File(s)
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* Class Roster View */
            <div
              className={`rounded-2xl border ${theme.surface} ${theme.border} overflow-hidden shadow-sm`}
            >
              <div className="p-6 border-b border-gray-800/10">
                <h3 className="text-lg font-black tracking-tight">
                  Enrolled Students
                </h3>
                <p className={`text-xs ${theme.textSecondary}`}>
                  Total: {roster.length} members
                </p>
              </div>
              <div className="divide-y divide-gray-800/10">
                {roster.map((student) => (
                  <div
                    key={student.id}
                    className="p-4 flex items-center justify-between hover:bg-gray-500/5 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm">
                        {student.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{student.name}</p>
                        <p className={`text-[10px] ${theme.textSecondary}`}>
                          ID: {student.id.slice(0, 8)}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 bg-gray-500/10 rounded">
                        Student
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Classroom;
