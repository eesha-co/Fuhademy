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

async function callAI(messages: Array<any>, maxTokens = 4096, temperature = 0.2): Promise<string> {
  const key = Deno.env.get("KIMI_API_KEY");
  if (!key) throw new Error("API key not configured");
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Authorization": `Bearer ${key}`, "Accept": "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ model: MODEL, messages, max_tokens: maxTokens, temperature, stream: false }),
  });
  if (!response.ok) throw new Error(`AI API ${response.status}: ${(await response.text()).substring(0, 200)}`);
  const data = await response.json();
  return data.choices?.[0]?.message?.content || "";
}

Deno.serve(async (req: Request) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);
  try {
    const { session_id, current_html, prompt } = await req.json();
    if (!session_id) return errorResponse("session_id required");
    const supabase = await createServiceClient();

    // Get the session to find where we stopped
    const { data: session } = await supabase.from("ai_sessions")
      .select("*").eq("session_id", session_id).order("created_at", { ascending: false }).limit(1).maybeSingle();

    if (!session) return errorResponse("Session not found", 404);

    // If plan is done but build hasn't started, do the build
    if (session.phase === "plan" && session.status === "completed") {
      // Create build session entry
      await supabase.from("ai_sessions").insert({
        session_id: session_id,
        phase: "build",
        status: "in_progress",
        content: "",
      });

      const plan = session.content;
      const userContent = `EXISTING HTML MODULE:\n\n${current_html}\n\nPLAN:\n${plan}\n\nEDIT INSTRUCTION: ${prompt}\n\nReturn ONLY the changes as SEARCH/REPLACE blocks.`;

      const content = await callAI(
        [{ role: "system", content: SYSTEM_TARGETED }, { role: "user", content: userContent }],
        4096, 0.2
      );

      // Parse edits
      const edits: Array<{search: string, replace: string}> = [];
      const regex = /<<<<\s*SEARCH\s*\n([\s\S]*?)\n====\s*REPLACE\s*\n([\s\S]*?)\n>>>>/g;
      let match;
      while ((match = regex.exec(content)) !== null) {
        edits.push({ search: match[1], replace: match[2] });
      }

      let summary = content.replace(/<<<<\s*SEARCH[\s\S]*?>>>>/g, "").trim();
      if (!summary) summary = `Applied ${edits.length} edit(s).`;

      // Save build result
      await supabase.from("ai_sessions").update({
        phase: "build",
        status: "completed",
        content: content,
        updated_at: new Date().toISOString()
      }).eq("session_id", session_id).eq("phase", "build");

      return json({ success: true, session_id, phase: "build", status: "completed", edits, summary });
    }

    // If build is done, tell frontend to test
    if (session.phase === "build" && session.status === "completed") {
      return json({ success: true, session_id, phase: "build_done", message: "Build complete, ready for testing." });
    }

    return json({ success: false, message: "Unknown session state", session });
  } catch (e) {
    // Mark session as failed
    if (req.body) {
      try {
        const body = await req.json();
        const supabase = await createServiceClient();
        await supabase.from("ai_sessions").update({
          status: "failed",
          error: (e as Error).message,
          updated_at: new Date().toISOString()
        }).eq("session_id", body.session_id);
      } catch {}
    }
    return errorResponse("Server error: " + (e as Error).message, 500);
  }
});
