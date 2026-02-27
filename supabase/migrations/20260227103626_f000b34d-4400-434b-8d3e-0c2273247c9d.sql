ALTER TABLE public.customers ADD CONSTRAINT customers_email_unique UNIQUE (email);
ALTER TABLE public.customers ADD CONSTRAINT customers_phone_unique UNIQUE (phone);