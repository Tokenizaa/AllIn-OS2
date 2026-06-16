# Plano de Ação - Implementação do Sistema de Processamento MLM

**Data:** 16 de Junho de 2026  
**Versão:** 1.0  
**Status:** Em Andamento

---

# ÍNDICE

1. [OBJETIVO](#objetivo)
2. [SITUAÇÃO ATUAL](#situação-atual)
3. [PLANO DE AÇÃO](#plano-de-ação)
4. [CRONOGRAMA](#cronograma)
5. [RISCOS E MITIGAÇÕES](#riscos-e-mitigações)

---

# OBJETIVO

Implementar o sistema automático de processamento de pedidos para calcular comissões, bônus, pontos e atualizar tabelas MLM, conforme documentação da API e regras de negócio.

---

# SITUAÇÃO ATUAL

## Dados Migrados
- ✅ 22,084 pedidos migrados com sucesso
- ✅ 3 planos configurados (Afiliado, Avanço, Excelência)
- ✅ 12 regras de bônus configuradas
- ✅ 100 distribuidores cadastrados

## Problemas Identificados
- ❌ 0 comissões calculadas
- ❌ 0 pontos calculados
- ❌ 0 qualificações
- ❌ 0 rede linear configurada
- ❌ Nenhum trigger de processamento automático configurado

## Causa Raiz
O sistema não tem processamento automático configurado. Quando um pedido é confirmado, não há triggers ou funções que disparam os cálculos de MLM.

---

# PLANO DE AÇÃO

## FASE 1: Implementação de Funções SQL

### 1.1 Criar Função Principal
**Arquivo:** `supabase/migrations/062_mlm_processar_pedido.sql`

**Função:** `processar_pedido_mlm(pedido_id UUID)`

**Responsabilidade:**
- Identificar tipo de compra (plano vs produto)
- Identificar se comprador é distribuidor ou cliente final
- Chamar função específica conforme tipo

**Status:** ⏳ Pendente

### 1.2 Criar Função de Compra de Plano
**Arquivo:** `supabase/migrations/063_mlm_processar_compra_plano.sql`

**Função:** `processar_compra_plano(pedido_id UUID, e_distribuidor BOOLEAN)`

**Responsabilidade:**
- Se cliente final: Criar novo distribuidor
- Definir patrocinador
- Inserir na rede linear
- Atualizar plano do distribuidor
- Gerar pontos de ativação

**Status:** ⏳ Pendente

### 1.3 Criar Função de Compra de Produto
**Arquivo:** `supabase/migrations/064_mlm_processar_compra_produto.sql`

**Função:** `processar_compra_produto(pedido_id UUID, e_distribuidor BOOLEAN)`

**Responsabilidade:**
- Gerar comissão direta para comprador
- Gerar bônus para patrocinador
- Gerar comissões de geração (1ª, 2ª, 3ª)
- Gerar bônus de liderança (Excelência)
- Gerar pontos para rede
- Atualizar qualificações

**Status:** ⏳ Pendente

## FASE 2: Implementação de Trigger

### 2.1 Criar Trigger de Processamento
**Arquivo:** `supabase/migrations/065_mlm_trigger_processar_pedido.sql`

**Trigger:** `trigger_processar_pedido_pagamento`

**Evento:** `AFTER UPDATE` na tabela `pedidos`

**Condição:** `WHEN NEW.pagamento_confirmado = true AND OLD.pagamento_confirmado = false`

**Ação:** Chamar `processar_pedido_mlm(NEW.id)`

**Status:** ⏳ Pendente

## FASE 3: Processamento de Pedidos Migrados

### 3.1 Executar Script Batch
**Arquivo:** `scripts/processar_pedidos_migrados.py`

**Responsabilidade:**
- Buscar pedidos com `pagamento_confirmado = true` e `comissoes_geradas IS NULL`
- Processar cada pedido chamando a função SQL
- Marcar pedidos como processados

**Status:** ⏳ Pendente

### 3.2 Verificar Integridade
**Responsabilidade:**
- Contar comissões geradas
- Verificar pontos calculados
- Validar qualificações
- Conferir rede linear

**Status:** ⏳ Pendente

## FASE 4: Configuração da Rede Linear

### 4.1 Popular Rede Linear
**Arquivo:** `scripts/configurar_rede_linear.py`

**Responsabilidade:**
- Para cada distribuidor, criar nó na rede linear
- Vincular ao patrocinador
- Estabelecer ordem de entrada

**Status:** ⏳ Pendente

## FASE 5: Testes e Validação

### 5.1 Testar Trigger
**Responsabilidade:**
- Criar pedido de teste
- Confirmar pagamento
- Verificar se trigger disparou
- Validar cálculos gerados

**Status:** ⏳ Pendente

### 5.2 Testar Script Batch
**Responsabilidade:**
- Executar script em ambiente de teste
- Validar resultados
- Comparar com valores esperados

**Status:** ⏳ Pendente

---

# CRONOGRAMA

## Dia 1 (16/06/2026)
- [x] Análise da documentação API
- [x] Identificação do fluxo correto
- [x] Criação de documento de fluxo
- [x] Criação de plano de ação
- [ ] Implementar função `processar_pedido_mlm()`
- [ ] Implementar função `processar_compra_plano()`

## Dia 2 (17/06/2026)
- [ ] Implementar função `processar_compra_produto()`
- [ ] Implementar trigger `trigger_processar_pedido_pagamento`
- [ ] Testar trigger com pedido novo
- [ ] Corrigir erros se houver

## Dia 3 (18/06/2026)
- [ ] Executar script batch para pedidos migrados
- [ ] Configurar rede linear
- [ ] Verificar integridade dos dados
- [ ] Corrigir erros se houver

## Dia 4 (19/06/2026)
- [ ] Testes finais
- [ ] Documentação de resultados
- [ ] Deploy em produção

---

# RISCOS E MITIGAÇÕES

## Risco 1: Erros em Funções SQL
**Probabilidade:** Alta  
**Impacto:** Alto  
**Mitigação:**
- Testar cada função individualmente
- Usar transações com rollback em caso de erro
- Implementar logging detalhado

## Risco 2: Dados Inconsistentes
**Probabilidade:** Média  
**Impacto:** Alto  
**Mitigação:**
- Verificar integridade após processamento
- Ter backup dos dados antes de processar
- Implementar validações de dados

## Risco 3: Performance do Trigger
**Probabilidade:** Média  
**Impacto:** Médio  
**Mitigação:**
- Otimizar consultas SQL
- Usar índices apropriados
- Monitorar performance após implementação

## Risco 4: Erros no Script Batch
**Probabilidade:** Média  
**Impacto:** Médio  
**Mitigação:**
- Processar em batches pequenos
- Implementar retry logic
- Ter rollback manual disponível

---

# PRÓXIMOS PASSOS IMEDIATOS

1. Criar migration `062_mlm_processar_pedido.sql` com função principal
2. Criar migration `063_mlm_processar_compra_plano.sql` com função de plano
3. Criar migration `064_mlm_processar_compra_produto.sql` com função de produto
4. Criar migration `065_mlm_trigger_processar_pedido.sql` com trigger
5. Aplicar migrations no banco
6. Testar com pedido novo
7. Processar pedidos migrados

---

**Plano criado em 16/06/2026**
