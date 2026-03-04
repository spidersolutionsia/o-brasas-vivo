

# Plano: Email de resumo do pedido + botão "Cadastrar" no header

## 1. Nova Edge Function: `send-order-email`

Criar `supabase/functions/send-order-email/index.ts` baseado no padrão do `send-welcome-email`, recebendo:
- `customerName`, `customerEmail`, `orderNumber`, `items` (array com brand, weight, quantity)

O template HTML incluirá:
- Resumo dos itens do pedido
- Número do pedido
- Botão/link "Confirmar Pedido via WhatsApp" que abre `https://wa.me/5522992525529?text=...` com a mesma mensagem formatada usada no `StepConfirmation`

Configurar `verify_jwt = false` no `config.toml`.

## 2. Chamar a Edge Function no `StepConfirmation.tsx`

Após salvar o pedido com sucesso (depois do insert no banco), invocar `supabase.functions.invoke('send-order-email', ...)` passando os dados do pedido. Buscar o email do cliente a partir dos dados já carregados (`customer`). Falha no envio não bloqueia o fluxo.

## 3. Adicionar opção "Cadastrar" no `CustomerLogin.tsx`

Quando o usuário **não está logado**, abaixo do botão "Entrar" no dropdown, adicionar um link "Não tem conta? Cadastre-se" que navega para `/pedido` (onde o fluxo de cadastro já existe na etapa de registro). Alternativamente, pode linkar direto para `/pedido` com um state indicando pular para o cadastro — mas o mais simples é redirecionar para `/pedido` e o cliente segue o fluxo normal.

