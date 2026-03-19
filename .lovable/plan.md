

## Plano: Cores por rota no calendário

### Contexto
As rotas (`rotas_carvao`) têm um campo `dia_semana` que ainda está vazio. Precisamos:
1. Permitir atribuir `dia_semana` às rotas (já existe no RouteModal)
2. Atribuir uma cor fixa a cada rota
3. No MiniCalendar, mostrar indicadores coloridos nos dias que têm rotas com clientes ativos

### O que será feito

**1. Adicionar coluna `cor` na tabela `rotas_carvao`**
- Nova coluna `cor TEXT` com default null
- Migração SQL simples

**2. Adicionar campo de cor no RouteModal**
- Adicionar um seletor de cor (paleta pré-definida com ~8 cores: vermelho, azul, verde, laranja, roxo, rosa, ciano, amarelo)
- Salvar a cor escolhida junto com os dados da rota

**3. Atualizar MiniCalendar para mostrar cores das rotas**
- Receber as rotas como prop (com `nome`, `dia_semana`, `cor`)
- Receber os clientes ativos como prop
- Para cada dia do calendário, verificar qual dia da semana é (seg, ter, etc.)
- Buscar quais rotas têm `dia_semana` correspondente E possuem pelo menos 1 cliente ativo nessa rota
- Renderizar bolinhas coloridas abaixo do número do dia (1 bolinha por rota ativa naquele dia)

**4. Adicionar legenda**
- Abaixo do calendário, mostrar uma legenda simples: bolinha colorida + nome da rota

### Detalhes técnicos

**Migração SQL:**
```sql
ALTER TABLE rotas_carvao ADD COLUMN cor TEXT DEFAULT NULL;
```

**Arquivo: `src/components/admin/RouteModal.tsx`**
- Adicionar array de cores pré-definidas
- Renderizar botões circulares coloridos para seleção
- Incluir `cor` no save

**Arquivo: `src/components/admin/MiniCalendar.tsx`**
- Nova prop `rotas: { nome, dia_semana, cor }[]`
- Nova prop `activeRouteNames: string[]` (rotas que têm clientes ativos)
- Para cada dia, calcular dia da semana → filtrar rotas que caem nesse dia E estão em `activeRouteNames`
- Renderizar dots coloridos dentro do botão do dia

**Arquivo: `src/components/admin/AdminCRM.tsx`**
- Calcular `activeRouteNames` (rotas que têm pelo menos 1 cliente ativo)
- Passar `rotas` e `activeRouteNames` ao MiniCalendar

### Arquivos

| Arquivo | Ação |
|---|---|
| Migração SQL | Adicionar coluna `cor` |
| `src/components/admin/RouteModal.tsx` | Seletor de cor |
| `src/components/admin/MiniCalendar.tsx` | Indicadores coloridos por rota |
| `src/components/admin/AdminCRM.tsx` | Passar props de rotas ao calendário |

