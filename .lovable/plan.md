

# Plano: Modal de detalhes do pedido

Adicionar um Dialog que abre ao clicar em uma linha da tabela, mostrando todos os detalhes do pedido e do cliente.

## Implementação

**Arquivo:** `src/pages/AdminPedidos.tsx`

1. Adicionar estado `selectedOrder` para controlar qual pedido está aberto
2. Tornar as linhas da tabela clicáveis (cursor pointer, onClick)
3. Adicionar um `Dialog` com os detalhes completos:
   - Número do pedido e data
   - Status atual com badge
   - Dados do cliente: nome, email, telefone
   - Endereço completo (buscar dados extras do customer: rua, número, bairro, cidade, CEP, complemento)
   - CNPJ (se houver)
   - Lista detalhada dos itens (marca, peso, quantidade)
   - Seletor de status para alterar diretamente do modal

4. Atualizar o `fetchOrders` para incluir mais campos do customer no select: `customers(name, email, phone, cnpj, street, number, neighborhood, city, cep, complement)`

**Componentes usados:** `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle` (já disponíveis no projeto).

