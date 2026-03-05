

# Plano: Sistema de Pontos + Total de Sacos na página Meus Pedidos

## O que será feito

Na página "Meus Pedidos", adicionar:

1. **Card de resumo no topo** com:
   - Total de sacos pedidos (soma de todas as quantidades de todos os pedidos)
   - Total de pontos acumulados (1 ponto por kg pedido)
   - Visual atrativo com ícones (ex: estrela/flame para pontos)

2. **Cálculo de pontos**: Extrair o valor numérico do peso de cada item (ex: "2,5kg" → 2.5, "9kg" → 9), multiplicar pela quantidade, e somar tudo. Cada kg = 1 ponto.

## Implementação

**Arquivo:** `src/pages/MeusPedidos.tsx`

- Após carregar os pedidos, calcular:
  - `totalBags`: soma de `item.quantity` de todos os pedidos
  - `totalPoints`: soma de `parseFloat(item.weight.replace(',', '.')) * item.quantity` de todos os pedidos
- Adicionar um card de resumo acima da lista de pedidos com essas duas métricas
- Usar ícones do Lucide (ex: `Flame` para pontos, `Package` para sacos)
- Estilizar com o padrão existente (`card-dark rounded-xl`)

Tudo será calculado no frontend a partir dos dados dos pedidos já carregados — sem necessidade de alterações no banco.

