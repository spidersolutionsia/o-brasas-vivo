

## Plano: Webhook do Supabase externo → Lovable Cloud

### Problema
Atualmente a sincronização é unidirecional: Lovable → externo (via `crm-sync`). Quando você edita dados no dashboard do Supabase externo, essas mudanças não voltam para o Lovable Cloud.

### Solução
Criar um webhook endpoint no Lovable Cloud que o Supabase externo chamará automaticamente a cada INSERT/UPDATE/DELETE nas tabelas relevantes (`crm_carvaomascate`, `rotas_carvao`).

### O que será feito

**1. Nova Edge Function: `webhook-external-sync`**
- Endpoint público (`verify_jwt = false`) que recebe payloads do formato Database Webhook do Supabase
- Valida um secret compartilhado via header (`x-webhook-secret`) para segurança
- Recebe o payload com `type` (INSERT/UPDATE/DELETE), `table`, `record` e `old_record`
- Aplica a mudança correspondente na tabela local do Lovable Cloud usando o service role

**2. Configurar secret do webhook**
- Adicionar um secret `WEBHOOK_SECRET` no Lovable Cloud (valor que você definir)

**3. Configurar no Supabase externo (manual)**
- No dashboard do Supabase externo, ir em **Database → Webhooks**
- Criar webhooks para as tabelas `crm_carvaomascate` e `rotas_carvao` (INSERT, UPDATE, DELETE)
- Apontar para: `https://cvvrmgqmqamakvwzxets.supabase.co/functions/v1/webhook-external-sync`
- Adicionar header `x-webhook-secret` com o mesmo valor do secret

### Detalhes técnicos

**Edge Function (`supabase/functions/webhook-external-sync/index.ts`):**
```text
POST → valida x-webhook-secret
     → lê { type, table, record, old_record }
     → switch(type):
         INSERT → supabase.from(table).upsert(record)
         UPDATE → supabase.from(table).upsert(record)  
         DELETE → supabase.from(table).delete().match({id/telefone})
     → retorna 200
```

- Usa `SUPABASE_SERVICE_ROLE_KEY` para bypassar RLS
- Ignora coluna `cor` no sentido externo→local para `rotas_carvao` (mantém o valor local)

**Config (`supabase/config.toml`):**
```toml
[functions.webhook-external-sync]
verify_jwt = false
```

### Passos pós-deploy (manual no Supabase externo)
Vou te dar as instruções exatas de como configurar os webhooks no dashboard do seu Supabase externo após criar a Edge Function.

### Arquivos

| Arquivo | Ação |
|---|---|
| `supabase/functions/webhook-external-sync/index.ts` | Criar |
| `supabase/config.toml` | Adicionar entry |
| Secret `WEBHOOK_SECRET` | Adicionar |

