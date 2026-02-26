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