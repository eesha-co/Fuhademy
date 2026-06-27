import { json, errorResponse, handleOptions, createServiceClient } from "../_shared/helpers.ts";

const API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const MODEL = "deepseek-ai/deepseek-v4-pro";

const SYSTEM_PLAN = `You are an expert educational content strategist. Create a detailed plan for building or editing an HTML learning module. Include: WHAT YOU UNDERSTOOD, WEB RESEARCH, DECISIONS, and APPROACH.`;

const SYSTEM_TARGETED = `You are an expert HTML editor. Return ONLY changes as SEARCH/REPLACE blocks.
Format:
<<<< SEARCH
[text to find]
==== REPLACE
[new text]
>>>>
After blocks, write one sentence about what you changed.`;

async function callAI(messages: Array<any>, maxTokens = 4096, temperature = 0.3): Promise<string> {
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

Deno.serve(async (req: Request) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);
  try {
    const { prompt, current_html, search, session_id } = await req.json();
    if (!prompt) return errorResponse("prompt required");
    const supabase = await createServiceClient();

    // Create or update session
    const sessionId = session_id || crypto.randomUUID();
    const isEdit = !!(current_html && current_html.length > 50);

    // Check if session exists (continuation)
    const { data: existing } = await supabase.from("ai_sessions").select("*").eq("session_id", sessionId).order("created_at", { ascending: false }).limit(1).single();
    
    if (existing && existing.status === "completed" && existing.phase === "plan") {
      // Plan already done — skip to build
      return json({ success: true, session_id: sessionId, phase: "plan_done", plan: existing.content });
    }

    // Write initial session state
    await supabase.from("ai_sessions").upsert({
      session_id: sessionId,
      phase: "plan",
      status: "in_progress",
      content: "",
    }, { onConflict: "session_id" }).select("*").single();

    // Step 1: Web search
    const searchQuery = isEdit ? `${prompt} educational content` : `${prompt} educational module`;
    const searchResults = search !== false ? await webSearch(searchQuery) : "";

    // Update session with search results
    await supabase.from("ai_sessions").update({ 
      content: `WEB RESEARCH:\n${searchResults.substring(0, 500)}\n\nPlanning...`,
      updated_at: new Date().toISOString()
    }).eq("session_id", sessionId);

    // Step 2: Generate plan
    let userContent = `USER REQUEST: ${prompt}\n\n`;
    if (current_html) userContent += `EXISTING MODULE:\n${current_html}\n\n`;
    if (searchResults) userContent += `WEB RESEARCH:\n${searchResults}\n\n`;
    userContent += isEdit ? "Create a detailed plan for editing this module." : "Create a detailed plan for building this module.";

    const plan = await callAI(
      [{ role: "system", content: SYSTEM_PLAN }, { role: "user", content: userContent }],
      4096, 0.4
    );

    // Save completed plan
    await supabase.from("ai_sessions").update({
      phase: "plan",
      status: "completed",
      content: plan,
      updated_at: new Date().toISOString()
    }).eq("session_id", sessionId);

    return json({
      success: true,
      session_id: sessionId,
      phase: "plan",
      status: "completed",
      plan: plan,
      searchResults: searchResults.substring(0, 500),
      searched: !!searchResults,
    });
  } catch (e) {
    return errorResponse("Server error: " + (e as Error).message, 500);
  }
});
