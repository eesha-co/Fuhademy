import { json, errorResponse, handleOptions, createServiceClient } from "../_shared/helpers.ts";

Deno.serve(async (req: Request) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);
  try {
    const { sender_id, sender_role, sender_name, receiver_id, receiver_role, receiver_name, ciphertext, iv } = await req.json();
    if (!sender_id || !receiver_id || !ciphertext) return errorResponse("sender_id, receiver_id, ciphertext required");
    const supabase = await createServiceClient();

    // Store ONLY the ciphertext — server cannot decrypt (no private keys)
    const { data, error } = await supabase.from("messages").insert({
      sender_id, sender_role, sender_name,
      receiver_id, receiver_role, receiver_name,
      content: ciphertext, // encrypted message (base64)
      iv: iv || null,       // initialization vector for AES-GCM
    }).select("*").single();

    if (error) return errorResponse("Failed: " + error.message, 500);
    return json({ success: true, message: data });
  } catch (e) { return errorResponse("Server error: " + (e as Error).message, 500); }
});
