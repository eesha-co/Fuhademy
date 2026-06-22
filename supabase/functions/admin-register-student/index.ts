import { json, errorResponse, handleOptions, createServiceClient, hashPassword } from "../_shared/helpers.ts";

Deno.serve(async (req: Request) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);

  try {
    const { admin_id, student } = await req.json();
    // Verify admin by ID (from session cookie — no password re-entry needed)
    if (!admin_id) return errorResponse("Admin authentication required (no session found). Please log in again.", 401);
    if (!student) return errorResponse("student data required");

    const supabase = await createServiceClient();
    const { data: admin } = await supabase.from("admins").select("id, username, full_name").eq("id", admin_id).single();
    if (!admin) return errorResponse("Admin not found. Please log in again.", 401);

    // Validate student fields
    if (!student.username || !student.password || !student.full_name || !student.class_name) {
      return errorResponse("student requires: username, password, full_name, class_name");
    }
    const validClasses = ["JSS1","JSS2","JSS3","SSS1","SSS2","SSS3"];
    if (!validClasses.includes(student.class_name)) {
      return errorResponse("class_name must be one of: " + validClasses.join(", "));
    }

    // Check username uniqueness across BOTH students and teachers
    const { data: existingStudent } = await supabase.from("students").select("id").eq("username", student.username).single();
    if (existingStudent) return errorResponse("Username already exists", 409);
    const { data: existingTeacher } = await supabase.from("teachers").select("id").eq("username", student.username).single();
    if (existingTeacher) return errorResponse("Username already exists", 409);

    const password_hash = await hashPassword(student.password);
    const { data: created, error } = await supabase.from("students").insert({
      username: student.username,
      password_hash,
      full_name: student.full_name,
      class_name: student.class_name,
      email: student.email || null,
      phone: student.phone || null,
      guardian_name: student.guardian_name || null,
    }).select("id, username, full_name, class_name, email, phone, guardian_name, is_active, created_at").single();

    if (error) return errorResponse("Failed to register student: " + error.message, 500);
    return json({ success: true, student: created, registered_by: admin.full_name });
  } catch (e) {
    return errorResponse("Server error: " + (e as Error).message, 500);
  }
});
