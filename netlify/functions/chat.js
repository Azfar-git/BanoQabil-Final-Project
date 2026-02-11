/* eslint-disable no-undef */
import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contextData = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, "../../context.json"), "utf-8")
);

const initializeFirebase = () => {
  if (admin.apps.length > 0) return admin.app();

  try {
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;
    if (privateKey) {
      privateKey = privateKey
        .replace(/^['"](.*)['"]$/, "$1")
        .replace(/\\n/g, "\n");
    }

    return admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
  } catch (error) {
    console.error("❌ Firebase Init Error:", error.message);
    return null;
  }
};

const MODEL = "meta-llama/Llama-3.1-8B-Instruct";

const buildSystemPrompt = (
  role,
  userMessage,
  userName,
  contextDocs,
  userCourse,
) => {
  const isStudent = role === "student";
  const contextString = contextDocs
    .map((item) => `### ${item.title}\n${item.text}`)
    .join("\n\n");

  // PERSONA SELECTION
  const persona = isStudent
    ? `You are a **Senior Mentor and Big Brother**. You have a direct, motivating, and protective vibe. You act like you've known the student throughout their journey.
       - **MANDATORY Catchphrase:** If they express doubt, laziness, or struggle, you MUST use: "Skills beat inflation."
       - **Action:** Push them toward the **Incubation Centers** for practical help.`
    : `You are a **Polite and Welcoming Assistant**. You are professional, encouraging, and focused on recruitment.
       - **Action:** Guide them to register for 100% FREE courses at Bano Qabil`;

  return `
You are **BanoQabil AI**, the official digital voice of Bano Qabil 5.0. 

${persona}

**USER PROFILE:**
- Status: ${isStudent ? "Registered Student" : "Guest / Prospective Student"}
- User Name: ${userName}
- Current Course: ${isStudent ? userCourse : "Not Enrolled"}

**STRICT BEHAVIORAL INSTRUCTIONS:**
1. **MEMORY:** Reference their name (${userName}) and their course (${userCourse}) to make it personal.
2. **SOURCE OF TRUTH:** Use ONLY the **CONTEXT DATABASE** provided below. If the answer isn't there, say: "I don't have that specific info right now. Please [Contact Support] for details."
3. **CONCISENESS:** Keep responses to 2-3 sentences max. Do not ramble.
4. **MOOD TAGS:** Start your reply with [MOOD:EMPATHY] for struggles or [MOOD:HYPED] for successes. Use ONLY ONE tag per message.
5. **UI COMMANDS:** Include [COMMAND:ROADMAP] ONLY if they ask about their career path or "what's next."

**CONTEXT DATABASE:**
${contextString}
`;
};

const getRelevantContext = (message) => {
  const query = message.toLowerCase();
  return contextData
    .map((item) => {
      let score = 0;
      if (item.title.toLowerCase().includes(query)) score += 10;
      if (item.keywords?.some((k) => query.includes(k.toLowerCase())))
        score += 5;
      if (item.text.toLowerCase().includes(query)) score += 2;
      return { ...item, score };
    })
    .filter((item) => item.score > 0 || item.important)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
};

export async function handler(event) {
  if (event.httpMethod !== "POST")
    return { statusCode: 405, body: "Method Not Allowed" };

  try {
    const { message, role, history, userName, userId } = JSON.parse(event.body);

    // Initialize & Connect
    const app = initializeFirebase();
    const db = app ? admin.firestore() : null;

    let userCourse = "their selected track";

    // Fetch User Data from Firestore
    if (db && role === "student" && (userId || userName)) {
      try {
        const userDoc = await db
          .collection("users")
          .doc(userId || userName)
          .get();
        if (userDoc.exists) {
          userCourse = userDoc.data().course || userCourse;
        }
      } catch (e) {
        console.error("DB Fetch Fail:", e.message);
      }
    }

    const relevantDocs = getRelevantContext(message);
    const systemPrompt = buildSystemPrompt(
      role,
      message,
      userName,
      relevantDocs,
      userCourse,
    );

    const chatHistory = (history || []).slice(-10).map((msg) => ({
      role: msg.sender === "ai" ? "assistant" : "user",
      content: msg.text,
    }));

    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: "system", content: systemPrompt },
            ...chatHistory,
            { role: "user", content: message },
          ],
          temperature: 0.2, // Kept low for instruction following
          max_tokens: 400,
        }),
      },
    );

    const data = await response.json();
    const aiReply =
      data?.choices?.[0]?.message?.content ||
      "System pulse check... I'm still here! Try asking again.";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply: aiReply }),
    };
  } catch (error) {
    console.error("Handler Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "System offline. [Contact Support]." }),
    };
  }
}
