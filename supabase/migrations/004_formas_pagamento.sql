-- ============================================================================
-- FORMAS PAGAMENTO - ALLIN OS 2.0
-- Baseado em: 46-formas-pagamento.md
-- Campos: nome (String 200), codigo (String 45)
-- ============================================================================

BEGIN;

-- ============================================================================
-- FORMAS PAGAMENTO
-- Baseado em: 46-formas-pagamento.md
-- ============================================================================
CREATE TABLE formas_pagamento (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(200) NOT NULL,
    codigo VARCHAR(45) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_formas_pagamento_codigo ON formas_pagamento(codigo);
CREATE INDEX idx_formas_pagamento_nome ON formas_pagamento(nome);
CREATE INDEX idx_formas_pagamento_is_active ON formas_pagamento(is_active);

-- ============================================================================
-- TRIGGER: updated_at
-- ============================================================================
CREATE TRIGGER update_formas_pagamento_updated_at BEFORE UPDATE ON formas_pagamento
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

COMMIT;

-- Verificar tabela criada
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
AND tablename = 'formas_pagamento';
