

## Plano: Adicionar preços aos produtos

### Alterações

**1. `src/components/order/StepProducts.tsx`**
- Adicionar campo `price` na interface `Product`
- Incluir preços em cada produto do array
- Exibir o preço formatado (R$ X,XX) ao lado do peso em cada card
- Atualizar o resumo para mostrar o valor total do pedido (soma de preço × quantidade)

**2. `src/components/ProductsSection.tsx`**
- Adicionar campo `price` na interface `ProductItem`
- Incluir preços em cada produto
- Exibir o preço no card do produto, abaixo do peso, com destaque visual

### Tabela de preços

| Produto | Preço |
|---------|-------|
| Diamante Negro 2kg | R$ 9,00 |
| Diamante Negro 4kg | R$ 15,20 |
| Mascate 2,5kg | R$ 12,00 |
| Mascate 5kg | R$ 19,00 |
| Mascate 9kg | R$ 43,00 |

### Detalhes técnicos
- Preços armazenados como `number` (ex: `9.00`, `15.20`)
- Formatação com `toFixed(2)` e vírgula como separador decimal
- No StepProducts, o resumo mostrará "Total: R$ XX,XX" além da contagem de sacos
- No ProductsSection, o preço aparecerá com estilo `text-primary font-bold` para destaque visual

