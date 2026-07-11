-- Migration: Configurações do MLM Engine
-- Tabela de configurações globais do sistema MLM

CREATE TABLE IF NOT EXISTS mlm.configuracoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chave TEXT UNIQUE NOT NULL,
  valor TEXT NOT NULL,
  descricao TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert defaults
INSERT INTO mlm.configuracoes (chave, valor, descricao) VALUES
  ('decay_rate_pontos', '0.5', 'Taxa de decaimento de pontos por nível (50% = 0.5)'),
  ('max_niveis_pontos', '5', 'Máximo de níveis para distribuição de pontos de qualificação'),
  ('max_geracoes_default', '3', 'Número máximo de gerações para comissões unilevel'),
  ('bonus_lideranca_min_diretos_1', '4', 'Mínimo de diretos para bônus liderança nível 1'),
  ('bonus_lideranca_min_diretos_2', '8', 'Mínimo de diretos para bônus liderança nível 2'),
  ('ciclo_pagamento_automatico', 'false', 'Se true, ciclos são processados automaticamente'),
  ('qualificacao_automatica', 'true', 'Se true, qualificação é recalculada automaticamente')
ON CONFLICT (chave) DO NOTHING;

-- RLS
ALTER TABLE mlm.configuracoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all" ON mlm.configuracoes
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "authenticated_read" ON mlm.configuracoes
  FOR SELECT USING (auth.role() = 'authenticated');
