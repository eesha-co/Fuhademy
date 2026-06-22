import { json, errorResponse, handleOptions, createServiceClient } from "../_shared/helpers.ts";

// Returns the list of people a user can message:
// - Students: teachers who have access to their class
// - Teachers: students in their class_access classes
Deno.serve(async (req: Request) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);
  try {
    const { user_id, role, class_name, class_access } = await req.json();
    if (!user_id || !role) return errorResponse("user_id and role required");
    const supabase = await createServiceClient();

    if (role === "student") {
      // Get teachers who have this student's class in their class_access
      const { data, error } = await supabase.from("teachers")
        .select("id, username, full_name, subject, class_access, public_key")
        .eq("is_active", true)
        .contains("class_access", [class_name]);
      if (error) return errorResponse("Failed: " + error.message, 500);
      return json({ success: true, contacts: data || [] });
    } else if (role === "teacher") {
      // Get students in the teacher's class_access classes
      const classes = class_access || [];
      if (classes.length === 0) return json({ success: true, contacts: [] });
      const { data, error } = await supabase.from("students")
        .select("id, username, full_name, class_name, public_key")
        .eq("is_active", true)
        .in("class_name", classes);
      if (error) return errorResponse("Failed: " + error.message, 500);
      return json({ success: true, contacts: data || [] });
    }
    return errorResponse("Invalid role");
  } catch (e) { return errorResponse("Server error: " + (e as Error).message, 500); }
});
