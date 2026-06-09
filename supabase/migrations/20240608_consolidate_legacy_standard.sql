-- FASE 16 - CONSOLIDAÇÃO NO PADRÃO LEGADO
-- Data: 8 de Junho de 2026
-- Estratégia: Adotar nomenclaturas do legado Allin como padrão
-- Motivo: Sistema consome muitos dados do legado, evitar erros de mapeamento

-- ============================================
-- PASSO 1: Criar tabela de mapeamento
-- ============================================

-- Tabela para mapear id_comprador (legado) com customer_id UUID (sistema novo)
-- Isso permitirá migrar gradualmente sem perder dados
CREATE TABLE IF NOT EXISTS customer_id_mapping (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_comprador TEXT UNIQUE NOT NULL,
    customer_id UUID UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PASSO 2: Popular mapeamento inicial
-- ============================================

-- Estratégia: Mapear customers.id_comprador com customers.id
-- Isso cria o vínculo entre o sistema legado e o sistema novo
INSERT INTO customer_id_mapping (id_comprador, customer_id)
SELECT 
    c.id_comprador,
    c.id
FROM customers c
WHERE c.id_comprador IS NOT NULL
ON CONFLICT (id_comprador) DO NOTHING;

-- ============================================
-- PASSO 3: Adicionar coluna id_comprador nas tabelas do sistema novo
-- ============================================

-- Adicionar id_comprador em wallets
ALTER TABLE wallets ADD COLUMN IF NOT EXISTS id_comprador TEXT;

-- Adicionar id_comprador em points_wallets
ALTER TABLE points_wallets ADD COLUMN IF NOT EXISTS id_comprador TEXT;

-- Adicionar id_comprador em bonus_wallets
ALTER TABLE bonus_wallets ADD COLUMN IF NOT EXISTS id_comprador TEXT;

-- Adicionar id_comprador em customer_plans
ALTER TABLE customer_plans ADD COLUMN IF NOT EXISTS id_comprador TEXT;

-- Adicionar id_comprador em customer_metrics
ALTER TABLE customer_metrics ADD COLUMN IF NOT EXISTS id_comprador TEXT;

-- Adicionar id_comprador em customer_scores
ALTER TABLE customer_scores ADD COLUMN IF NOT EXISTS id_comprador TEXT;

-- Adicionar id_comprador em customer_network_metrics
ALTER TABLE customer_network_metrics ADD COLUMN IF NOT EXISTS id_comprador TEXT;

-- Adicionar id_comprador em network_relationships
ALTER TABLE network_relationships ADD COLUMN IF NOT EXISTS id_comprador TEXT;
ALTER TABLE network_relationships ADD COLUMN IF NOT EXISTS sponsor_id_comprador TEXT;
ALTER TABLE network_relationships ADD COLUMN IF NOT EXISTS root_id_comprador TEXT;

-- ============================================
-- PASSO 4: Popular id_comprador nas tabelas do sistema novo
-- ============================================

-- Atualizar wallets com id_comprador usando mapeamento
UPDATE wallets w
SET id_comprador = m.id_comprador
FROM customer_id_mapping m
WHERE w.customer_id = m.customer_id;

-- Atualizar points_wallets com id_comprador usando mapeamento
UPDATE points_wallets pw
SET id_comprador = m.id_comprador
FROM customer_id_mapping m
WHERE pw.customer_id = m.customer_id;

-- Atualizar bonus_wallets com id_comprador usando mapeamento
UPDATE bonus_wallets bw
SET id_comprador = m.id_comprador
FROM customer_id_mapping m
WHERE bw.customer_id = m.customer_id;

-- Atualizar customer_plans com id_comprador usando mapeamento
UPDATE customer_plans cp
SET id_comprador = m.id_comprador
FROM customer_id_mapping m
WHERE cp.customer_id = m.customer_id;

-- Atualizar customer_metrics com id_comprador usando mapeamento
UPDATE customer_metrics cm
SET id_comprador = m.id_comprador
FROM customer_id_mapping m
WHERE cm.customer_id = m.customer_id;

-- Atualizar customer_scores com id_comprador usando mapeamento
UPDATE customer_scores cs
SET id_comprador = m.id_comprador
FROM customer_id_mapping m
WHERE cs.customer_id = m.customer_id;

-- Atualizar customer_network_metrics com id_comprador usando mapeamento
UPDATE customer_network_metrics cnm
SET id_comprador = m.id_comprador
FROM customer_id_mapping m
WHERE cnm.customer_id = m.customer_id;

-- Atualizar network_relationships com id_comprador usando mapeamento
UPDATE network_relationships nr
SET 
    id_comprador = m.id_comprador,
    sponsor_id_comprador = sm.id_comprador,
    root_id_comprador = rm.id_comprador
FROM customer_id_mapping m
LEFT JOIN customer_id_mapping sm ON nr.sponsor_customer_id = sm.customer_id
LEFT JOIN customer_id_mapping rm ON nr.root_customer_id = rm.customer_id
WHERE nr.customer_id = m.customer_id;

-- ============================================
-- PASSO 5: Validar migração de id_comprador
-- ============================================

-- Verificar quantos registros foram atualizados
SELECT 
    'wallets' as tabela,
    COUNT(*) as total,
    COUNT(id_comprador) as com_id_comprador,
    COUNT(customer_id) as com_customer_id
FROM wallets
UNION ALL
SELECT 
    'bonus_wallets' as tabela,
    COUNT(*) as total,
    COUNT(id_comprador) as com_id_comprador,
    COUNT(customer_id) as com_customer_id
FROM bonus_wallets
UNION ALL
SELECT 
    'customer_plans' as tabela,
    COUNT(*) as total,
    COUNT(id_comprador) as com_id_comprador,
    COUNT(customer_id) as com_customer_id
FROM customer_plans
UNION ALL
SELECT 
    'network_relationships' as tabela,
    COUNT(*) as total,
    COUNT(id_comprador) as com_id_comprador,
    COUNT(customer_id) as com_customer_id
FROM network_relationships;

-- ============================================
-- PASSO 6: Validar relacionamentos após migração
-- ============================================

-- Verificar se wallets.id_comprador corresponde a customers.id_comprador
SELECT 
    'wallets.id_comprador vs customers.id_comprador' as teste,
    COUNT(DISTINCT w.id_comprador) as wallets_id_comprador,
    COUNT(DISTINCT c.id_comprador) as customers_id_comprador,
    COUNT(DISTINCT CASE WHEN w.id_comprador = c.id_comprador THEN w.id_comprador END) as matches
FROM wallets w
FULL OUTER JOIN customers c ON w.id_comprador = c.id_comprador
WHERE w.id_comprador IS NOT NULL;

-- Verificar se network_relationships.id_comprador corresponde a customers.id_comprador
SELECT 
    'network_relationships.id_comprador vs customers.id_comprador' as teste,
    COUNT(DISTINCT nr.id_comprador) as nr_id_comprador,
    COUNT(DISTINCT c.id_comprador) as customers_id_comprador,
    COUNT(DISTINCT CASE WHEN nr.id_comprador = c.id_comprador THEN nr.id_comprador END) as matches
FROM network_relationships nr
FULL OUTER JOIN customers c ON nr.id_comprador = c.id_comprador
WHERE nr.id_comprador IS NOT NULL;

-- ============================================
-- PASSO 7: Adicionar índices para performance
-- ============================================

-- Índice em customer_id_mapping
CREATE INDEX IF NOT EXISTS idx_customer_id_mapping_id_comprador ON customer_id_mapping(id_comprador);
CREATE INDEX IF NOT EXISTS idx_customer_id_mapping_customer_id ON customer_id_mapping(customer_id);

-- Índices em wallets
CREATE INDEX IF NOT EXISTS idx_wallets_id_comprador ON wallets(id_comprador);
CREATE INDEX IF NOT EXISTS idx_bonus_wallets_id_comprador ON bonus_wallets(id_comprador);

-- Índices em customer_plans
CREATE INDEX IF NOT EXISTS idx_customer_plans_id_comprador ON customer_plans(id_comprador);

-- Índices em network_relationships
CREATE INDEX IF NOT EXISTS idx_network_relationships_id_comprador ON network_relationships(id_comprador);
CREATE INDEX IF NOT EXISTS idx_network_relationships_sponsor_id_comprador ON network_relationships(sponsor_id_comprador);
CREATE INDEX IF NOT EXISTS idx_network_relationships_root_id_comprador ON network_relationships(root_id_comprador);

-- ============================================
-- PASSO 8: Adicionar NOT NULL constraint após validação
-- ============================================

-- ATENÇÃO: Executar apenas após validar que todos os registros têm id_comprador
-- ALTER TABLE wallets ALTER COLUMN id_comprador SET NOT NULL;
-- ALTER TABLE bonus_wallets ALTER COLUMN id_comprador SET NOT NULL;
-- ALTER TABLE customer_plans ALTER COLUMN id_comprador SET NOT NULL;
-- ALTER TABLE network_relationships ALTER COLUMN id_comprador SET NOT NULL;

-- ============================================
-- PASSO 9: Adicionar Foreign Keys (após validação completa)
-- ============================================

-- ATENÇÃO: Executar apenas após validar que id_comprador está populado corretamente
-- ALTER TABLE wallets ADD CONSTRAINT wallets_id_comprador_fkey 
--     FOREIGN KEY (id_comprador) REFERENCES customers(id_comprador);
-- ALTER TABLE bonus_wallets ADD CONSTRAINT bonus_wallets_id_comprador_fkey 
--     FOREIGN KEY (id_comprador) REFERENCES customers(id_comprador);
-- ALTER TABLE customer_plans ADD CONSTRAINT customer_plans_id_comprador_fkey 
--     FOREIGN KEY (id_comprador) REFERENCES customers(id_comprador);
-- ALTER TABLE network_relationships ADD CONSTRAINT network_relationships_id_comprador_fkey 
--     FOREIGN KEY (id_comprador) REFERENCES customers(id_comprador);

-- ============================================
-- NOTAS IMPORTANTES
-- ============================================

-- 1. Esta migration cria o mapeamento inicial entre id_comprador e customer_id UUID
-- 2. Adiciona coluna id_comprador em todas as tabelas do sistema novo
-- 3. Popula id_comprador usando o mapeamento
-- 4. Valida a migração
-- 5. Cria índices para performance
-- 6. NOT NULL constraints e Foreign Keys devem ser adicionados manualmente após validação

-- 7. Após esta migration, o sistema terá:
--    - id_comprador como identificador principal (padrão legado)
--    - customer_id UUID mantido para compatibilidade temporária
--    - Mapeamento entre os dois sistemas

-- 8. Próximos passos:
--    - Validar completamente o sistema
--    - Remover colunas duplicadas de orders
--    - Consolidar 3 wallets em 1 wallet
--    - Migrar distribuidores para customers
--    - Remover customer_id UUID após validação completa
