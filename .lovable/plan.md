

# Plano: Ajustes no Fluxo de Pedido

## Alteracoes

### 1. Scroll to top ao navegar entre paginas
- Adicionar um componente `ScrollToTop` no `App.tsx` que usa `useEffect` com `useLocation` para chamar `window.scrollTo(0, 0)` a cada mudanca de rota.

### 2. Header - Adicionar link "Fazer Pedido"
- No `Header.tsx`, adicionar um link "Fazer Pedido" na navegacao desktop e mobile, apontando para `/pedido`.
- O botao "Comprar no Atacado" no `HeroSection.tsx` (atualmente `href="#atacado"`) deve apontar para `/pedido` via `Link` do react-router.

### 3. Cadastro nao deve abrir WhatsApp
- No `StepRegister.tsx`, remover o bloco que faz `window.open` para WhatsApp ao finalizar cadastro (linhas 108-113).
- O WhatsApp so sera aberto na etapa de confirmacao final do pedido.

### 4. Apos cadastro, ir direto para confirmacao com resumo
- Alterar o fluxo: apos cadastro, em vez de voltar para a tela de identificacao, ir direto para a etapa de confirmacao.
- No `StepRegister.tsx`, o callback `onRegistered` passa o `customerId`, `customerCode` e `customerName` para o componente pai.
- No `Pedido.tsx`, ao receber o registro, setar os dados do cliente e ir direto para `step = 'confirmation'`.

### 5. Tela de Confirmacao com duas opcoes
- Manter o layout atual do `StepConfirmation.tsx` com resumo do pedido e dados do cliente.
- Botao principal: "Finalizar e Enviar Pedido" (abre WhatsApp + envia webhook).
- Botao secundario menor: "Voltar ao Pedido" (volta para selecao de produtos).

---

## Detalhes Tecnicos

### Arquivo: `src/components/ScrollToTop.tsx` (novo)
- Componente que escuta `useLocation()` e faz `window.scrollTo(0, 0)` no `useEffect`.

### Arquivo: `src/App.tsx`
- Importar e renderizar `ScrollToTop` dentro do `BrowserRouter`.

### Arquivo: `src/components/HeroSection.tsx`
- Trocar `<a href="#atacado">` por `<Link to="/pedido">` para o botao "Comprar no Atacado".

### Arquivo: `src/components/order/StepRegister.tsx`
- Remover o `window.open` do WhatsApp no `handleSubmit`.
- Alterar `onRegistered` para passar `(id, code, name)` em vez de so `(code)`.

### Arquivo: `src/pages/Pedido.tsx`
- Alterar `handleRegistered` para receber `(id, code, name)` e ir direto para `confirmation`.
- Scroll to top tambem ao mudar de step (dentro do componente).

### Arquivo: `src/components/order/StepConfirmation.tsx`
- Renomear botao para "Finalizar e Enviar Pedido".
- Botao "Voltar" leva de volta a `products` (inicio do pedido).

