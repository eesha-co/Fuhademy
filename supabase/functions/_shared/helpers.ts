// Shared helpers for Blue Horizon Edge Functions (Deno runtime)
// These run on Supabase's edge runtime and use the SERVICE ROLE key.

export const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
  "Content-Type": "application/json",
};

export function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: CORS_HEADERS,
  });
}

export function errorResponse(message: string, status = 400): Response {
  return json({ error: message }, status);
}

export function handleOptions(req: Request): Response | null {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS_HEADERS });
  }
  return null;
}

// Create a Supabase admin client using the service_role key (bypasses RLS).
// The service_role key is set via `supabase secrets set` — NEVER in client code.
export async function createServiceClient() {
  const { createClient } = await import(
    "https://esm.sh/@supabase/supabase-js@2"
  );
  const url =
    Deno.env.get("SUPABASE_URL") ??
    "https://kruwfhzfqieuiuhqlutt.supabase.co";
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY not configured");
  }
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// Simple bcrypt-like hash using Web Crypto (PBKDF2).
// For production, prefer a proper bcrypt library via esm.sh.
export async function hashPassword(password: string): Promise<string> {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    keyMaterial,
    256,
  );
  const hashArr = new Uint8Array(bits);
  const saltHex = Array.from(salt).map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  const hashHex = Array.from(hashArr).map((b) =>
    b.toString(16).padStart(2, "0")
  ).join("");
  return `pbkdf2$100000$${saltHex}$${hashHex}`;
}

export async function verifyPassword(
  password: string,
  stored: string,
): Promise<boolean> {
  const parts = stored.split("$");
  if (parts.length !== 4 || parts[0] !== "pbkdf2") return false;
  const iterations = parseInt(parts[1], 10);
  const salt = new Uint8Array(
    parts[2].match(/.{2}/g)!.map((b) => parseInt(b, 16)),
  );
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"],
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
    keyMaterial,
    256,
  );
  const hashHex = Array.from(new Uint8Array(bits)).map((b) =>
    b.toString(16).padStart(2, "0")
  ).join("");
  return hashHex === parts[3];
}
