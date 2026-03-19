

## Plano: Aba "Clientes & Rotas" no Painel Administrativo

### Contexto
O CRM uploaded conecta a um Supabase externo com 3 tabelas: `crm_carvaomascate`, `rotas_carvao`, `pedidos_semana_carvao`. Preciso integrar essa funcionalidade como uma nova aba no painel admin existente.

### O que será feito

**1. Configuração da conexão externa**
- Criar um segundo cliente Supabase no frontend usando URL e anon key do projeto externo
- Solicitar ao usuário as credenciais (URL + anon key) via secrets — a anon key é pública, mas vou guardar como secret para manter organizado
- Arquivo: `src/lib/externalSupabase.ts`

**2. Reestruturar o painel admin com abas**
- Adicionar sistema de abas (Tabs do shadcn) no `AdminPedidos.tsx`: **Pedidos** | **Clientes & Rotas**
- A aba Pedidos mantém o conteúdo atual intacto
- A aba Clientes & Rotas carrega o novo componente CRM

**3. Componente CRM — `src/components/admin/AdminCRM.tsx`**
Reescrever o CRM usando os componentes shadcn/tailwind do projeto:
- **Sidebar lateral** com mini calendário, filtros (rota, status ativo/inativo, dia da semana)
- **Tabela de clientes** com busca, ordenação por colunas, badge de status, seletor inline de rota, checkbox de pedido semanal
- **Modal de edição/criação de cliente** (Dialog do shadcn) com campos: nome, telefone, cidade, ativo, rota, dia de visita, observações, entrega
- **Modal de gerenciamento de rotas** — criar, editar, deletar rotas com nome, descrição, dia padrão, observações
- **Cards de estatísticas** (total, ativos, pedidos confirmados, filtrados)

**4. Componentes auxiliares**
- `src/components/admin/RouteModal.tsx` — gerenciar rotas (CRUD)
- `src/components/admin/ClientModal.tsx` — editar/criar cliente
- `src/components/admin/MiniCalendar.tsx` — calendário compacto para seleção de data/semana

### Funcionalidades preservadas do CRM original
- Filtro por rota, status ativo, dia da semana do calendário
- Ordenação por coluna (nome, telefone, cidade, rota, ativo)
- Toggle de pedido semanal por cliente (checkbox que insere/atualiza na tabela `pedidos_semana_carvao`)
- Cálculo de semana ISO para agrupar pedidos
- Edição inline de rota na tabela
- CRUD completo de clientes e rotas

### Arquivos criados/editados
- **Novo**: `src/lib/externalSupabase.ts` — cliente Supabase externo
- **Novo**: `src/components/admin/AdminCRM.tsx` — componente principal do CRM
- **Novo**: `src/components/admin/RouteModal.tsx`
- **Novo**: `src/components/admin/ClientModal.tsx`
- **Novo**: `src/components/admin/MiniCalendar.tsx`
- **Editado**: `src/pages/AdminPedidos.tsx` — adicionar Tabs com aba Pedidos + Clientes & Rotas

### Pré-requisito
Vou precisar que você forneça a **URL** e a **anon key** do projeto Supabase externo onde estão as tabelas do CRM.

