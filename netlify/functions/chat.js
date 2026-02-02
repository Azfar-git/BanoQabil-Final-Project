import fetch from "node-fetch";
import contextData from "../../context.json";

const MODEL = "meta-llama/Llama-3.1-8B-Instruct";

const buildSystemPrompt = (role, userMessage, userName) => {
  const isStudent = role === "student"; 

  const relevantContext = contextData
    .filter((item) => {
      const keywords = item.title.toLowerCase().split(" ");
      return (
        keywords.some((kw) => userMessage.toLowerCase().includes(kw)) ||
        item.important
      );
    })
    .slice(0, 10);

  return `
You are BanoQabil AI, the official mentor and assistant for BanoQabil.pk.
${
  isStudent
    ? `USER STATUS: REGISTERED STUDENT. Name: ${userName}. Tone: Encouraging, mentorship-driven, and career-focused.`
    : `USER STATUS: GUEST. Name: ${userName}. Tone: Professional, informative, and concise.`
}

STRICT RULES:
1. ONLY use the CONTEXT provided. Do not invent details.
2. If the user is a GUEST, focus on admissions, courses, and basic FAQs.
3. If the user is a STUDENT, provide deeper guidance on career paths and course benefits.
4. If information is missing, use the EXACT fallback message provided below.

FORMATTING:
- Use **Bold** for emphasis and titles.
- Use bullet points for lists.
- Keep responses under 4 sentences unless listing items.

SPECIAL TRIGGERS:
- [MOOD:EMPATHY] if user is struggling/confused.
- [MOOD:HYPED] if user is happy/greeting.
- [COMMAND:ROADMAP] if a STUDENT asks about career paths or "what's next".

CONTEXT:
${relevantContext.map((item) => `- **${item.title}:** ${item.text}`).join("\n")}
`;
};

export async function handler(event) {
  const fallback =
    "I couldn't find an exact answer to your question in our database. Please [Contact Support on WhatsApp](https://wa.me/923178226242) for personalized help.";
  if (event.httpMethod !== "POST")
    return { statusCode: 405, body: "Method Not Allowed" };

  try {
    const { message, role, history, userName } = JSON.parse(event.body);
    if (!message)
      return {
        statusCode: 400,
        body: JSON.stringify({ reply: "Message is required." }),
      };

    const systemPrompt = buildSystemPrompt(
      role || "guest",
      message,
      userName || "Guest",
    );

    // Construct history for the AI model
    const chatHistory = (history || []).slice(-6).map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

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
          top_p: 0.9,
        }),
      },
    );

    const data = await response.json();
    let aiReply = data?.choices?.[0]?.message?.content || fallback;
    if (aiReply.length < 5) aiReply = fallback;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply: aiReply }),
    };
  } catch {
    return {
      statusCode: 500,
      body: JSON.stringify({
        reply: "System is briefly offline. Please try again later.",
      }),
    };
  }
}
