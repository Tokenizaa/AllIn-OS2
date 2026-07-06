-- Criar tabela commerce.produtos com estrutura correta
CREATE SCHEMA IF NOT EXISTS commerce;

-- Dropar tabela existente se houver (para recriar com estrutura correta)
DROP TABLE IF EXISTS commerce.produtos CASCADE;

CREATE TABLE commerce.produtos (
  id TEXT PRIMARY KEY,
  nome TEXT NOT NULL,
  sku TEXT,
  category TEXT,
  price DECIMAL(10, 2) DEFAULT 0,
  images TEXT[] DEFAULT '{}',
  description TEXT,
  manufacturer TEXT DEFAULT 'Allin',
  stock INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhorar performance
CREATE INDEX idx_produtos_category ON commerce.produtos(category);
CREATE INDEX idx_produtos_status ON commerce.produtos(status);
CREATE INDEX idx_produtos_sku ON commerce.produtos(sku);
CREATE INDEX idx_produtos_created_at ON commerce.produtos(created_at DESC);

-- Criar trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_produtos_updated_at ON commerce.produtos;
CREATE TRIGGER update_produtos_updated_at
  BEFORE UPDATE ON commerce.produtos
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Habilitar Row Level Security (RLS)
ALTER TABLE commerce.produtos ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura pública
CREATE POLICY "Allow public read access"
  ON commerce.produtos FOR SELECT
  USING (true);

-- Política para permitir inserção/edição apenas para usuários autenticados
CREATE POLICY "Allow authenticated insert"
  ON commerce.produtos FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update"
  ON commerce.produtos FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Política para permitir deleção apenas para administradores
CREATE POLICY "Allow admin delete"
  ON commerce.produtos FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM identity.user_roles
      WHERE user_id = auth.uid()
      AND role_id IN (
        SELECT id FROM identity.roles
        WHERE name IN ('admin_master', 'admin')
      )
    )
  );
