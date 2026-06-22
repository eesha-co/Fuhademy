import { json, errorResponse, handleOptions, createServiceClient, hashPassword } from "../_shared/helpers.ts";

Deno.serve(async (req: Request) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);
  try {
    const { admin_id, teacher } = await req.json();
    if (!admin_id) return errorResponse("Admin authentication required", 401);
    if (!teacher) return errorResponse("teacher data required");
    const supabase = await createServiceClient();
    const { data: admin } = await supabase.from("admins").select("id").eq("id", admin_id).single();
    if (!admin) return errorResponse("Admin not found", 401);

    if (!teacher.username || !teacher.password || !teacher.full_name || !teacher.subject) {
      return errorResponse("teacher requires: username, password, full_name, subject");
    }

    // Check username uniqueness
    const { data: existingT } = await supabase.from("teachers").select("id").eq("username", teacher.username).single();
    if (existingT) return errorResponse("Username already exists", 409);
    const { data: existingS } = await supabase.from("students").select("id").eq("username", teacher.username).single();
    if (existingS) return errorResponse("Username already exists", 409);

    const password_hash = await hashPassword(teacher.password);

    // Generate E2EE key pair (ECDH P-256) using Web Crypto
    // The key pair is generated HERE but the private key is immediately encrypted
    // with a key derived from the user's password, then the raw private key is discarded.
    // The server never stores the unencrypted private key.
    const keyPair = await crypto.subtle.generateKey(
      { name: "ECDH", namedCurve: "P-256" },
      true, // extractable so we can export
      ["deriveKey", "deriveBits"]
    );
    const publicKeyBuf = await crypto.subtle.exportKey("raw", keyPair.publicKey);
    const privateKeyBuf = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);

    // Convert to base64
    const pubKeyB64 = btoa(String.fromCharCode(...new Uint8Array(publicKeyBuf)));
    const privKeyBytes = new Uint8Array(privateKeyBuf);

    // Encrypt the private key with a key derived from the user's password
    // PBKDF2 → AES-GCM encryption of the private key
    const salt = crypto.getRandomValues(new Uint8Array(16));
    const passwordKeyMaterial = await crypto.subtle.importKey("raw", new TextEncoder().encode(teacher.password), "PBKDF2", false, ["deriveKey"]);
    const encryptionKey = await crypto.subtle.deriveKey(
      { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
      passwordKeyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt"]
    );
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encryptedPrivKey = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, encryptionKey, privKeyBytes);

    // Combine salt + iv + ciphertext for storage
    const encryptedBlob = btoa(String.fromCharCode(...salt, ...iv, ...new Uint8Array(encryptedPrivKey)));

    // Validate class_access
    const validClasses = ["JSS1","JSS2","JSS3","SSS1","SSS2","SSS3"];
    let classAccess = teacher.class_access || [];
    if (typeof classAccess === "string") classAccess = [classAccess];
    classAccess = classAccess.filter((c: string) => validClasses.includes(c));

    const { data: created, error } = await supabase.from("teachers").insert({
      username: teacher.username,
      password_hash,
      full_name: teacher.full_name,
      subject: teacher.subject,
      email: teacher.email || null,
      phone: teacher.phone || null,
      class_access: classAccess,
      public_key: pubKeyB64,
      encrypted_private_key: encryptedBlob,
    }).select("id, username, full_name, subject, class_access, email, phone, is_active, created_at").single();

    if (error) return errorResponse("Failed: " + error.message, 500);
    return json({ success: true, teacher: created });
  } catch (e) { return errorResponse("Server error: " + (e as Error).message, 500); }
});
