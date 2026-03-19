import { supabase } from "@/integrations/supabase/client";

/**
 * Proxy para o Supabase externo via Edge Function.
 * Todas as operações passam pelo crm-proxy que tem as credenciais do projeto externo.
 */
async function crmProxy(payload: {
  action: string;
  table: string;
  data?: any;
  match?: Record<string, any>;
  filters?: string;
  order?: string;
}) {
  const adminToken = sessionStorage.getItem("admin-token");
  const { data, error } = await supabase.functions.invoke("crm-proxy", {
    body: payload,
    headers: { "x-admin-token": adminToken || "" },
  });

  if (error) throw new Error(error.message || "Erro na requisição CRM");
  if (data?.error) throw new Error(typeof data.error === "string" ? data.error : JSON.stringify(data.error));
  return data?.data;
}

export async function fetchTable(table: string, options: { order?: string; filters?: string } = {}) {
  return crmProxy({
    action: "select",
    table,
    order: options.order,
    filters: options.filters,
  });
}

export async function updateRow(table: string, id: string, data: Record<string, any>) {
  return crmProxy({
    action: "update",
    table,
    data,
    match: { id },
  });
}

export async function insertRow(table: string, data: Record<string, any>) {
  return crmProxy({
    action: "insert",
    table,
    data,
  });
}

export async function upsertRow(table: string, data: Record<string, any>) {
  return crmProxy({
    action: "upsert",
    table,
    data,
  });
}

export async function deleteRow(table: string, id: string) {
  return crmProxy({
    action: "delete",
    table,
    match: { id },
  });
}
