import { json, errorResponse, handleOptions } from "../_shared/helpers.ts";

// This edge function proxies requests from the frontend to the Render-hosted
// AI module tester service. The Render URL is stored as a Supabase secret
// (MODULE_TESTER_URL) so it's not exposed in frontend code.

Deno.serve(async (req: Request) => {
  const preflight = handleOptions(req);
  if (preflight) return preflight;
  if (req.method !== "POST") return errorResponse("Method not allowed", 405);

  try {
    const RENDER_URL = Deno.env.get("MODULE_TESTER_URL");
    if (!RENDER_URL) {
      return errorResponse(
        "AI module tester is not configured yet. The school admin needs to deploy the ai-module-tester service and set MODULE_TESTER_URL in Supabase secrets.",
        503
      );
    }

    const body = await req.json();
    const { action } = body;

    // Map frontend actions to Render endpoints
    let endpoint = "";
    let payload: Record<string, unknown> = {};

    if (action === "generate") {
      endpoint = "/generate";
      payload = { prompt: body.prompt, current_html: body.current_html || null };
    } else if (action === "edit") {
      endpoint = "/edit";
      payload = { instruction: body.instruction || body.prompt, current_html: body.current_html };
    } else if (action === "test") {
      endpoint = "/test";
      payload = { htmlContent: body.current_html || body.html };
    } else if (action === "preview") {
      endpoint = "/start";
      payload = { htmlContent: body.current_html || body.html };
    } else {
      return errorResponse("Unknown action. Use: generate, edit, test, preview");
    }

    // Call the Render service
    const response = await fetch(`${RENDER_URL}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errText = await response.text();
      return errorResponse(`AI service error: ${errText}`, response.status);
    }

    const data = await response.json();
    return json(data);
  } catch (e) {
    return errorResponse("Server error: " + (e as Error).message, 500);
  }
});
