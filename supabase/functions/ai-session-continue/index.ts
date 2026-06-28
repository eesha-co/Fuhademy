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

async function callAI(messages: Array<any>, maxTokens = 8192, temperature = 0.2): Promise<string> {
  const key = Deno.env.get("KIMI_API_KEY");
  if (!key) throw new Error("API key not configured");
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Authorization": `Bearer ${key}`, "Accept": "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ model: MODEL, messages, max_tokens: maxTokens, temperature, stream: false }),
  });
  if (!response.ok) throw new Error(`AI API ${response.status}: ${(await response.text()).substring(0, 300)}`);
  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
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

Deno.serve(async (req: Request) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);
  try {
    const { session_id, current_html, prompt, is_edit, plan } = await req.json();
    if (!session_id) return errorResponse("session_id required");
    const supabase = await createServiceClient();

    // Load the saved session from DB
    const { data: session } = await supabase.from("ai_sessions")
      .select("*").eq("session_id", session_id).order("created_at", { ascending: false }).limit(1).maybeSingle();

    if (!session) return errorResponse("Session not found", 404);

    // CASE 1: Build already completed — return saved result
    if (session.phase === "build" && session.status === "completed") {
      const { edits, summary } = parseEdits(session.content || "");
      return json({ success: true, session_id, phase: "build", status: "completed", edits, summary });
    }

    // CASE 2: Build was in progress or paused — RESUME with saved messages
    // Load the SAVED messages from DB (this is the key: same conversation context)
    let buildMessages: Array<any>;

    if (session.phase === "build" && (session.status === "in_progress" || session.status === "paused_on_error")) {
      // Resume: use the SAVED messages from DB (don't rebuild from scratch)
      buildMessages = session.messages || [];
      if (!buildMessages.length) {
        // Fallback: rebuild if messages weren't saved
        const savedPlan = session.content || plan || "";
        let userContent = `EXISTING HTML MODULE:\n\n${current_html}\n\n`;
        if (savedPlan) userContent += `PLAN:\n${savedPlan}\n\n`;
        userContent += `EDIT INSTRUCTION: ${prompt}\n\nReturn ONLY the changes as SEARCH/REPLACE blocks.`;
        buildMessages = [
          { role: "system", content: SYSTEM_TARGETED },
          { role: "user", content: userContent }
        ];
      }
    } else if (session.phase === "plan" && session.status === "completed") {
      // Plan done, start build — build messages fresh
      const savedPlan = session.content || plan || "";
      const editMode = is_edit !== false;
      if (editMode) {
        let userContent = `EXISTING HTML MODULE:\n\n${current_html}\n\n`;
        if (savedPlan) userContent += `PLAN:\n${savedPlan}\n\n`;
        userContent += `EDIT INSTRUCTION: ${prompt}\n\nReturn ONLY the changes as SEARCH/REPLACE blocks.`;
        buildMessages = [
          { role: "system", content: SYSTEM_TARGETED },
          { role: "user", content: userContent }
        ];
      } else {
        let userContent = `USER REQUEST: ${prompt}\n\n`;
        if (savedPlan) userContent += `PLAN:\n${savedPlan}\n\n`;
        userContent += `Build the module. Return the HTML in a code block.`;
        buildMessages = [
          { role: "system", content: SYSTEM_GENERATE },
          { role: "user", content: userContent }
        ];
      }
    } else {
      return json({ success: false, message: "Session in unexpected state", phase: session.phase, status: session.status });
    }

    // Save messages to DB BEFORE calling API (so they survive timeout)
    await supabase.from("ai_sessions").update({
      phase: "build",
      status: "in_progress",
      messages: buildMessages,
      updated_at: new Date().toISOString()
    }).eq("session_id", session_id);

    // Call AI with the messages (either saved or freshly built)
    const editMode = is_edit !== false;
    const content = await callAI(buildMessages, editMode ? 4096 : 8192, editMode ? 0.2 : 0.5);

    // Save completed build result + updated messages
    buildMessages.push({ role: "assistant", content });
    await supabase.from("ai_sessions").update({
      phase: "build",
      status: "completed",
      content: content,
      messages: buildMessages,
      updated_at: new Date().toISOString()
    }).eq("session_id", session_id);

    // Return result
    if (editMode) {
      const { edits, summary } = parseEdits(content);
      return json({ success: true, session_id, phase: "build", status: "completed", edits, summary });
    } else {
      let html = "";
      let m = content.match(/```html\s*\n?([\s\S]*?)```/i);
      if (m) html = m[1].trim();
      if (!html) { m = content.match(/```(?:\w*\s*\n?)?([\s\S]*?)```/i); if (m && m[1] && m[1].includes("<")) html = m[1].trim(); }
      if (!html) html = content.trim();
      return json({ success: true, session_id, phase: "build", status: "completed", html, reply: "Module generated." });
    }
  } catch (e) {
    // Save error state — messages preserved for Continue
    const body = await req.json().catch(() => ({}));
    if (body.session_id) {
      const supabase = await createServiceClient();
      await supabase.from("ai_sessions").update({
        status: "paused_on_error",
        error: (e as Error).message,
        updated_at: new Date().toISOString()
      }).eq("session_id", body.session_id);
    }
    return errorResponse("Server error: " + (e as Error).message, 500);
  }
});
