

# Plano: Criar página `/cadastro` independente

## Resumo
Criar uma rota `/cadastro` que reutiliza o componente `StepRegister` de forma standalone, sem exigir o fluxo de pedido.

## Alterações

### 1. Nova página `src/pages/Cadastro.tsx`
- Importa `Header`, `Footer` e `StepRegister`
- Renderiza o formulário de cadastro centralizado com título "Criar Conta"
- `onBack` → navega para `/`
- `onRegistered` → faz login via contexto, exibe toast de sucesso e redireciona para `/meus-pedidos`

### 2. `src/App.tsx`
- Adicionar rota `<Route path="/cadastro" element={<Cadastro />} />`

### 3. `src/components/CustomerLogin.tsx`
- Alterar o link "Cadastre-se" para navegar para `/cadastro` em vez de `/pedido`

