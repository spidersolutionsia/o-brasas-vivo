ALTER TABLE public.customers ADD COLUMN cnpj text;
ALTER TABLE public.customers ADD CONSTRAINT customers_cnpj_unique UNIQUE (cnpj);