-- Add intervalo and semana_referencia to rotas_carvao
ALTER TABLE rotas_carvao ADD COLUMN IF NOT EXISTS intervalo integer NOT NULL DEFAULT 1;
ALTER TABLE rotas_carvao ADD COLUMN IF NOT EXISTS semana_referencia text;

-- Convert rota from text to text[] in crm_carvaomascate
ALTER TABLE crm_carvaomascate ALTER COLUMN rota TYPE text[] USING CASE WHEN rota IS NULL THEN NULL ELSE ARRAY[rota] END;