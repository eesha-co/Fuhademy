import { json, errorResponse, handleOptions } from "../_shared/helpers.ts";

const KIMI_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const MODEL = "moonshotai/kimi-k2.6";

// === SYSTEM PROMPT FOR PLANNING ===
const SYSTEM_PLAN = `You are an expert educational content strategist. The user wants to create or edit an HTML learning module.

Your job is to:
1. UNDERSTAND exactly what the user wants (analyze their request carefully)
2. Use the web search results to gather accurate information about the topic
3. Make PRECISE DECISIONS about what to build or change
4. Return a detailed plan

Your plan must include:
- WHAT YOU UNDERSTOOD: A clear restatement of what the user wants
- WEB RESEARCH: Key facts found from the web (if relevant)
- DECISIONS: Exactly what changes you will make (be specific — which sections, what content, what interactive elements)
- APPROACH: How you will implement it (what HTML/CSS/JS techniques)

Be thorough but concise. This plan will be given to the coding AI to execute.`;

// === SYSTEM PROMPT FOR GENERATING NEW MODULES ===
const SYSTEM_GENERATE = `You are an expert educational content creator for Blue Horizon Schools.
Create interactive, self-contained HTML learning modules for Nigerian secondary school students.

You will be given a PLAN created by a strategist. Follow the plan EXACTLY.
Use the web research and decisions from the plan to guide your implementation.

Requirements:
1. Complete HTML document (<!DOCTYPE html>, <html>, <head>, <body>)
2. Inline CSS in <style> tag — no external stylesheets
3. Vanilla JS in <script> tags — no external libraries except fonts/icons via CDN
4. Interactive: quizzes, drag-drop, animations, expandable sections
5. Clear, age-appropriate language for JSS/SSS students
6. Use Blue Horizon navy #1f507b as primary color
7. Responsive and visually appealing
8. Wrap entire HTML in a \`\`\`html code block
9. After the code block, confirm what you built (matching the plan)`;

// === SYSTEM PROMPT FOR EDITING EXISTING MODULES ===
const SYSTEM_EDIT = `You are an expert HTML editor for educational modules.

You will be given:
1. An existing HTML module
2. A PLAN created by a strategist (with web research and precise decisions)
3. The user's original request

CRITICAL RULES:
1. Follow the PLAN exactly — make ONLY the changes described in the plan
2. PRESERVE all existing content, structure, styling, and functionality that the plan doesn't mention changing
3. Return the COMPLETE updated HTML document
4. Keep all existing CSS classes, IDs, and JavaScript functions intact
5. Think of yourself as a surgeon — make precise, targeted changes based on the plan
6. Do NOT rewrite the entire module from scratch
7. Return the result in a \`\`\`html code block
8. After the code block, confirm what you changed (matching the plan)`;

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

    // === PLAN: Understand + Search + Decide ===
    if (action === "plan") {
      const prompt = body.prompt || body.instruction || "";
      const currentHtml = body.current_html || null;
      if (!prompt) return errorResponse("prompt required");

      // Step 1: Search the web for context (ALWAYS, even for edits)
      const searchQuery = currentHtml 
        ? `${prompt} educational content` 
        : `${prompt} educational module Nigerian secondary school`;
      const searchResults = await webSearch(searchQuery);

      // Step 2: Build the planning message
      let userContent = "";
      if (currentHtml) {
        userContent = `USER REQUEST: ${prompt}\n\nEXISTING MODULE (summary):\n${currentHtml.substring(0, 2000)}\n\nWEB RESEARCH:\n${searchResults || "No web results found."}\n\nCreate a detailed plan for editing this module.`;
      } else {
        userContent = `USER REQUEST: ${prompt}\n\nWEB RESEARCH:\n${searchResults || "No web results found."}\n\nCreate a detailed plan for building this module.`;
      }

      const messages = [
        { role: "system", content: SYSTEM_PLAN },
        { role: "user", content: userContent },
      ];

      // Step 3: Get the plan
      const plan = await callKimi(messages, 4096, 0.4);

      return json({
        success: true,
        plan,
        searchResults: searchResults.substring(0, 500),
        searched: !!searchResults,
      });
    }

    // === GENERATE or EDIT: Execute the plan ===
    if (action === "generate" || action === "edit") {
      const prompt = body.prompt || body.instruction || "";
      const currentHtml = body.current_html || null;
      const plan = body.plan || null;
      const searchResults = body.search_results || null;
      if (!prompt) return errorResponse("prompt required");

      const isEdit = !!currentHtml && currentHtml.length > 50;

      // Build messages with the plan as context
      let userContent = "";
      let systemPrompt = isEdit ? SYSTEM_EDIT : SYSTEM_GENERATE;

      if (plan) {
        // Execute with the plan
        if (isEdit) {
          userContent = `EXISTING HTML MODULE:\n\n\`\`\`html\n${currentHtml}\n\`\`\`\n\nUSER REQUEST: ${prompt}\n\nSTRATEGIST'S PLAN:\n${plan}\n\n${searchResults ? `WEB RESEARCH:\n${searchResults}\n\n` : ""}Follow the plan EXACTLY. Apply ONLY the changes described. Return the COMPLETE updated HTML in a \`\`\`html code block.`;
        } else {
          userContent = `USER REQUEST: ${prompt}\n\nSTRATEGIST'S PLAN:\n${plan}\n\n${searchResults ? `WEB RESEARCH:\n${searchResults}\n\n` : ""}Follow the plan EXACTLY. Build the module as described. Return the HTML in a \`\`\`html code block.`;
        }
      } else {
        // No plan — direct execution (fallback)
        if (isEdit) {
          userContent = `EXISTING HTML MODULE:\n\n\`\`\`html\n${currentHtml}\n\`\`\`\n\nEDIT INSTRUCTION: ${prompt}\n\nApply ONLY this edit. Return the COMPLETE updated HTML in a \`\`\`html code block.`;
        } else {
          userContent = `Create a module: ${prompt}`;
        }
      }

      let messages: any[] = [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent },
      ];

      const maxTokens = isEdit ? 16384 : 8192;
      const temperature = isEdit ? 0.2 : 0.5;

      let content = "";
      let html = "";
      // Execute step: thinking DISABLED (plan already did the thinking — this just follows it mechanically)
      // This prevents timeout on large modules (thinking + large input = >150s)
      for (let attempt = 0; attempt < 2; attempt++) {
        content = await callKimi(messages, maxTokens, temperature, false);
        html = extractHtml(content);
        if (html) break;
        if (attempt === 0) {
          messages.push({ role: "assistant", content: content.substring(0, 200) });
          messages.push({ role: "user", content: "Please return the complete HTML module in a \`\`\`html code block." });
        }
      }

      if (!html) {
        return json({ error: "AI did not generate valid HTML. Please try a different prompt.", raw: content.substring(0, 300) }, 500);
      }

      let reply = content.replace(/```html\s*\n?[\s\S]*?```/gi, "").replace(/```[\s\S]*?```/gi, "").trim();
      if (!reply) reply = isEdit ? "Module edited successfully." : "Module generated successfully.";

      return json({
        html,
        reply,
        mode: isEdit ? "edit" : "generate",
        testNeeded: true,
      });
    }

    // === TEST: Verify the result ===
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
        if (!startResp.ok) return json({ success: true, test: { issues: ["Could not render preview"], suggestions: [], overall: "error" } });
        const startData = await startResp.json();
        const screenshotB64 = bufferToBase64(startData.screenshot);
        const analysis = await callKimi([
          { role: "system", content: "You are a QA tester for educational HTML modules. Analyze the HTML code and report issues. Return ONLY JSON: {\"issues\":[\"...\"],\"suggestions\":[\"...\"],\"overall\":\"good|needs_work|broken\"}" },
          { role: "user", content: `Analyze this HTML module. Check: layout, readability, interactive elements, content is educational, navy color #1f507b is used, responsive design.\n\nHTML:\n${html.substring(0, 3000)}` },
        ], 2048, 0.3);
        try {
          const jsonMatch = analysis.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const result = JSON.parse(jsonMatch[0]);
            return json({ success: true, test: { ...result, screenshot: screenshotB64 } });
          }
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
      const fixMessages = [
        { role: "system", content: SYSTEM_EDIT },
        { role: "user", content: `EXISTING HTML:\n\n\`\`\`html\n${html}\n\`\`\`\n\nFix these issues:\n${issues.join("\n")}\n\nSuggestions:\n${suggestions.join("\n")}\n\nReturn the COMPLETE updated HTML in a \`\`\`html code block.` },
      ];
      const fixedContent = await callKimi(fixMessages, 16384, 0.2, false);
      const fixedHtml = extractHtml(fixedContent);
      if (!fixedHtml) return json({ error: "Could not auto-fix." }, 500);
      let reply = fixedContent.replace(/```html\s*\n?[\s\S]*?```/gi, "").trim();
      if (!reply) reply = "Issues auto-fixed.";
      return json({ html: fixedHtml, reply, fixed: true });
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

    // === SEARCH ===
    if (action === "search") {
      const { query } = body;
      if (!query) return errorResponse("query required");
      const results = await webSearch(query);
      return json({ success: true, results });
    }

    return errorResponse("Unknown action. Use: plan, generate, edit, test, fix, preview, search");
  } catch (e) {
    return errorResponse("Server error: " + (e as Error).message, 500);
  }
});
