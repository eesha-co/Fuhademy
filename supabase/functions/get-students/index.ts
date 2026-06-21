import { json, errorResponse, handleOptions, createServiceClient } from "../_shared/helpers.ts";

Deno.serve(async (req: Request) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);
  try {
    const { class_name } = await req.json();
    if (!class_name) return errorResponse("class_name required");
    const supabase = await createServiceClient();
    const { data, error } = await supabase.from("students")
      .select("id, username, full_name, class_name, is_active, created_at")
      .eq("class_name", class_name).eq("is_active", true);
    if (error) return errorResponse("Failed: " + error.message, 500);
    return json({ success: true, students: data || [] });
  } catch (e) { return errorResponse("Server error: " + (e as Error).message, 500); }
});
