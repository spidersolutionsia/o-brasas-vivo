

# Plano: Remover código de cliente

## Resumo
Remover todas as referências ao código de cliente (ex: "ABC123") do sistema, já que a autenticação agora é feita por email/telefone + senha.

## Alterações

### 1. `src/components/order/StepConfirmation.tsx`
- Remover prop `customerCode` da interface
- Remover o bloco visual "Seu código de cliente" (linhas 121-126)
- Na mensagem do WhatsApp, trocar `(${customerCode})` por email ou simplesmente remover
- No webhook, remover campo `customer_code`

### 2. `src/components/order/StepRegister.tsx`
- Remover chamada a `generate_customer_code` RPC
- Gerar um código interno automaticamente (ex: `crypto.randomUUID().slice(0,6).toUpperCase()`) apenas para preencher a coluna obrigatória `code` no banco
- Remover `customerCode` do callback `onRegistered` — passar só `(id, name)`
- Remover `customerCode` do payload do welcome email e webhook (ou manter internamente se necessário)

### 3. `src/pages/Pedido.tsx`
- Remover estado `customerCode`
- Ajustar assinaturas de `handleCustomerFound` e `handleRegistered` para não usar `code`
- Não passar `customerCode` ao `StepConfirmation`

### 4. `src/components/order/StepIdentify.tsx`
- Ajustar callback `onCustomerFound` para `(id, name)` sem `code`

### 5. `supabase/functions/send-welcome-email/index.ts`
- Remover referência ao código no template do email (trocar por mensagem de boas-vindas simples sem código)

### 6. `src/contexts/CustomerSessionContext.tsx`
- Remover `customerCode` do contexto (já usa email como identificador)
- Remover `CODE_KEY` do localStorage

### 7. `src/components/CustomerLogin.tsx`
- Remover uso de `customer.code` no login

