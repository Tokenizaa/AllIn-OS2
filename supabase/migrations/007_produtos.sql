-- ============================================================================
-- PRODUTOS - ALLIN OS 2.0
-- Baseado em: 54-produtos.md
-- ============================================================================

BEGIN;

-- ============================================================================
-- PRODUTOS
-- Baseado em: 54-produtos.md
-- Campos principais da API AllInBrasil
-- ============================================================================
CREATE TABLE produtos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identificação básica
    modelo VARCHAR(200),
    ncm VARCHAR(20),
    sku VARCHAR(100),
    upc VARCHAR(50),
    ean VARCHAR(50),
    jan VARCHAR(50),
    isbn VARCHAR(50),
    mpn VARCHAR(100),
    nome VARCHAR(200),
    descricao TEXT,
    tag TEXT,
    
    -- Categorização
    categoria_id UUID REFERENCES produtos_categorias(id) ON DELETE SET NULL,
    
    -- Preço e estoque
    preco NUMERIC(10,2),
    quantidade INTEGER DEFAULT 0,
    quantidade_visualizacao INTEGER DEFAULT 0,
    quantidade_minima INTEGER DEFAULT 0,
    estoque_status_id INTEGER,
    estoque_status_nome VARCHAR(100),
    
    -- Flags de plano
    e_plano BOOLEAN DEFAULT false,
    e_upgrade_plano BOOLEAN DEFAULT false,
    e_recompra_plano BOOLEAN DEFAULT false,
    e_renovacao_plano BOOLEAN DEFAULT false,
    e_ativacao BOOLEAN DEFAULT false,
    e_visivel BOOLEAN DEFAULT true,
    
    -- Upgrade e renovação
    upgrade_de_id UUID,
    upgrade_para_id UUID,
    renovacao_de_id UUID,
    
    -- Status e disponibilidade
    status VARCHAR(50),
    data_disponivel DATE,
    destacado BOOLEAN DEFAULT false,
    
    -- Frete e dimensões
    necessita_frete BOOLEAN DEFAULT false,
    peso NUMERIC(10,2),
    classe_peso_id INTEGER,
    classe_peso_unidade VARCHAR(20),
    comprimento NUMERIC(10,2),
    largura NUMERIC(10,2),
    altura NUMERIC(10,2),
    classe_dimensao_id INTEGER,
    classe_dimensao_unidade VARCHAR(20),
    
    -- Lojas
    cadastrado_loja_id INTEGER,
    gerenciado_loja_id INTEGER,
    aparece_loja_id INTEGER,
    
    -- SEO
    meta_titulo VARCHAR(200),
    meta_descricao TEXT,
    meta_palavra_chave TEXT,
    
    -- Datas
    data_adicionado TIMESTAMPTZ DEFAULT NOW(),
    data_modificado TIMESTAMPTZ DEFAULT NOW(),
    
    -- Metadados
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices baseados em filtros da API
CREATE INDEX idx_produtos_id ON produtos(id);
CREATE INDEX idx_produtos_modelo ON produtos(modelo);
CREATE INDEX idx_produtos_ncm ON produtos(ncm);
CREATE INDEX idx_produtos_preco ON produtos(preco);
CREATE INDEX idx_produtos_e_plano ON produtos(e_plano);
CREATE INDEX idx_produtos_e_upgrade_plano ON produtos(e_upgrade_plano);
CREATE INDEX idx_produtos_e_recompra_plano ON produtos(e_recompra_plano);
CREATE INDEX idx_produtos_e_renovacao_plano ON produtos(e_renovacao_plano);
CREATE INDEX idx_produtos_e_ativacao ON produtos(e_ativacao);
CREATE INDEX idx_produtos_e_visivel ON produtos(e_visivel);
CREATE INDEX idx_produtos_quantidade ON produtos(quantidade);
CREATE INDEX idx_produtos_status ON produtos(status);
CREATE INDEX idx_produtos_categoria_id ON produtos(categoria_id);
CREATE INDEX idx_produtos_sku ON produtos(sku);
CREATE INDEX idx_produtos_nome ON produtos(nome);
CREATE INDEX idx_produtos_data_adicionado ON produtos(data_adicionado);
CREATE INDEX idx_produtos_destacado ON produtos(destacado);

-- Índices GIN para busca de texto
CREATE INDEX idx_produtos_nome_trgm ON produtos USING gin(nome gin_trgm_ops);
CREATE INDEX idx_produtos_descricao_trgm ON produtos USING gin(descricao gin_trgm_ops);
CREATE INDEX idx_produtos_sku_trgm ON produtos USING gin(sku gin_trgm_ops);

-- ============================================================================
-- TRIGGER: updated_at
-- ============================================================================
CREATE TRIGGER update_produtos_updated_at BEFORE UPDATE ON produtos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;

-- Verificar tabela criada
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename = 'produtos';
