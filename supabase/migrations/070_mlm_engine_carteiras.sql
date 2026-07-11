-- Migration: Carteiras do MLM Engine
-- Tabelas de saldo financeiro e transações dos distribuidores

CREATE TABLE IF NOT EXISTS mlm.carteiras (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  distribuidor_id UUID UNIQUE NOT NULL REFERENCES mlm.distribuidores(id),
  saldo NUMERIC(12,2) DEFAULT 0,
  bloqueado NUMERIC(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mlm.carteiras_transacoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  distribuidor_id UUID NOT NULL REFERENCES mlm.distribuidores(id),
  tipo TEXT NOT NULL,
  valor NUMERIC(12,2) NOT NULL,
  saldo_antes NUMERIC(12,2) NOT NULL,
  saldo_depois NUMERIC(12,2) NOT NULL,
  descricao TEXT,
  commission_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_carteiras_transacoes_distribuidor ON mlm.carteiras_transacoes(distribuidor_id);
CREATE INDEX IF NOT EXISTS idx_carteiras_transacoes_tipo ON mlm.carteiras_transacoes(tipo);

-- RLS
ALTER TABLE mlm.carteiras ENABLE ROW LEVEL SECURITY;
ALTER TABLE mlm.carteiras_transacoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all_carteiras" ON mlm.carteiras
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "authenticated_read_carteiras" ON mlm.carteiras
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "service_role_all_carteiras_transacoes" ON mlm.carteiras_transacoes
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "authenticated_read_carteiras_transacoes" ON mlm.carteiras_transacoes
  FOR SELECT USING (auth.role() = 'authenticated');
