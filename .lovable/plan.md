

## Plano: Botão "Disparo" no CRM

### Resumo
Substituir o checkbox de "Pedido semanal" por um checkbox "Disparo" que controla a coluna `disparo` (bool) na tabela `crm_carvaomascate`, sincronizando com o banco externo.

### Passos

**1. Migração — Adicionar coluna `disparo` à tabela `crm_carvaomascate`**
- Nova coluna `disparo` do tipo `boolean`, default `false`, nullable.

**2. Atualizar `webhook-external-sync`**
- Adicionar `"disparo"` à whitelist de `ALLOWED_COLUMNS` para `crm_carvaomascate`.

**3. Atualizar `crm-sync`**
- Garantir que a coluna `disparo` não esteja em `LOCAL_ONLY_COLUMNS` (ela deve ser sincronizada).

**4. Atualizar `AdminCRM.tsx`**
- Renomear o header da coluna de `Pedido W__` para `Disparo`.
- Substituir `handleTogglePedido` por `handleToggleDisparo`: faz update de `disparo` (bool toggle) direto na tabela `crm_carvaomascate` local, e sincroniza com o externo via `crm-sync`.
- O checkbox lê `c.disparo` em vez de `pedidoMap[c.id]?.confirmado`.
- Remover lógica/estado de `pedidosSemana` e `currentWeek` que não será mais necessária (ou mantê-la inativa para uso futuro).

### Detalhes técnicos

- O handler `handleToggleDisparo(clientId, telefone)` fará:
  ```typescript
  const newVal = !client.disparo;
  await supabase.from("crm_carvaomascate").update({ disparo: newVal }).eq("id", clientId);
  syncToExternal({ table: "crm_carvaomascate", action: "update", data: { disparo: newVal }, match: { telefone } });
  ```
- Deploy das edge functions `webhook-external-sync` e `crm-sync` após edição.

