import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-token",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const EXTERNAL_URL = Deno.env.get("EXTERNAL_SUPABASE_URL")!;
const EXTERNAL_KEY = Deno.env.get("EXTERNAL_SUPABASE_ANON_KEY")!;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const adminToken = req.headers.get("x-admin-token");
    if (!adminToken) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { table, action, data: rawData, match } = await req.json();

    // Strip columns that only exist in the local DB (not in external)
    const LOCAL_ONLY_COLUMNS: Record<string, string[]> = {
      rotas_carvao: ["cor"],
    };

    function stripLocalColumns(obj: Record<string, unknown>, tbl: string) {
      const cols = LOCAL_ONLY_COLUMNS[tbl];
      if (!cols || !obj) return obj;
      const cleaned = { ...obj };
      for (const col of cols) delete cleaned[col];
      return cleaned;
    }

    const data = rawData
      ? Array.isArray(rawData)
        ? rawData.map((d: Record<string, unknown>) => stripLocalColumns(d, table))
        : stripLocalColumns(rawData, table)
      : rawData;

    if (!table || !action) {
      return new Response(JSON.stringify({ error: "Missing table or action" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const headers: Record<string, string> = {
      apikey: EXTERNAL_KEY,
      Authorization: `Bearer ${EXTERNAL_KEY}`,
      "Content-Type": "application/json",
    };

    let url: string;
    let method: string;
    let body: string | undefined;

    switch (action) {
      case "upsert": {
        // Use telefone as conflict key for crm_carvaomascate
        method = "POST";
        headers["Prefer"] = "return=representation,resolution=merge-duplicates";
        if (table === "crm_carvaomascate") {
          url = `${EXTERNAL_URL}/rest/v1/${table}?on_conflict=telefone`;
        } else {
          url = `${EXTERNAL_URL}/rest/v1/${table}`;
        }
        body = JSON.stringify(Array.isArray(data) ? data : [data]);
        break;
      }
      case "update": {
        method = "PATCH";
        headers["Prefer"] = "return=representation";
        // Build filter from match (always telefone-based for clients)
        const params = Object.entries(match || {})
          .map(([k, v]) => `${k}=eq.${v}`)
          .join("&");
        url = `${EXTERNAL_URL}/rest/v1/${table}?${params}`;
        body = JSON.stringify(data);
        break;
      }
      case "delete": {
        method = "DELETE";
        const delParams = Object.entries(match || {})
          .map(([k, v]) => `${k}=eq.${v}`)
          .join("&");
        url = `${EXTERNAL_URL}/rest/v1/${table}?${delParams}`;
        break;
      }
      case "insert": {
        method = "POST";
        headers["Prefer"] = "return=representation";
        url = `${EXTERNAL_URL}/rest/v1/${table}`;
        body = JSON.stringify(Array.isArray(data) ? data : [data]);
        break;
      }
      default:
        return new Response(JSON.stringify({ error: "Invalid action" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    const res = await fetch(url, { method, headers, body });
    const resText = await res.text();

    if (!res.ok) {
      console.error(`CRM Sync error: ${res.status} ${resText}`);
      return new Response(JSON.stringify({ error: resText }), {
        status: res.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let result;
    try { result = JSON.parse(resText); } catch { result = resText; }

    return new Response(JSON.stringify({ data: result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("CRM Sync exception:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
