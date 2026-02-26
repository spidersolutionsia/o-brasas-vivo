
# Plano: Scroll ao topo ao confirmar pedido

## Problema
Quando o pedido e finalizado e a tela de sucesso aparece, a pagina nao rola para o topo. Isso acontece porque o efeito de scroll esta vinculado a mudanca de `step`, mas a tela de sucesso e controlada pelo estado interno `done` do `StepConfirmation`, que nao dispara o scroll.

## Solucao

### `src/components/order/StepConfirmation.tsx`
Adicionar `window.scrollTo({ top: 0, behavior: 'instant' })` dentro do `handleConfirm`, logo apos `setDone(true)`, para que ao exibir a tela de sucesso a pagina role automaticamente para o topo.

```text
setDone(true);
window.scrollTo({ top: 0, behavior: 'instant' });
```

Alteracao minima de uma linha, sem impacto em outros componentes.
