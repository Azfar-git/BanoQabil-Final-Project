import fetch from "node-fetch";
import contextData from "../../context.json";

const MODEL = "meta-llama/Llama-3.1-8B-Instruct";

const buildSystemPrompt = (role, userMessage, userName) => {
  const isStudent = role === "student";

  const relevantContext = contextData
    .map((item) => {
      let score = 0;
      const lowerMsg = userMessage.toLowerCase();
      const titleWords = item.title.toLowerCase().split(" ");
      if (titleWords.some((word) => lowerMsg.includes(word))) score += 3;
      if (
        item.text.toLowerCase().includes(lowerMsg) ||
        lowerMsg.includes(item.text.toLowerCase())
      )
        score += 1;
      return { ...item, score };
    })
    .filter((item) => item.score > 0 || item.important)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8);

  return `
You are **BanoQabil AI**, the official intelligent voice of Bano Qabil 5.0 (Launched Jan 2026).
Your goal is to empower Pakistani youth with IT skills.

**USER CONTEXT:**
- Status: ${isStudent ? "Registered Student" : "Guest / Aspiring Student"}
- Name: ${userName}

**BEHAVIORAL INSTRUCTIONS:**
1. **AS A GUEST ASSISTANT:** If the user is a Guest, be extremely polite, welcoming, and helpful. Focus on the benefits of joining and guide them through the registration process found in the context.
2. **AS A STUDENT MENTOR:** If the user is a Student, act as a **Senior Mentor and Friend**. Be direct and motivating. If they express struggle, remind them that "Skills are the only way to beat inflation" and push them to utilize the **Incubation Centers** or resources mentioned in the context.
3. **ACCURACY:** Use ONLY the information provided in the **CONTEXT DATABASE** below. If the information is not there, do not guess. Say: "I don't have that specific info right now. Please [Contact Support]."

**TECHNICAL CONSTRAINTS:**
- **Length:** Keep responses concise (max 3-4 sentences).
- **Moods:** - Append [MOOD:EMPATHY] for sad/struggling users.
- Append [MOOD:HYPED] for excited/new users.
- **UI Commands:** Append [COMMAND:ROADMAP] if the user asks for career paths or "which course to take."

**CONTEXT DATABASE:**
${relevantContext.map((item) => `### ${item.title}\n${item.text}`).join("\n\n")}
`;
};

export async function handler(event) {
  const fallback =
    "I couldn't find an exact answer. Please [Contact Support] for personalized help.";
  if (event.httpMethod !== "POST")
    return { statusCode: 405, body: "Method Not Allowed" };

  try {
    const { message, role, history, userName } = JSON.parse(event.body);
    const systemPrompt = buildSystemPrompt(
      role || "guest",
      message,
      userName || "Guest",
    );
    const chatHistory = (history || [])
      .slice(-6)
      .map((msg) => ({ role: msg.role, content: msg.content }));

    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        method: "POST",
        headers: {
          //eslint-disable-next-line no-undef
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
          temperature: 0.1,
          max_tokens: 450,
        }),
      },
    );

    const data = await response.json();
    let aiReply = data?.choices?.[0]?.message?.content || fallback;
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply: aiReply }),
    };
  } catch {
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "System offline. Try later." }),
    };
  }
}
