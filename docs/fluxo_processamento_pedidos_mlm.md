# Fluxo de Processamento de Pedidos - Sistema MLM

**Data:** 16 de Junho de 2026  
**Versão:** 1.0  
**Status:** Documentação Completa

---

# ÍNDICE

1. [INTRODUÇÃO](#introdução)
2. [FLUXO DE PROCESSAMENTO DE PEDIDOS](#fluxo-de-processamento-de-pedidos)
3. [DEFINIÇÃO DE COMPRADOR VS CLIENTE](#definição-de-comprador-vs-cliente)
4. [DISPARADORES DE CÁLCULOS](#disparadores-de-cálculos)
5. [IMPLEMENTAÇÃO RECOMENDADA](#implementação-recomendada)

---

# INTRODUÇÃO

Este documento descreve como o sistema deve processar pedidos para disparar cálculos de bônus, comissões, pontos e atualizações de tabelas MLM, baseado na documentação da API e nas regras de negócio.

**Princípio Fundamental:** Tudo começa pela tabela `pedidos`. Quando um pedido é criado e confirmado, ele dispara uma série de processos que atualizam as tabelas MLM.

---

# FLUXO DE PROCESSAMENTO DE PEDIDOS

## 1. Criação do Pedido

**Endpoint:** `POST /v1/pedidos`

**Campos Críticos:**
- `tipo_nome` - Tipo de compra (ex: "Plano Afiliado", "Plano Avanço", "Plano Excelência", "Produto")
- `distribuidor_indicador_id` - ID do distribuidor que indicou a compra
- `distribuidor_comprador_id` - ID do distribuidor que fez a compra (se for distribuidor)
- `cliente_id` - ID do cliente que fez a compra (se for cliente final)
- `valor_total` - Valor total do pedido
- `pagamento_confirmado` - Se o pagamento foi confirmado (true/false)
- `status_pedido` - Status do pedido (pending, approved, cancelled, etc.)
- `metadata` - Dados adicionais (id_comprador, patrocinador_comprador, plano_comprador, etc.)

**Lógica:**
1. Sistema recebe dados do pedido
2. Identifica se é compra de distribuidor ou cliente final
3. Se for compra de plano, prepara para ativação/upgrade do distribuidor
4. Se for compra de produto, prepara para geração de pontos e comissões

---

## 2. Confirmação de Pagamento

**Endpoint:** `POST /v1/pedidos/ConfirmarPagamento`

**Este é o MOMENTO CRÍTICO onde todos os cálculos devem ser disparados.**

**Fluxo de Processamento:**

### 2.1. Atualização do Status do Pedido
```sql
UPDATE pedidos 
SET pagamento_confirmado = true, 
    status_pedido = 'approved',
    data_pagamento = NOW()
WHERE id = :pedido_id
```

### 2.2. Identificação do Comprador

**Baseado nos campos do pedido:**
- Se `distribuidor_comprador_id` está preenchido → Comprador é DISTRIBUIDOR
- Se `cliente_id` está preenchido → Comprador é CLIENTE FINAL
- Se ambos estão vazios → Verificar `metadata->>'id_comprador'`

### 2.3. Processamento por Tipo de Compra

#### A. Compra de Plano (Ativação/Upgrade)

**Identificação:** `tipo_nome` contém "Plano" (ex: "Plano Afiliado", "Plano Avanço", "Plano Excelência")

**Ações:**
1. **Se comprador é CLIENTE FINAL:**
   - Criar novo registro em `mlm.distribuidores`
   - Copiar dados pessoais do cliente para o distribuidor
   - Definir `patrocinador_id` baseado em `metadata->>'patrocinador_comprador'` ou `distribuidor_indicador_id`
   - Inserir na rede linear do patrocinador
   - Atualizar `mlm.planos_distribuidores` com o plano comprado
   - Gerar pontos de ativação para o distribuidor

2. **Se comprador é DISTRIBUIDOR:**
   - Atualizar `mlm.planos_distribuidores` com o novo plano
   - Se for upgrade, registrar histórico de upgrade
   - Gerar pontos de ativação/upgrade

#### B. Compra de Produto

**Identificação:** `tipo_nome` NÃO contém "Plano"

**Ações:**
1. **Gerar Comissão Direta:**
   - Identificar o plano do comprador (via `metadata->>'plano_comprador'` ou `mlm.planos_distribuidores`)
   - Buscar regra de bônus direto correspondente em `mlm.bonus_regras`
   - Calcular comissão: `valor_total * (porcentagem / 100)`
   - Inserir registro em `mlm.comissoes` para o comprador
   - Status: 'pendente'

2. **Gerar Bônus para Patrocinador:**
   - Se `distribuidor_indicador_id` ou `metadata->>'patrocinador_comprador'` estiver preenchido
   - Identificar o patrocinador
   - Buscar regra de bônus patrocinador correspondente
   - Calcular bônus: `valor_total * (porcentagem / 100)`
   - Inserir registro em `mlm.comissoes` para o patrocinador
   - Status: 'pendente'

3. **Gerar Comissões de Geração (para planos Avanço/Excelência):**
   - Se o plano do comprador for Avanço ou Excelência
   - Navegar pela rede linear do patrocinador
   - Para cada geração (1ª, 2ª, 3ª):
     - Identificar o distribuidor da geração
     - Buscar regra de bônus de geração correspondente
     - Calcular comissão: `valor_total * (porcentagem / 100)`
     - Inserir registro em `mlm.comissoes`
     - Status: 'pendente'

4. **Gerar Bônus de Liderança (para plano Excelência):**
   - Se o plano do comprador for Excelência
   - Verificar número de diretos ativos do patrocinador
   - Se 4-7 diretos: aplicar bônus extra de 2%
   - Se 8+ diretos: aplicar bônus extra de 4%
   - Inserir registro em `mlm.comissoes`
   - Status: 'pendente'

5. **Gerar Pontos para a Rede:**
   - Calcular pontos baseados no valor do pedido
   - Adicionar pontos ao saldo do comprador em `mlm.pontos_saldo`
   - Adicionar pontos à rede do comprador (uplines)
   - Inserir transação em `mlm.pontos_transacoes`

6. **Atualizar Qualificações:**
   - Verificar se o comprador atingiu novos níveis de qualificação
   - Atualizar `mlm.qualificacoes` se necessário
   - Registrar histórico em `mlm.qualificacoes_historico`

---

# DEFINIÇÃO DE COMPRADOR VS CLIENTE

## Comprador é DISTRIBUIDOR

**Condições:**
- `distribuidor_comprador_id` está preenchido
- OU `metadata->>'id_comprador'` corresponde a um ID em `mlm.distribuidores`

**Comportamento:**
- Compra NÃO gera novo distribuidor
- Compras geram pontos para sua própria rede
- Compras NÃO geram comissão para si mesmo
- Pode fazer upgrade de plano

## Comprador é CLIENTE FINAL

**Condições:**
- `cliente_id` está preenchido
- OU `metadata->>'id_comprador'` NÃO corresponde a um distribuidor

**Comportamento:**
- Se for compra de plano → CRIA novo distribuidor
- Se for compra de produto → Permanece como cliente
- Compras geram comissão para seu patrocinador
- Pode ter patrocinador MLM (opcional)
- Pode se tornar distribuidor futuramente

---

# DISPARADORES DE CÁLCULOS

## 1. Trigger no Banco de Dados (Recomendado)

**Trigger:** `trigger_processar_pedido_pagamento`

**Evento:** `AFTER UPDATE` na tabela `pedidos`

**Condição:** `WHEN NEW.pagamento_confirmado = true AND OLD.pagamento_confirmado = false`

**Ação:** Chamar função `processar_pedido_mlm(pedido_id)`

```sql
CREATE OR REPLACE FUNCTION processar_pedido_mlm(pedido_id UUID)
RETURNS VOID AS $$
BEGIN
    -- 1. Identificar tipo de compra
    DECLARE tipo_compra TEXT;
    DECLARE e_distribuidor BOOLEAN;
    DECLARE e_plano BOOLEAN;
    
    SELECT tipo_nome INTO tipo_compra FROM pedidos WHERE id = pedido_id;
    
    -- Verificar se é compra de plano
    e_plano := tipo_compra ILIKE '%Plano%';
    
    -- 2. Identificar se comprador é distribuidor
    SELECT EXISTS(
        SELECT 1 FROM mlm.distribuidores d
        WHERE d.id = (SELECT distribuidor_comprador_id FROM pedidos WHERE id = pedido_id)
           OR d.allin_id::TEXT = (SELECT metadata->>'id_comprador' FROM pedidos WHERE id = pedido_id)
    ) INTO e_distribuidor;
    
    -- 3. Processar conforme tipo
    IF e_plano THEN
        -- Processar compra de plano
        PERFORM processar_compra_plano(pedido_id, e_distribuidor);
    ELSE
        -- Processar compra de produto
        PERFORM processar_compra_produto(pedido_id, e_distribuidor);
    END IF;
    
END;
$$ LANGUAGE plpgsql;
```

## 2. Edge Function (Alternativa)

**Endpoint:** `/functions/processar-pedido`

**Trigger:** Webhook ou chamada manual após confirmação de pagamento

**Vantagens:**
- Mais flexibilidade para lógica complexa
- Pode integrar com serviços externos
- Fácil de debugar

**Desvantagens:**
- Requer chamada explícita
- Latência adicional

## 3. Script Batch (Para Pedidos Migrados)

**Uso:** Processar pedidos históricos que já foram confirmados

**Implementação:**
- Script Python que busca pedidos com `pagamento_confirmado = true` e `comissoes_geradas IS NULL`
- Processa cada pedido conforme a lógica acima
- Marca pedidos como processados

---

# IMPLEMENTAÇÃO RECOMENDADA

## Fase 1: Implementar Trigger no Banco

**Priority:** Alta

**Passos:**
1. Criar função `processar_pedido_mlm()`
2. Criar função `processar_compra_plano()`
3. Criar função `processar_compra_produto()`
4. Criar trigger `trigger_processar_pedido_pagamento`
5. Testar com pedidos novos

## Fase 2: Processar Pedidos Migrados

**Priority:** Alta

**Passos:**
1. Executar script batch para processar pedidos históricos
2. Verificar integridade dos dados gerados
3. Corrigir erros se houver

## Fase 3: Implementar Edge Functions (Opcional)

**Priority:** Média

**Passos:**
1. Criar edge function para processamento manual
2. Implementar retry logic
3. Adicionar logs detalhados
4. Monitorar performance

## Fase 4: Implementar Dashboard de Monitoramento

**Priority:** Baixa

**Passos:**
1. Criar dashboard para visualizar comissões geradas
2. Monitorar performance do trigger
3. Alertas para erros de processamento
4. Relatórios de auditoria

---

# ESTRUTURA DE FUNÇÕES

## Função: processar_compra_plano()

```sql
CREATE OR REPLACE FUNCTION processar_compra_plano(pedido_id UUID, e_distribuidor BOOLEAN)
RETURNS VOID AS $$
DECLARE
    pedido RECORD;
    comprador_id UUID;
    patrocinador_id UUID;
    plano_nome TEXT;
    plano_id UUID;
BEGIN
    -- Buscar dados do pedido
    SELECT * INTO pedido FROM pedidos WHERE id = pedido_id;
    
    -- Identificar plano
    plano_nome := pedido.tipo_nome;
    SELECT id INTO plano_id FROM planos WHERE LOWER(nome) = LOWER(plano_nome);
    
    IF NOT e_distribuidor THEN
        -- Criar novo distribuidor
        -- 1. Copiar dados do cliente
        -- 2. Inserir em mlm.distribuidores
        -- 3. Definir patrocinador
        -- 4. Inserir na rede linear
    END IF;
    
    -- Atualizar plano do distribuidor
    INSERT INTO mlm.planos_distribuidores (distribuidor_id, plano_id, data_ativacao)
    VALUES (comprador_id, plano_id, NOW())
    ON CONFLICT (distribuidor_id) DO UPDATE SET
        plano_id = plano_id,
        data_ativacao = NOW();
    
    -- Gerar pontos de ativação
    INSERT INTO mlm.pontos_saldo (distribuidor_id, pontos_ativacao, pontos_renovacao)
    VALUES (comprador_id, 100, 0) -- Valor baseado no plano
    ON CONFLICT (distribuidor_id) DO UPDATE SET
        pontos_ativacao = pontos_ativacao + 100;
    
END;
$$ LANGUAGE plpgsql;
```

## Função: processar_compra_produto()

```sql
CREATE OR REPLACE FUNCTION processar_compra_produto(pedido_id UUID, e_distribuidor BOOLEAN)
RETURNS VOID AS $$
DECLARE
    pedido RECORD;
    comprador_id UUID;
    patrocinador_id UUID;
    valor NUMERIC;
    plano TEXT;
    regra RECORD;
BEGIN
    -- Buscar dados do pedido
    SELECT * INTO pedido FROM pedidos WHERE id = pedido_id;
    
    valor := pedido.valor_total;
    
    -- Identificar comprador
    IF e_distribuidor THEN
        comprador_id := pedido.distribuidor_comprador_id;
    ELSE
        -- Cliente final - buscar patrocinador
        patrocinador_id := pedido.distribuidor_indicador_id;
    END IF;
    
    -- Identificar plano do comprador
    plano := pedido.metadata->>'plano_comprador';
    
    -- Gerar comissão direta
    SELECT * INTO regra FROM mlm.bonus_regras 
    WHERE tipo = 'direto' 
      AND configuracoes->>'plano' = LOWER(plano)
      AND is_active = true
    LIMIT 1;
    
    IF regra.id IS NOT NULL THEN
        INSERT INTO mlm.comissoes (
            pedido_id, tipo, geracao, valor_base, porcentagem, 
            valor_comissao, status, data_calculo, distribuidor_id, descricao
        ) VALUES (
            pedido_id, regra.tipo, regra.geracao, valor, regra.porcentagem,
            valor * (regra.porcentagem / 100), 'pendente', NOW(), 
            comprador_id, regra.nome
        );
    END IF;
    
    -- Gerar bônus para patrocinador
    IF patrocinador_id IS NOT NULL THEN
        SELECT * INTO regra FROM mlm.bonus_regras 
        WHERE tipo = 'patrocinador' 
          AND configuracoes->>'plano' = LOWER(plano)
          AND is_active = true
        LIMIT 1;
        
        IF regra.id IS NOT NULL THEN
            INSERT INTO mlm.comissoes (
                pedido_id, tipo, geracao, valor_base, porcentagem, 
                valor_comissao, status, data_calculo, distribuidor_id, descricao
            ) VALUES (
                pedido_id, regra.tipo, regra.geracao, valor, regra.porcentagem,
                valor * (regra.porcentagem / 100), 'pendente', NOW(), 
                patrocinador_id, regra.nome
            );
        END IF;
        
        -- Gerar comissões de geração (para planos Avanço/Excelência)
        IF LOWER(plano) IN ('avanco', 'excelencia') THEN
            -- Navegar pela rede linear e gerar comissões para cada geração
            FOR i IN 1..3 LOOP
                SELECT * INTO regra FROM mlm.bonus_regras 
                WHERE tipo = 'geracao' 
                  AND geracao = i
                  AND configuracoes->>'plano' = LOWER(plano)
                  AND is_active = true
                LIMIT 1;
                
                IF regra.id IS NOT NULL THEN
                    -- Identificar distribuidor da geração i
                    -- Inserir comissão
                END IF;
            END LOOP;
        END IF;
    END IF;
    
    -- Gerar pontos
    -- Calcular pontos baseados no valor
    -- Adicionar ao saldo do comprador
    -- Adicionar à rede do comprador
    
END;
$$ LANGUAGE plpgsql;
```

---

# CONCLUSÃO

O sistema MLM deve processar pedidos automaticamente quando o pagamento é confirmado. O fluxo começa na tabela `pedidos` e dispara uma série de atualizações nas tabelas MLM:

1. **Compras de plano:** Criam/ativam distribuidores e geram pontos de ativação
2. **Compras de produto:** Geram comissões diretas, bônus de patrocinador, comissões de geração e pontos

A implementação recomendada é usar triggers no banco de dados para processamento automático, com scripts batch para processar pedidos históricos.

---

**Documento gerado em 16/06/2026**
