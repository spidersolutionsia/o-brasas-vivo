
# Plano: Ajustar cards Diamante Negro e remover overlay de peso

## Alterações em `src/components/ProductsSection.tsx`

1. **Remover overlay de peso laranja** — deletar o bloco condicional (linhas 135-139) que mostra o badge de peso sobre as imagens Mascate.

2. **Igualar tamanho dos cards Diamante Negro** — o grid Diamante Negro usa `md:grid-cols-2` com `max-w-5xl`, então os 2 cards ficam mais largos que os 3 do Mascate. Trocar para `md:grid-cols-3` com o mesmo max-width, colocando os 2 cards nas 2 primeiras colunas (mesma largura dos cards Mascate).
