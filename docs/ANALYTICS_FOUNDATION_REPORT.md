# ANALYTICS FOUNDATION REPORT

**Data:** 7 de Junho de 2026  
**Projeto Supabase:** sistema-allin (isjsydhuqurneswstlyx)  
**Objetivo:** Auditar tabelas de analytics e validar origem, atualização, frequência, precisão

---

# RESUMO EXECUTIVO

**Status:** ⚠️ PARCIALMENTE PREPARADO - Dados Estagnados

A auditoria revelou que as tabelas de analytics existem mas:

- customer_metrics e customer_scores têm dados (1,000 registros cada)
- Todos referenciam customers_backup (não o scrape em andamento)
- Última atualização: 2026-05-17 (mais de 3 semanas atrás)
- customer_predictions e campaign_intelligence estão vazias
- Não há pipeline automático de atualização

---

# ENTIDADES MAPEADAS

## Tabelas de Analytics

| Tabela | Registros | Referência | Última Atualização | Status |
|--------|-----------|------------|-------------------|--------|
| customer_metrics | 1,000 | customers_backup | 2026-05-17 | ⚠️ Estagnado |
| customer_scores | 1,000 | customers_backup | 2026-05-17 | ⚠️ Estagnado |
| customer_predictions | 0 | - | - | ❌ Vazio |
| campaign_intelligence | 0 | - | - | ❌ Vazio |

---

# CUSTOMER_METRICS

## Schema

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Identificador único |
| user_id | UUID | Link com auth.users |
| customer_id | UUID | Link com customers |
| total_gasto | NUMERIC | Total gasto |
| ticket_medio | NUMERIC | Ticket médio |
| ltv | NUMERIC | Lifetime Value |
| total_pedidos | INTEGER | Total de pedidos |
| dias_desde_ultima_compra | INTEGER | Dias desde última compra |
| frequencia_compra | NUMERIC | Frequência de compra |
| primeira_compra | TIMESTAMP | Data da primeira compra |
| ultima_compra | TIMESTAMP | Data da última compra |
| plano_atual | TEXT | Plano atual |
| upgrade_realizado | BOOLEAN | Upgrade realizado |
| total_indicados | INTEGER | Total de indicados |
| indicados_ativos | INTEGER | Indicados ativos |
| volume_rede | NUMERIC | Volume da rede |
| receita_rede | NUMERIC | Receita da rede |
| produto_favorito | TEXT | Produto favorito |
| categoria_favorita | TEXT | Categoria favorita |
| updated_at | TIMESTAMP | Data de atualização |

## Status

- **Registros:** 1,000
- **Referência:** 100% referenciam customers_backup (válidos)
- **Última Atualização:** 2026-05-17 20:14:23 (mais de 3 semanas atrás)
- **Atualização Automática:** ❌ Não identificada

## Problemas

1. **Dados Estagnados**
   - Última atualização há mais de 3 semanas
   - Não há triggers ou jobs identificados para atualização automática
   - Dados não refletem scrape em andamento

2. **Cobertura Incompleta**
   - 1,000 de 1,631 customers têm metrics (61.3%)
   - 631 customers sem metrics

3. **Cálculos Não Validados**
   - Não há documentação de como ltv é calculado
   - Não há validação de consistência com orders/payments

---

# CUSTOMER_SCORES

## Schema

| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | Identificador único |
| user_id | UUID | Link com auth.users |
| customer_id | UUID | Link com customers |
| recompra_score | INTEGER | Score de recompra |
| ativacao_score | INTEGER | Score de ativação |
| upgrade_score | INTEGER | Score de upgrade |
| influencia_score | INTEGER | Score de influência |
| rede_score | INTEGER | Score de rede |
| churn_score | INTEGER | Score de churn |
| engagement_score | INTEGER | Score de engagement |
| updated_at | TIMESTAMP | Data de atualização |

## Status

- **Registros:** 1,000
- **Referência:** 100% referenciam customers_backup (válidos)
- **Última Atualização:** 2026-05-17 20:14:23 (mais de 3 semanas atrás)
- **Atualização Automática:** ❌ Não identificada

## Problemas

1. **Dados Estagnados**
   - Última atualização há mais de 3 semanas
   - Não há pipeline de atualização identificado

2. **Scores Não Documentados**
   - Não há documentação de como scores são calculados
   - Não há validação de consistência
   - Escala de scores não definida

3. **Cobertura Incompleta**
   - 1,000 de 1,631 customers têm scores (61.3%)
   - 631 customers sem scores

---

# CUSTOMER_PREDICTIONS

## Status

- **Registros:** 0
- **Status:** ❌ Vazio
- **Uso:** Não identificado

## Problema

Tabela existe mas não é utilizada. Não há:
- Pipeline de ML
- Modelo treinado
- Predições geradas

---

# CAMPAIGN_INTELLIGENCE

## Status

- **Registros:** 0
- **Status:** ❌ Vazio
- **Uso:** Não identificado

## Problema

Tabela existe mas não é utilizada. Não há:
- Dados de campanhas
- Inteligência de campanhas
- Análise de performance

---

# ORIGEM DOS DADOS

## customer_metrics

**Fonte Provável:** Cálculo baseado em orders e payments

**Problema:**
- Não há função ou trigger identificado para cálculo
- Não há job scheduler (pg_cron não instalado)
- Cálculo provavelmente foi feito manualmente ou via script externo

## customer_scores

**Fonte Provável:** Cálculo baseado em customer_metrics e network metrics

**Problema:**
- Não há função ou trigger identificado para cálculo
- Não há documentação de fórmulas
- Cálculo provavelmente foi feito manualmente ou via script externo

---

# FREQUÊNCIA DE ATUALIZAÇÃO

## Atual

- **Frequência:** Manual (quando executado)
- **Última Atualização:** 2026-05-17
- **Próxima Atualização:** Não agendada

## Problema

Não há atualização automática. Para ter analytics confiáveis, é necessário:

1. **Trigger pós-order:** Atualizar metrics quando novo order é criado
2. **Trigger pós-payment:** Atualizar metrics quando payment é completado
3. **Job diário:** Recalcular scores e metrics
4. **Job semanal:** Recalcular LTV e churn scores

---

# PRECISÃO DOS DADOS

## Validação

Não foi possível validar precisão porque:

1. Não há documentação de fórmulas
2. Não há funções identificadas
3. Dados estão estagnados há 3 semanas
4. Não há comparação com fonte de verdade

## Problema

Impossível determinar se os dados são precisos sem:
- Documentação de fórmulas
- Funções de cálculo
- Validação cruzada com orders/payments

---

# AÇÕES CORRETIVAS PRIORITÁRIAS

## CRÍTICO (Bloqueia Operação)

1. **Documentar fórmulas de cálculo**
   - Documentar como ltv é calculado
   - Documentar como scores são calculados
   - Documentar frequência esperada de atualização

2. **Criar pipeline de atualização automática**
   - Implementar triggers pós-order
   - Implementar triggers pós-payment
   - Instalar pg_cron para jobs agendados
   - Criar job diário de atualização

3. **Atualizar analytics para referenciar scrape**
   - Atualizar customer_metrics para referenciar customers (scrape)
   - Atualizar customer_scores para referenciar customers (scrape)
   - Recalcular metrics com dados do scrape

## ALTO (Impacta Qualidade)

4. **Expandir cobertura**
   - Calcular metrics para todos os 1,631 customers
   - Calcular scores para todos os 1,631 customers
   - Validar consistência de dados

5. **Implementar customer_predictions**
   - Definir modelo de ML
   - Treinar modelo com dados históricos
   - Implementar pipeline de predição

6. **Implementar campaign_intelligence**
   - Coletar dados de campanhas
   - Calcular métricas de performance
   - Implementar análise de ROI

## MÉDIO (Melhorias Futuras)

7. **Criar views de analytics**
   - View consolidada de customer 360
   - View de trends de metrics
   - View de comparação de scores

8. **Implementar alertas automáticos**
   - Alerta quando churn_score > threshold
   - Alerta quando ltv cai significativamente
   - Alerta quando engagement_score baixo

---

# SCORE FINAL

| Métrica | Score | Status |
|---------|-------|--------|
| Disponibilidade de Dados | 5/10 | ⚠️ Parcial |
| Atualização Automática | 0/10 | ❌ Crítico |
| Precisão de Dados | 2/10 | ❌ Crítico |
| Cobertura de Dados | 6/10 | ⚠️ Parcial |
| Documentação | 1/10 | ❌ Crítico |
| **Analytics Readiness** | **2.8/10** | **❌ Crítico** |

---

# CONCLUSÃO

O sistema de analytics **NÃO é confiável para operações atuais**. Embora as tabelas existam e tenham dados, os dados estão estagnados há mais de 3 semanas e não há pipeline de atualização automática.

**Recomendação Imediata:**
1. Documentar fórmulas de cálculo
2. Criar pipeline de atualização automática
3. Atualizar analytics para referenciar dados do scrape
4. Expandir cobertura para todos os customers

**Após correções, o sistema estará pronto para:**
- Analytics em tempo real
- Scores atualizados automaticamente
- Predições de churn
- Inteligência de campanhas

---

**Documento criado em:** 7 de Junho de 2026  
**Versão:** 1.0  
**Autor:** Cascade AI Assistant
