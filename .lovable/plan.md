

# Plano: "Lembrar-me" no login do cliente

Adicionar um checkbox "Lembrar meus dados" no formulário de login (StepIdentify). Quando marcado, salva email e senha no localStorage para preencher automaticamente na próxima visita.

## Implementação

**Arquivo:** `src/components/order/StepIdentify.tsx`

1. Adicionar estado `rememberMe` (checkbox) e carregar dados salvos do localStorage no mount
2. Ao fazer login com sucesso, se `rememberMe` estiver marcado, salvar email e senha no localStorage (`saved_login`, `saved_password`). Se desmarcado, limpar esses dados.
3. No mount, verificar se existem dados salvos e pré-preencher os campos + marcar o checkbox

**Arquivo:** `src/components/CustomerLogin.tsx`

- Aplicar a mesma lógica se este componente também tiver formulário de login

**UI:** Checkbox com label "Lembrar meus dados" entre os campos de senha e o botão Entrar, usando o componente `Checkbox` do Radix já disponível no projeto.

