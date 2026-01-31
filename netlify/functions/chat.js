import fetch from "node-fetch";
import contextData from "../../context.json";

const MODEL = "meta-llama/Llama-3.1-8B-Instruct";

const buildSystemPrompt = (role) => {
  const isStudent = role === "student";

  let prompt = `
You are BanoQabil AI, the official informational assistant for BanoQabil.pk.
${isStudent ? "CURRENT USER STATUS: REGISTERED STUDENT. Act as a supportive mentor and career counselor." : "CURRENT USER STATUS: GUEST. Act as a professional informational assistant."}

RULES:
- ONLY use information explicitly in the CONTEXT below.
- NO prior knowledge, guesses, or assumptions.
${isStudent ? "- If a student asks for advice, use the 'Guidance' context to help them choose a career path." : "- If the user greets you, respond friendly then ask if they want to know about courses, campuses, or admissions."}
- If the answer is NOT in CONTEXT, reply EXACTLY:
  "I couldn't find an exact answer to your question. Would you like to [Contact Support on WhatsApp](https://wa.me/923178226242) for personalized assistance?"

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
    const { message, role } = body; 

    if (!message) {
      return { statusCode: 400, body: JSON.stringify({ reply: "No message provided." }) };
    }

    const systemPrompt = buildSystemPrompt(role);

    const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
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
          { role: "user", content: message },
        ],
        temperature: 0.2,
        max_tokens: 400,
      }),
    });

    const data = await response.json();
    // Default fallback if AI fails or doesn't find context
    const fallback = "I couldn't find an exact answer to your question. Would you like to [Contact Support on WhatsApp](https://wa.me/923178226242) for personalized assistance?";
    const reply = data?.choices?.[0]?.message?.content || fallback;

    return { statusCode: 200, body: JSON.stringify({ reply }) };
  } catch (err) {
    console.error("Server error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        reply: "I couldn't find an exact answer to your question. Would you like to [Contact Support on WhatsApp](https://wa.me/923178226242) for personalized assistance?",
      }),
    };
  }
}