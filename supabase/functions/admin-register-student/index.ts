import { json, errorResponse, handleOptions, createServiceClient, hashPassword } from "../_shared/helpers.ts";

Deno.serve(async (req: Request) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);
  try {
    const { admin_id, student } = await req.json();
    if (!admin_id) return errorResponse("Admin authentication required", 401);
    if (!student) return errorResponse("student data required");
    const supabase = await createServiceClient();
    const { data: admin } = await supabase.from("admins").select("id").eq("id", admin_id).single();
    if (!admin) return errorResponse("Admin not found", 401);

    if (!student.username || !student.password || !student.full_name || !student.class_name) {
      return errorResponse("student requires: username, password, full_name, class_name");
    }
    const validClasses = ["JSS1","JSS2","JSS3","SSS1","SSS2","SSS3"];
    if (!validClasses.includes(student.class_name)) {
      return errorResponse("class_name must be one of: " + validClasses.join(", "));
    }

    const { data: existingS } = await supabase.from("students").select("id").eq("username", student.username).single();
    if (existingS) return errorResponse("Username already exists", 409);
    const { data: existingT } = await supabase.from("teachers").select("id").eq("username", student.username).single();
    if (existingT) return errorResponse("Username already exists", 409);

    const password_hash = await hashPassword(student.password);

    // Generate E2EE key pair (same as teacher)
    const keyPair = await crypto.subtle.generateKey(
      { name: "ECDH", namedCurve: "P-256" },
      true,
      ["deriveKey", "deriveBits"]
    );
    const publicKeyBuf = await crypto.subtle.exportKey("raw", keyPair.publicKey);
    const privateKeyBuf = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
    const pubKeyB64 = btoa(String.fromCharCode(...new Uint8Array(publicKeyBuf)));
    const privKeyBytes = new Uint8Array(privateKeyBuf);

    // Encrypt private key with password-derived key
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const passwordKeyMaterial = await crypto.subtle.importKey("raw", new TextEncoder().encode(student.password), "PBKDF2", false, ["deriveKey"]);
    const encryptionKey = await crypto.subtle.deriveKey(
      { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
      passwordKeyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt"]
    );
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encryptedPrivKey = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, encryptionKey, privKeyBytes);
    const encryptedBlob = btoa(String.fromCharCode(...salt, ...iv, ...new Uint8Array(encryptedPrivKey)));

    const { data: created, error } = await supabase.from("students").insert({
      username: student.username,
      password_hash,
      full_name: student.full_name,
      class_name: student.class_name,
      email: student.email || null,
      phone: student.phone || null,
      guardian_name: student.guardian_name || null,
      public_key: pubKeyB64,
      encrypted_private_key: encryptedBlob,
    }).select("id, username, full_name, class_name, email, phone, guardian_name, is_active, created_at").single();

    if (error) return errorResponse("Failed: " + error.message, 500);
    return json({ success: true, student: created });
  } catch (e) { return errorResponse("Server error: " + (e as Error).message, 500); }
});
