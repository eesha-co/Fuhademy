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

Deno.serve(async (req: Request) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);

  const body = await req.json();
  const { session_id, current_html, prompt, is_edit, plan } = body;

  if (!session_id) return errorResponse("session_id required");
  const supabase = await createServiceClient();

  try {
    // LOAD THE SAVED SESSION FROM DB — this has the full messages array
    const { data: session, error: loadErr } = await supabase.from("ai_sessions")
      .select("*").eq("session_id", session_id).order("created_at", { ascending: false }).limit(1).maybeSingle();

    if (!session) return errorResponse("Session not found", 404);

    // ========================================
    // CASE 1: Plan was paused/timed out — RESUME with saved messages
    // ========================================
    if (session.phase === "plan" && (session.status === "in_progress" || session.status === "paused_on_error")) {
      // Load the EXACT messages that were saved before the timeout
      const savedMessages = session.messages || [];
      if (!savedMessages.length) return errorResponse("No saved messages to resume", 400);

      // Send the EXACT same messages to the API — true continuation
      const planResult = await callAI(savedMessages, 4096, 0.4);

      // SUCCESS — append assistant response and save
      savedMessages.push({ role: "assistant", content: planResult });
      await supabase.from("ai_sessions").update({
        phase: "plan",
        status: "completed",
        content: planResult,
        messages: savedMessages,
        error: null,
        updated_at: new Date().toISOString()
      }).eq("session_id", session_id);

      return json({
        success: true, session_id, phase: "plan", status: "completed",
        plan: planResult,
      });
    }

    // ========================================
    // CASE 2: Plan completed — start build phase
    // ========================================
    if (session.phase === "plan" && session.status === "completed") {
      const savedPlan = session.content || plan || "";
      const editMode = is_edit !== false;

      // Build messages for the build phase
      let buildMessages: Array<any>;
      if (editMode) {
        let userContent = `EXISTING HTML MODULE:\n\n${current_html}\n\nPLAN:\n${savedPlan}\n\nEDIT INSTRUCTION: ${prompt}\n\nReturn ONLY the changes as SEARCH/REPLACE blocks.`;
        buildMessages = [{ role: "system", content: SYSTEM_TARGETED }, { role: "user", content: userContent }];
      } else {
        let userContent = `USER REQUEST: ${prompt}\n\nPLAN:\n${savedPlan}\n\nBuild the module. Return the HTML in a code block.`;
        buildMessages = [{ role: "system", content: SYSTEM_GENERATE }, { role: "user", content: userContent }];
      }

      // SAVE build messages to DB BEFORE calling API
      await supabase.from("ai_sessions").update({
        phase: "build",
        status: "in_progress",
        messages: buildMessages,  // FULL build messages saved
        updated_at: new Date().toISOString()
      }).eq("session_id", session_id);

      // Call AI
      const content = await callAI(buildMessages, editMode ? 4096 : 8192, editMode ? 0.2 : 0.5);

      // SUCCESS — save result
      buildMessages.push({ role: "assistant", content });
      await supabase.from("ai_sessions").update({
        phase: "build",
        status: "completed",
        content: content,
        messages: buildMessages,
        updated_at: new Date().toISOString()
      }).eq("session_id", session_id);

      return json({
        success: true, session_id, phase: "build", status: "completed",
        edits: editMode ? parseEdits(content).edits : undefined,
        html: editMode ? undefined : extractHtml(content),
        summary: editMode ? parseEdits(content).summary : "Module generated.",
      });
    }

    // ========================================
    // CASE 3: Build was paused/timed out — RESUME with saved messages
    // ========================================
    if (session.phase === "build" && (session.status === "in_progress" || session.status === "paused_on_error")) {
      // Load the EXACT build messages that were saved before the timeout
      const savedMessages = session.messages || [];
      if (!savedMessages.length) return errorResponse("No saved build messages to resume", 400);

      // Send the EXACT same messages to the API — true continuation
      const content = await callAI(savedMessages, 8192, 0.2);

      // SUCCESS — append assistant response and save
      savedMessages.push({ role: "assistant", content });
      await supabase.from("ai_sessions").update({
        phase: "build",
        status: "completed",
        content: content,
        messages: savedMessages,
        error: null,
        updated_at: new Date().toISOString()
      }).eq("session_id", session_id);

      const editMode = is_edit !== false;
      return json({
        success: true, session_id, phase: "build", status: "completed",
        edits: editMode ? parseEdits(content).edits : undefined,
        html: editMode ? undefined : extractHtml(content),
        summary: editMode ? parseEdits(content).summary : "Module generated.",
      });
    }

    // ========================================
    // CASE 4: Build already completed — return saved result
    // ========================================
    if (session.phase === "build" && session.status === "completed") {
      const content = session.content || "";
      const editMode = is_edit !== false;
      return json({
        success: true, session_id, phase: "build", status: "completed",
        edits: editMode ? parseEdits(content).edits : undefined,
        html: editMode ? undefined : extractHtml(content),
        summary: editMode ? parseEdits(content).summary : "Module generated.",
      });
    }

    return json({ success: false, message: "Session in unexpected state", phase: session.phase, status: session.status });

  } catch (e) {
    // ERROR — messages are ALREADY saved in DB from the earlier save
    // The Continue button will load them and retry with EXACT same messages
    const errorMsg = (e as Error).message;
    if (session_id) {
      await supabase.from("ai_sessions").update({
        status: "paused_on_error",
        error: errorMsg,
        updated_at: new Date().toISOString()
      }).eq("session_id", session_id);
    }

    return json({
      success: false,
      session_id,
      error: errorMsg,
      can_continue: true,  // Show Continue button — messages are saved
    }, 500);
  }
});

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
