import { json, errorResponse, handleOptions, createServiceClient } from "../_shared/helpers.ts";

Deno.serve(async (req: Request) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);
  try {
    const { student_id, student_name, teacher_id, teacher_name, subject, class_name, score, max_score, exam_type, teacher_remark, exam_date } = await req.json();
    if (!student_id || !student_name || !teacher_name || !subject || !class_name || score === undefined) {
      return errorResponse("student_id, student_name, teacher_name, subject, class_name, score required");
    }
    const supabase = await createServiceClient();
    const { data, error } = await supabase.from("scores").insert({
      student_id, student_name, teacher_id: teacher_id || null, teacher_name,
      subject, class_name, score, max_score: max_score || 100,
      exam_type: exam_type || "CA", teacher_remark: teacher_remark || null,
      exam_date: exam_date || new Date().toISOString().split("T")[0],
    }).select("*").single();
    if (error) return errorResponse("Failed: " + error.message, 500);
    return json({ success: true, score: data });
  } catch (e) { return errorResponse("Server error: " + (e as Error).message, 500); }
});
