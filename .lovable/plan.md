

## Plano: Recuperação de Senha

### Contexto
O sistema usa autenticação customizada (não Supabase Auth) com tabela `customers` e senhas hasheadas via pgcrypto. Preciso criar um fluxo de "Esqueci minha senha" com duas opções de recebimento: email (envio direto) ou telefone (via webhook n8n/WhatsApp).

### O que será feito

**1. Banco de dados**
- Criar função RPC `recover_password` que recebe o email ou telefone do cliente, gera uma nova senha temporária (6 caracteres alfanuméricos), atualiza o `password_hash` do cliente (o trigger existente faz o hash automaticamente), e retorna o canal escolhido + dados do cliente (nome, email, phone) para que o frontend saiba para onde enviar.

**2. Edge Function `send-recovery-email`**
- Nova edge function que envia a senha temporária por email usando o SMTP do Gmail (mesmo padrão do `send-welcome-email`).

**3. Webhook n8n para telefone**
- Quando o usuário escolher telefone, o frontend dispara o webhook existente (`carvaomascatesite`) com evento `code_recovery`, incluindo nome, telefone e a senha temporária. O n8n cuida do envio via WhatsApp.

**4. UI - Link "Esqueci minha senha"**
- Adicionar link nos dois pontos de login: `CustomerLogin.tsx` (header dropdown) e `StepIdentify.tsx` (tela de pedido).
- Ao clicar, exibe um mini-formulário inline pedindo email ou telefone.
- Após localizar o cliente, mostra duas opções: "Receber por Email" e "Receber por Telefone (WhatsApp)".
- Se email: chama a edge function direto e mostra confirmação.
- Se telefone: dispara webhook n8n e mostra confirmação.
- Após receber a senha temporária, o usuário faz login normalmente e pode continuar usando.

### Arquivos modificados/criados
- **Nova migration SQL**: função `recover_customer_password` (gera senha, atualiza hash, retorna dados)
- **Novo**: `supabase/functions/send-recovery-email/index.ts`
- **Editado**: `src/components/CustomerLogin.tsx` — adicionar link + modal de recuperação
- **Editado**: `src/components/order/StepIdentify.tsx` — adicionar link + modal de recuperação
- **Editado**: `supabase/config.toml` — registro da nova edge function (verify_jwt = false)

### Fluxo do usuário
1. Clica "Esqueci minha senha"
2. Digita email ou telefone
3. Sistema busca o cliente e mostra opções de envio
4. Escolhe Email → recebe a senha nova no email instantaneamente
5. Escolhe Telefone → recebe via WhatsApp (n8n)
6. Volta ao login e entra com a nova senha

