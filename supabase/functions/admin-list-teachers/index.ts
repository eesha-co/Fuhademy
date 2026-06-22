import { json, errorResponse, handleOptions, createServiceClient } from "../_shared/helpers.ts";

Deno.serve(async (req: Request) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);
  try {
    const { admin_id } = await req.json();
    if (!admin_id) return errorResponse("Admin authentication required", 401);
    const supabase = await createServiceClient();
    const { data: admin } = await supabase.from("admins").select("id").eq("id", admin_id).single();
    if (!admin) return errorResponse("Admin not found", 401);
    const { data, error } = await supabase.from("teachers").select("id, username, full_name, subject, email, phone, is_active, created_at").order("created_at", { ascending: false });
    if (error) return errorResponse("Failed: " + error.message, 500);
    return json({ success: true, teachers: data || [] });
  } catch (e) { return errorResponse("Server error: " + (e as Error).message, 500); }
});
