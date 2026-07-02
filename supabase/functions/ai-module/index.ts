import { json, errorResponse, handleOptions, createServiceClient } from "../_shared/helpers.ts";

const API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const MODEL = "deepseek-ai/deepseek-v4-pro";

const SYSTEM_TARGETED = `You are an expert HTML editor. Return ONLY changes as SEARCH/REPLACE blocks.
Format:
<<<< SEARCH
[text to find]
==== REPLACE
[new text]
>>>>
After blocks, write one sentence about what you changed.`;

const SYSTEM_GENERATE = `You are an expert educational content creator. Create a complete HTML document with inline CSS and JS. Use navy #1f507b. Wrap in a code block.`;

async function webSearch(query: string): Promise<string> {
  try {
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1`;
    const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!r.ok) return "";
    const d = await r.json();
    let results = d.AbstractText ? d.AbstractText + "\n" : "";
    if (d.RelatedTopics) for (const t of d.RelatedTopics.slice(0, 3)) if (t.Text) results += t.Text + "\n";
    return results.substring(0, 2000);
  } catch { return ""; }
}

function parseEdits(content: string) {
  const edits: Array<{search: string, replace: string}> = [];
  const regex = /<<<<\s*SEARCH\s*\n([\s\S]*?)\n====\s*REPLACE\s*\n([\s\S]*?)\n>>>>/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    edits.push({ search: match[1], replace: match[2] });
  }
  let summary = content.replace(/<<<<\s*SEARCH[\s\S]*?>>>>/g, "").trim();
  if (!summary) summary = `Applied ${edits.length} edit(s).`;
  return { edits, summary };
}

function extractHtml(content: string) {
  let m = content.match(/```html\s*\n?([\s\S]*?)```/i);
  if (m) return m[1].trim();
  m = content.match(/```(?:\w*\s*\n?)?([\s\S]*?)```/i);
  if (m && m[1] && m[1].includes("<")) return m[1].trim();
  return content.trim();
}

Deno.serve(async (req: Request) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);

  const body = await req.json();
  const { action, session_id } = body;

  try {
    // ========================================
    // PLAN: understand + search + decide
    // ========================================
    if (action === "plan") {
      const { prompt, current_html, search } = body;
      if (!prompt) return errorResponse("prompt required");
      const supabase = await createServiceClient();
      const sessionId = session_id || crypto.randomUUID();

      const searchQuery = current_html ? `${prompt} educational content` : `${prompt} educational module`;
      const searchResults = search !== false ? await webSearch(searchQuery) : "";

      let userContent = `USER REQUEST: ${prompt}\n\n`;
      if (current_html) userContent += `EXISTING MODULE:\n${current_html}\n\n`;
      if (searchResults) userContent += `WEB RESEARCH:\n${searchResults}\n\n`;
      userContent += current_html ? "Create a detailed plan for editing this module." : "Create a detailed plan for building this module.";

      const messages = [
        { role: "system", content: `You are an expert educational content strategist. Create a detailed plan. Include: WHAT YOU UNDERSTOOD, WEB RESEARCH, DECISIONS, APPROACH.` },
        { role: "user", content: userContent }
      ];

      // Save to DB before calling API
      await supabase.from("ai_sessions").upsert({
        session_id: sessionId, phase: "plan", status: "in_progress", content: "", messages: messages,
      }, { onConflict: "session_id" });

      // Call API
      const key = Deno.env.get("KIMI_API_KEY");
      if (!key) throw new Error("API key not configured");
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Authorization": `Bearer ${key}`, "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ model: MODEL, messages, max_tokens: 4096, temperature: 0.4, stream: false }),
      });
      if (!response.ok) throw new Error(`AI API ${response.status}`);
      const data = await response.json();
      const plan = data.choices?.[0]?.message?.content || "";

      messages.push({ role: "assistant", content: plan });
      await supabase.from("ai_sessions").update({
        phase: "plan", status: "completed", content: plan, messages: messages,
        updated_at: new Date().toISOString()
      }).eq("session_id", sessionId);

      return json({ success: true, session_id: sessionId, phase: "plan", status: "completed", plan, searchResults: searchResults.substring(0, 500), searched: !!searchResults });
    }

    // ========================================
    // BUILD: generate/edit with STREAMING
    // ========================================
    if (action === "build") {
      const { prompt, current_html, is_edit, plan: buildPlan } = body;
      if (!prompt) return errorResponse("prompt required");
      const supabase = await createServiceClient();
      const sessionId = session_id || crypto.randomUUID();
      const editMode = is_edit !== false;

      // If session exists with completed plan, use saved plan
      let savedPlan = buildPlan || "";
      if (session_id) {
        const { data: session } = await supabase.from("ai_sessions")
          .select("*").eq("session_id", session_id).order("created_at", { ascending: false }).limit(1).maybeSingle();
        if (session) {
          if (session.phase === "build" && session.status === "completed") {
            const { edits, summary } = parseEdits(session.content || "");
            return json({ success: true, session_id, edits, summary, already_done: true });
          }
          savedPlan = session.content || buildPlan || "";
        }
      }

      // Build messages — full HTML, no truncation
      let buildMessages: Array<any>;
      if (editMode) {
        let userContent = `EXISTING HTML MODULE:\n\n${current_html}\n\n`;
        if (savedPlan) userContent += `PLAN:\n${savedPlan}\n\n`;
        userContent += `EDIT INSTRUCTION: ${prompt}\n\nReturn ONLY the changes as SEARCH/REPLACE blocks.`;
        buildMessages = [{ role: "system", content: SYSTEM_TARGETED }, { role: "user", content: userContent }];
      } else {
        let userContent = `USER REQUEST: ${prompt}\n\nPLAN:\n${savedPlan}\n\nBuild the module. Return the HTML in a code block.`;
        buildMessages = [{ role: "system", content: SYSTEM_GENERATE }, { role: "user", content: userContent }];
      }

      // Save messages before calling API
      await supabase.from("ai_sessions").upsert({
        session_id: sessionId, phase: "build", status: "in_progress", messages: buildMessages,
      }, { onConflict: "session_id" });

      // Call API with STREAMING and return a STREAMING RESPONSE to the client
      // This keeps the connection alive — data flows from DeepSeek → edge function → client
      // Supabase won't kill the function as long as data is being sent
      const key = Deno.env.get("KIMI_API_KEY");
      if (!key) throw new Error("API key not configured");
      const aiResponse = await fetch(API_URL, {
        method: "POST",
        headers: { "Authorization": `Bearer ${key}`, "Accept": "text/event-stream", "Content-Type": "application/json" },
        body: JSON.stringify({ model: MODEL, messages: buildMessages, max_tokens: editMode ? 4096 : 8192, temperature: editMode ? 0.2 : 0.5, stream: true }),
      });

      if (!aiResponse.ok) throw new Error(`AI API ${aiResponse.status}`);

      // Create a streaming response that pipes DeepSeek's stream to the client
      // AND accumulates the content to save to DB when done
      const encoder = new TextEncoder();
      let fullContent = "";

      const stream = new ReadableStream({
        async start(controller) {
          const reader = aiResponse.body!.getReader();
          const decoder = new TextDecoder();
          let buffer = "";

          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split("\n");
              buffer = lines.pop() || "";
              for (const line of lines) {
                if (line.startsWith("data: ")) {
                  const jsonStr = line.slice(6).trim();
                  if (jsonStr === "[DONE]") continue;
                  try {
                    const chunk = JSON.parse(jsonStr);
                    const delta = chunk.choices?.[0]?.delta;
                    if (delta?.content) {
                      fullContent += delta.content;
                      // Send each chunk to the client as a JSON line
                      controller.enqueue(encoder.encode(JSON.stringify({ chunk: delta.content }) + "\n"));
                    }
                  } catch {}
                }
              }
            }
            // Stream complete — save to DB
            buildMessages.push({ role: "assistant", content: fullContent });
            await supabase.from("ai_sessions").update({
              phase: "build", status: "completed", content: fullContent, messages: buildMessages,
              updated_at: new Date().toISOString()
            }).eq("session_id", sessionId);
            // Send final result
            if (editMode) {
              const { edits, summary } = parseEdits(fullContent);
              controller.enqueue(encoder.encode(JSON.stringify({ done: true, edits, summary }) + "\n"));
            } else {
              controller.enqueue(encoder.encode(JSON.stringify({ done: true, html: extractHtml(fullContent), reply: "Module generated." }) + "\n"));
            }
          } catch (e) {
            controller.enqueue(encoder.encode(JSON.stringify({ error: (e as Error).message }) + "\n"));
          }
          controller.close();
        }
      });

      return new Response(stream, {
        headers: { ...CORS_HEADERS, "Content-Type": "application/x-ndjson", "Transfer-Encoding": "chunked" }
      });
    }

    // ========================================
    // CONTINUE: resume from saved messages
    // ========================================
    if (action === "continue") {
      if (!session_id) return errorResponse("session_id required");
      const supabase = await createServiceClient();

      const { data: session } = await supabase.from("ai_sessions")
        .select("*").eq("session_id", session_id).order("created_at", { ascending: false }).limit(1).maybeSingle();

      if (!session) return errorResponse("Session not found", 404);

      // If already completed, return saved result
      if (session.status === "completed") {
        if (session.phase === "plan") {
          return json({ success: true, session_id, phase: "plan", status: "completed", plan: session.content });
        } else if (session.phase === "build") {
          const { edits, summary } = parseEdits(session.content || "");
          return json({ success: true, session_id, edits, summary, already_done: true });
        }
      }

      // Resume: load saved messages and retry with STREAMING
      const savedMessages = session.messages || [];
      if (!savedMessages.length) return errorResponse("No saved messages", 400);

      // Mark as in_progress
      await supabase.from("ai_sessions").update({
        status: "in_progress", error: null, updated_at: new Date().toISOString()
      }).eq("session_id", session_id);

      const key = Deno.env.get("KIMI_API_KEY");
      if (!key) throw new Error("API key not configured");

      // Use streaming to avoid timeout
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Authorization": `Bearer ${key}`, "Accept": "text/event-stream", "Content-Type": "application/json" },
        body: JSON.stringify({ model: MODEL, messages: savedMessages, max_tokens: 8192, temperature: 0.2, stream: true }),
      });

      if (!response.ok) throw new Error(`AI API ${response.status}`);

      let fullContent = "";
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const jsonStr = line.slice(6).trim();
            if (jsonStr === "[DONE]") continue;
            try {
              const chunk = JSON.parse(jsonStr);
              const delta = chunk.choices?.[0]?.delta;
              if (delta?.content) fullContent += delta.content;
            } catch {}
          }
        }
      }

      // Save result
      savedMessages.push({ role: "assistant", content: fullContent });
      await supabase.from("ai_sessions").update({
        status: "completed", content: fullContent, messages: savedMessages, error: null,
        updated_at: new Date().toISOString()
      }).eq("session_id", session_id);

      if (session.phase === "plan") {
        return json({ success: true, session_id, phase: "plan", status: "completed", plan: fullContent });
      } else {
        const { edits, summary } = parseEdits(fullContent);
        return json({ success: true, session_id, edits, summary });
      }
    }

    // ========================================
    // TEST
    // ========================================
    if (action === "test") {
      const { current_html } = body;
      if (!current_html) return errorResponse("current_html required");
      const key = Deno.env.get("KIMI_API_KEY");
      if (!key) throw new Error("API key not configured");
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Authorization": `Bearer ${key}`, "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ model: MODEL, messages: [
          { role: "system", content: "You are a QA tester. Return JSON: {\"issues\":[\"...\"],\"suggestions\":[\"...\"],\"overall\":\"good|needs_work|broken\"}" },
          { role: "user", content: `Analyze this HTML:\n${current_html.substring(0, 3000)}` }
        ], max_tokens: 2048, temperature: 0.3, stream: false }),
      });
      if (!response.ok) throw new Error(`AI API ${response.status}`);
      const data = await response.json();
      const analysis = data.choices?.[0]?.message?.content || "";
      try {
        const jsonMatch = analysis.match(/\{[\s\S]*\}/);
        if (jsonMatch) return json({ success: true, test: JSON.parse(jsonMatch[0]) });
      } catch {}
      return json({ success: true, test: { issues: [], suggestions: [], overall: "unknown" } });
    }

    // ========================================
    // FIX (uses SEARCH/REPLACE)
    // ========================================
    if (action === "fix") {
      const { current_html, issues, suggestions } = body;
      if (!current_html) return errorResponse("current_html required");
      const key = Deno.env.get("KIMI_API_KEY");
      if (!key) throw new Error("API key not configured");
      let userContent = `EXISTING HTML:\n\n${current_html}\n\nFix these issues:\n${(issues||[]).join("\n")}\n\nReturn ONLY the changes as SEARCH/REPLACE blocks.`;
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Authorization": `Bearer ${key}`, "Accept": "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ model: MODEL, messages: [
          { role: "system", content: SYSTEM_TARGETED },
          { role: "user", content: userContent }
        ], max_tokens: 4096, temperature: 0.2, stream: false }),
      });
      if (!response.ok) throw new Error(`AI API ${response.status}`);
      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || "";
      const { edits, summary } = parseEdits(content);
      return json({ success: true, edits, summary });
    }

    return errorResponse("Unknown action. Use: plan, build, continue, test, fix");
  } catch (e) {
    // Save error state
    if (session_id) {
      const supabase = await createServiceClient();
      await supabase.from("ai_sessions").update({
        status: "paused_on_error", error: (e as Error).message,
        updated_at: new Date().toISOString()
      }).eq("session_id", session_id);
    }
    return json({ success: false, session_id, error: (e as Error).message, can_continue: true }, 500);
  }
});
