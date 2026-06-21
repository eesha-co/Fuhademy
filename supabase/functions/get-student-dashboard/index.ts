import { json, errorResponse, handleOptions, createServiceClient } from "../_shared/helpers.ts";

Deno.serve(async (req: Request) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);

  try {
    const { student_id, class_name } = await req.json();
    if (!student_id || !class_name) return errorResponse("student_id and class_name required");
    const supabase = await createServiceClient();

    const [scores, assignments, timetable, liveSessions, messages] = await Promise.all([
      supabase.from("scores").select("*").eq("student_id", student_id).order("created_at", { ascending: false }).limit(20),
      supabase.from("assignments").select("*").eq("class_name", class_name).order("created_at", { ascending: false }).limit(10),
      supabase.from("timetables").select("*").eq("class_name", class_name).order("day_of_week, period"),
      supabase.from("live_sessions").select("*").eq("class_name", class_name).eq("status", "ongoing"),
      supabase.from("messages").select("*").eq("receiver_id", student_id).is("read_at", null).limit(5),
    ]);

    return json({
      success: true,
      scores: scores.data || [],
      assignments: assignments.data || [],
      timetable: timetable.data || [],
      liveSessions: liveSessions.data || [],
      unreadMessages: (messages.data || []).length,
    });
  } catch (e) {
    return errorResponse("Server error: " + (e as Error).message, 500);
  }
});
