CREATE OR REPLACE FUNCTION public.generate_recovery_code(p_login text)
RETURNS TABLE(customer_id uuid, customer_name text, customer_email text, customer_phone text, recovery_code text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_id uuid;
  v_name text;
  v_email text;
  v_phone text;
  v_code text;
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

  UPDATE public.password_recovery_codes SET used = true
  WHERE password_recovery_codes.customer_id = v_id AND used = false;

  v_code := '';
  FOR i IN 1..4 LOOP
    v_code := v_code || floor(random() * 10)::int::text;
  END LOOP;

  INSERT INTO public.password_recovery_codes (customer_id, code)
  VALUES (v_id, v_code);

  customer_id := v_id;
  customer_name := v_name;
  customer_email := v_email;
  customer_phone := v_phone;
  recovery_code := v_code;
  RETURN NEXT;
END;
$$;