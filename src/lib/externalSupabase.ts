import { supabase } from "@/integrations/supabase/client";

/**
 * Dispara sincronização em background para o Supabase externo via crm-sync edge function.
 * Fire-and-forget: se falhar, o dado local permanece correto.
 */
export async function syncToExternal(payload: {
  table: string;
  action: "upsert" | "update" | "delete" | "insert";
  data?: any;
  match?: Record<string, any>;
}) {
  const adminToken = sessionStorage.getItem("admin-token");
  try {
    await supabase.functions.invoke("crm-sync", {
      body: payload,
      headers: { "x-admin-token": adminToken || "" },
    });
  } catch (e) {
    console.warn("Sync to external failed (non-blocking):", e);
  }
}
