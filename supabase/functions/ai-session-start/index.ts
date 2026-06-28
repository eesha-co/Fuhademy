import { json, errorResponse, handleOptions, createServiceClient } from "../_shared/helpers.ts";

const API_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
const MODEL = "deepseek-ai/deepseek-v4-pro";

const SYSTEM_PLAN = `You are an expert educational content strategist. Create a detailed plan for building or editing an HTML learning module. Include: WHAT YOU UNDERSTOOD, WEB RESEARCH, DECISIONS, and APPROACH.`;

async function callAI(messages: Array<any>, maxTokens = 4096, temperature = 0.4): Promise<string> {
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
  
  const body = await req.json();
  const { prompt, current_html, search, session_id } = body;
  
  if (!prompt) return errorResponse("prompt required");
  const supabase = await createServiceClient();
  const sessionId = session_id || crypto.randomUUID();

  try {
    // Step 1: Web search
    const searchQuery = current_html ? `${prompt} educational content` : `${prompt} educational module`;
    const searchResults = search !== false ? await webSearch(searchQuery) : "";

    // Step 2: Build full messages array — NO TRUNCATION, full HTML included
    let userContent = `USER REQUEST: ${prompt}\n\n`;
    if (current_html) userContent += `EXISTING MODULE:\n${current_html}\n\n`;
    if (searchResults) userContent += `WEB RESEARCH:\n${searchResults}\n\n`;
    userContent += current_html ? "Create a detailed plan for editing this module." : "Create a detailed plan for building this module.";

    const messages = [
      { role: "system", content: SYSTEM_PLAN },
      { role: "user", content: userContent }
    ];

    // Step 3: SAVE FULL MESSAGES TO DB BEFORE calling API
    // This is the key — if the API times out, the exact messages survive
    await supabase.from("ai_sessions").upsert({
      session_id: sessionId,
      phase: "plan",
      status: "in_progress",
      content: "",
      messages: messages,  // FULL messages array saved here
    }, { onConflict: "session_id" });

    // Step 4: Call AI
    const plan = await callAI(messages, 4096, 0.4);

    // Step 5: SUCCESS — append assistant response to messages and save
    messages.push({ role: "assistant", content: plan });
    await supabase.from("ai_sessions").update({
      phase: "plan",
      status: "completed",
      content: plan,
      messages: messages,  // Updated with assistant response
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
    // ERROR — messages are ALREADY saved in DB from Step 3
    // The Continue button will load them and retry with the EXACT same messages
    await supabase.from("ai_sessions").update({
      status: "paused_on_error",
      error: (e as Error).message,
      updated_at: new Date().toISOString()
    }).eq("session_id", sessionId);

    return json({
      success: false,
      session_id: sessionId,
      error: (e as Error).message,
      can_continue: true,  // Tell frontend to show Continue button
    }, 500);
  }
});
