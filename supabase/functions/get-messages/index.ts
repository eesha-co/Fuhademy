import { json, errorResponse, handleOptions, createServiceClient } from "../_shared/helpers.ts";

Deno.serve(async (req: Request) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);
  try {
    const { user_id, partner_id } = await req.json();
    if (!user_id || !partner_id) return errorResponse("user_id and partner_id required");
    const supabase = await createServiceClient();

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .or(`and(sender_id.eq.${user_id},receiver_id.eq.${partner_id}),and(sender_id.eq.${partner_id},receiver_id.eq.${user_id})`)
      .order("created_at", { ascending: true });

    if (error) return errorResponse("Failed: " + error.message, 500);

    // Mark received messages as read
    await supabase.from("messages").update({ read_at: new Date().toISOString() })
      .eq("receiver_id", user_id).eq("sender_id", partner_id).is("read_at", null);

    return json({ success: true, messages: data || [] });
  } catch (e) { return errorResponse("Server error: " + (e as Error).message, 500); }
});
