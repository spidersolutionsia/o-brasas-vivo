
CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE public.customers ADD COLUMN password_hash text;

CREATE OR REPLACE FUNCTION public.authenticate_customer(p_login text, p_password text)
RETURNS TABLE(id uuid, name text, code text, email text)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT c.id, c.name, c.code, c.email
  FROM public.customers c
  WHERE (c.email = p_login OR c.phone = p_login)
    AND c.password_hash = crypt(p_password, c.password_hash);
END;
$$;

CREATE OR REPLACE FUNCTION public.hash_customer_password()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.password_hash IS NOT NULL AND (TG_OP = 'INSERT' OR OLD.password_hash IS DISTINCT FROM NEW.password_hash) THEN
    NEW.password_hash := crypt(NEW.password_hash, gen_salt('bf'));
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_hash_customer_password
BEFORE INSERT OR UPDATE ON public.customers
FOR EACH ROW EXECUTE FUNCTION public.hash_customer_password();
