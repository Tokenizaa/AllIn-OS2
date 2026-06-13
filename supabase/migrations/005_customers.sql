-- ============================================================================
-- CUSTOMERS - ALLIN OS 2.0
-- Baseado em: 37-clientes.md
-- ============================================================================

BEGIN;

-- ============================================================================
-- CUSTOMERS
-- Baseado em: 37-clientes.md
-- Campos principais da API AllInBrasil
-- ============================================================================
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identificação
    tipo_cliente VARCHAR(50),
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
    
    -- Relacionamentos MLM
    patrocinador_id TEXT,
    distribuidor_id TEXT,
    
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
CREATE INDEX idx_customers_id ON customers(id);
CREATE INDEX idx_customers_tipo_cliente ON customers(tipo_cliente);
CREATE INDEX idx_customers_nome ON customers(nome);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_cpf ON customers(cpf);
CREATE INDEX idx_customers_cnpj ON customers(cnpj);
CREATE INDEX idx_customers_patrocinador_id ON customers(patrocinador_id);
CREATE INDEX idx_customers_distribuidor_id ON customers(distribuidor_id);
CREATE INDEX idx_customers_status ON customers(status);
CREATE INDEX idx_customers_ativo ON customers(ativo);
CREATE INDEX idx_customers_login ON customers(login);
CREATE INDEX idx_customers_data_cadastro ON customers(data_cadastro);
CREATE INDEX idx_customers_email_verificado ON customers(email_verificado);
CREATE INDEX idx_customers_auto_ativacao ON customers(auto_ativacao);

-- Índices GIN para busca de texto
CREATE INDEX idx_customers_nome_trgm ON customers USING gin(nome gin_trgm_ops);
CREATE INDEX idx_customers_email_trgm ON customers USING gin(email gin_trgm_ops);

-- ============================================================================
-- TRIGGER: updated_at
-- ============================================================================
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;

-- Verificar tabela criada
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename = 'customers';
