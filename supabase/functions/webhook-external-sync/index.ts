import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-webhook-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Columns allowed per table (whitelist approach to avoid unknown column errors)
const ALLOWED_COLUMNS: Record<string, string[]> = {
  crm_carvaomascate: [
    "id", "nome", "telefone", "cidade", "Ativo", "rota", "dia_visita",
    "observacoes_rota", "entrega", "Abordagem", "Verificado",
    "totaldisparomes", "ultimadatadisparo", "created_at",
  ],
  rotas_carvao: [
    "id", "nome", "descricao", "dia_semana", "observacoes", "ativa", "created_at",
    // "cor" is local-only, so NOT listed here
  ],
};

function stripToAllowedColumns(record: Record<string, unknown>, table: string) {
  const allowed = ALLOWED_COLUMNS[table];
  if (!allowed || !record) return record;
  const cleaned: Record<string, unknown> = {};
  for (const col of allowed) {
    if (col in record) cleaned[col] = record[col];
  }
  return cleaned;
}

// Primary key per table
const PRIMARY_KEY: Record<string, string> = {
  crm_carvaomascate: "id",
  rotas_carvao: "id",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate webhook secret
    const webhookSecret = Deno.env.get("WEBHOOK_SECRET");
    const receivedSecret = req.headers.get("x-webhook-secret");

    if (!webhookSecret || receivedSecret !== webhookSecret) {
      console.error("Webhook secret mismatch");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const payload = await req.json();
    // Supabase Database Webhook payload format:
    // { type: "INSERT"|"UPDATE"|"DELETE", table: "table_name", schema: "public", record: {...}, old_record: {...} }
    const { type, table, record, old_record } = payload;

    if (!type || !table) {
      return new Response(JSON.stringify({ error: "Missing type or table" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const pk = PRIMARY_KEY[table] || "id";
    let result;

    switch (type) {
      case "INSERT":
      case "UPDATE": {
        const cleanRecord = stripToAllowedColumns(record, table);
        const { data, error } = await supabase
          .from(table)
          .upsert(cleanRecord, { onConflict: pk })
          .select();

        if (error) throw new Error(error.message);
        result = data;
        break;
      }
      case "DELETE": {
        const ref = old_record || record;
        if (!ref || !ref[pk]) {
          throw new Error(`No primary key value for DELETE on ${table}`);
        }
        const { data, error } = await supabase
          .from(table)
          .delete()
          .eq(pk, ref[pk])
          .select();

        if (error) throw new Error(error.message);
        result = data;
        break;
      }
      default:
        return new Response(JSON.stringify({ error: `Unknown type: ${type}` }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    console.log(`Webhook sync: ${type} on ${table} → success`);
    return new Response(JSON.stringify({ success: true, data: result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Webhook sync error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
