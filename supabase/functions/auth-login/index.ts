import { json, errorResponse, handleOptions, createServiceClient, verifyPassword } from "../_shared/helpers.ts";

Deno.serve(async (req: Request) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);
  try {
    const { username, password, role } = await req.json();
    if (!username || !password || !role) return errorResponse("username, password, and role required");
    const supabase = await createServiceClient();
    const table = role === "student" ? "students" : role === "teacher" ? "teachers" : role === "admin" ? "admins" : null;
    if (!table) return errorResponse("Invalid role");

    const { data, error } = await supabase.from(table).select("*").eq("username", username).single();
    if (error || !data) {
      return json({ success: false, message: "Please ensure your credentials are correct or ensure you are registered by your school admin. If not registered, contact your school admin. You can also contact your school admin for a change in credentials." }, 401);
    }
    const valid = await verifyPassword(password, data.password_hash);
    if (!valid) {
      return json({ success: false, message: "Please ensure your credentials are correct or ensure you are registered by your school admin. If not registered, contact your school admin. You can also contact your school admin for a change in credentials." }, 401);
    }
    if (data.is_active === false) return errorResponse("Your account has been deactivated. Contact your school admin.", 403);

    // Return user data + encrypted_private_key (for E2EE) + public_key
    // The frontend will decrypt the private key using the password
    const { password_hash, ...safeUser } = data;
    return json({
      success: true,
      user: { ...safeUser, role },
      // For E2EE: return the encrypted private key + the password
      // The frontend decrypts it client-side and stores in session
      e2ee: {
        encrypted_private_key: data.encrypted_private_key || null,
        public_key: data.public_key || null,
      },
    });
  } catch (e) { return errorResponse("Server error: " + (e as Error).message, 500); }
});
