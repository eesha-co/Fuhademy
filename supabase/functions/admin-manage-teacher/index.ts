import { json, errorResponse, handleOptions, createServiceClient } from "../_shared/helpers.ts";

Deno.serve(async (req: Request) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);
  try {
    const { admin_id, teacher_id, action } = await req.json();
    if (!admin_id || !teacher_id || !action) return errorResponse("admin_id, teacher_id, action required");
    const supabase = await createServiceClient();
    const { data: admin } = await supabase.from("admins").select("id").eq("id", admin_id).single();
    if (!admin) return errorResponse("Admin not found", 401);

    if (action === "suspend" || action === "activate") {
      const { data, error } = await supabase.from("teachers").update({ is_active: action === "suspend" ? false : true }).eq("id", teacher_id).select("id, username, full_name, is_active").single();
      if (error) return errorResponse("Failed: " + error.message, 500);
      return json({ success: true, teacher: data, action });
    } else if (action === "delete") {
      await supabase.from("scores").delete().eq("teacher_id", teacher_id);
      await supabase.from("assignments").delete().eq("teacher_id", teacher_id);
      await supabase.from("messages").delete().eq("sender_id", teacher_id);
      await supabase.from("messages").delete().eq("receiver_id", teacher_id);
      const { error } = await supabase.from("teachers").delete().eq("id", teacher_id);
      if (error) return errorResponse("Failed: " + error.message, 500);
      return json({ success: true, deleted: teacher_id });
    }
    return errorResponse("Unknown action: use suspend, activate, or delete");
  } catch (e) { return errorResponse("Server error: " + (e as Error).message, 500); }
});
