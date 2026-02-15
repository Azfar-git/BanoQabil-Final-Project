# 📚 Classroom Module Overview

The classroom module is a real‑time learning environment built with React, Firebase, and Tailwind CSS. It integrates seamlessly with the main dashboard and provides all the tools teachers and students need for online classes.

---

## ✨ Key Features

- **Stream** – Teachers post announcements and assignments with text, files, links, and due dates. Students can comment, like, and see if a submission is late.  
- **Chat** – Real‑time messaging with file uploads (images, PDFs). Students can edit/delete their own messages; teachers can delete any message or bulk‑delete.  
- **People** – Roster of enrolled students. Teachers can add or remove students using a multi‑select search. Students see only names; teachers see full details.  
- **Assignments & Grades** – Students submit work (files or links); teachers grade submissions. Late submissions are flagged. Grades appear instantly for both students and teachers.  
- **Notifications** – When a teacher posts, all enrolled students (and the teacher) receive a real‑time notification. Unread count shows in the navbar.  
- **Dashboard Widgets** – Pending assignments, unread notifications, active classes, and a progress chart (for students) keep everything at a glance.  
- **Calendar** – Monthly view with due‑date indicators; sidebar lists upcoming assignments with status.  
- **Dark Mode** – Full support for light/dark themes, respecting the global toggle.

---

## 👤 Role‑Based Access

- **Teachers** can create posts, pin them, grade work, add/remove students, and manage chat (edit/delete any message, bulk delete).  
- **Students** can comment, like, submit work, and edit/delete only their own chat messages.  
- **Supervisors** have limited view access (can see posts and submissions but cannot grade or manage students).

---

## 🛠️ Tech Stack

- React (Hooks, Router v6)  
- Material‑UI + Tailwind CSS  
- Firebase (Auth, Firestore, Storage)  
- Framer Motion (animations)  
- Lucide React & MUI Icons  
