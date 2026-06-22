import { json, errorResponse, handleOptions } from "../_shared/helpers.ts";

const KIMI_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const MODEL = "moonshotai/kimi-k2.6";

const SYSTEM = `You are an expert educational content creator for Blue Horizon Schools.
Create interactive, self-contained HTML learning modules for Nigerian secondary school students.

Requirements:
1. Complete HTML document (<!DOCTYPE html>, <html>, <head>, <body>)
2. Inline CSS in <style> tag — no external stylesheets
3. Vanilla JS in <script> tags — no external libraries except fonts/icons via CDN
4. Interactive: quizzes, drag-drop, animations, expandable sections
5. Clear, age-appropriate language for JSS/SSS students
6. Include: lesson title, learning objectives, content with examples, interactive practice, summary
7. Use Blue Horizon navy #1f507b as primary color
8. Responsive and visually appealing
9. Wrap entire HTML in a \`\`\`html code block
10. After the code block, write a brief description of what you created

You will be given a prompt and optionally web search results for context.
Use the search results to make the content accurate and comprehensive.`;

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

// Convert Render's Buffer object {type:"Buffer",data:[137,80,...]} to base64 string
function bufferToBase64(screenshot: any): string {
  if (!screenshot) return "";
  // If it's already a string, return as-is
  if (typeof screenshot === "string") return screenshot;
  // If it's a Buffer object with data array
  if (screenshot.type === "Buffer" && Array.isArray(screenshot.data)) {
    const bytes = new Uint8Array(screenshot.data);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  }
  return "";
}

async function callKimi(messages: Array<any>, maxTokens = 8192): Promise<string> {
  const key = Deno.env.get("KIMI_API_KEY");
  if (!key) throw new Error("KIMI_API_KEY not configured");
  const response = await fetch(KIMI_URL, {
    method: "POST",
    headers: { "Authorization": `Bearer ${key}`, "Accept": "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL, messages, max_tokens: maxTokens,
      temperature: 0.5, top_p: 1.0, stream: false,
      chat_template_kwargs: { thinking: true },  // THINKING MODE ENABLED
    }),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Kimi API ${response.status}: ${err.substring(0, 300)}`);
  }
  const data = await response.json();
  const msg = data.choices?.[0]?.message || {};
  // K2.6 with thinking may put content in reasoning_content
  return msg.content || msg.reasoning_content || "";
}

async function webSearch(query: string): Promise<string> {
  try {
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
    const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!response.ok) return "";
    const data = await response.json();
    let results = "";
    if (data.AbstractText) results += data.AbstractText + "\n\n";
    if (data.RelatedTopics) {
      for (const t of data.RelatedTopics.slice(0, 5)) {
        if (t.Text) results += t.Text + "\n";
        if (t.Topics) for (const sub of t.Topics.slice(0, 2)) if (sub.Text) results += sub.Text + "\n";
      }
    }
    return results.substring(0, 3000);
  } catch { return ""; }
}

async function testHtml(html: string): Promise<{ issues: string[]; suggestions: string[]; overall: string; screenshot?: string }> {
  const RENDER_URL = Deno.env.get("MODULE_TESTER_URL");
  if (!RENDER_URL) return { issues: [], suggestions: [], overall: "skipped" };

  try {
    // Get screenshot from Render
    const startResp = await fetch(`${RENDER_URL}/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ htmlContent: html }),
    });
    if (!startResp.ok) return { issues: ["Could not render preview"], suggestions: [], overall: "error" };
    const startData = await startResp.json();
    // Convert Buffer to base64 string
    const screenshotB64 = bufferToBase64(startData.screenshot);
    if (!screenshotB64) return { issues: ["Could not capture screenshot"], suggestions: [], overall: "error" };

    // Ask AI to analyze — use text-only (no image to avoid base64 issues with Kimi)
    const analysis = await callKimi([
      { role: "system", content: "You are a QA tester for educational HTML modules. Analyze the HTML code and report issues. Return ONLY JSON: {\"issues\":[\"...\"],\"suggestions\":[\"...\"],\"overall\":\"good|needs_work|broken\"}" },
      { role: "user", content: `Analyze this HTML module. Check: layout, readability, interactive elements, content is educational, navy color #1f507b is used, responsive design.\n\nHTML:\n${html.substring(0, 3000)}` },
    ], 2048);

    try {
      const jsonMatch = analysis.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        return { ...result, screenshot: screenshotB64 };
      }
    } catch {}
    return { issues: [], suggestions: [], overall: "unknown", screenshot: screenshotB64 };
  } catch (e) {
    return { issues: [`Test error: ${e.message}`], suggestions: [], overall: "error" };
  }
}

Deno.serve(async (req: Request) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);

  try {
    const body = await req.json();
    const { action } = body;

    if (action === "search") {
      const { query } = body;
      if (!query) return errorResponse("query required");
      const results = await webSearch(query);
      return json({ success: true, results });
    }

    if (action === "generate" || action === "edit") {
      const prompt = body.prompt || body.instruction || "";
      const currentHtml = body.current_html || null;
      const useSearch = body.search !== false;
      if (!prompt) return errorResponse("prompt or instruction required");

      // Step 1: Web search for context
      let searchContext = "";
      if (useSearch && !currentHtml) {
        searchContext = await webSearch(prompt);
      }

      // Step 2: Build messages
      let userContent = "";
      if (currentHtml) {
        userContent = `Current module:\n\n\`\`\`html\n${currentHtml}\n\`\`\`\n\nInstruction: ${prompt}`;
      } else {
        userContent = searchContext
          ? `Web search results for context:\n${searchContext}\n\n---\n\nCreate a module: ${prompt}`
          : `Create a module: ${prompt}`;
      }

      let messages: any[] = [
        { role: "system", content: SYSTEM },
        { role: "user", content: userContent },
      ];

      // Step 3: Generate HTML (with retry — K2.6 sometimes produces garbled output)
      let content = "";
      let html = "";
      for (let attempt = 0; attempt < 2; attempt++) {
        content = await callKimi(messages);
        html = extractHtml(content);
        if (html) break;
        if (attempt === 0) {
          messages.push({ role: "assistant", content: content.substring(0, 200) });
          messages.push({ role: "user", content: "Please generate the HTML module now. Return ONLY the HTML in a \`\`\`html code block." });
        }
      }

      if (!html) {
        return json({ error: "AI did not generate valid HTML. Please try a different prompt.", raw: content.substring(0, 300) }, 500);
      }

      let reply = content.replace(/```html\s*\n?[\s\S]*?```/gi, "").replace(/```[\s\S]*?```/gi, "").trim();
      if (!reply) reply = "Module generated. Testing now...";

      // Step 4: Auto-test
      const testResult = await testHtml(html);

      // Step 5: Auto-fix if issues found
      let fixesApplied = "";
      if ((testResult.overall === "needs_work" || testResult.overall === "broken") && testResult.issues?.length > 0) {
        const fixMessages = [
          { role: "system", content: "You are an HTML editor. Fix the issues and return the complete updated HTML in a ```html block." },
          { role: "user", content: `Current HTML:\n\n\`\`\`html\n${html}\n\`\`\`\n\nFix these issues:\n${testResult.issues.join("\n")}\n\nApply suggestions:\n${(testResult.suggestions || []).join("\n")}` },
        ];
        const fixedContent = await callKimi(fixMessages, 8192);
        const fixedHtml = extractHtml(fixedContent);
        if (fixedHtml) {
          html = fixedHtml;
          fixesApplied = "Issues found and auto-fixed. ";
        }
      }

      return json({
        html,
        reply: fixesApplied + reply,
        test: testResult,
        searched: !!searchContext,
        searchResults: searchContext ? searchContext.substring(0, 500) : "",
      });
    }

    if (action === "test") {
      const html = body.current_html || body.html;
      if (!html) return errorResponse("current_html required");
      const testResult = await testHtml(html);
      return json({ success: true, test: testResult });
    }

    if (action === "preview") {
      const RENDER_URL = Deno.env.get("MODULE_TESTER_URL");
      if (!RENDER_URL) return errorResponse("Render service not configured", 503);
      const html = body.current_html || body.html;
      if (!html) return errorResponse("current_html required");
      const response = await fetch(`${RENDER_URL}/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ htmlContent: html }),
      });
      if (!response.ok) return errorResponse("Render error", response.status);
      const data = await response.json();
      // Convert Buffer to base64 before returning to frontend
      return json({ screenshot: bufferToBase64(data.screenshot) });
    }

    return errorResponse("Unknown action. Use: generate, edit, test, preview, search");
  } catch (e) {
    return errorResponse("Server error: " + (e as Error).message, 500);
  }
});
