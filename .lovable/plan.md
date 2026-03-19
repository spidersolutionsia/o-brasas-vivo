

## Plano: Tabelas internas com sincronização via telefone

### Objetivo
Criar 3 tabelas internas no Lovable Cloud espelhando as externas. O app lê/escreve localmente, e cada alteração é sincronizada com o externo usando o **telefone do cliente como chave de busca** (não o ID).

### 1. Migração SQL — criar tabelas internas

**`crm_carvaomascate`**: `id` (bigint PK, gerado), `nome`, `telefone` (text, unique), `cidade`, `"Ativo"`, `rota`, `dia_visita`, `observacoes_rota`, `entrega`, `"Abordagem"` (bool), `"Verificado"` (bool), `totaldisparomes` (int), `ultimadatadisparo` (text), `created_at`

**`rotas_carvao`**: `id` (uuid PK), `nome`, `descricao`, `dia_padrao`, `observacoes`, `created_at`

**`pedidos_semana_carvao`**: `id` (uuid PK), `cliente_id` (bigint), `telefone` (text), `semana`, `confirmado` (bool), `data_confirmacao` (timestamptz), `created_at`

RLS: políticas abertas para anon (mesmo padrão das tabelas orders/customers).

### 2. Edge Function `crm-sync`

Recebe `{ table, action, data, match }`. Ao sincronizar com o externo:
- **Sempre usa `telefone` como filtro** para localizar o registro na tabela externa
- Insert: envia upsert com telefone como conflict key
- Update: busca pelo telefone no match (`?telefone=eq.XXXX`)
- Delete: deleta pelo telefone

Isso garante que mesmo que os IDs internos e externos sejam diferentes, a sincronização funciona corretamente.

### 3. Refatorar frontend

- `AdminCRM.tsx`: lê/escreve no Supabase local via `supabase` client. Após cada operação bem-sucedida, chama `crm-sync` em background passando o telefone.
- `ClientModal.tsx` e `RouteModal.tsx`: ajustados para usar client local.
- `externalSupabase.ts`: simplificado — mantém apenas função de sync.

### 4. Importação inicial

Script único para copiar os 811 registros do externo (via `crm-proxy` select) para as tabelas internas locais.

### Arquivos

| Arquivo | Ação |
|---|---|
| Migração SQL (3 tabelas + RLS) | Criar |
| `supabase/functions/crm-sync/index.ts` | Criar |
| `src/components/admin/AdminCRM.tsx` | Editar |
| `src/components/admin/ClientModal.tsx` | Editar |
| `src/components/admin/RouteModal.tsx` | Editar |
| `src/lib/externalSupabase.ts` | Refatorar |

### Detalhe-chave: sincronização por telefone

```text
Local DB (insert/update/delete)
       ↓
  crm-sync Edge Function
       ↓
  External Supabase REST API
  → match: { telefone: "11999999999" }
```

O telefone é o identificador universal entre os dois bancos. Todas as operações de sync usam `telefone` como filtro, nunca o `id`.

