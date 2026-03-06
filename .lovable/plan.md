

# Plano: Corrigir logout nao refletido na pagina de pedido

## Problema
O hook `useCustomerSession` e usado de forma independente em `CustomerLogin` e `Pedido`. Cada componente cria sua propria instancia do hook com seu proprio estado. Quando o logout e chamado no `CustomerLogin`, ele limpa o localStorage e o estado daquela instancia, mas a instancia do `Pedido` continua com os valores antigos em memoria -- o `isLoggedIn` continua `true`.

## Solucao
Transformar o `useCustomerSession` em um Context Provider (React Context), para que todas as instancias compartilhem o mesmo estado. Quando o logout for chamado em qualquer lugar, todos os componentes que usam o contexto serao atualizados automaticamente.

## Alteracoes

### 1. Criar `src/contexts/CustomerSessionContext.tsx`
- Criar um React Context com Provider que encapsula a logica atual do `useCustomerSession`
- Exportar um hook `useCustomerSession` que consome o contexto
- Manter a mesma interface (`customerCode`, `customerName`, `isLoggedIn`, `login`, `logout`)

### 2. Atualizar `src/hooks/useCustomerSession.ts`
- Substituir a implementacao atual por uma re-exportacao do hook do contexto
- Manter compatibilidade com todos os imports existentes

### 3. Atualizar `src/App.tsx`
- Envolver a aplicacao com o `CustomerSessionProvider` para que todos os componentes filhos compartilhem o mesmo estado

### Resultado
- Logout no header reflete imediatamente na pagina de pedido
- Login tambem reflete em todos os componentes
- Nenhuma mudanca nos componentes que ja usam `useCustomerSession` -- a interface permanece identica

