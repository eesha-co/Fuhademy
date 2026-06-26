import { json, errorResponse, handleOptions } from "../_shared/helpers.ts";

const KIMI_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const MODEL = "moonshotai/kimi-k2.6";

// === SYSTEM PROMPT FOR PLANNING ===
const SYSTEM_PLAN = `You are an expert educational content strategist. The user wants to create or edit an HTML learning module.

Your job is to:
1. UNDERSTAND exactly what the user wants
2. Use the web search results to gather accurate information
3. Make PRECISE DECISIONS about what to build or change
4. Return a detailed plan

Your plan must include:
- WHAT YOU UNDERSTOOD: A clear restatement of what the user wants
- WEB RESEARCH: Key facts found from the web
- DECISIONS: Exactly what changes you will make
- APPROACH: How you will implement it

Be thorough but concise.`;

// === SYSTEM PROMPT FOR GENERATING NEW MODULES ===
const SYSTEM_GENERATE = `You are an expert educational content creator for Blue Horizon Schools.
Create interactive, self-contained HTML learning modules for Nigerian secondary school students.

Requirements:
1. Complete HTML document with <!DOCTYPE html>, <html>, <head>, <body>
2. Inline CSS in <style> tag
3. Vanilla JS in <script> tags
4. Interactive: quizzes, drag-drop, animations
5. Clear, age-appropriate language for JSS/SSS students
6. Use Blue Horizon navy #1f507b as primary color
7. Responsive and visually appealing
8. Wrap entire HTML in a code block starting with triple-backtick html
9. After the code block, confirm what you built`;

// === SYSTEM PROMPT FOR TARGETED EDITS (Copilot-style SEARCH/REPLACE) ===
const SYSTEM_TARGETED = `You are an expert HTML editor that makes targeted edits using SEARCH/REPLACE blocks (like GitHub Copilot).

You will receive an existing HTML module and an edit instruction. Instead of returning the complete HTML, return ONLY the changes using SEARCH/REPLACE blocks.

Format for each edit:
<<<< SEARCH
[exact text from the original HTML to find]
==== REPLACE
[new text to replace it with]
>>>>

Rules:
1. Each SEARCH block must contain text that EXISTS in the original HTML (copy it exactly)
2. Each REPLACE block contains the new text
3. You can have MULTIPLE SEARCH/REPLACE blocks
4. Keep SEARCH blocks as small as possible
5. If inserting new content, SEARCH for the element after which to insert, REPLACE with original + new content
6. After all blocks, write one sentence describing what you changed

Example:
<<<< SEARCH
<title>Acids and Bases</title>
==== REPLACE
<title>Acids and Bases Quiz</title>
>>>>
<<<< SEARCH
</body>
==== REPLACE
<div class="quiz"><p>Q1: What is the pH of water?</p><button onclick="alert(7)">Answer</button></div>
</body>
>>>>`;

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

function bufferToBase64(screenshot: any): string {
  if (!screenshot) return "";
  if (typeof screenshot === "string") return screenshot;
  if (screenshot.type === "Buffer" && Array.isArray(screenshot.data)) {
    const bytes = new Uint8Array(screenshot.data);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  }
  return "";
}

async function callKimi(messages: Array<any>, maxTokens = 16384, temperature = 0.3, thinking = true): Promise<string> {
  const key = Deno.env.get("KIMI_API_KEY");
  if (!key) throw new Error("KIMI_API_KEY not configured");
  const response = await fetch(KIMI_URL, {
    method: "POST",
    headers: { "Authorization": `Bearer ${key}`, "Accept": "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL, messages, max_tokens: maxTokens,
      temperature: temperature, top_p: 1.0, stream: false,
      chat_template_kwargs: { thinking: thinking },
    }),
  });
  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Kimi API ${response.status}: ${err.substring(0, 300)}`);
  }
  const data = await response.json();
  const msg = data.choices?.[0]?.message || {};
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

Deno.serve(async (req: Request) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);

  try {
    const body = await req.json();
    const { action } = body;

    // === SEARCH ===
    if (action === "search") {
      const { query } = body;
      if (!query) return errorResponse("query required");
      const results = await webSearch(query);
      return json({ success: true, results });
    }

    // === PLAN: Understand + Search + Decide ===
    if (action === "plan") {
      const prompt = body.prompt || body.instruction || "";
      const currentHtml = body.current_html || null;
      if (!prompt) return errorResponse("prompt required");

      const searchQuery = currentHtml
        ? `${prompt} educational content`
        : `${prompt} educational module Nigerian secondary school`;
      const searchResults = await webSearch(searchQuery);

      let userContent = "";
      if (currentHtml) {
        userContent = `USER REQUEST: ${prompt}\n\nEXISTING MODULE (first 2000 chars):\n${currentHtml.substring(0, 2000)}\n\nWEB RESEARCH:\n${searchResults || "No results."}\n\nCreate a detailed plan for editing this module.`;
      } else {
        userContent = `USER REQUEST: ${prompt}\n\nWEB RESEARCH:\n${searchResults || "No results."}\n\nCreate a detailed plan for building this module.`;
      }

      const plan = await callKimi(
        [{ role: "system", content: SYSTEM_PLAN }, { role: "user", content: userContent }],
        4096, 0.4, true
      );

      return json({
        success: true,
        plan,
        searchResults: searchResults.substring(0, 500),
        searched: !!searchResults,
      });
    }

    // === EDIT-TARGETED: Copilot-style SEARCH/REPLACE blocks ===
    if (action === "edit-targeted") {
      const prompt = body.prompt || body.instruction || "";
      const currentHtml = body.current_html || null;
      const plan = body.plan || null;
      if (!prompt) return errorResponse("prompt required");
      if (!currentHtml) return errorResponse("current_html required for targeted edits");

      let userContent = `EXISTING HTML MODULE:\n\n${currentHtml.substring(0, 8000)}\n\n`;
      if (plan) userContent += `PLAN:\n${plan}\n\n`;
      userContent += `EDIT INSTRUCTION: ${prompt}\n\nReturn ONLY the changes as SEARCH/REPLACE blocks. Do NOT return the full HTML.`;

      // Targeted edits produce SMALL output → fast, no timeout
      const content = await callKimi(
        [{ role: "system", content: SYSTEM_TARGETED }, { role: "user", content: userContent }],
        8192, 0.2, true
      );

      // Parse SEARCH/REPLACE blocks
      const edits: Array<{search: string, replace: string}> = [];
      const regex = /<<<<\s*SEARCH\s*\n([\s\S]*?)\n====\s*REPLACE\s*\n([\s\S]*?)\n>>>>/g;
      let match;
      while ((match = regex.exec(content)) !== null) {
        edits.push({ search: match[1], replace: match[2] });
      }

      let summary = content.replace(/<<<<\s*SEARCH[\s\S]*?>>>>/g, "").trim();
      if (!summary) summary = `Applied ${edits.length} edit(s).`;

      if (edits.length === 0) {
        return json({ error: "AI did not return SEARCH/REPLACE blocks. Try rephrasing.", raw: content.substring(0, 300) }, 500);
      }

      return json({
        success: true,
        edits: edits,
        summary: summary,
        mode: "targeted",
      });
    }

    // === GENERATE: Build new module from scratch ===
    if (action === "generate") {
      const prompt = body.prompt || "";
      const plan = body.plan || null;
      const searchResults = body.search_results || null;
      if (!prompt) return errorResponse("prompt required");

      let userContent = "";
      if (plan) {
        userContent = `USER REQUEST: ${prompt}\n\nPLAN:\n${plan}\n\n${searchResults ? `WEB RESEARCH:\n${searchResults}\n\n` : ""}Follow the plan. Return the HTML in a code block.`;
      } else {
        userContent = `Create a module: ${prompt}`;
      }

      let messages: any[] = [
        { role: "system", content: SYSTEM_GENERATE },
        { role: "user", content: userContent },
      ];

      let content = "";
      let html = "";
      for (let attempt = 0; attempt < 2; attempt++) {
        content = await callKimi(messages, 8192, 0.5, true);
        html = extractHtml(content);
        if (html) break;
        if (attempt === 0) {
          messages.push({ role: "assistant", content: content.substring(0, 200) });
          messages.push({ role: "user", content: "Return the HTML in a code block." });
        }
      }

      if (!html) return json({ error: "AI did not generate valid HTML.", raw: content.substring(0, 300) }, 500);
      let reply = content.replace(/```html\s*\n?[\s\S]*?```/gi, "").replace(/```[\s\S]*?```/gi, "").trim();
      if (!reply) reply = "Module generated.";
      return json({ html, reply, mode: "generate", testNeeded: true });
    }

    // === TEST: Verify with Playwright ===
    if (action === "test") {
      const html = body.current_html || body.html;
      if (!html) return errorResponse("current_html required");
      const RENDER_URL = Deno.env.get("MODULE_TESTER_URL");
      if (!RENDER_URL) return json({ success: true, test: { issues: [], suggestions: [], overall: "skipped" } });
      try {
        const startResp = await fetch(`${RENDER_URL}/start`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ htmlContent: html }),
        });
        if (!startResp.ok) return json({ success: true, test: { issues: ["Could not render"], suggestions: [], overall: "error" } });
        const startData = await startResp.json();
        const screenshotB64 = bufferToBase64(startData.screenshot);
        const analysis = await callKimi([
          { role: "system", content: "You are a QA tester. Return JSON: {\"issues\":[\"...\"],\"suggestions\":[\"...\"],\"overall\":\"good|needs_work|broken\"}" },
          { role: "user", content: `Analyze this HTML:\n${html.substring(0, 3000)}` },
        ], 2048, 0.3, false);
        try {
          const jsonMatch = analysis.match(/\{[\s\S]*\}/);
          if (jsonMatch) return json({ success: true, test: { ...JSON.parse(jsonMatch[0]), screenshot: screenshotB64 } });
        } catch {}
        return json({ success: true, test: { issues: [], suggestions: [], overall: "unknown", screenshot: screenshotB64 } });
      } catch (e) {
        return json({ success: true, test: { issues: [`Test error: ${e.message}`], suggestions: [], overall: "error" } });
      }
    }

    // === FIX: Auto-fix issues ===
    if (action === "fix") {
      const html = body.current_html || body.html;
      const issues = body.issues || [];
      const suggestions = body.suggestions || [];
      if (!html) return errorResponse("current_html required");
      // Use targeted edits for fixing too (faster, no timeout)
      let userContent = `EXISTING HTML:\n\n${html.substring(0, 8000)}\n\nFix these issues:\n${issues.join("\n")}\n\nSuggestions:\n${suggestions.join("\n")}\n\nReturn ONLY the changes as SEARCH/REPLACE blocks.`;
      const content = await callKimi(
        [{ role: "system", content: SYSTEM_TARGETED }, { role: "user", content: userContent }],
        8192, 0.2, true
      );
      const edits: Array<{search: string, replace: string}> = [];
      const regex = /<<<<\s*SEARCH\s*\n([\s\S]*?)\n====\s*REPLACE\s*\n([\s\S]*?)\n>>>>/g;
      let match;
      while ((match = regex.exec(content)) !== null) {
        edits.push({ search: match[1], replace: match[2] });
      }
      let summary = content.replace(/<<<<\s*SEARCH[\s\S]*?>>>>/g, "").trim();
      if (!summary) summary = `Applied ${edits.length} fix(es).`;
      if (edits.length === 0) return json({ error: "Could not parse fixes." }, 500);
      return json({ success: true, edits, summary, mode: "targeted-fix" });
    }

    // === PREVIEW ===
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
      return json({ screenshot: bufferToBase64(data.screenshot) });
    }

    return errorResponse("Unknown action. Use: plan, edit-targeted, generate, test, fix, preview, search");
  } catch (e) {
    return errorResponse("Server error: " + (e as Error).message, 500);
  }
});
