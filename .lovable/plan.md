
## Plano atualizado: sincronizar `Disparo` mesmo com coluna externa nula

### Diagnóstico
O `NULL` não é o que gera o erro 400. O erro acontece porque a integração está tentando enviar `disparo` (minúsculo), mas o banco externo aparenta ter a coluna `Disparo` (D maiúsculo), como no print. Em PostgreSQL isso pode virar um identificador diferente se foi criado com aspas.

Resumo:
- `NULL` é aceitável para toggle/checkbox.
- O problema real é o nome da coluna no contrato entre banco local e banco externo.

### O que vou ajustar

**1. Tornar o sync de saída compatível com o banco externo**
- Em `supabase/functions/crm-sync/index.ts`, adicionar um mapeamento de colunas para `crm_carvaomascate`.
- Converter `disparo` local para `Disparo` no payload enviado ao banco externo.
- Aplicar isso tanto em `update` quanto em `upsert`/`insert`.

**2. Tornar o sync de entrada compatível também**
- Em `supabase/functions/webhook-external-sync/index.ts`, mapear `Disparo` recebido do externo para `disparo` local antes de salvar.
- Ajustar a whitelist para aceitar esse campo vindo com o nome externo e persistir no nome local.

**3. Manter a UI tolerante a `NULL`**
- Em `AdminCRM.tsx`, manter o checkbox e contagens tratando `null` como `false`.
- Hoje o checkbox já usa `!!c.disparo`, então a mudança aqui tende a ser mínima ou nenhuma.

**4. Validar o fluxo completo**
- Marcar um cliente no CRM.
- Confirmar que o request enviado ao `crm-sync` sai com o campo traduzido corretamente.
- Confirmar que o valor muda no banco externo.
- Desmarcar e repetir para validar ida e volta.

### Detalhes técnicos
Estratégia sugerida:
```ts
// saída: local -> externo
const EXTERNAL_COLUMN_MAP = {
  crm_carvaomascate: {
    disparo: "Disparo",
  },
};

// entrada: externo -> local
const LOCAL_COLUMN_MAP = {
  crm_carvaomascate: {
    Disparo: "disparo",
  },
};
```

Fluxo:
```text
UI local: disparo
   -> crm-sync traduz para Disparo
   -> banco externo salva em Disparo

Webhook externo: Disparo
   -> webhook-external-sync traduz para disparo
   -> banco local salva em disparo
```

### Observação importante
Se depois disso ainda houver erro de coluna não encontrada, aí o próximo passo será confirmar se a coluna externa foi criada exatamente como `"Disparo"` (com aspas) ou `disparo` (sem aspas). Mas pelo print, o ajuste de mapeamento é o caminho mais seguro sem depender de recriar a coluna externa.
