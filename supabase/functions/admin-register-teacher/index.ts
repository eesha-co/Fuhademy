import { json, errorResponse, handleOptions, createServiceClient, hashPassword, verifyPassword } from "../_shared/helpers.ts";

Deno.serve(async (req: Request) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);

  try {
    const { admin_username, admin_password, teacher } = await req.json();
    if (!admin_username || !admin_password || !teacher) {
      return errorResponse("admin_username, admin_password, and teacher data are required");
    }
    const supabase = await createServiceClient();

    const { data: admin } = await supabase.from("admins").select("*").eq("username", admin_username).single();
    if (!admin || !(await verifyPassword(admin_password, admin.password_hash))) {
      return errorResponse("Admin authentication failed", 401);
    }

    if (!teacher.username || !teacher.password || !teacher.full_name || !teacher.subject) {
      return errorResponse("teacher requires: username, password, full_name, subject");
    }
    const { data: existing } = await supabase.from("teachers").select("id").eq("username", teacher.username).single();
    if (existing) return errorResponse("Username already exists", 409);

    const password_hash = await hashPassword(teacher.password);
    const { data: created, error } = await supabase.from("teachers").insert({
      username: teacher.username,
      password_hash,
      full_name: teacher.full_name,
      subject: teacher.subject,
      email: teacher.email || null,
      phone: teacher.phone || null,
    }).select("id, username, full_name, subject, created_at").single();

    if (error) return errorResponse("Failed to register teacher: " + error.message, 500);
    return json({ success: true, teacher: created });
  } catch (e) {
    return errorResponse("Server error: " + (e as Error).message, 500);
  }
});
