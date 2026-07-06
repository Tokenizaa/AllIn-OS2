# ETAPA 5 - MOTOR DE REDE MLM

**Data:** 11 de Junho de 2026  
**Versão:** 1.0  
**Status:** Documentação Baseada em Evidência  
**Fonte:** Documentação API AllInBrasil, 02-BUSINESS-RULES-REVERSE-ENGINEERING.md, api-knowledge-base/58-rede-linear-nos.md

---

# OBJETIVO

Documentar a estrutura da rede MLM, incluindo rede binária, rede linear, regras de atualização, relacionamentos de patrocinador e algoritmos de posicionamento.

---

# TIPOS DE REDE

## Rede Binária

**Fonte:** docs/02-BUSINESS-RULES-REVERSE-ENGINEERING.md (linhas 1-744)

**STATUS = COMPROVADO** - Rede binária documentada em regras de negócio

**Características Documentadas:**
- Duas pernas: esquerda e direita
- Cada distribuidor pode ter duas pernas
- Patrocinador aloca novos distribuidores nas pernas
- Volume de perna é usado para cálculo de bônus

**STATUS = COMPROVADO** - Características gerais documentadas

**Campos em mlm.distribuidores:**
- `perna_esquerda_id` - ID da perna esquerda
- `perna_direita_id` - ID da perna direita
- `patrocinador_id` - ID do patrocinador

**STATUS = COMPROVADO** - Campos documentados em docs/api-knowledge-base/39-distribuidores.md

**Estrutura da Tabela (NÃO DOCUMENTADA):**
- STATUS = NÃO COMPROVADO - Estrutura completa da tabela mlm.distribuidores não documentada

---

## Rede Linear

**Fonte:** docs/api-knowledge-base/58-rede-linear-nos.md, docs/02-BUSINESS-RULES-REVERSE-ENGINEERING.md

**STATUS = COMPROVADO** - Rede linear documentada

**Características Documentadas:**
- Estrutura de linha única
- Cada distribuidor tem uma posição relativa na linha
- Posição é calculada automaticamente
- Vinculação ao patrocinador

**STATUS = COMPROVADO** - Características gerais documentadas

---

# TABELA DE REDE LINEAR

## Tabela: mlm.rede_linear_nos

**Fonte:** docs/api-knowledge-base/58-rede-linear-nos.md, docs/analise_migracao_mlm.md

**STATUS = COMPROVADO** - Tabela existe mas está vazia

**Campos Documentados:**
- `id` - ID do nó
- `linha` - Linha na rede linear
- `posicao_relativa` - Posição relativa na linha
- `id_distribuidor` - ID do distribuidor
- `id_patrocinador` - ID do patrocinador
- `data_cadastro` - Data de cadastro

**STATUS = COMPROVADO** - Campos documentados

**Estrutura Completa (NÃO DOCUMENTADA):**
- STATUS = NÃO COMPROVADO - Estrutura completa não documentada

**Conteúdo Atual:**
- STATUS = COMPROVADO - Tabela está vazia (sem nós na rede linear)

---

# ENDPOINTS DE REDE LINEAR

## Endpoint: GET /v1/rede-linear-nos

**Fonte:** docs/api-knowledge-base/58-rede-linear-nos.md

**Descrição:** Lista posições na rede linear

**Filtros Disponíveis:**
- `id` - Filtro por ID
- `linha` - Filtro por linha
- `posicao_relativa` - Filtro por posição relativa
- `id_distribuidor` - Filtro por distribuidor
- `id_patrocinador` - Filtro por patrocinador
- `limit` - Limite de resultados
- `page` - Número da página
- `select` - Seleção de campos
- `order_by` - Ordenação

**STATUS = COMPROVADO** - Endpoint documentado

---

## Endpoint: GET /v1/rede-linear-nos/Downlines

**Fonte:** docs/01-ENGANHARIA-REVERSA-API-COMPLETA.md (linha 80)

**Descrição:** Lista downlines na rede linear

**Filtros Disponíveis:**
- `id_distribuidor` - Filtro por distribuidor
- `nivel` - Filtro por nível

**Campos de Resposta:**
- `id` - ID do nó
- `id_distribuidor` - ID do distribuidor
- `nivel` - Nível na hierarquia
- `linha` - Linha na rede linear

**STATUS = COMPROVADO** - Endpoint documentado

---

## Endpoint: GET /v1/rede-linear-nos/Uplines

**Fonte:** docs/01-ENGANHARIA-REVERSA-API-COMPLETA.md (linha 81)

**Descrição:** Lista uplines na rede linear

**Filtros Disponíveis:**
- `id_distribuidor` - Filtro por distribuidor
- `nivel` - Filtro por nível

**Campos de Resposta:**
- `id` - ID do nó
- `id_distribuidor` - ID do distribuidor
- `nivel` - Nível na hierarquia
- `linha` - Linha na rede linear

**STATUS = COMPROVADO** - Endpoint documentado

---

# REGRAS DE POSICIONAMENTO

## Inserção na Rede Linear

**Fonte:** docs/fluxo_processamento_pedidos_mlm.md (linhas 1-445)

**STATUS = COMPROVADO** - Inserção ocorre na compra de plano

**Momento:**
- Quando distribuidor compra plano de ativação
- Função: processar_compra_plano()
- STATUS = COMPROVADO

**Operações:**
- INSERT em mlm.rede_linear_nos
- STATUS = COMPROVADO

---

## Cálculo de Posição Relativa

**Fonte:** docs/02-BUSINESS-RULES-REVERSE-ENGINEERING.md

**STATUS = PARCIALMENTE COMPROVADO** - Posição relativa existe mas algoritmo não documentado

**Campo Documentado:**
- `posicao_relativa` - Posição relativa na linha
- STATUS = COMPROVADO

**Algoritmo de Cálculo (NÃO DOCUMENTADO):**
- STATUS = NÃO COMPROVADO - Algoritmo de cálculo de posição não documentado

---

## Alocação em Pernas (Rede Binária)

**Fonte:** docs/02-BUSINESS-RULES-REVERSE-ENGINEERING.md

**STATUS = PARCIALMENTE COMPROVADO** - Alocação em pernas existe mas regras não documentadas

**Campos Documentados:**
- `perna_esquerda_id` - ID da perna esquerda
- `perna_direita_id` - ID da perna direita
- STATUS = COMPROVADO

**Regras de Alocação (NÃO DOCUMENTADAS):**
- STATUS = NÃO COMPROVADO - Critérios para alocação em perna esquerda vs direita não documentados
- STATUS = NÃO COMPROVADO - Quem decide a alocação (patrocinador ou sistema) não documentado

---

# RELACIONAMENTO DE PATROCINADOR

## Campo: patrocinador_id

**Fonte:** docs/api-knowledge-base/39-distribuidores.md, docs/api-knowledge-base/58-rede-linear-nos.md

**STATUS = COMPROVADO** - Campo documentado

**Em mlm.distribuidores:**
- `patrocinador_id` - ID do patrocinador do distribuidor
- STATUS = COMPROVADO

**Em mlm.rede_linear_nos:**
- `id_patrocinador` - ID do patrocinador
- STATUS = COMPROVADO

---

## Definição de Patrocinador (NÃO DOCUMENTADA)

**STATUS = NÃO COMPROVADO** - Definição de patrocinador não documentada

**Possíveis Definições (INFERIDAS):**
- STATUS = NÃO COMPROVADO - Patrocinador é quem indicou o distribuidor (inferido mas não documentado)

---

## Alteração de Patrocinador

**Fonte:** docs/AUDITORIA_LEGADA_ALLIN.md (linhas 1-925)

**Funcionalidade Identificada:**
- Tela administrativa para "Alterar usuário/patrocinador"
- STATUS = COMPROVADO

**Endpoint (NÃO DOCUMENTADO):**
- STATUS = NÃO COMPROVADO - Endpoint para alteração não documentado

**Regras de Alteração (NÃO DOCUMENTADAS):**
- STATUS = NÃO COMPROVADO - Regras para quando é permitido alterar não documentadas
- STATUS = NÃO COMPROVADO - Impacto da alteração na rede não documentado

---

# UPLINES E DOWNLINES

## Definição de Upline (NÃO DOCUMENTADA)

**STATUS = NÃO COMPROVADO** - Definição de upline não documentada

**Possível Definição (INFERIDA):**
- STATUS = NÃO COMPROVADO - Upline são distribuidores acima na hierarquia (inferido mas não documentado)

---

## Definição de Downline (NÃO DOCUMENTADA)

**STATUS = NÃO COMPROVADO** - Definição de downline não documentada

**Possível Definição (INFERIDA):**
- STATUS = NÃO COMPROVADO - Downline são distribuidores abaixo na hierarquia (inferido mas não documentado)

---

## Nível na Hierarquia

**Fonte:** docs/01-ENGANHARIA-REVERSA-API-COMPLETA.md (linhas 80-81)

**Campo Documentado:**
- `nivel` - Nível na hierarquia
- STATUS = COMPROVADO

**Cálculo de Nível (NÃO DOCUMENTADO):**
- STATUS = NÃO COMPROVADO - Algoritmo de cálculo de nível não documentado

---

# VOLUME DE REDE

## Volume de Perna

**Fonte:** docs/02-BUSINESS-RULES-REVERSE-ENGINEERING.md (linhas 1009-1016)

**Regra Documentada:**
- Bônus de perna é pago baseado no volume da perna menor
- Cálculo: Volume da perna menor × porcentagem
- Condição: Ambas as pernas devem ter volume mínimo

**STATUS = COMPROVADO** - Regra geral documentada

**Cálculo de Volume (NÃO DOCUMENTADO):**
- STATUS = NÃO COMPROVADO - Fórmula de cálculo de volume não documentada
- STATUS = NÃO COMPROVADO - O que compõe o volume não documentado (vendas? pontos?)

**Volume Mínimo (NÃO DOCUMENTADO):**
- STATUS = NÃO COMPROVADO - Valor de volume mínimo não documentado

---

## Volume de Rede para Qualificação

**Fonte:** docs/02-BUSINESS-RULES-REVERSE-ENGINEERING.md (linhas 1059-1064)

**Regra Documentada:**
- Volume de vendas da rede é critério de progressão
- STATUS = COMPROVADO

**Cálculo de Volume de Rede (NÃO DOCUMENTADO):**
- STATUS = NÃO COMPROVADO - Fórmula de cálculo não documentada
- STATUS = NÃO COMPROVADO - Escopo da rede (quantos níveis?) não documentado

---

# ATUALIZAÇÃO DE REDE

## Momento de Atualização

**Fonte:** docs/fluxo_processamento_pedidos_mlm.md

**STATUS = COMPROVADO** - Rede é atualizada na compra de plano

**Função Responsável:**
- processar_compra_plano(pedido_id UUID, e_distribuidor BOOLEAN)
- STATUS = COMPROVADO

**Operações:**
- INSERT em mlm.rede_linear_nos
- UPDATE em mlm.distribuidores (perna_esquerda_id, perna_direita_id)
- STATUS = COMPROVADO

---

## Reindexação de Rede (NÃO DOCUMENTADA)

**STATUS = NÃO COMPROVADO** - Reindexação após alteração de patrocinador não documentada

---

# REDE BINÁRIA VS REDE LINEAR

## Diferenças (NÃO DOCUMENTADAS)

**STATUS = NÃO COMPROVADO** - Diferenças funcionais entre as duas redes não documentadas

**Possíveis Diferenças (INFERIDAS):**
- STATUS = NÃO COMPROVADO - Rede binária usada para bônus de perna (inferido)
- STATUS = NÃO COMPROVADO - Rede linear usada para outro propósito (inferido)
- STATUS = NÃO COMPROVADO - Relação entre as duas redes não documentada

---

# TELA "A REDE"

**Fonte:** docs/AUDITORIA_LEGADA_ALLIN.md (linhas 1-925)

**Descrição:** Tela para visualização da rede de distribuidores

**Funcionalidades Identificadas:**
- Visualização da rede
- STATUS = COMPROVADO

**Endpoint (NÃO DOCUMENTADO):**
- STATUS = NÃO COMPROVADO - Endpoint para visualização não documentado

---

# RESUMO DO MOTOR DE REDE

## Tipos de Rede (COMPROVADO)
1. Rede Binária - Duas pernas (esquerda/direita)
2. Rede Linear - Estrutura de linha única

## Tabelas (PARCIALMENTE COMPROVADO)
- mlm.distribuidores - Campos de rede binária documentados
- mlm.rede_linear_nos - Campos documentados, tabela vazia

## Endpoints (COMPROVADO)
- GET /v1/rede-linear-nos - Lista posições
- GET /v1/rede-linear-nos/Downlines - Lista downlines
- GET /v1/rede-linear-nos/Uplines - Lista uplines

## Campos (COMPROVADO)
- perna_esquerda_id
- perna_direita_id
- patrocinador_id
- linha
- posicao_relativa
- nivel

## Algoritmos (NÃO COMPROVADO)
- Cálculo de posição relativa na rede linear
- Alocação em pernas da rede binária
- Cálculo de nível na hierarquia
- Cálculo de volume de perna
- Cálculo de volume de rede
- Reindexação após alteração de patrocinador

## Regras (NÃO COMPROVADAS)
- Critérios para alocação em perna esquerda vs direita
- Quem decide a alocação
- Quando é permitido alterar patrocinador
- Impacto da alteração de patrocinador
- Diferenças funcionais entre rede binária e linear
- Relação entre as duas redes

---

# STATUS DE EVIDÊNCIA

## COMPROVADO
- Existência de rede binária e rede linear
- Campos de rede em mlm.distribuidores
- Campos de rede linear em mlm.rede_linear_nos
- Endpoints para consulta de rede linear
- Gatilho de atualização (compra de plano)
- Relacionamento de patrocinador
- Existência de funcionalidade de alteração de patrocinador
- Uso de volume de perna para bônus
- Uso de volume de rede para qualificação

## PARCIALMENTE COMPROVADO
- Estrutura completa das tabelas de rede

## NÃO COMPROVADO
- Algoritmo de cálculo de posição relativa
- Algoritmo de alocação em pernas
- Algoritmo de cálculo de nível
- Algoritmo de cálculo de volume de perna
- Algoritmo de cálculo de volume de rede
- Definição de patrocinador
- Definição de upline e downline
- Regras para alteração de patrocinador
- Impacto da alteração de patrocinador
- Diferenças entre rede binária e linear
- Relação entre as duas redes
- Volume mínimo por perna
- Escopo da rede para qualificação

---

# PRÓXIMA ETAPA

ETAPA 6: Mapeamento de dependências de tabelas (MLM-TABLE-DEPENDENCIES.md)
