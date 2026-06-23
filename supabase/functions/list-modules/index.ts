import { json, errorResponse, handleOptions, createServiceClient } from "../_shared/helpers.ts";

// Lists modules in the Supabase storage bucket, filtered by subject folder
Deno.serve(async (req: Request) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);
  try {
    const { subject } = await req.json();
    if (!subject) return errorResponse("subject required (e.g. 'chemistry', 'physics')");

    const supabase = await createServiceClient();
    // List files in the subject folder within the 'modules' bucket
    const { data, error } = await supabase.storage
      .from("modules")
      .list(subject, { limit: 500, sortBy: { column: "name", order: "asc" } });

    if (error) return errorResponse("Failed to list modules: " + error.message, 500);

    // Format the response — only .html files
    const modules = (data || [])
      .filter((f: any) => f.name.endsWith(".html"))
      .map((f: any) => ({
        name: f.name,
        title: f.name.replace(/\.html$/, "").replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
        subject: subject,
        size: f.metadata?.size || 0,
        url: `https://kruwfhzfqieuiuhqlutt.supabase.co/storage/v1/object/public/modules/${subject}/${f.name}`,
        created_at: f.created_at || null,
      }));

    return json({ success: true, modules });
  } catch (e) { return errorResponse("Server error: " + (e as Error).message, 500); }
});
