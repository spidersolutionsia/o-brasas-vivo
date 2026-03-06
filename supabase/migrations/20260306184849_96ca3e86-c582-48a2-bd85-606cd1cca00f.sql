
-- Table for recovery codes
CREATE TABLE public.password_recovery_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  code text NOT NULL,
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '10 minutes'),
  used boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.password_recovery_codes ENABLE ROW LEVEL SECURITY;

-- No direct access policies - all via security definer RPCs

-- RPC: generate_recovery_code
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

  -- Invalidate previous unused codes
  UPDATE public.password_recovery_codes SET used = true
  WHERE password_recovery_codes.customer_id = v_id AND used = false;

  -- Generate 6-digit numeric code
  v_code := '';
  FOR i IN 1..6 LOOP
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

-- RPC: verify_recovery_code
CREATE OR REPLACE FUNCTION public.verify_recovery_code(p_login text, p_code text)
RETURNS TABLE(customer_id uuid)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  v_customer_id uuid;
  v_code_id uuid;
BEGIN
  SELECT c.id INTO v_customer_id
  FROM public.customers c
  WHERE c.email = p_login OR c.phone = p_login
  LIMIT 1;

  IF v_customer_id IS NULL THEN
    RETURN;
  END IF;

  SELECT prc.id INTO v_code_id
  FROM public.password_recovery_codes prc
  WHERE prc.customer_id = v_customer_id
    AND prc.code = p_code
    AND prc.used = false
    AND prc.expires_at > now()
  ORDER BY prc.created_at DESC
  LIMIT 1;

  IF v_code_id IS NULL THEN
    RETURN;
  END IF;

  UPDATE public.password_recovery_codes SET used = true WHERE id = v_code_id;

  customer_id := v_customer_id;
  RETURN NEXT;
END;
$$;

-- RPC: reset_customer_password
CREATE OR REPLACE FUNCTION public.reset_customer_password(p_customer_id uuid, p_new_password text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  UPDATE public.customers SET password_hash = p_new_password WHERE id = p_customer_id;
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  RETURN true;
END;
$$;

-- Drop old RPC
DROP FUNCTION IF EXISTS public.recover_customer_password(text);
