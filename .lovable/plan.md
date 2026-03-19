

## Plano: Atualizar CSV + dividir clientes em 3 abas

### 1. Importar CSV atualizado
Executar script Python para upsert dos 811 registros do CSV na tabela interna `crm_carvaomascate` (match por `telefone`), atualizando campos como `Ativo`, `cidade`, `entrega`, etc. Também sincronizar com o externo via `crm-proxy`.

### 2. Adicionar Tabs no painel CRM
Substituir a tabela única por 3 abas usando o componente `Tabs` já existente:

- **Ativos** — `Ativo === "SIM"` e `cidade` preenchida
- **Inativos** — `Ativo === "NÃO"` ou `Ativo === "NAO"`
- **Falta Dados** — `Ativo !== "NÃO"/"NAO"` e `cidade` vazia/null (clientes que precisam completar cadastro)

Cada aba mostra a contagem no título (ex: "Ativos (234)") e aplica os mesmos filtros de busca, rota e dia.

O filtro "Status" (Ativo/Inativo) na sidebar será removido, pois as abas já cumprem essa função.

### Detalhes técnicos

**Arquivo: `src/components/admin/AdminCRM.tsx`**
- Importar `Tabs, TabsList, TabsTrigger, TabsContent` de `@/components/ui/tabs`
- Adicionar state `activeTab` com valores `"ativos" | "inativos" | "faltaDados"`
- Criar 3 listas derivadas via `useMemo` a partir de `filteredClients` (que já aplica busca/rota/dia)
- Remover o filtro `filterAtivo` e o Select de Status da sidebar
- A tabela (Table) é renderizada uma vez, recebendo a lista da aba ativa
- Stats cards atualizados: Total, Ativos, Inativos, Falta Dados

**Script de importação (temporário)**
- Ler CSV, limpar tipos, upsert via Supabase local por `telefone`
- Sincronizar com externo via `crm-proxy`

### Arquivos

| Arquivo | Ação |
|---|---|
| `src/components/admin/AdminCRM.tsx` | Editar — adicionar Tabs, remover filtro Status |
| Script Python (temporário) | Importar CSV atualizado |

