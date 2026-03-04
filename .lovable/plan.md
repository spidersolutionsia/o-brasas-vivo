

# Plano: Painel Administrativo

## Abordagem
Criar uma área `/admin` protegida por login simples (credenciais fixas armazenadas como secret no backend, validadas via edge function). Sem usar Supabase Auth — apenas uma edge function que valida usuário/senha e retorna um token JWT simples.

**Credenciais:** `carvaomascate@gmail.com` / `@mascate77`

## Componentes a criar

### 1. Edge Function `admin-login`
- Recebe `{ email, password }`, compara com secrets `ADMIN_EMAIL` e `ADMIN_PASSWORD`
- Se correto, retorna `{ token: "admin-session-token" }` (JWT ou hash fixo)
- Se incorreto, retorna 401

### 2. Secrets a adicionar
- `ADMIN_EMAIL` = `carvaomascate@gmail.com`
- `ADMIN_PASSWORD` = `@mascate77`

### 3. Páginas
- **`/admin`** — Login admin (email + senha), salva token no sessionStorage
- **`/admin/pedidos`** — Lista todos os pedidos com dados do cliente, status, itens, data. Permite alterar status (pending → processing → shipped → delivered). Sidebar com navegação.

### 4. Funcionalidades do painel
- Tabela com todos os pedidos (order_number, cliente, itens, status, data)
- Filtro por status
- Busca por número do pedido ou nome do cliente
- Botão para alterar status do pedido (requer migration para adicionar UPDATE policy na tabela orders, ou usar edge function)

### 5. Migration necessária
- Adicionar RLS policy para UPDATE em `orders` (ou usar edge function com service role para atualizar status)

### 6. Arquivos
- `supabase/functions/admin-login/index.ts`
- `src/pages/AdminLogin.tsx`
- `src/pages/AdminPedidos.tsx`
- `src/components/AdminLayout.tsx`
- Rotas em `App.tsx`

