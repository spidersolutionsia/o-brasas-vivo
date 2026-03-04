
# Plano: Adicionar produtos Diamante Negro à seção de Produtos

## Problema
1. A seção "Nossos Produtos" só exibe os 3 carvões Mascate.
2. Todos usam a mesma imagem (`product-bag-5kg.jpg`) — manter por enquanto.
3. Faltam os 2 produtos Diamante Negro (2kg e 4kg) com as imagens enviadas.

## Alterações

### 1. Salvar imagens
- Copiar as imagens enviadas como `src/assets/product-diamante-2kg.png` e `src/assets/product-diamante-4kg.png`.

### 2. `src/components/ProductsSection.tsx`
- Adicionar `brand` e `image` a cada produto no array.
- Incluir os 2 produtos Diamante Negro com suas imagens.
- Organizar em dois blocos com badge da marca:
  - **Carvão Mascate** — grid 3 colunas (2,5kg, 5kg, 9kg)
  - **Diamante Negro** — grid 2 colunas centralizadas (2kg, 4kg)
- Cada card usa sua imagem própria via `product.image`.
