
CREATE OR REPLACE FUNCTION public.recover_customer_password(p_login text)
RETURNS TABLE(customer_id uuid, customer_name text, customer_email text, customer_phone text, temp_password text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $function$
DECLARE
  v_id uuid;
  v_name text;
  v_email text;
  v_phone text;
  v_temp text;
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  i int;
BEGIN
  SELECT c.id, c.name, c.email, c.phone
  INTO v_id, v_name, v_email, v_phone
  FROM public.customers c
  WHERE c.email = p_login OR c.phone = p_login
  LIMIT 1;

  IF v_id IS NULL THEN
    RETURN;
  END IF;

  v_temp := '';
  FOR i IN 1..6 LOOP
    v_temp := v_temp || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;

  UPDATE public.customers SET password_hash = v_temp WHERE id = v_id;

  customer_id := v_id;
  customer_name := v_name;
  customer_email := v_email;
  customer_phone := v_phone;
  temp_password := v_temp;
  RETURN NEXT;
END;
$function$;
