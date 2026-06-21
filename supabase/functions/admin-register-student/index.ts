import { json, errorResponse, handleOptions, createServiceClient, hashPassword } from "../_shared/helpers.ts";

Deno.serve(async (req: Request) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);

  try {
    const { admin_username, admin_password, student } = await req.json();
    if (!admin_username || !admin_password || !student) {
      return errorResponse("admin_username, admin_password, and student data are required");
    }
    const supabase = await createServiceClient();

    // Verify admin
    const { data: admin } = await supabase.from("admins").select("*").eq("username", admin_username).single();
    const { verifyPassword } = await import("../_shared/helpers.ts");
    if (!admin || !(await verifyPassword(admin_password, admin.password_hash))) {
      return errorResponse("Admin authentication failed", 401);
    }

    // Validate student fields
    if (!student.username || !student.password || !student.full_name || !student.class_name) {
      return errorResponse("student requires: username, password, full_name, class_name");
    }
    const validClasses = ["JSS1","JSS2","JSS3","SSS1","SSS2","SSS3"];
    if (!validClasses.includes(student.class_name)) {
      return errorResponse("class_name must be one of: " + validClasses.join(", "));
    }

    // Check username uniqueness
    const { data: existing } = await supabase.from("students").select("id").eq("username", student.username).single();
    if (existing) return errorResponse("Username already exists", 409);

    const password_hash = await hashPassword(student.password);
    const { data: created, error } = await supabase.from("students").insert({
      username: student.username,
      password_hash,
      full_name: student.full_name,
      class_name: student.class_name,
      email: student.email || null,
      phone: student.phone || null,
      guardian_name: student.guardian_name || null,
    }).select("id, username, full_name, class_name, created_at").single();

    if (error) return errorResponse("Failed to register student: " + error.message, 500);
    return json({ success: true, student: created });
  } catch (e) {
    return errorResponse("Server error: " + (e as Error).message, 500);
  }
});
