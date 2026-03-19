
-- Table: crm_carvaomascate
CREATE TABLE public.crm_carvaomascate (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome text,
  telefone text UNIQUE,
  cidade text,
  "Ativo" text DEFAULT 'SIM',
  rota text,
  dia_visita text,
  observacoes_rota text,
  entrega text,
  "Abordagem" boolean DEFAULT false,
  "Verificado" boolean DEFAULT false,
  totaldisparomes integer DEFAULT 0,
  ultimadatadisparo text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.crm_carvaomascate ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all select on crm_carvaomascate" ON public.crm_carvaomascate FOR SELECT TO public USING (true);
CREATE POLICY "Allow all insert on crm_carvaomascate" ON public.crm_carvaomascate FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow all update on crm_carvaomascate" ON public.crm_carvaomascate FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow all delete on crm_carvaomascate" ON public.crm_carvaomascate FOR DELETE TO public USING (true);

-- Table: rotas_carvao
CREATE TABLE public.rotas_carvao (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  descricao text,
  dia_semana text,
  observacoes text,
  ativa boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.rotas_carvao ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all select on rotas_carvao" ON public.rotas_carvao FOR SELECT TO public USING (true);
CREATE POLICY "Allow all insert on rotas_carvao" ON public.rotas_carvao FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow all update on rotas_carvao" ON public.rotas_carvao FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow all delete on rotas_carvao" ON public.rotas_carvao FOR DELETE TO public USING (true);

-- Table: pedidos_semana_carvao
CREATE TABLE public.pedidos_semana_carvao (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id bigint REFERENCES public.crm_carvaomascate(id) ON DELETE CASCADE,
  telefone text,
  semana text NOT NULL,
  confirmado boolean DEFAULT false,
  data_confirmacao timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.pedidos_semana_carvao ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all select on pedidos_semana_carvao" ON public.pedidos_semana_carvao FOR SELECT TO public USING (true);
CREATE POLICY "Allow all insert on pedidos_semana_carvao" ON public.pedidos_semana_carvao FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow all update on pedidos_semana_carvao" ON public.pedidos_semana_carvao FOR UPDATE TO public USING (true) WITH CHECK (true);
CREATE POLICY "Allow all delete on pedidos_semana_carvao" ON public.pedidos_semana_carvao FOR DELETE TO public USING (true);
