import { json, errorResponse, handleOptions, createServiceClient, hashPassword, verifyPassword } from "../_shared/helpers.ts";

Deno.serve(async (req: Request) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);

  try {
    const { admin_id, teacher } = await req.json();
    if (!admin_id) return errorResponse("Admin authentication required (no session found). Please log in again.", 401);
    if (!teacher) return errorResponse("teacher data required");

    const supabase = await createServiceClient();
    const { data: admin } = await supabase.from("admins").select("id, username, full_name").eq("id", admin_id).single();
    if (!admin) return errorResponse("Admin not found. Please log in again.", 401);

    if (!teacher.username || !teacher.password || !teacher.full_name || !teacher.subject) {
      return errorResponse("teacher requires: username, password, full_name, subject");
    }

    // Check username uniqueness across both tables
    const { data: existingTeacher } = await supabase.from("teachers").select("id").eq("username", teacher.username).single();
    if (existingTeacher) return errorResponse("Username already exists", 409);
    const { data: existingStudent } = await supabase.from("students").select("id").eq("username", teacher.username).single();
    if (existingStudent) return errorResponse("Username already exists", 409);

    const password_hash = await hashPassword(teacher.password);
    const { data: created, error } = await supabase.from("teachers").insert({
      username: teacher.username,
      password_hash,
      full_name: teacher.full_name,
      subject: teacher.subject,
      email: teacher.email || null,
      phone: teacher.phone || null,
    }).select("id, username, full_name, subject, email, phone, is_active, created_at").single();

    if (error) return errorResponse("Failed to register teacher: " + error.message, 500);
    return json({ success: true, teacher: created, registered_by: admin.full_name });
  } catch (e) {
    return errorResponse("Server error: " + (e as Error).message, 500);
  }
});
