import React, { useState, useRef } from "react";
import { useClassroom } from "./Classroom";
import {
  Heart,
  MessageCircle,
  Link as LinkIcon,
  FileText,
  X,
  Trash2,
  Paperclip,
  Upload,
  Users,
  Award,
  Pin,
  ExternalLink,
  Send,
  Calendar,
  Clock,
} from "lucide-react";

const CheckCircleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const Modal = ({ isOpen, onClose, title, children, theme }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className={`w-full max-w-md rounded-2xl shadow-2xl border ${theme.surface} ${theme.border} p-6 scale-in-center`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className={`text-lg font-bold ${theme.textPrimary}`}>{title}</h3>
          <button onClick={onClose} className={`p-1 rounded-full ${theme.hover} ${theme.textSecondary}`}>
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const ClassroomStream = () => {
  const { posts, mockUser, theme, canPost, canSubmit, canGrade, handlers } = useClassroom();

  const [newPostContent, setNewPostContent] = useState("");
  const [pendingAttachments, setPendingAttachments] = useState([]);
  const [isPinningPost, setIsPinningPost] = useState(false);
  const [dueDate, setDueDate] = useState(""); // ISO string from datetime-local
  const [activeCommentPostId, setActiveCommentPostId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [activeSubmissionPostId, setActiveSubmissionPostId] = useState(null);
  const [viewSubmissionsPostId, setViewSubmissionsPostId] = useState(null);
  const [submissionFiles, setSubmissionFiles] = useState([]);
  const [modalState, setModalState] = useState({ type: null, context: null });
  const [tempLinkInput, setTempLinkInput] = useState({ url: "", name: "" });
  const [tempGradeInput, setTempGradeInput] = useState("");

  const postFileInputRef = useRef(null);
  const submissionFileInputRef = useRef(null);

  const renderAttachmentIcon = (type) => {
    return type === "link" ? <LinkIcon size={14} className="text-blue-500" /> : <FileText size={14} className="text-orange-500" />;
  };

  const handlePostCreate = async () => {
    if (!newPostContent.trim() && pendingAttachments.length === 0) return;
    // Convert dueDate to a Firestore timestamp (or null)
    const dueTimestamp = dueDate ? new Date(dueDate).toISOString() : null;
    await handlers.onCreatePost(newPostContent, pendingAttachments, isPinningPost, dueTimestamp);
    setNewPostContent("");
    setPendingAttachments([]);
    setIsPinningPost(false);
    setDueDate("");
  };

  const handleLocalPostComment = async (postId) => {
    if (!commentText.trim()) return;
    await handlers.onPostComment(postId, commentText);
    setCommentText("");
    setActiveCommentPostId(postId);
  };

  const handleFileSelect = (e, isSubmission = false) => {
    const file = e.target.files[0];
    if (!file) return;
    const resource = {
      type: "file",
      name: file.name,
      url: URL.createObjectURL(file),
      mimeType: file.type,
    };
    if (isSubmission) setSubmissionFiles((prev) => [...prev, resource]);
    else setPendingAttachments((prev) => [...prev, resource]);
    e.target.value = null;
  };

  const openLinkModal = (context) => {
    setTempLinkInput({ url: "", name: "" });
    setModalState({ type: "addLink", context });
  };

  const handleAddLink = () => {
    if (!tempLinkInput.url.trim()) return;
    const resource = {
      type: "link",
      name: tempLinkInput.name || tempLinkInput.url,
      url: tempLinkInput.url.startsWith("http") ? tempLinkInput.url : `https://${tempLinkInput.url}`,
    };
    if (modalState.context === "submission") setSubmissionFiles((prev) => [...prev, resource]);
    else setPendingAttachments((prev) => [...prev, resource]);
    closeModal();
  };

  const openGradeModal = (postId, studentId, submissions) => {
    const current = submissions.find((s) => s.studentId === studentId)?.grade || "";
    setTempGradeInput(current);
    setModalState({ type: "grade", context: { postId, studentId, submissions } });
  };

  const handleGradeSubmit = async () => {
    if (!tempGradeInput || !modalState.context) return;
    const { postId, studentId, submissions } = modalState.context;
    await handlers.onAssignGrade(postId, studentId, submissions, tempGradeInput);
    closeModal();
  };

  const closeModal = () => {
    setModalState({ type: null, context: null });
    setTempLinkInput({ url: "", name: "" });
    setTempGradeInput("");
  };

  // Helper to check if submission is late
  const isLateSubmission = (post, submittedAt) => {
    if (!post.dueDate) return false;
    return new Date(submittedAt) > new Date(post.dueDate);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Teacher Post Creator */}
      {canPost && (
        <div className={`p-6 rounded-2xl border ${theme.surface} ${theme.border} shadow-sm focus-within:ring-2 ring-blue-500/20 transition-all`}>
          <textarea
            className="w-full bg-transparent outline-none resize-none mb-4 text-lg font-medium placeholder:opacity-50"
            placeholder="Share an update or assignment..."
            rows={3}
            value={newPostContent}
            onChange={(e) => setNewPostContent(e.target.value)}
          />

          {pendingAttachments.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {pendingAttachments.map((att, i) => (
                <div key={i} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${theme.border} ${theme.bg} group`}>
                  {renderAttachmentIcon(att.type)}
                  <span className="text-xs font-bold max-w-[120px] truncate">{att.name}</span>
                  <button onClick={() => setPendingAttachments(prev => prev.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-500">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Due date picker */}
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={18} className="text-gray-400" />
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={`px-3 py-2 rounded-lg text-sm border ${theme.input} focus:border-blue-500 transition-colors`}
            />
            <span className="text-xs opacity-60">(optional due date)</span>
          </div>

          <div className={`flex justify-between items-center border-t pt-4 ${theme.divider}`}>
            <div className="flex gap-1">
              <button onClick={() => postFileInputRef.current.click()} className={`p-2.5 rounded-xl ${theme.hover} text-gray-400 hover:text-blue-500 transition-colors`} title="Attach File">
                <Paperclip size={20} />
              </button>
              <button onClick={() => openLinkModal("post")} className={`p-2.5 rounded-xl ${theme.hover} text-gray-400 hover:text-blue-500 transition-colors`} title="Add Link">
                <LinkIcon size={20} />
              </button>
              <button onClick={() => setIsPinningPost(!isPinningPost)} className={`p-2.5 rounded-xl ${theme.hover} transition-all ${isPinningPost ? "bg-blue-500/10 text-blue-500" : "text-gray-400"}`} title="Pin Post">
                <Pin size={20} fill={isPinningPost ? "currentColor" : "none"} />
              </button>
              <input type="file" hidden ref={postFileInputRef} onChange={(e) => handleFileSelect(e, false)} />
            </div>
            <button
              onClick={handlePostCreate}
              disabled={!newPostContent.trim() && pendingAttachments.length === 0}
              className={`${theme.accentBg} px-8 py-2.5 rounded-xl text-white font-black text-sm shadow-lg shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale`}
            >
              POST
            </button>
          </div>
        </div>
      )}

      {/* Posts Feed */}
      {posts.map((post) => {
        const hasSubmitted = post.submissions?.some((s) => s.studentId === mockUser.id);
        // Find current user's submission if any
        const mySubmission = post.submissions?.find((s) => s.studentId === mockUser.id);
        const isLate = mySubmission && isLateSubmission(post, mySubmission.submittedAt);

        return (
          <div key={post.id} className={`p-6 rounded-2xl border ${theme.surface} ${theme.border} relative transition-all hover:shadow-xl hover:shadow-black/5`}>
            {post.pinned && <div className="absolute top-6 right-6 text-blue-500 animate-pulse"><Pin size={18} fill="currentColor" /></div>}

            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black text-white shadow-lg shadow-blue-500/20">
                  {post.author?.[0] || "?"}
                </div>
                <div>
                  <h4 className="text-sm font-black flex items-center gap-2">
                    {post.author}
                    {post.roleName === "teacher" && <span className="bg-blue-500/10 text-blue-500 text-[9px] px-2 py-0.5 rounded-md font-black uppercase tracking-tighter">TEACHER</span>}
                  </h4>
                  <p className={`text-[10px] font-bold opacity-50 uppercase tracking-widest`}>
                    {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : "Recently"}
                  </p>
                  {post.dueDate && (
                    <p className={`text-[9px] font-bold flex items-center gap-1 mt-1 ${new Date(post.dueDate) < new Date() ? 'text-red-500' : 'text-green-500'}`}>
                      <Clock size={10} />
                      Due: {new Date(post.dueDate).toLocaleDateString()} {new Date(post.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>
              </div>
              {post.authorId === mockUser.id && (
                <button onClick={() => handlers.onDeletePost(post.id)} className="text-gray-300 hover:text-red-500 transition-colors p-2"><Trash2 size={18} /></button>
              )}
            </div>

            <p className="text-[15px] mb-5 whitespace-pre-wrap leading-relaxed opacity-90 font-medium">{post.content}</p>

            {/* Resources Grid */}
            {post.resources?.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                {post.resources.map((res, i) => (
                  <a key={i} href={res.url} target="_blank" rel="noreferrer" className={`flex items-center gap-3 p-3 rounded-xl border ${theme.border} ${theme.hover} transition-all border-l-4 border-l-blue-500 group`}>
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500 group-hover:scale-110 transition-transform">{renderAttachmentIcon(res.type)}</div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-xs font-black truncate">{res.name}</p>
                      <p className="text-[10px] opacity-50 uppercase font-bold">{res.type}</p>
                    </div>
                    <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" />
                  </a>
                ))}
              </div>
            )}

            <div className={`flex items-center gap-6 pt-4 border-t ${theme.divider}`}>
              <button onClick={() => handlers.onToggleLike(post.id, post.likes)} className={`flex items-center gap-2 text-xs font-black transition-colors ${post.likes?.includes(mockUser.id) ? "text-red-500" : "opacity-60 hover:opacity-100"}`}>
                <Heart size={20} fill={post.likes?.includes(mockUser.id) ? "currentColor" : "none"} /> {post.likes?.length || 0}
              </button>
              
              <button onClick={() => setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)} className="flex items-center gap-2 text-xs font-black opacity-60 hover:opacity-100 transition-colors">
                <MessageCircle size={20} /> {post.comments?.length || 0}
              </button>

              <div className="ml-auto flex gap-2">
                {canGrade ? (
                  <button onClick={() => setViewSubmissionsPostId(viewSubmissionsPostId === post.id ? null : post.id)} className={`text-xs font-black uppercase flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all ${viewSubmissionsPostId === post.id ? "bg-blue-600 text-white" : "bg-blue-500/10 text-blue-600"}`}>
                    <Users size={16} /> {post.submissions?.length || 0} Submissions
                  </button>
                ) : (
                  canSubmit && (
                    <button
                      onClick={() => setActiveSubmissionPostId(activeSubmissionPostId === post.id ? null : post.id)}
                      className={`flex items-center gap-2 text-xs font-black px-4 py-2 rounded-xl transition-all shadow-md active:scale-95 ${
                        hasSubmitted
                          ? isLate
                            ? "bg-orange-500/10 text-orange-600 shadow-orange-500/5"
                            : "bg-emerald-500/10 text-emerald-600 shadow-emerald-500/5"
                          : "bg-blue-600 text-white shadow-blue-500/20"
                      }`}
                    >
                      {hasSubmitted ? (
                        <>
                          <CheckCircleIcon /> {isLate ? "Late" : "Submitted"}
                        </>
                      ) : (
                        <>
                          <Upload size={16} /> Turn In
                        </>
                      )}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Submissions List for Teachers */}
            {viewSubmissionsPostId === post.id && canGrade && (
              <div className={`mt-4 space-y-2 p-4 rounded-2xl ${theme.bg} border ${theme.border} animate-in zoom-in-95 duration-200`}>
                <h5 className="text-[10px] font-black uppercase tracking-widest mb-3 opacity-40">Class Activity</h5>
                {post.submissions?.length === 0 ? <p className="text-xs italic opacity-50 py-4 text-center">No work turned in yet.</p> : (
                  post.submissions.map((s, i) => {
                    const late = isLateSubmission(post, s.submittedAt);
                    return (
                      <div key={i} className={`p-3 rounded-xl border ${theme.border} ${theme.surface} flex flex-col gap-3 shadow-sm`}>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-black flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-gray-500/10 flex items-center justify-center text-[10px]">{s.studentName?.[0]}</div>
                            {s.studentName}
                          </span>
                          <div className="flex items-center gap-2">
                            {late && <span className="text-[9px] font-black text-orange-600 bg-orange-500/10 px-2 py-0.5 rounded">LATE</span>}
                            {s.grade ? (
                              <span className="text-[10px] font-black text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-lg ring-1 ring-emerald-500/20">{s.grade}</span>
                            ) : (
                              <button onClick={() => openGradeModal(post.id, s.studentId, post.submissions)} className="text-[10px] font-black text-blue-500 flex items-center gap-1.5 px-2 py-1 rounded-md hover:bg-blue-500/10">
                                <Award size={14} /> GRADE
                              </button>
                            )}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {s.attachments?.map((att, idx) => (
                            <a key={idx} href={att.url} target="_blank" rel="noreferrer" className="text-[9px] font-black flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/5 hover:bg-blue-500 hover:text-white transition-all">
                              {renderAttachmentIcon(att.type)} {att.name}
                            </a>
                          ))}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* Turn In Form for Students */}
            {activeSubmissionPostId === post.id && canSubmit && (
              <div className={`mt-4 p-6 rounded-2xl border-2 border-dashed ${theme.border} bg-blue-500/5 animate-in slide-in-from-top-4`}>
                <div className="text-center mb-5">
                  <h4 className="text-sm font-black uppercase tracking-tighter">Your Submission</h4>
                  <p className="text-[11px] opacity-60">Add files or links to complete this task.</p>
                  {post.dueDate && (
                    <p className={`text-[10px] font-bold mt-2 ${new Date(post.dueDate) < new Date() ? 'text-red-500' : 'text-green-500'}`}>
                      Due: {new Date(post.dueDate).toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <button onClick={() => submissionFileInputRef.current.click()} className={`p-3 rounded-xl border ${theme.border} ${theme.surface} text-[10px] font-black hover:border-blue-500 transition-all flex flex-col items-center gap-2`}>
                    <Upload size={18} className="text-blue-500" /> FILE
                  </button>
                  <button onClick={() => openLinkModal("submission")} className={`p-3 rounded-xl border ${theme.border} ${theme.surface} text-[10px] font-black hover:border-blue-500 transition-all flex flex-col items-center gap-2`}>
                    <LinkIcon size={18} className="text-indigo-500" /> LINK
                  </button>
                  <input type="file" hidden ref={submissionFileInputRef} onChange={(e) => handleFileSelect(e, true)} />
                </div>

                {submissionFiles.map((file, i) => (
                  <div key={i} className={`flex items-center justify-between p-3 mb-2 rounded-xl border ${theme.border} ${theme.surface} animate-in fade-in`}>
                    <div className="flex items-center gap-2 truncate">
                      {renderAttachmentIcon(file.type)}
                      <span className="text-xs font-bold truncate">{file.name}</span>
                    </div>
                    <button onClick={() => setSubmissionFiles(prev => prev.filter((_, idx) => idx !== i))} className="text-red-400"><X size={16} /></button>
                  </div>
                ))}

                <button
                  onClick={async () => {
                    await handlers.onSubmitWork(post.id, submissionFiles);
                    setSubmissionFiles([]);
                    setActiveSubmissionPostId(null);
                  }}
                  disabled={submissionFiles.length === 0}
                  className={`w-full py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${submissionFiles.length > 0 ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20 active:scale-95" : "bg-gray-400/20 text-gray-400 cursor-not-allowed"}`}
                >
                  Confirm Turn In
                </button>
              </div>
            )}

            {/* Comments Section */}
            {(activeCommentPostId === post.id || post.comments?.length > 0) && (
              <div className={`mt-6 pt-6 border-t ${theme.divider} animate-in slide-in-from-top-2`}>
                <div className="space-y-4 mb-5 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {post.comments?.map((c) => (
                    <div key={c.id} className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-gray-500/10 flex items-center justify-center text-[10px] font-black">{c.userName?.[0]}</div>
                      <div className={`flex-1 p-3 rounded-2xl rounded-tl-none text-xs ${theme.input} shadow-sm border ${theme.border}`}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-black text-blue-500">{c.userName}</span>
                          <span className="text-[9px] font-bold opacity-40 uppercase">{new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="opacity-90 leading-relaxed font-medium">{c.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 items-center bg-black/5 p-1 rounded-full border border-black/5">
                  <input
                    className="flex-1 bg-transparent px-4 py-2 text-xs outline-none font-medium"
                    placeholder="Add a class comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLocalPostComment(post.id)}
                  />
                  <button onClick={() => handleLocalPostComment(post.id)} className="p-2 bg-blue-600 text-white rounded-full hover:scale-105 transition-transform"><Send size={16} /></button>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* MODALS */}
      <Modal isOpen={modalState.type === "addLink"} onClose={closeModal} title="Insert Link" theme={theme}>
        <div className="space-y-4">
          <input className={`w-full p-3 rounded-xl text-sm border ${theme.input}`} placeholder="URL (e.g. google.com)" value={tempLinkInput.url} onChange={e => setTempLinkInput({...tempLinkInput, url: e.target.value})} autoFocus />
          <input className={`w-full p-3 rounded-xl text-sm border ${theme.input}`} placeholder="Display Text (Optional)" value={tempLinkInput.name} onChange={e => setTempLinkInput({...tempLinkInput, name: e.target.value})} />
          <button onClick={handleAddLink} className="w-full bg-blue-600 text-white font-black py-3 rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-blue-500/20 active:scale-95 transition-all">Add to Post</button>
        </div>
      </Modal>

      <Modal isOpen={modalState.type === "grade"} onClose={closeModal} title="Grade Submission" theme={theme}>
        <div className="space-y-4 text-center">
          <p className="text-xs font-bold opacity-60 uppercase tracking-widest">Evaluate student performance</p>
          <input className={`w-full p-4 rounded-xl text-2xl font-black text-center border ${theme.input} focus:ring-2 ring-blue-500/20 transition-all`} placeholder="A+" value={tempGradeInput} onChange={e => setTempGradeInput(e.target.value)} autoFocus />
          <button onClick={handleGradeSubmit} className="w-full bg-emerald-600 text-white font-black py-3 rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">Submit Grade</button>
        </div>
      </Modal>
    </div>
  );
};

export default ClassroomStream;