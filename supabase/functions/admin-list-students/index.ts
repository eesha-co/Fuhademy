import { json, errorResponse, handleOptions, createServiceClient } from "../_shared/helpers.ts";

Deno.serve(async (req: Request) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);
  try {
    const { admin_id, class_name } = await req.json();
    if (!admin_id) return errorResponse("Admin authentication required", 401);
    const supabase = await createServiceClient();
    const { data: admin } = await supabase.from("admins").select("id").eq("id", admin_id).single();
    if (!admin) return errorResponse("Admin not found", 401);

    let query = supabase.from("students").select("id, username, full_name, class_name, email, phone, guardian_name, is_active, created_at").order("created_at", { ascending: false });
    if (class_name && class_name !== "All") query = query.eq("class_name", class_name);
    const { data, error } = await query;
    if (error) return errorResponse("Failed: " + error.message, 500);

    // Also get subscription status for each student
    const { data: subs } = await supabase.from("subscriptions").select("student_id, status").in("student_id", (data || []).map(s => s.id));
    const subMap = new Map((subs || []).map(s => [s.student_id, s.status]));
    const students = (data || []).map(s => ({ ...s, subscription_status: subMap.get(s.id) || "none" }));

    return json({ success: true, students });
  } catch (e) { return errorResponse("Server error: " + (e as Error).message, 500); }
});
