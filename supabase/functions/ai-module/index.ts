import { json, errorResponse, handleOptions } from "../_shared/helpers.ts";

const KIMI_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const MODEL = "moonshotai/kimi-k2.6";

const SYSTEM = `You are an educational web page designer. Create a visually appealing educational web page about the topic the user requests.

Output requirements:
- A complete HTML document with <!DOCTYPE html>, <html>, <head>, and <body> tags
- CSS styles inside a <style> tag in the head
- The page should be educational and suitable for secondary school students
- Use the color #1f507b (navy blue) as the main color
- Include a title, explanatory text, and a simple quiz with 2-3 questions
- Wrap the entire HTML in a code block starting with \`\`\`html

After the code block, write one sentence describing what you created.`;

function extractHtml(text: string): string {
  if (!text) return "";
  let m = text.match(/```html\s*\n?([\s\S]*?)```/i);
  if (m) return m[1].trim();
  m = text.match(/```(?:\w*\s*\n?)?([\s\S]*?)```/i);
  if (m && m[1] && m[1].includes("<")) return m[1].trim();
  const trimmed = text.trim();
  if (trimmed.match(/^<!DOCTYPE|<html|<div/i)) return trimmed;
  const idx = text.search(/<!DOCTYPE|<html/i);
  if (idx >= 0) {
    const sub = text.substring(idx);
    const end = sub.lastIndexOf("</html>");
    if (end >= 0) return sub.substring(0, end + 7).trim();
    return sub.trim();
  }
  return "";
}

async function callKimi(messages: Array<{role:string;content:string}>): Promise<string> {
  const key = Deno.env.get("KIMI_API_KEY");
  if (!key) throw new Error("KIMI_API_KEY not configured");

  // Non-streaming — simpler and more reliable
  const response = await fetch(KIMI_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${key}`,
      "Accept": "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      max_tokens: 2048,
      temperature: 0.3,
      top_p: 1.0,
      stream: false,
      chat_template_kwargs: { thinking: false },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Kimi API ${response.status}: ${err.substring(0, 200)}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

Deno.serve(async (req: Request) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);

  try {
    const body = await req.json();
    const { action } = body;

    if (action === "generate" || action === "edit") {
      const prompt = body.prompt || body.instruction || "";
      const currentHtml = body.current_html || null;
      if (!prompt) return errorResponse("prompt or instruction required");

      const messages = currentHtml
        ? [
            { role: "system", content: SYSTEM },
            { role: "user", content: `Current module:\n\n\`\`\`html\n${currentHtml}\n\`\`\`\n\nInstruction: ${prompt}` },
          ]
        : [
            { role: "system", content: SYSTEM },
            { role: "user", content: prompt },
          ];

      const content = await callKimi(messages);
      const html = extractHtml(content);
      let reply = content.replace(/```html\s*\n?[\s\S]*?```/gi, "").replace(/```[\s\S]*?```/gi, "").trim();
      if (!reply) reply = "Module generated successfully. You can preview it below.";

      if (!html) {
        return json({ error: "AI did not generate valid HTML. Please try a different prompt.", raw: content.substring(0, 300) }, 500);
      }

      return json({ html, reply });
    }

    if (action === "preview" || action === "test") {
      const RENDER_URL = Deno.env.get("MODULE_TESTER_URL");
      if (!RENDER_URL) return errorResponse("Render service not configured", 503);
      const endpoint = action === "test" ? "/test" : "/start";
      const response = await fetch(`${RENDER_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ htmlContent: body.current_html || body.html }),
      });
      if (!response.ok) return errorResponse("Render error", response.status);
      return json(await response.json());
    }

    return errorResponse("Unknown action. Use: generate, edit, test, preview");
  } catch (e) {
    return errorResponse("Server error: " + (e as Error).message, 500);
  }
});
