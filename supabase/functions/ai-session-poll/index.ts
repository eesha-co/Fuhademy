import { json, errorResponse, handleOptions, createServiceClient } from "../_shared/helpers.ts";

Deno.serve(async (req: Request) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);
  try {
    const { session_id } = await req.json();
    if (!session_id) return errorResponse("session_id required");
    const supabase = await createServiceClient();
    const { data, error } = await supabase.from("ai_sessions")
      .select("*").eq("session_id", session_id).order("created_at", { ascending: false }).limit(1).single();
    if (error || !data) return json({ success: false, status: "not_found" });
    return json({ success: true, session: data });
  } catch (e) { return errorResponse("Server error: " + (e as Error).message, 500); }
});
