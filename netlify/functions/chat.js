// functions/chat.js
import fetch from "node-fetch";
import contextData from "../../context.json"; // path may vary

const MODEL = "meta-llama/Llama-3.1-8B-Instruct";

const buildSystemPrompt = () => {
  let prompt = `
You are BanoQabil AI, the official informational assistant for BanoQabil.pk.

RULES:
- ONLY use information explicitly in the CONTEXT below.
- NO prior knowledge, guesses, or assumptions.
- If the user greets you with "hi", "hello", "hey", etc., respond with a friendly greeting first, THEN ask if they want to know about courses, campuses, admissions, or programs.
- If the user's question is unclear, short, or vague (like "hmm", "ok"), reply politely: "I’m here to help with courses, campuses, admissions, or programs. Could you please ask about one of these?"
- If the answer is NOT in CONTEXT, reply EXACTLY:
  "I couldn't find an exact answer to your question. Would you like to contact our support team on WhatsApp for personalized assistance?"

FORMAT:
- Markdown bullets only (max 6 bullets, one sentence each)
- **Bold** for section titles
- Calm, professional, factual

CONTEXT:
`;

  contextData.forEach((item) => {
    prompt += `\n- **${item.title}:** ${item.text}`;
  });

  prompt += `
INSTRUCTIONS:
- Prioritize only the most important info relevant to the user's question.
- Keep response concise (~400 tokens max).
`;

  return prompt;
};

export async function handler(event) {
  try {
    const body = JSON.parse(event.body);
    const message = body.message;

    if (!message) {
      return { statusCode: 400, body: JSON.stringify({ reply: "No message provided." }) };
    }

    const systemPrompt = buildSystemPrompt();

    const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        temperature: 0.2,
        max_tokens: 400,
      }),
    });

    const data = await response.json();
    const reply =
      data?.choices?.[0]?.message?.content ||
      "I couldn't find an exact answer to your question. Would you like to contact our support team on WhatsApp for personalized assistance?";

    return { statusCode: 200, body: JSON.stringify({ reply }) };
  } catch (err) {
    console.error("Server error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        reply:
          "I couldn't find an exact answer to your question. Would you like to contact our support team on WhatsApp for personalized assistance?",
      }),
    };
  }
}
