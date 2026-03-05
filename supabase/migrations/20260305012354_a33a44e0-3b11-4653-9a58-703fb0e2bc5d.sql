
-- Tabela de usuários do app
CREATE TABLE public.app_users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('gestor', 'cuidador')),
  password TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de registros diários
CREATE TABLE public.records (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  caregiver TEXT NOT NULL,
  meals JSONB NOT NULL DEFAULT '{}',
  liquidos INTEGER NOT NULL DEFAULT 0,
  aceitacao INTEGER NOT NULL DEFAULT 0,
  humor TEXT DEFAULT '',
  degluticao TEXT DEFAULT '',
  peso NUMERIC(5,1),
  fezes JSONB NOT NULL DEFAULT '{"quantidade":"","obs":""}',
  urina JSONB NOT NULL DEFAULT '{"qtd":0,"obs":""}',
  alertas TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de cardápio
CREATE TABLE public.cardapio (
  id SERIAL PRIMARY KEY,
  meal_key TEXT NOT NULL,
  descricao TEXT NOT NULL,
  kcal INTEGER NOT NULL DEFAULT 0
);

-- Tabela de configurações globais
CREATE TABLE public.settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL
);

-- RLS habilitado com políticas abertas (auth gerenciada no app)
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cardapio ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all access to app_users" ON public.app_users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to records" ON public.records FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to cardapio" ON public.cardapio FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to settings" ON public.settings FOR ALL USING (true) WITH CHECK (true);

-- Seed: usuários padrão
INSERT INTO public.app_users (name, role, password) VALUES
  ('Hueslei', 'gestor', '4321'),
  ('Suelen', 'gestor', '4321'),
  ('Ana Costa', 'gestor', 'gestor123'),
  ('Fátima', 'cuidador', '1234');

-- Seed: cardápio padrão
INSERT INTO public.cardapio (meal_key, descricao, kcal) VALUES
  ('cafe', 'Mingau de aveia com leite + banana amassada', 280),
  ('cafe', 'Papa de leite com farinha de arroz + mel + canela', 260),
  ('cafe', 'Iogurte natural batido com mamão + aveia fina', 220),
  ('cafe', 'Nutren Senior conforme prescrição', 200),
  ('lanche_manha', 'Gelatina cremosa com iogurte natural', 80),
  ('lanche_manha', '½ copo suco de fruta natural coado', 60),
  ('lanche_manha', 'Iogurte natural desnatado 80g', 65),
  ('almoco', 'Purê de batata + frango desfiado em molho + cenoura', 450),
  ('almoco', 'Arroz papa + carne moída processada + abobrinha', 420),
  ('almoco', 'Sopa creme de feijão + legumes + frango desfiado', 400),
  ('almoco', 'Purê de mandioca + frango + espinafre com azeite', 430),
  ('lanche_tarde', 'Gelatina de fruta mole', 70),
  ('lanche_tarde', '½ copo vitamina de fruta com leite', 90),
  ('lanche_tarde', 'Caldo de legumes coado morno', 50),
  ('jantar', 'Sopa creme + macarrão cabelo-de-anjo + frango', 380),
  ('jantar', 'Purê de legumes + omelete mole processada', 350),
  ('jantar', 'Caldo grosso de frango com batata e cenoura', 330),
  ('ceia', 'Nutren Senior diluído conforme prescrição', 200),
  ('ceia', 'Iogurte natural morno com mel', 120),
  ('ceia', 'Caldo de frango coado morno', 80);

-- Seed: meta calórica padrão
INSERT INTO public.settings (key, value) VALUES
  ('meta_kcal', '{"min": 1600, "max": 1800}');
