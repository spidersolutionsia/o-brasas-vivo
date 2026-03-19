import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-webhook-secret",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Columns allowed per table (whitelist; excludes identity cols for crm)
const ALLOWED_COLUMNS: Record<string, string[]> = {
  crm_carvaomascate: [
    "nome", "telefone", "cidade", "Ativo", "rota", "dia_visita",
    "observacoes_rota", "entrega", "Abordagem", "Verificado",
    "totaldisparomes", "ultimadatadisparo", "created_at",
  ],
  rotas_carvao: [
    "id", "nome", "descricao", "dia_semana", "observacoes", "ativa", "created_at",
  ],
};

// Match key for finding the local row (used for update & delete)
const MATCH_KEY: Record<string, string> = {
  crm_carvaomascate: "telefone",
  rotas_carvao: "id",
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

    const matchKey = MATCH_KEY[table] || "id";
    let result;

    switch (type) {
      case "INSERT":
      case "UPDATE": {
        const cleanRecord = stripToAllowedColumns(record, table);
        const matchValue = record[matchKey];
        if (!matchValue) {
          throw new Error(`No match key '${matchKey}' in record for ${table}`);
        }

        // Check if row exists locally
        const { data: existing } = await supabase
          .from(table)
          .select(matchKey)
          .eq(matchKey, matchValue)
          .maybeSingle();

        let data, error;
        if (existing) {
          // Update existing row
          ({ data, error } = await supabase
            .from(table)
            .update(cleanRecord)
            .eq(matchKey, matchValue)
            .select());
        } else {
          // Insert new row (without identity column)
          ({ data, error } = await supabase
            .from(table)
            .insert(cleanRecord)
            .select());
        }

        if (error) throw new Error(error.message);
        result = data;
        break;
      }
      case "DELETE": {
        const ref = old_record || record;
        const matchValue = ref?.[matchKey];
        if (!matchValue) {
          throw new Error(`No match key '${matchKey}' for DELETE on ${table}`);
        }
        const { data, error } = await supabase
          .from(table)
          .delete()
          .eq(matchKey, matchValue)
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
