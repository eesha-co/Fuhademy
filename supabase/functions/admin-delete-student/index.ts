import { json, errorResponse, handleOptions, createServiceClient } from "../_shared/helpers.ts";

Deno.serve(async (req: Request) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);
  try {
    const { admin_id, student_id } = await req.json();
    if (!admin_id || !student_id) return errorResponse("admin_id and student_id required");
    const supabase = await createServiceClient();
    const { data: admin } = await supabase.from("admins").select("id").eq("id", admin_id).single();
    if (!admin) return errorResponse("Admin not found", 401);

    // Delete related records first (scores, subscriptions, attendance, messages)
    await supabase.from("scores").delete().eq("student_id", student_id);
    await supabase.from("subscriptions").delete().eq("student_id", student_id);
    await supabase.from("attendance").delete().eq("student_id", student_id);
    await supabase.from("messages").delete().eq("sender_id", student_id);
    await supabase.from("messages").delete().eq("receiver_id", student_id);

    const { error } = await supabase.from("students").delete().eq("id", student_id);
    if (error) return errorResponse("Failed: " + error.message, 500);
    return json({ success: true, deleted: student_id });
  } catch (e) { return errorResponse("Server error: " + (e as Error).message, 500); }
});
