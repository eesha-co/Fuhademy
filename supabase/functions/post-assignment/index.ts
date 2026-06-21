import { json, errorResponse, handleOptions, createServiceClient } from "../_shared/helpers.ts";

Deno.serve(async (req: Request) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);
  try {
    const { teacher_id, teacher_name, class_name, subject, title, description, due_date } = await req.json();
    if (!teacher_id || !teacher_name || !class_name || !subject || !title) {
      return errorResponse("teacher_id, teacher_name, class_name, subject, title required");
    }
    const supabase = await createServiceClient();
    const { data, error } = await supabase.from("assignments").insert({
      teacher_id, teacher_name, class_name, subject, title,
      description: description || null,
      due_date: due_date || null,
    }).select("*").single();
    if (error) return errorResponse("Failed: " + error.message, 500);
    return json({ success: true, assignment: data });
  } catch (e) { return errorResponse("Server error: " + (e as Error).message, 500); }
});
