
-- Ensure pgcrypto is enabled in the correct schema
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- Recreate functions using schema-qualified calls
CREATE OR REPLACE FUNCTION public.hash_customer_password()
RETURNS trigger LANGUAGE plpgsql SET search_path = public, extensions AS $$
BEGIN
  IF NEW.password_hash IS NOT NULL AND (TG_OP = 'INSERT' OR OLD.password_hash IS DISTINCT FROM NEW.password_hash) THEN
    NEW.password_hash := extensions.crypt(NEW.password_hash, extensions.gen_salt('bf'));
  END IF;
  RETURN NEW;
END;
$$;

-- Drop and recreate trigger
DROP TRIGGER IF EXISTS trg_hash_customer_password ON public.customers;
CREATE TRIGGER trg_hash_customer_password
BEFORE INSERT OR UPDATE ON public.customers
FOR EACH ROW EXECUTE FUNCTION public.hash_customer_password();

-- Recreate authenticate function with schema-qualified calls
CREATE OR REPLACE FUNCTION public.authenticate_customer(p_login text, p_password text)
RETURNS TABLE(id uuid, name text, code text, email text)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, extensions
AS $$
BEGIN
  RETURN QUERY
  SELECT c.id, c.name, c.code, c.email
  FROM public.customers c
  WHERE (c.email = p_login OR c.phone = p_login)
    AND c.password_hash = extensions.crypt(p_password, c.password_hash);
END;
$$;
