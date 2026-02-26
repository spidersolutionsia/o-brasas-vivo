
# Plano: Proteger "Meus Pedidos" e mostrar boas-vindas com nome do cliente

## Alteracoes

### 1. `src/hooks/useCustomerSession.ts`
- Adicionar estado `customerName` ao hook, salvo no localStorage junto com o codigo.
- Alterar `login` para aceitar `(code: string, name?: string)` e salvar o nome.
- Retornar `customerName` no hook.

### 2. `src/components/CustomerLogin.tsx`
- Ao fazer login, buscar tambem o `name` do cliente no banco (alterar select de `code` para `code, name`).
- Passar o nome para `login(data.code, data.name)`.
- Quando logado, mostrar ao lado do codigo: **"Ola, Primeiro-Nome!"** (extraindo o primeiro nome do campo `name`).
- No dropdown, trocar "Logado como CODE" por "Ola, seja bem-vindo Primeiro-Nome".

### 3. `src/pages/MeusPedidos.tsx`
- Se o cliente nao estiver logado (`!isLoggedIn`), redirecionar automaticamente para a home (`/`) ou mostrar mensagem pedindo login (ja existe a mensagem, manter mas melhorar).
- Esconder o link "Meus Pedidos" no Header quando nao estiver logado.

### 4. `src/components/Header.tsx`
- Condicionar a exibicao do link "Meus Pedidos" (desktop e mobile) ao estado `isLoggedIn` do `useCustomerSession`. Se nao estiver logado, o link nao aparece.

## Detalhes tecnicos

**useCustomerSession.ts:**
- Adicionar `localStorage.setItem('customer_name', name)` no login.
- Adicionar `customerName` state lido do localStorage.
- Login signature: `login(code: string, name?: string)`.

**CustomerLogin.tsx:**
- Select: `.select('code, name')` no handleLogin.
- Chamar `login(data.code, data.name)`.
- No botao do header quando logado: mostrar "Ola, {primeiroNome}" usando `customerName?.split(' ')[0]`.

**Header.tsx:**
- Importar `useCustomerSession`.
- Renderizar link "Meus Pedidos" apenas se `isLoggedIn === true`.

**Pedido.tsx:**
- Atualizar chamadas `login(code)` para `login(code, name)` nos handlers `handleCustomerFound` e `handleRegistered` (que ja recebem o nome).
