import { json, errorResponse, handleOptions, createServiceClient } from "../_shared/helpers.ts";

// Saves a module to the Supabase storage bucket
// Can create a new file OR update an existing one (upsert)
Deno.serve(async (req: Request) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);
  try {
    const { teacher_id, teacher_name, subject, filename, html, mode, class_name } = await req.json();
    if (!teacher_id) return errorResponse("teacher_id required");
    if (!subject) return errorResponse("subject required");
    if (!filename) return errorResponse("filename required");
    if (!html) return errorResponse("html content required");

    const supabase = await createServiceClient();
    // Verify teacher exists
    const { data: teacher } = await supabase.from("teachers").select("id, subject").eq("id", teacher_id).single();
    if (!teacher) return errorResponse("Teacher not found", 401);

    // Map subject to folder (lowercase)
    const folder = subject.toLowerCase().trim();
    const fullPath = `${folder}/${filename}`;

    // Upload to storage (upsert = true to allow updates)
    const { data, error } = await supabase.storage
      .from("modules")
      .upload(fullPath, html, { contentType: "text/html", upsert: true });

    if (error) return errorResponse("Storage upload failed: " + error.message, 500);

    const publicUrl = `https://kruwfhzfqieuiuhqlutt.supabase.co/storage/v1/object/public/modules/${fullPath}`;

    // Also insert/update an assignment record
    await supabase.from("assignments").upsert({
      title: "Module: " + filename.replace(".html", "").replace(/-/g, " "),
      description: `Interactive module by ${teacher_name}. Open to view the full lesson.`,
      class_name: class_name || "All Classes",
      subject: subject,
      teacher_id: teacher_id,
      teacher_name: teacher_name,
    }, { onConflict: "title,teacher_id" }).select("*");

    return json({
      success: true,
      url: publicUrl,
      path: fullPath,
      mode: mode || "saved",
      message: mode === "update" ? "Module updated in storage bucket" : "Module saved to storage bucket",
    });
  } catch (e) { return errorResponse("Server error: " + (e as Error).message, 500); }
});
