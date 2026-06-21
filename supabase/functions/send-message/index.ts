import { json, errorResponse, handleOptions, createServiceClient } from "../_shared/helpers.ts";

Deno.serve(async (req: Request) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);

  try {
    const { sender_id, sender_role, sender_name, receiver_id, receiver_role, receiver_name, content } = await req.json();
    if (!sender_id || !receiver_id || !content) return errorResponse("sender_id, receiver_id, content required");
    const supabase = await createServiceClient();

    const { data, error } = await supabase.from("messages").insert({
      sender_id, sender_role, sender_name,
      receiver_id, receiver_role, receiver_name,
      content,
    }).select("*").single();

    if (error) return errorResponse("Failed to send message: " + error.message, 500);
    return json({ success: true, message: data });
  } catch (e) {
    return errorResponse("Server error: " + (e as Error).message, 500);
  }
});
