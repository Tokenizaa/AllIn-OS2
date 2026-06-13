-- ============================================================================
-- DISTRIBUIDORES - ALLIN OS 2.0
-- Baseado em: 39-distribuidores.md
-- ============================================================================

BEGIN;

-- ============================================================================
-- DISTRIBUIDORES
-- Baseado em: 39-distribuidores.md
-- Campos principais da API AllInBrasil
-- ============================================================================
CREATE TABLE distribuidores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identificação
    usuario VARCHAR(100) UNIQUE NOT NULL,
    nome VARCHAR(200),
    email VARCHAR(200),
    cpf VARCHAR(20),
    cnpj VARCHAR(20),
    tipo_pessoa VARCHAR(50),
    rg VARCHAR(20),
    inss_pis VARCHAR(20),
    cpf_empresario VARCHAR(20),
    pis_pasep VARCHAR(20),
    nit VARCHAR(20),
    ie VARCHAR(20),
    razao_social VARCHAR(200),
    nome_fantasia VARCHAR(200),
    
    -- Relacionamentos de rede
    patrocinador_id TEXT,
    perna_esquerda_id TEXT,
    perna_direita_id TEXT,
    
    -- Dados pessoais
    data_nascimento DATE,
    estado_civil VARCHAR(50),
    sexo VARCHAR(20),
    dependentes INTEGER DEFAULT 0,
    nome_mae VARCHAR(200),
    
    -- Contato e web
    telefone VARCHAR(20),
    website TEXT,
    resumo TEXT,
    
    -- Endereço
    cep VARCHAR(10),
    cidade VARCHAR(100),
    bairro VARCHAR(100),
    endereco TEXT,
    complemento TEXT,
    numero VARCHAR(20),
    
    -- Status e atividade
    ativo BOOLEAN DEFAULT true,
    status VARCHAR(50),
    login BOOLEAN DEFAULT false,
    auto_ativacao BOOLEAN DEFAULT false,
    email_verificado BOOLEAN DEFAULT false,
    
    -- Datas
    data_cadastro TIMESTAMPTZ DEFAULT NOW(),
    data_verificacao TIMESTAMPTZ,
    data_modificacao TIMESTAMPTZ DEFAULT NOW(),
    
    -- Metadados
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices baseados em filtros da API
CREATE INDEX idx_distribuidores_id ON distribuidores(id);
CREATE INDEX idx_distribuidores_usuario ON distribuidores(usuario);
CREATE INDEX idx_distribuidores_patrocinador_id ON distribuidores(patrocinador_id);
CREATE INDEX idx_distribuidores_perna_esquerda_id ON distribuidores(perna_esquerda_id);
CREATE INDEX idx_distribuidores_perna_direita_id ON distribuidores(perna_direita_id);
CREATE INDEX idx_distribuidores_nome ON distribuidores(nome);
CREATE INDEX idx_distribuidores_email ON distribuidores(email);
CREATE INDEX idx_distribuidores_cpf ON distribuidores(cpf);
CREATE INDEX idx_distribuidores_cnpj ON distribuidores(cnpj);
CREATE INDEX idx_distribuidores_status ON distribuidores(status);
CREATE INDEX idx_distribuidores_ativo ON distribuidores(ativo);
CREATE INDEX idx_distribuidores_login ON distribuidores(login);
CREATE INDEX idx_distribuidores_data_cadastro ON distribuidores(data_cadastro);
CREATE INDEX idx_distribuidores_email_verificado ON distribuidores(email_verificado);
CREATE INDEX idx_distribuidores_auto_ativacao ON distribuidores(auto_ativacao);

-- Índices GIN para busca de texto
CREATE INDEX idx_distribuidores_nome_trgm ON distribuidores USING gin(nome gin_trgm_ops);
CREATE INDEX idx_distribuidores_email_trgm ON distribuidores USING gin(email gin_trgm_ops);
CREATE INDEX idx_distribuidores_usuario_trgm ON distribuidores USING gin(usuario gin_trgm_ops);

-- ============================================================================
-- TRIGGER: updated_at
-- ============================================================================
CREATE TRIGGER update_distribuidores_updated_at BEFORE UPDATE ON distribuidores
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;

-- Verificar tabela criada
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename = 'distribuidores';
