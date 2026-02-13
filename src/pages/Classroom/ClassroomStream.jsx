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
// Ensure your mockUser has: { id: "...", name: "...", role: "teacher" | "student" | "supervisor" }
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
  Award,
  Layout,
  Pin,
  ExternalLink,
} from "lucide-react";

/* --- Reusable Modal Component --- */
const Modal = ({ isOpen, onClose, title, children, theme }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div
        className={`w-full max-w-md rounded-2xl shadow-2xl border ${theme.surface} ${theme.border} p-6 animate-in fade-in zoom-in duration-200`}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-lg font-bold ${theme.textPrimary}`}>{title}</h3>
          <button
            onClick={onClose}
            className={`p-1 rounded-full ${theme.hover} ${theme.textSecondary}`}
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const Classroom = ({ darkMode }) => {
  const { id } = useParams();

  // --- Refs ---
  const postFileInputRef = useRef(null);
  const submissionFileInputRef = useRef(null);

  // --- Core State ---
  const [classData, setClassData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [roster, setRoster] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("stream");

  // --- Interaction State ---
  const [newPostContent, setNewPostContent] = useState("");
  const [pendingAttachments, setPendingAttachments] = useState([]);
  const [isPinningPost, setIsPinningPost] = useState(false);

  // --- Modal & Action State ---
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentText, setCommentText] = useState("");

  // Submission & Grading
  const [activeSubmissionPostId, setActiveSubmissionPostId] = useState(null);
  const [viewSubmissionsPostId, setViewSubmissionsPostId] = useState(null);
  const [submissionFiles, setSubmissionFiles] = useState([]);

  // Custom Modals State
  const [modalState, setModalState] = useState({ type: null, context: null });
  const [tempLinkInput, setTempLinkInput] = useState({ url: "", name: "" });
  const [tempGradeInput, setTempGradeInput] = useState("");

  // --- Theme Configuration ---
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

  // --- Data Fetching ---
  useEffect(() => {
    if (!id) return;

    const unsubClass = onSnapshot(doc(db, "classes", id), (docSnap) => {
      setClassData(
        docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null,
      );
      setLoading(false);
    });

    const postsRef = collection(db, "classes", id, "posts");
    const qPosts = query(postsRef, orderBy("createdAt", "desc"));

    const unsubPosts = onSnapshot(qPosts, (snapshot) => {
      const fetchedPosts = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      // Client-side sort: Pinned first, then by date
      const sorted = fetchedPosts.sort((a, b) => {
        if (a.pinned === b.pinned) return 0;
        return a.pinned ? -1 : 1;
      });
      setPosts(sorted);
    });

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

  // --- Permissions Helpers ---
  const isTeacher = mockUser.role === "teacher";
  const isSupervisor = mockUser.role === "supervisor";

  const canPost = isTeacher;
  const canSubmit = !isTeacher && !isSupervisor; // Students only
  const canGrade = isTeacher;

  // --- Handlers: Post Creation ---
  const handleFileSelect = (e, isSubmission = false) => {
    const file = e.target.files[0];
    if (!file) return;

    // NOTE: In production, upload to Firebase Storage here and get the real URL.
    const resource = {
      type: "file",
      name: file.name,
      url: URL.createObjectURL(file),
      mimeType: file.type,
    };

    if (isSubmission) {
      setSubmissionFiles((prev) => [...prev, resource]);
    } else {
      setPendingAttachments((prev) => [...prev, resource]);
    }

    if (postFileInputRef.current) postFileInputRef.current.value = "";
    if (submissionFileInputRef.current)
      submissionFileInputRef.current.value = "";
  };

  const handleAddLink = () => {
    if (!tempLinkInput.url.trim()) return;

    const resource = {
      type: "link",
      name: tempLinkInput.name || tempLinkInput.url,
      url: tempLinkInput.url.startsWith("http")
        ? tempLinkInput.url
        : `https://${tempLinkInput.url}`,
    };

    if (modalState.context === "submission") {
      setSubmissionFiles((prev) => [...prev, resource]);
    } else {
      setPendingAttachments((prev) => [...prev, resource]);
    }
    closeModal();
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim() && pendingAttachments.length === 0) return;
    try {
      await addDoc(collection(db, "classes", id, "posts"), {
        author: mockUser.name,
        authorId: mockUser.id,
        role: mockUser.role,
        content: newPostContent,
        createdAt: serverTimestamp(),
        pinned: isPinningPost,
        likes: [],
        comments: [],
        submissions: [],
        resources: pendingAttachments,
      });
      setNewPostContent("");
      setPendingAttachments([]);
      setIsPinningPost(false);
    } catch (err) {
      console.error(err);
    }
  };

  // --- Handlers: Interactions ---
  const handleDeletePost = async (postId) => {
    // We can use a custom modal here too, but window.confirm is acceptable for deletion safety
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    await deleteDoc(doc(db, "classes", id, "posts", postId));
  };

  const handleToggleLike = async (postId, likes = []) => {
    const postRef = doc(db, "classes", id, "posts", postId);
    const hasLiked = likes.includes(mockUser.id);
    await updateDoc(postRef, {
      likes: hasLiked ? arrayRemove(mockUser.id) : arrayUnion(mockUser.id),
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

  // --- Handlers: Submissions & Grading ---
  const handleSubmitWork = async (postId) => {
    if (submissionFiles.length === 0) return;
    const postRef = doc(db, "classes", id, "posts", postId);

    await updateDoc(postRef, {
      submissions: arrayUnion({
        studentId: mockUser.id,
        studentName: mockUser.name,
        attachments: submissionFiles,
        submittedAt: new Date().toISOString(),
        grade: null,
      }),
    });
    setSubmissionFiles([]);
    setActiveSubmissionPostId(null);
  };

  const handleAssignGrade = async () => {
    if (!tempGradeInput || !modalState.context) return;
    const { postId, studentId, submissions } = modalState.context;

    const updatedSubmissions = submissions.map((s) =>
      s.studentId === studentId ? { ...s, grade: tempGradeInput } : s,
    );

    await updateDoc(doc(db, "classes", id, "posts", postId), {
      submissions: updatedSubmissions,
    });
    closeModal();
  };

  // --- Modal Helpers ---
  const openLinkModal = (context) => {
    setTempLinkInput({ url: "", name: "" });
    setModalState({ type: "addLink", context });
  };

  const openGradeModal = (postId, studentId, submissions) => {
    const current =
      submissions.find((s) => s.studentId === studentId)?.grade || "";
    setTempGradeInput(current);
    setModalState({
      type: "grade",
      context: { postId, studentId, submissions },
    });
  };

  const closeModal = () => {
    setModalState({ type: null, context: null });
    setTempLinkInput({ url: "", name: "" });
    setTempGradeInput("");
  };

  // --- Render Helpers ---
  const renderAttachmentIcon = (type) => {
    if (type === "link")
      return <LinkIcon size={14} className="text-blue-500" />;
    return <FileText size={14} className="text-orange-500" />;
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

      {/* Navigation */}
      <div
        className={`border-b sticky top-0 z-20 ${theme.surface} ${theme.border}`}
      >
        <div className="max-w-7xl mx-auto px-6 flex gap-8">
          {["stream", "roster"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 text-xs font-black uppercase tracking-widest transition-all border-b-2 ${
                activeTab === tab
                  ? "border-blue-500 text-blue-500"
                  : "border-transparent text-gray-400"
              }`}
            >
              {tab === "stream" ? "Stream" : "Class Roster"}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Sidebar */}
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
                  <p className="text-[10px] opacity-50">Total Activity</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Feed */}
        <div className="lg:col-span-3">
          {activeTab === "stream" ? (
            <div className="space-y-6">
              {/* Teacher Post Creator */}
              {canPost && (
                <div
                  className={`p-6 rounded-2xl border ${theme.surface} ${theme.border}`}
                >
                  <textarea
                    className="w-full bg-transparent outline-none resize-none mb-4 text-lg"
                    placeholder="Announce something to your class..."
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                  />

                  {/* Pending Attachments List */}
                  {pendingAttachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {pendingAttachments.map((att, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${theme.border} bg-opacity-50 ${theme.bg}`}
                        >
                          {renderAttachmentIcon(att.type)}
                          <span className="text-xs font-medium max-w-[150px] truncate">
                            {att.name}
                          </span>
                          <button
                            onClick={() =>
                              setPendingAttachments((prev) =>
                                prev.filter((_, idx) => idx !== i),
                              )
                            }
                            className="text-red-400 hover:text-red-500 ml-1"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div
                    className={`flex justify-between items-center border-t pt-4 ${theme.divider}`}
                  >
                    <div className="flex gap-2">
                      <button
                        onClick={() => postFileInputRef.current.click()}
                        className={`p-2 rounded-full ${theme.hover} relative group`}
                      >
                        <Paperclip
                          size={20}
                          className="text-gray-400 group-hover:text-blue-500"
                        />
                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] bg-black text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                          File
                        </span>
                      </button>
                      <button
                        onClick={() => openLinkModal("post")}
                        className={`p-2 rounded-full ${theme.hover} relative group`}
                      >
                        <LinkIcon
                          size={20}
                          className="text-gray-400 group-hover:text-blue-500"
                        />
                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] bg-black text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                          Link
                        </span>
                      </button>
                      <button
                        onClick={() => setIsPinningPost(!isPinningPost)}
                        className={`p-2 rounded-full ${theme.hover} relative group ${isPinningPost ? "bg-blue-500/10" : ""}`}
                      >
                        <Pin
                          size={20}
                          className={
                            isPinningPost
                              ? "text-blue-500 fill-blue-500"
                              : "text-gray-400 group-hover:text-blue-500"
                          }
                        />
                      </button>
                      <input
                        type="file"
                        hidden
                        ref={postFileInputRef}
                        onChange={(e) => handleFileSelect(e, false)}
                      />
                    </div>
                    <button
                      onClick={handleCreatePost}
                      className={`${theme.accentBg} px-6 py-2 rounded-xl text-white font-bold text-sm shadow-lg shadow-blue-500/20`}
                    >
                      Post
                    </button>
                  </div>
                </div>
              )}

              {/* Posts Feed */}
              {posts.map((post) => (
                <div
                  key={post.id}
                  className={`group p-6 rounded-2xl border ${theme.surface} ${theme.border} relative transition-all hover:border-blue-500/30`}
                >
                  {post.pinned && (
                    <div className="absolute top-4 right-4 text-blue-500">
                      <Pin size={16} fill="currentColor" />
                    </div>
                  )}

                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center font-bold text-white shadow-md">
                        {post.author[0]}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold flex items-center gap-2">
                          {post.author}
                          {post.role === "teacher" && (
                            <span className="bg-blue-500/10 text-blue-500 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                              Teacher
                            </span>
                          )}
                        </h4>
                        <p className={`text-xs ${theme.textSecondary}`}>
                          {post.createdAt?.toDate
                            ? post.createdAt.toDate().toLocaleDateString()
                            : "Just now"}
                        </p>
                      </div>
                    </div>

                    {/* Only author can delete, Supervisors cannot delete */}
                    {post.authorId === mockUser.id && !isSupervisor && (
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                  <p className="text-sm mb-4 whitespace-pre-wrap leading-relaxed">
                    {post.content}
                  </p>

                  {/* Post Resources */}
                  {post.resources?.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                      {post.resources.map((res, i) => (
                        <a
                          key={i}
                          href={res.url}
                          target="_blank"
                          rel="noreferrer"
                          className={`flex items-center gap-3 p-3 rounded-xl border ${theme.border} ${theme.hover} transition-colors group/file`}
                        >
                          <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                            {renderAttachmentIcon(res.type)}
                          </div>
                          <div className="flex-1 overflow-hidden">
                            <p className="text-xs font-bold truncate">
                              {res.name}
                            </p>
                            <p className="text-[10px] text-gray-500 uppercase">
                              {res.type}
                            </p>
                          </div>
                          <ExternalLink
                            size={14}
                            className="opacity-0 group-hover/file:opacity-100 transition-opacity text-gray-400"
                          />
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Actions Bar */}
                  <div
                    className={`flex items-center gap-6 pt-4 border-t ${theme.divider}`}
                  >
                    <button
                      onClick={() => handleToggleLike(post.id, post.likes)}
                      className={`flex items-center gap-2 text-xs font-bold transition-colors ${post.likes?.includes(mockUser.id) ? "text-red-500" : theme.textSecondary}`}
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
                      className={`flex items-center gap-2 text-xs font-bold transition-colors ${theme.textSecondary}`}
                    >
                      <MessageCircle size={18} /> {post.comments?.length || 0}
                    </button>

                    {/* Right Side Actions: Turn In or View Submissions */}
                    <div className="ml-auto">
                      {isTeacher || isSupervisor ? (
                        <button
                          onClick={() =>
                            setViewSubmissionsPostId(
                              viewSubmissionsPostId === post.id
                                ? null
                                : post.id,
                            )
                          }
                          className={`text-xs font-black uppercase tracking-wider flex items-center gap-2 ${viewSubmissionsPostId === post.id ? "text-blue-500" : "text-gray-400 hover:text-blue-500"}`}
                        >
                          <Users size={16} /> {post.submissions?.length || 0}{" "}
                          Subs
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            setActiveSubmissionPostId(
                              activeSubmissionPostId === post.id
                                ? null
                                : post.id,
                            )
                          }
                          className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-lg transition-colors ${
                            post.submissions?.some(
                              (s) => s.studentId === mockUser.id,
                            )
                              ? "bg-green-500/10 text-green-500"
                              : "bg-blue-500/10 text-blue-500"
                          }`}
                        >
                          {post.submissions?.some(
                            (s) => s.studentId === mockUser.id,
                          ) ? (
                            <CheckCircleIcon />
                          ) : (
                            <Upload size={16} />
                          )}
                          {post.submissions?.some(
                            (s) => s.studentId === mockUser.id,
                          )
                            ? "Submitted"
                            : "Turn In"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* --- Teacher/Supervisor View: Submission List --- */}
                  {viewSubmissionsPostId === post.id &&
                    (isTeacher || isSupervisor) && (
                      <div
                        className={`mt-4 space-y-2 p-4 rounded-xl ${theme.input}`}
                      >
                        <h5 className="text-xs font-black uppercase tracking-widest mb-3 opacity-50">
                          Student Submissions
                        </h5>
                        {post.submissions?.length === 0 && (
                          <p className="text-xs italic text-gray-500">
                            No submissions yet.
                          </p>
                        )}
                        {post.submissions?.map((s, i) => (
                          <div
                            key={i}
                            className={`p-3 rounded-lg border ${theme.border} ${theme.surface} flex flex-col gap-2`}
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold flex items-center gap-2">
                                <div className="w-6 h-6 rounded-full bg-gray-500/20 flex items-center justify-center text-[10px]">
                                  {s.studentName[0]}
                                </div>
                                {s.studentName}
                              </span>
                              <div className="flex items-center gap-3">
                                {s.grade ? (
                                  <span className="text-xs font-black text-emerald-500 px-2 py-1 bg-emerald-500/10 rounded">
                                    {s.grade}
                                  </span>
                                ) : (
                                  canGrade && (
                                    <button
                                      onClick={() =>
                                        openGradeModal(
                                          post.id,
                                          s.studentId,
                                          post.submissions,
                                        )
                                      }
                                      className="text-[10px] font-bold text-blue-500 flex items-center gap-1 hover:underline"
                                    >
                                      <Award size={14} /> Grade
                                    </button>
                                  )
                                )}
                              </div>
                            </div>

                            {/* Attachments for this student */}
                            <div className="flex flex-wrap gap-2 mt-1">
                              {s.attachments?.map((att, idx) => (
                                <a
                                  key={idx}
                                  href={att.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className={`text-[10px] flex items-center gap-1 px-2 py-1 rounded bg-gray-500/10 hover:bg-blue-500/10 hover:text-blue-500 transition-colors ${theme.textSecondary}`}
                                >
                                  {renderAttachmentIcon(att.type)} {att.name}{" "}
                                  <ExternalLink size={10} />
                                </a>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                  {/* --- Student View: Submission Area --- */}
                  {activeSubmissionPostId === post.id && canSubmit && (
                    <div
                      className={`mt-4 p-6 rounded-2xl border-2 border-dashed ${theme.border} bg-gray-500/5`}
                    >
                      <div className="text-center mb-4">
                        <p className="text-sm font-bold mb-1">Your Work</p>
                        <p className={`text-xs ${theme.textSecondary}`}>
                          Upload files or add links to turn in.
                        </p>
                      </div>

                      {/* List staged files */}
                      {submissionFiles.length > 0 && (
                        <div className="space-y-2 mb-4">
                          {submissionFiles.map((file, i) => (
                            <div
                              key={i}
                              className={`flex items-center justify-between p-2 rounded-lg ${theme.surface} border ${theme.border}`}
                            >
                              <div className="flex items-center gap-2 overflow-hidden">
                                {renderAttachmentIcon(file.type)}
                                <span className="text-xs truncate">
                                  {file.name}
                                </span>
                              </div>
                              <button
                                onClick={() =>
                                  setSubmissionFiles((prev) =>
                                    prev.filter((_, idx) => idx !== i),
                                  )
                                }
                                className="text-red-400 hover:text-red-500"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex justify-center gap-3 mb-4">
                        <button
                          onClick={() => submissionFileInputRef.current.click()}
                          className={`px-3 py-2 rounded-lg border ${theme.border} ${theme.surface} text-xs font-bold hover:border-blue-500 transition-colors flex items-center gap-2`}
                        >
                          <Upload size={14} /> File
                        </button>
                        <button
                          onClick={() => openLinkModal("submission")}
                          className={`px-3 py-2 rounded-lg border ${theme.border} ${theme.surface} text-xs font-bold hover:border-blue-500 transition-colors flex items-center gap-2`}
                        >
                          <LinkIcon size={14} /> Link
                        </button>
                        <input
                          type="file"
                          hidden
                          ref={submissionFileInputRef}
                          onChange={(e) => handleFileSelect(e, true)}
                        />
                      </div>

                      <button
                        onClick={() => handleSubmitWork(post.id)}
                        disabled={submissionFiles.length === 0}
                        className={`w-full py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                          submissionFiles.length > 0
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                            : "bg-gray-500/20 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        {submissionFiles.length > 0
                          ? `Turn In (${submissionFiles.length})`
                          : "Add attachments"}
                      </button>
                    </div>
                  )}

                  {/* Comments Section */}
                  {(activeCommentPostId === post.id ||
                    post.comments?.length > 0) && (
                    <div
                      className={`mt-6 pt-6 border-t ${theme.divider} animate-in slide-in-from-top-2`}
                    >
                      <div className="space-y-4 mb-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {post.comments?.map((c) => (
                          <div key={c.id} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-500/10 flex items-center justify-center text-[10px] font-bold">
                              {c.userName[0]}
                            </div>
                            <div
                              className={`flex-1 p-3 rounded-2xl rounded-tl-none text-xs ${theme.input}`}
                            >
                              <div className="flex justify-between items-baseline mb-1">
                                <span className="font-bold">{c.userName}</span>
                                <span className="text-[10px] opacity-50">
                                  {new Date(c.timestamp).toLocaleTimeString(
                                    [],
                                    { hour: "2-digit", minute: "2-digit" },
                                  )}
                                </span>
                              </div>
                              <p>{c.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2 items-center">
                        <input
                          className={`flex-1 px-4 py-2.5 rounded-full text-xs outline-none border ${theme.input} focus:border-blue-500 transition-colors`}
                          placeholder="Write a comment..."
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          onKeyDown={(e) =>
                            e.key === "Enter" && handlePostComment(post.id)
                          }
                        />
                        <button
                          onClick={() => handlePostComment(post.id)}
                          className={`p-2.5 rounded-full text-blue-500 hover:bg-blue-500/10 transition-colors`}
                        >
                          <Send size={18} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* Roster View */
            <div
              className={`rounded-2xl border ${theme.surface} ${theme.border} overflow-hidden`}
            >
              <div className="p-6 border-b border-gray-800/10">
                <h3 className="text-lg font-black tracking-tight">
                  Class Roster
                </h3>
              </div>
              <div className="divide-y divide-gray-800/10">
                {roster.map((student) => (
                  <div
                    key={student.id}
                    className={`p-4 flex items-center justify-between ${theme.hover}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-sm">
                        {student.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{student.name}</p>
                        <p className={`text-[10px] ${theme.textSecondary}`}>
                          ID: {student.id.slice(0, 8)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* --- Modals --- */}

      {/* Add Link Modal */}
      <Modal
        isOpen={modalState.type === "addLink"}
        onClose={closeModal}
        title="Add Link"
        theme={theme}
      >
        <div className="space-y-4">
          <div>
            <label
              className={`text-xs font-bold uppercase mb-1 block ${theme.textSecondary}`}
            >
              URL
            </label>
            <input
              className={`w-full p-2 rounded-lg text-sm outline-none border ${theme.input} focus:border-blue-500`}
              placeholder="https://drive.google.com/..."
              value={tempLinkInput.url}
              onChange={(e) =>
                setTempLinkInput({ ...tempLinkInput, url: e.target.value })
              }
              autoFocus
            />
          </div>
          <div>
            <label
              className={`text-xs font-bold uppercase mb-1 block ${theme.textSecondary}`}
            >
              Display Text (Optional)
            </label>
            <input
              className={`w-full p-2 rounded-lg text-sm outline-none border ${theme.input} focus:border-blue-500`}
              placeholder="Project Guidelines PDF"
              value={tempLinkInput.name}
              onChange={(e) =>
                setTempLinkInput({ ...tempLinkInput, name: e.target.value })
              }
            />
          </div>
          <button
            onClick={handleAddLink}
            className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg text-sm mt-2"
          >
            Add Link
          </button>
        </div>
      </Modal>

      {/* Grade Modal */}
      <Modal
        isOpen={modalState.type === "grade"}
        onClose={closeModal}
        title="Assign Grade"
        theme={theme}
      >
        <div className="space-y-4">
          <p className={`text-sm ${theme.textSecondary}`}>
            Enter grade for this student submission.
          </p>
          <input
            className={`w-full p-3 rounded-lg text-lg font-bold text-center outline-none border ${theme.input} focus:border-blue-500`}
            placeholder="e.g. 95/100 or A"
            value={tempGradeInput}
            onChange={(e) => setTempGradeInput(e.target.value)}
            autoFocus
          />
          <button
            onClick={handleAssignGrade}
            className="w-full bg-emerald-600 text-white font-bold py-2 rounded-lg text-sm mt-2"
          >
            Save Grade
          </button>
        </div>
      </Modal>
    </div>
  );
};

// Helper Icon Component
const CheckCircleIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export default Classroom;
