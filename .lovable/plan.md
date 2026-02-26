

# Plano: Adicionar rotulos nos cards de pedidos

## O que muda

Na pagina "Meus Pedidos" (`src/pages/MeusPedidos.tsx`), adicionar rotulos descritivos antes do numero do pedido e da data:

- **Numero do pedido**: de `1000` para `Pedido: 1000`
- **Data**: de `26/02/2026` para `Data: 26/02/2026`

## Alteracao tecnica

No arquivo `src/pages/MeusPedidos.tsx`, linhas 121-124:

Antes:
```text
<p className="font-heading font-bold">{order.order_number}</p>
<p className="text-xs text-muted-foreground">
  {new Date(order.created_at).toLocaleDateString('pt-BR')}
</p>
```

Depois:
```text
<p className="font-heading font-bold">Pedido: {order.order_number}</p>
<p className="text-xs text-muted-foreground">
  Data: {new Date(order.created_at).toLocaleDateString('pt-BR')}
</p>
```

Apenas uma alteracao de texto, sem impacto em logica ou layout.
