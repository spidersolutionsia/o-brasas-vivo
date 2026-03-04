
CREATE OR REPLACE FUNCTION public.hash_customer_password()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.password_hash IS NOT NULL AND (TG_OP = 'INSERT' OR OLD.password_hash IS DISTINCT FROM NEW.password_hash) THEN
    NEW.password_hash := crypt(NEW.password_hash, gen_salt('bf'));
  END IF;
  RETURN NEW;
END;
$$;
