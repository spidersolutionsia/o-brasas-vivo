

## Corrigir filtro por dia no CRM

### Problema
O filtro por dia (linha 203 do `AdminCRM.tsx`) verifica `c.dia_visita` no cliente, mas o dia da semana está definido na **rota** (`dia_semana` na tabela `rotas_carvao`), não no cliente. Por isso ao clicar num dia e filtrar, nenhum cliente aparece.

### Correção

**Arquivo: `src/components/admin/AdminCRM.tsx`** (linhas 200-213)

Substituir a lógica do `filterByDay` para:
1. Pegar o dia da semana do `selectedDate`
2. Para cada cliente, verificar se alguma das suas rotas tem `dia_semana` igual a esse dia
3. Adicionalmente, verificar se essa rota está ativa na semana (alternância quinzenal)

```text
Lógica atual (errada):
  cliente.dia_visita === dia  ← campo não existe

Lógica correta:
  Para cada rota do cliente:
    rotaMap[rotaNome].dia_semana === dia
    AND isRotaActiveOnDate(...)
```

Apenas uma mudança de ~10 linhas no bloco de filtro. Nenhum outro arquivo precisa ser alterado.

