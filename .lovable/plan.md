

# Plano: Adicionar campo de tipo de evento no webhook + numeracao sequencial

## Alteracoes

### 1. Migration SQL - Numeracao sequencial a partir de 1000
- Recriar a sequencia `order_number_seq` comecando em 1000.
- Atualizar a funcao `generate_order_number()` para retornar apenas o numero sequencial (ex: "1000", "1001", "1002").

### 2. `src/components/order/StepConfirmation.tsx` - Adicionar campo `event` no webhook
- Adicionar o campo `"event": "order_completed"` no payload do webhook enviado ao n8n, para que o sistema identifique que se trata de um pedido finalizado.

O payload ficara assim:

```text
{
  "event": "order_completed",
  "order_number": "1000",
  "customer_code": "ABC123",
  "customer_name": "...",
  "customer_phone": "...",
  "customer_email": "...",
  "customer_address": "...",
  "items": [...],
  "created_at": "..."
}
```

### Detalhes tecnicos

**Migration SQL:**
```sql
DROP SEQUENCE IF EXISTS order_number_seq;
CREATE SEQUENCE order_number_seq START 1000;

CREATE OR REPLACE FUNCTION public.generate_order_number()
RETURNS text
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  RETURN nextval('order_number_seq')::text;
END;
$$;
```

**StepConfirmation.tsx:** Adicionar `event: 'order_completed'` no body do fetch para o webhook (linha 70).

