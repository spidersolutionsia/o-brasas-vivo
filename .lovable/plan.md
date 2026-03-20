

## Sistema de Intervalo de Rotas e Múltiplas Rotas por Cliente

### Resumo
Criar um sistema onde rotas alternam entre semanas (semana sim, semana não) e clientes podem pertencer a mais de uma rota.

### Mudanças no Banco de Dados

**1. Adicionar coluna `intervalo` e `semana_referencia` na tabela `rotas_carvao`**
- `intervalo` (integer, default 1): a cada quantas semanas a rota opera (1 = toda semana, 2 = quinzenal)
- `semana_referencia` (text, nullable): semana ISO de referência para calcular alternância (ex: "2026-W12" = essa semana é "ativa", pula a próxima, etc.)

**2. Mudar coluna `rota` de text para text[] (array) na tabela `crm_carvaomascate`**
- Permitir múltiplas rotas por cliente (ex: `["Rota1", "Rota2"]`)
- Migração converte valores existentes de string simples para array de 1 elemento

### Mudanças na UI

**3. RouteModal — campos de intervalo**
- Adicionar select para `intervalo` (Semanal / Quinzenal)
- Quando quinzenal, mostrar um date picker ou input para definir a semana de referência (semana em que a rota está ativa)
- Exibir indicador visual de qual semana a rota está ativa/inativa

**4. ClientModal — múltiplas rotas**
- Trocar o Select único de rota por checkboxes ou multi-select
- Permitir selecionar 0, 1 ou mais rotas

**5. AdminCRM tabela — exibir múltiplas rotas**
- Na coluna Rota, exibir badges para cada rota do cliente
- Inline editing via multi-select em vez de select único
- Ajustar filtro de rota para funcionar com arrays (cliente aparece se contém a rota filtrada)

**6. MiniCalendar — respeitar alternância**
- Ao renderizar dots coloridos, verificar se a rota está ativa naquela semana específica usando `intervalo` e `semana_referencia`
- Semanas inativas não mostram o dot da rota

**7. Filtro por dia — respeitar alternância**
- Quando "filtrar por dia" está ativo, considerar também se a rota do cliente está na semana ativa

### Lógica de Alternância

```text
Dado: semana_referencia = "2026-W12", intervalo = 2

Para saber se semana X é ativa:
  weekDiff = weekNumber(X) - weekNumber(referencia)
  isActive = weekDiff % intervalo === 0

Exemplo (intervalo=2, ref=W12):
  W12 ✓  W13 ✗  W14 ✓  W15 ✗  W16 ✓ ...
```

### Sync Externo
- Adicionar `intervalo` e `semana_referencia` ao `LOCAL_ONLY_COLUMNS` de `rotas_carvao` no `crm-sync` (a menos que o banco externo também precise dessas colunas)
- Para `rota` como array: o banco externo provavelmente espera text simples — converter array para string separada por vírgula no sync de saída, e vice-versa na entrada

### Arquivos Modificados
- `supabase/functions/crm-sync/index.ts` — ajustar sync para array de rotas
- `supabase/functions/webhook-external-sync/index.ts` — idem
- `src/components/admin/RouteModal.tsx` — campos intervalo/referência
- `src/components/admin/ClientModal.tsx` — multi-select de rotas
- `src/components/admin/AdminCRM.tsx` — filtros, exibição e lógica de alternância
- `src/components/admin/MiniCalendar.tsx` — dots respeitando alternância
- Migration SQL para novas colunas

