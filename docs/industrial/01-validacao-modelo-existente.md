# VALIDAÇÃO DO MODELO INDUSTRIAL EXISTENTE
## Fábrica de Colchões - AllIn OS 2.0

**Data:** 15 de Junho de 2026  
**Objetivo:** Validar se o schema industrial atual atende a uma fábrica real de colchões  
**Escopo:** 11 entidades existentes

---

# RESUMO EXECUTIVO

O schema industrial existente possui uma fundação sólida, mas precisa de expansões específicas para atender completamente a uma fábrica real de colchões.

**Status Geral:**
- ✅ **Fundação sólida:** Estrutura básica bem desenhada
- ⚠️ **Campos faltando:** Vários campos específicos para colchões
- ⚠️ **Relacionamentos faltando:** Algumas integrações necessárias
- ⚠️ **Funcionalidades faltando:** Manutenção, documentos, controle de qualidade

**Recomendação:** Gerar migrations complementares (nunca substituir) para expandir o modelo existente.

---

# ANÁLISE POR ENTIDADE

## 1. LOCATIONS

### Modelo Atual
```sql
CREATE TABLE industrial.locations (
    id UUID PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    tipo VARCHAR(50), -- galpao, setor, linha, deposito, almoxarifado, expedicao
    parent_id UUID REFERENCES industrial.locations(id),
    descricao TEXT,
    area_m2 NUMERIC(10,2),
    created_at, updated_at, deleted_at
);
```

### 1. O modelo atende a uma fábrica real de colchões?
**Resposta:** ✅ **PARCIALMENTE**

**O que atende:**
- ✅ Hierarquia de locations (galpão → setor → linha → posto)
- ✅ Tipos de locations relevantes (galpão, setor, linha, deposito, almoxarifado, expedicao)
- ✅ Área em m² para planejamento

**O que falta:**
- ❌ Capacidade de armazenamento (volume, peso máximo)
- ❌ Tipo de ambiente (climatizado, ventilado, aberto)
- ❌ Restrições de acesso (áreas restritas)
- ❌ Infraestrutura (iluminação, energia, ar comprimido)

### 2. Quais campos estão faltando?
```sql
-- Campos faltando:
capacidade_volume_m3 NUMERIC(10,2),           -- Capacidade volumétrica
capacidade_peso_kg NUMERIC(12,2),            -- Capacidade de peso
tipo_ambiente VARCHAR(50),                    -- climatizado, ventilado, aberto
restricao_acesso BOOLEAN DEFAULT false,      -- Área restrita
infraestrutura JSONB DEFAULT '{}',            -- {iluminacao, energia, ar_comprimido}
altitude_m NUMERIC(6,2),                      -- Altitude (para logística)
piso_tipo VARCHAR(50),                       -- concreto, cerâmica, etc
```

### 3. Quais relacionamentos estão faltando?
- ✅ parent_id (hierarquia) - JÁ EXISTE
- ❌ Relacionamento com máquinas (máquinas podem ter múltiplas locations ao longo do tempo)
- ❌ Relacionamento com materials (materiais armazenados em locations)

### 4. Quais ajustes são necessários?
**Prioridade:** MÉDIA  
**Ação:** Gerar migration para adicionar campos faltantes  
**Impacto:** BAIXO (campos adicionais, não quebra código existente)

---

## 2. MACHINES

### Modelo Atual
```sql
CREATE TABLE industrial.machines (
    id UUID PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    fabricante VARCHAR(200),
    modelo VARCHAR(200),
    numero_serie VARCHAR(100),
    data_aquisicao DATE,
    valor_aquisicao NUMERIC(12,2),
    localizacao_id UUID REFERENCES industrial.locations(id),
    localizacao_detalhe TEXT,
    status VARCHAR(50) DEFAULT 'active', -- active, maintenance, inactive, retired
    capacidade_horaria NUMERIC(10,2),
    especificacoes JSONB DEFAULT '{}',
    observacoes TEXT,
    anexos JSONB DEFAULT '[]',
    created_at, updated_at, deleted_at
);
```

### 1. O modelo atende a uma fábrica real de colchões?
**Resposta:** ⚠️ **PARCIALMENTE**

**O que atende:**
- ✅ Identificação básica (nome, código, fabricante, modelo, número série)
- ✅ Dados de aquisição (data, valor)
- ✅ Localização
- ✅ Status básico
- ✅ Capacidade horária
- ✅ Especificações em JSONB (flexível)
- ✅ Anexos em JSONB (flexível)

**O que falta:**
- ❌ Capacidade teórica vs capacidade operacional (distinção importante)
- ❌ Disponibilidade real (considerando manutenções, paradas)
- ❌ Manutenção preventiva (planejamento, histórico)
- ❌ Manutenção corretiva (histórico de falhas)
- ❌ Vida útil (data fim vida útil, depreciação)
- ❌ Documentos específicos (manuais, certificados)
- ❌ Fotos (para identificação visual)
- ❅ Especificações em JSONB é bom, mas falta estrutura

### 2. Quais campos estão faltando?
```sql
-- Campos faltando:
capacidade_teorica NUMERIC(10,2),            -- Capacidade teórica máxima
capacidade_operacional NUMERIC(10,2),        -- Capacidade real operacional
disponibilidade_percentual NUMERIC(5,2),    -- Disponibilidade atual (%)
data_fim_vida_util DATE,                     -- Fim da vida útil
depreciacao_anual_percentual NUMERIC(5,2),   -- Depreciação anual
horas_operacao_total NUMERIC(12,2),          -- Horas totais operadas
horas_manutencao_total NUMERIC(12,2),        -- Horas totais em manutenção
ultima_manutencao_preventiva DATE,           -- Última manutenção preventiva
proxima_manutencao_preventiva DATE,          -- Próxima manutenção preventiva
tipo_manutencao VARCHAR(50),                 -- preventiva, preditiva, corretiva
frequencia_manutencao_horas INTEGER,         -- Frequência em horas
criticalidade VARCHAR(50),                   -- alta, media, baixa
```

### 3. Quais relacionamentos estão faltando?
- ✅ localizacao_id - JÁ EXISTE
- ❌ Tabela de manutenções (machine_maintenance)
- ❌ Tabela de documentos técnicos (machine_documents)
- ❌ Tabela de fotos (machine_photos)
- ❌ Relacionamento com processes (quais processos a máquina executa)

### 4. Quais ajustes são necessários?
**Prioridade:** ALTA  
**Ação:** 
1. Gerar migration para adicionar campos faltantes
2. Criar tabela auxiliar `machine_maintenance`
3. Criar tabela auxiliar `machine_documents`
4. Criar tabela auxiliar `machine_photos`

**Impacto:** MÉDIO (adiciona tabelas auxiliares, mas não quebra código existente)

---

## 3. MATERIALS

### Modelo Atual
```sql
CREATE TABLE industrial.materials (
    id UUID PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    descricao VARCHAR(500) NOT NULL,
    categoria VARCHAR(100),
    unidade_medida VARCHAR(20) NOT NULL, -- kg, m, un, m2, m3
    estoque_atual NUMERIC(12,3) DEFAULT 0,
    estoque_minimo NUMERIC(12,3) DEFAULT 0,
    estoque_maximo NUMERIC(12,3),
    custo_unitario NUMERIC(12,2),
    custo_medio NUMERIC(12,2),
    fornecedor_padrao_id UUID REFERENCES industrial.suppliers(id),
    localizacao_id UUID REFERENCES industrial.locations(id),
    especificacoes JSONB DEFAULT '{}',
    observacoes TEXT,
    created_at, updated_at, deleted_at
);
```

### 1. O modelo atende a uma fábrica real de colchões?
**Resposta:** ✅ **BEM**

**O que atende:**
- ✅ Identificação completa (código, descrição, categoria)
- ✅ Unidade de medida flexível
- ✅ Controle de estoque (atual, mínimo, máximo)
- ✅ Custo (unitário, médio)
- ✅ Fornecedor padrão
- ✅ Localização
- ✅ Especificações em JSONB (flexível)

**O que falta:**
- ❌ Lead time de entrega (tempo para reposição)
- ❌ Lote/validade (para materiais com validade)
- ❌ Classificação ABC (para gestão de estoque)
- ❌ Peso específico (para cálculo de volume/peso)
- ❅ Especificações em JSONB é bom, mas falta estrutura para colchões

### 2. Quais campos estão faltando?
```sql
-- Campos faltando:
lead_time_dias INTEGER,                      -- Lead time de entrega
lote VARCHAR(50),                            -- Número do lote
data_validade DATE,                          -- Data de validade
classificacao_abc VARCHAR(1),                -- A, B, C (curva ABC)
peso_especifico_kg_m3 NUMERIC(8,3),         -- Peso específico
altura_pilha_max_m NUMERIC(6,2),             -- Altura máxima de empilhamento
unidade_caixa VARCHAR(50),                   -- Unidade por caixa
ponto_reposicao NUMERIC(12,3),              -- Ponto de reposição
segurança_estoque NUMERIC(12,3),             -- Estoque de segurança
```

### 3. Quais relacionamentos estão faltando?
- ✅ fornecedor_padrao_id - JÁ EXISTE
- ✅ localizacao_id - JÁ EXISTE
- ❌ Tabela de movimentação de estoque (inventory_movements)
- ❌ Tabela de histórico de preços (material_price_history)
- ❌ Relacionamento com components (materiais usados em componentes)

### 4. Quais ajustes são necessários?
**Prioridade:** MÉDIA  
**Ação:** 
1. Gerar migration para adicionar campos faltantes
2. Criar tabela auxiliar `inventory_movements`
3. Criar tabela auxiliar `material_price_history`

**Impacto:** MÉDIO (adiciona tabelas auxiliares)

---

## 4. SUPPLIERS

### Modelo Atual
```sql
CREATE TABLE industrial.suppliers (
    id UUID PRIMARY KEY,
    razao_social VARCHAR(200) NOT NULL,
    nome_fantasia VARCHAR(200),
    cnpj VARCHAR(20),
    contato_nome VARCHAR(100),
    contato_email VARCHAR(200),
    contato_telefone VARCHAR(20),
    endereco TEXT,
    cidade VARCHAR(100),
    estado VARCHAR(2),
    cep VARCHAR(10),
    status VARCHAR(50) DEFAULT 'active',
    condicoes_pagamento TEXT,
    prazo_entrega_padrao INTEGER, -- dias
    observacoes TEXT,
    created_at, updated_at, deleted_at
);
```

### 1. O modelo atende a uma fábrica real de colchões?
**Resposta:** ✅ **BEM**

**O que atende:**
- ✅ Identificação completa (razão social, nome fantasia, CNPJ)
- ✅ Contato (nome, email, telefone)
- ✅ Endereço completo
- ✅ Status
- ✅ Condições de pagamento
- ✅ Prazo de entrega padrão

**O que falta:**
- ❌ Classificação/categoria de fornecedor
- ❌ Avaliação/performance (qualidade, prazo, preço)
- ❌ Certificações (ISO, etc)
- ❌ Contatos múltiplos (mais de um contato por fornecedor)
- ❌ Histórico de pedidos

### 2. Quais campos estão faltando?
```sql
-- Campos faltando:
categoria VARCHAR(50),                       -- espumas, tecidos, acessorios, embalagens
classificacao VARCHAR(50),                   -- estrategico, preferencial, alternativo
avaliacao_qualidade NUMERIC(3,2),            -- 0-5
avaliacao_prazo NUMERIC(3,2),                -- 0-5
avaliacao_preco NUMERIC(3,2),                -- 0-5
avaliacao_geral NUMERIC(3,2),                -- 0-5 (média)
certificacoes JSONB DEFAULT '[]',            -- Lista de certificações
site VARCHAR(200),                           -- Site do fornecedor
data_primeira_compra DATE,                   -- Data da primeira compra
data_ultima_compra DATE,                     -- Data da última compra
total_compras NUMERIC(15,2),                 -- Total comprado
```

### 3. Quais relacionamentos estão faltando?
- ❌ Tabela de contatos múltiplos (supplier_contacts)
- ❌ Tabela de histórico de avaliações (supplier_evaluations)
- ❌ Relacionamento com materials (quais materiais o fornecedor fornece)

### 4. Quais ajustes são necessários?
**Prioridade:** MÉDIA  
**Ação:** 
1. Gerar migration para adicionar campos faltantes
2. Criar tabela auxiliar `supplier_contacts`
3. Criar tabela auxiliar `supplier_evaluations`

**Impacto:** BAIXO (campos adicionais e tabelas auxiliares)

---

## 5. PROCESSES

### Modelo Atual
```sql
CREATE TABLE industrial.processes (
    id UUID PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    descricao TEXT,
    sequencia INTEGER,
    entradas JSONB DEFAULT '[]', -- IDs de materiais
    saidas JSONB DEFAULT '[]', -- IDs de produtos/componentes
    maquinas JSONB DEFAULT '[]', -- IDs de máquinas
    responsaveis JSONB DEFAULT '[]', -- IDs de usuários/roles
    tempo_padrao_minutos INTEGER,
    status VARCHAR(50) DEFAULT 'active',
    observacoes TEXT,
    created_at, updated_at, deleted_at
);
```

### 1. O modelo atende a uma fábrica real de colchões?
**Resposta:** ⚠️ **PARCIALMENTE**

**O que atende:**
- ✅ Identificação básica (nome, descrição)
- ✅ Sequência (ordem do processo)
- ✅ Entradas e saídas em JSONB (flexível)
- ✅ Máquinas em JSONB (flexível)
- ✅ Responsáveis em JSONB (flexível)
- ✅ Tempo padrão
- ✅ Status

**O que falta:**
- ❌ Tipo de processo (Recebimento, Corte, Montagem, Costura, Fechamento, Embalagem, Expedição)
- ❌ Capacidade do processo (unidades/hora)
- ❌ Perdas previstas (%)
- ❅ Relacionamentos em JSONB é flexível, mas falta integridade referencial
- ❅ Setup time (tempo de preparação)
- ❅ Lote mínimo/máximo
- ❅ Documentos do processo (SOPs)

### 2. Quais campos estão faltando?
```sql
-- Campos faltando:
tipo_processo VARCHAR(50),                   -- recebimento, corte, montagem, costura, fechamento, embalagem, expedicao
capacidade_unidades_hora NUMERIC(10,2),      -- Capacidade do processo
perda_prevista_percentual NUMERIC(5,2),      -- Perda prevista (%)
setup_time_minutos INTEGER,                  -- Tempo de setup/preparação
lote_minimo INTEGER,                         -- Lote mínimo
lote_maximo INTEGER,                         -- Lote máximo
tempo_padrao_unidade_segundos NUMERIC(10,2),-- Tempo por unidade (segundos)
eficiencia_padrao NUMERIC(5,2),              -- Eficiência padrão (%)
```

### 3. Quais relacionamentos estão faltando?
- ❅ JSONB para entradas/saídas/máquinas/responsáveis é flexível
- ❌ Mas falta integridade referencial (pode referenciar IDs que não existem)
- ❌ Tabela de process_steps (sub-processos)
- ❌ Tabela de process_documents (SOPs, instruções)

### 4. Quais ajustes são necessários?
**Prioridade:** ALTA  
**Ação:** 
1. Gerar migration para adicionar campos faltantes
2. Criar tabela auxiliar `process_steps` (sub-processos)
3. Criar tabela auxiliar `process_documents` (SOPs)
4. Considerar criar tabelas de relacionamento para entradas/saídas/máquinas (substituir JSONB)

**Impacto:** MÉDIO (adiciona campos e tabelas auxiliares)

---

## 6. TIMING_RECORDS

### Modelo Atual
```sql
CREATE TABLE industrial.timing_records (
    id UUID PRIMARY KEY,
    processo_id UUID REFERENCES industrial.processes(id),
    operador_id UUID REFERENCES auth.users(id),
    inicio TIMESTAMPTZ NOT NULL,
    fim TIMESTAMPTZ,
    duracao_segundos INTEGER,
    produto_id UUID REFERENCES industrial.products_industrial(id),
    quantidade_produzida INTEGER,
    observacoes TEXT,
    created_at, updated_at, deleted_at
);
```

### 1. O modelo atende a uma fábrica real de colchões?
**Resposta:** ⚠️ **PARCIALMENTE**

**O que atende:**
- ✅ Relacionamento com processo
- ✅ Relacionamento com operador
- ✅ Tempo (início, fim, duração)
- ✅ Contexto (produto, quantidade)
- ✅ Observações

**O que falta:**
- ❌ Relacionamento com máquina (qual máquina foi usada)
- ❅ Tipo de medição (cronometragem, amostragem, estudo de tempos)
- ❌ Método de medição (cronômetro, vídeo, observação direta)
- ❌ Condições (normal, anormal, treinamento)
- ❌ Múltiplas medições (para cálculo de média e desvio padrão)
- ❅ Estudo de tempos (grupo de medições relacionadas)
- ❅ Fatores de ajuste (fadiga, atrasos, interrupções)

### 2. Quais campos estão faltando?
```sql
-- Campos faltando:
maquina_id UUID REFERENCES industrial.machines(id), -- Máquina utilizada
tipo_medicao VARCHAR(50),                   -- cronometragem, amostragem, estudo_tempos
metodo_medicao VARCHAR(50),                 -- cronometro, video, observacao
condicao VARCHAR(50),                       -- normal, anormal, treinamento
grupo_estudo_id UUID,                        -- Grupo de medições relacionadas
fator_ajuste NUMERIC(5,2),                  -- Fator de ajuste
ciclos INTEGER,                              -- Número de ciclos medidos
tempo_unitario_segundos NUMERIC(10,2),       -- Tempo por unidade
desvio_padrao_segundos NUMERIC(10,2),       -- Desvio padrão
minimo_segundos NUMERIC(10,2),              -- Tempo mínimo
maximo_segundos NUMERIC(10,2),              -- Tempo máximo
mediana_segundos NUMERIC(10,2),             -- Mediana
```

### 3. Quais relacionamentos estão faltando?
- ❌ maquina_id - ADICIONADO ACIMA
- ❌ Tabela de timing_studies (agrupa múltiplas medições)
- ❌ Tabela de timing_factors (fatores de ajuste padrão)

### 4. Quais ajustes são necessários?
**Prioridade:** ALTA  
**Ação:** 
1. Gerar migration para adicionar campos faltantes
2. Criar tabela auxiliar `timing_studies`
3. Criar tabela auxiliar `timing_factors`

**Impacto:** MÉDIO (adiciona campos e tabelas auxiliares)

---

## 7. CAPACITY

### Modelo Atual
```sql
CREATE TABLE industrial.capacity (
    id UUID PRIMARY KEY,
    maquina_id UUID REFERENCES industrial.machines(id),
    capacidade_teorica NUMERIC(12,2), -- unidades/hora
    capacidade_observada NUMERIC(12,2), -- unidades/hora (real)
    unidade_medida VARCHAR(20), -- unidades/hora, unidades/dia, metros/hora
    data_inicio DATE,
    data_fim DATE,
    observacoes TEXT,
    created_at, updated_at, deleted_at
);
```

### 1. O modelo atende a uma fábrica real de colchões?
**Resposta:** ⚠️ **PARCIALMENTE**

**O que atende:**
- ✅ Relacionamento com máquina
- ✅ Capacidade teórica vs observada
- ✅ Unidade de medida flexível
- ✅ Período (data início, data fim)

**O que falta:**
- ❌ Capacidade por processo (não apenas por máquina)
- ❌ Capacidade por setor/location
- ❅ Capacidade diária consolidada
- ❌ Capacidade mensal consolidada
- ❅ Turnos de trabalho (manhã, tarde, noite)
- ❌ Eficiência/OEE (Overall Equipment Effectiveness)
- ❅ Disponibilidade (considerando paradas planejadas)
- ❅ Performance (considerando velocidade real)
- ❌ Qualidade (considerando peças defeituosas)

### 2. Quais campos estão faltando?
```sql
-- Campos faltando:
processo_id UUID REFERENCES industrial.processes(id), -- Capacidade por processo
location_id UUID REFERENCES industrial.locations(id), -- Capacidade por setor
turno VARCHAR(50),                           -- manha, tarde, noite
horas_trabalho_diarias NUMERIC(5,2),         -- Horas de trabalho por dia
dias_trabalho_semana INTEGER,                -- Dias de trabalho por semana
eficiencia_percentual NUMERIC(5,2),          -- Eficiência (%)
disponibilidade_percentual NUMERIC(5,2),     -- Disponibilidade (%)
performance_percentual NUMERIC(5,2),         -- Performance (%)
qualidade_percentual NUMERIC(5,2),           -- Qualidade (%)
oee_percentual NUMERIC(5,2),                 -- OEE (%)
paradas_planejadas_horas NUMERIC(8,2),       -- Paradas planejadas (horas)
paradas_nao_planejadas_horas NUMERIC(8,2),   -- Paradas não planejadas (horas)
```

### 3. Quais relacionamentos estão faltando?
- ❌ processo_id - ADICIONADO ACIMA
- ❌ location_id - ADICIONADO ACIMA
- ❌ Tabela de capacity_planning (planejamento de capacidade)
- ❌ Tabela de capacity_history (histórico de capacidade)

### 4. Quais ajustes são necessários?
**Prioridade:** ALTA  
**Ação:** 
1. Gerar migration para adicionar campos faltantes
2. Criar tabela auxiliar `capacity_planning`
3. Criar tabela auxiliar `capacity_history`

**Impacto:** MÉDIO (adiciona campos e tabelas auxiliares)

---

## 8. TOOLS

### Modelo Atual
```sql
CREATE TABLE industrial.tools (
    id UUID PRIMARY KEY,
    descricao VARCHAR(500) NOT NULL,
    categoria VARCHAR(100),
    localizacao_id UUID REFERENCES industrial.locations(id),
    responsavel_id UUID REFERENCES auth.users(id),
    status VARCHAR(50) DEFAULT 'available',
    observacoes TEXT,
    created_at, updated_at, deleted_at
);
```

### 1. O modelo atende a uma fábrica real de colchões?
**Resposta:** ⚠️ **PARCIALMENTE**

**O que atende:**
- ✅ Descrição
- ✅ Categoria
- ✅ Localização
- ✅ Responsável
- ✅ Status

**O que falta:**
- ❌ Código/identificação única
- ❡ Tipo de ferramenta (manual, elétrica, pneumática)
- ❡ Fabricante
- ❡ Data de aquisição
- ❡ Vida útil
- ❡ Manutenção
- ❡ Calibração (para ferramentas de precisão)
- ❡ Relacionamento com processos (quais processos usam a ferramenta)

### 2. Quais campos estão faltando?
```sql
-- Campos faltando:
codigo VARCHAR(50) UNIQUE,                   -- Código único
tipo VARCHAR(50),                            -- manual, eletrica, pneumatica, precisao
fabricante VARCHAR(200),                     -- Fabricante
modelo VARCHAR(200),                         -- Modelo
data_aquisicao DATE,                         -- Data de aquisicao
data_fim_vida_util DATE,                     -- Fim da vida útil
ultima_calibracao DATE,                      -- Última calibração
proxima_calibracao DATE,                     -- Próxima calibração
frequencia_calibracao_dias INTEGER,          -- Frequência de calibração
```

### 3. Quais relacionamentos estão faltando?
- ❌ Tabela de tool_maintenance (manutenção de ferramentas)
- ❌ Tabela de tool_calibration (histórico de calibração)
- ❌ Relacionamento com processes (quais processos usam a ferramenta)

### 4. Quais ajustes são necessários?
**Prioridade:** BAIXA  
**Ação:** 
1. Gerar migration para adicionar campos faltantes
2. Criar tabela auxiliar `tool_maintenance`
3. Criar tabela auxiliar `tool_calibration`

**Impacto:** BAIXO (campos adicionais e tabelas auxiliares)

---

## 9. PRODUCTS_INDUSTRIAL

### Modelo Atual
```sql
CREATE TABLE industrial.products_industrial (
    id UUID PRIMARY KEY,
    modelo VARCHAR(200) NOT NULL,
    categoria VARCHAR(100), -- colchao, tenis (futuro)
    largura_cm NUMERIC(6,2),
    comprimento_cm NUMERIC(6,2),
    altura_cm NUMERIC(6,2),
    especificacoes JSONB DEFAULT '{}',
    observacoes TEXT,
    created_at, updated_at, deleted_at
);
```

### 1. O modelo atende a uma fábrica real de colchões?
**Resposta:** ⚠️ **PARCIALMENTE**

**O que atende:**
- ✅ Modelo
- ✅ Categoria
- ✅ Dimensões (largura, comprimento, altura)
- ✅ Especificações em JSONB (flexível)

**O que falta:**
- ❌ Densidade (importante para colchões)
- ❌ Composição (materiais usados)
- ❡ Linha (linha de produtos)
- ❡ Coleção (coleção dentro da linha)
- ❡ Peso (peso do colchão)
- ❡ Tipo (box, spring, espuma, látex, híbrido)
- ❡ Certificações (INMETRO, etc)
- ❡ Observações técnicas (especificações técnicas detalhadas)
- ❅ Especificações em JSONB é bom, mas falta estrutura para colchões

### 2. Quais campos estão faltando?
```sql
-- Campos faltando:
densidade NUMERIC(6,2),                      -- Densidade (kg/m³)
composicao TEXT,                             -- Composição dos materiais
linha VARCHAR(100),                          -- Linha de produtos
colecao VARCHAR(100),                        -- Coleção
peso_kg NUMERIC(8,2),                       -- Peso do colchão
tipo_colchao VARCHAR(50),                    -- box, spring, espuma, latex, hibrido
numero_molas INTEGER,                        -- Número de molas (se aplicável)
espessura_cm NUMERIC(6,2),                   -- Espessura
garantia_meses INTEGER,                      -- Garantia em meses
certificacoes JSONB DEFAULT '[]',            -- Lista de certificações
observacoes_tecnicas TEXT,                    -- Observações técnicas
sku VARCHAR(50),                             -- SKU para integração com e-commerce
ean VARCHAR(13),                             -- Código de barras EAN
```

### 3. Quais relacionamentos estão faltando?
- ❌ Relacionamento com BOM (já existe, mas pode ser melhorado)
- ❌ Relacionamento com processes (quais processos produzem este produto)
- ❌ Tabela de product_certifications (certificações detalhadas)

### 4. Quais ajustes são necessários?
**Prioridade:** ALTA  
**Ação:** 
1. Gerar migration para adicionar campos faltantes
2. Criar tabela auxiliar `product_certifications`
3. Criar tabela auxiliar `product_processes` (processos que produzem o produto)

**Impacto:** MÉDIO (adiciona campos e tabelas auxiliares)

---

## 10. COMPONENTS

### Modelo Atual
```sql
CREATE TABLE industrial.components (
    id UUID PRIMARY KEY,
    nome VARCHAR(200) NOT NULL,
    categoria VARCHAR(100), -- espuma, tecido, acessorio, embalagem
    especificacoes JSONB DEFAULT '{}',
    observacoes TEXT,
    created_at, updated_at, deleted_at
);
```

### 1. O modelo atende a uma fábrica real de colchões?
**Resposta:** ⚠️ **PARCIALMENTE**

**O que atende:**
- ✅ Nome
- ✅ Categoria (espuma, tecido, acessorio, embalagem)
- ✅ Especificações em JSONB (flexível)

**O que falta:**
- ❌ Código/identificação única
- ❡ Tipo específico (dentro da categoria)
- ❡ Dimensões (para componentes físicos)
- ❡ Peso
- ❡ Cor
- ❡ Fornecedor padrão
- ❅ Especificações em JSONB é bom, mas falta estrutura

### 2. Quais campos estão faltando?
```sql
-- Campos faltando:
codigo VARCHAR(50) UNIQUE,                   -- Código único
tipo VARCHAR(100),                           -- Tipo específico
largura_cm NUMERIC(6,2),                    -- Largura
comprimento_cm NUMERIC(6,2),                 -- Comprimento
altura_cm NUMERIC(6,2),                      -- Altura
peso_kg NUMERIC(8,2),                       -- Peso
cor VARCHAR(50),                             -- Cor
fornecedor_padrao_id UUID REFERENCES industrial.suppliers(id), -- Fornecedor padrão
unidade_medida VARCHAR(20),                  -- un, m, m2, kg
```

### 3. Quais relacionamentos estão faltando?
- ❌ fornecedor_padrao_id - ADICIONADO ACIMA
- ❌ Relacionamento com materials (componente feito de materiais)
- ❌ Tabela de component_specifications (especificações detalhadas)

### 4. Quais ajustes são necessários?
**Prioridade:** MÉDIA  
**Ação:** 
1. Gerar migration para adicionar campos faltantes
2. Criar tabela auxiliar `component_specifications`

**Impacto:** BAIXO (campos adicionais e tabela auxiliar)

---

## 11. BOM

### Modelo Atual
```sql
CREATE TABLE industrial.bom (
    id UUID PRIMARY KEY,
    produto_id UUID REFERENCES industrial.products_industrial(id),
    componente_id UUID REFERENCES industrial.components(id),
    quantidade NUMERIC(12,3) NOT NULL,
    unidade_medida VARCHAR(20),
    sequencia INTEGER,
    observacoes TEXT,
    created_at, updated_at, deleted_at
);
```

### 1. O modelo atende a uma fábrica real de colchões?
**Resposta:** ⚠️ **PARCIALMENTE**

**O que atende:**
- ✅ Relacionamento com produto
- ✅ Relacionamento com componente
- ✅ Quantidade
- ✅ Unidade de medida
- ✅ Sequência
- ✅ Observações

**O que falta:**
- ❡ Consumo por unidade (já tem quantidade, mas pode ser mais explícito)
- ❡ Perdas previstas (%)
- ❡ Revisão (versão do BOM)
- ❡ Versão (controle de versão)
- ❡ Vigência (data início, data fim)
- ❡ Status (ativo, inativo, obsoleto)
- ❡ Custo total do componente no BOM

### 2. Quais campos estão faltando?
```sql
-- Campos faltando:
perda_prevista_percentual NUMERIC(5,2),     -- Perda prevista (%)
revisao VARCHAR(50),                        -- Revisão (A, B, C...)
versao INTEGER,                             -- Versão (1, 2, 3...)
data_inicio_vigencia DATE,                  -- Início da vigência
data_fim_vigencia DATE,                     -- Fim da vigência
status VARCHAR(50) DEFAULT 'active',        -- active, inactive, obsolete
custo_unitario NUMERIC(12,2),               -- Custo unitário do componente
custo_total NUMERIC(12,2),                  -- Custo total (quantidade * custo)
aprovado_por UUID REFERENCES auth.users(id), -- Aprovado por
data_aprovacao DATE,                        -- Data de aprovação
```

### 3. Quais relacionamentos estão faltando?
- ❌ aprovado_por - ADICIONADO ACIMA
- ❌ Tabela de bom_history (histórico de versões do BOM)
- ❌ Tabela de bom_alternatives (componentes alternativos)

### 4. Quais ajustes são necessários?
**Prioridade:** ALTA  
**Ação:** 
1. Gerar migration para adicionar campos faltantes
2. Criar tabela auxiliar `bom_history`
3. Criar tabela auxiliar `bom_alternatives`

**Impacto:** MÉDIO (adiciona campos e tabelas auxiliares)

---

# RESUMO DAS MIGRATIONS NECESSÁRIAS

## MIGRATION 1: Expansão de Locations
**Prioridade:** MÉDIA  
**Campos:** capacidade_volume_m3, capacidade_peso_kg, tipo_ambiente, restricao_acesso, infraestrutura, altitude_m, piso_tipo

## MIGRATION 2: Expansão de Machines
**Prioridade:** ALTA  
**Campos:** capacidade_teorica, capacidade_operacional, disponibilidade_percentual, data_fim_vida_util, depreciação_anual_percentual, horas_operacao_total, horas_manutencao_total, ultima_manutencao_preventiva, proxima_manutencao_preventiva, tipo_manutencao, frequencia_manutencao_horas, criticalidade  
**Tabelas auxiliares:** machine_maintenance, machine_documents, machine_photos

## MIGRATION 3: Expansão de Materials
**Prioridade:** MÉDIA  
**Campos:** lead_time_dias, lote, data_validade, classificacao_abc, peso_especifico_kg_m3, altura_pilha_max_m, unidade_caixa, ponto_reposicao, seguranca_estoque  
**Tabelas auxiliares:** inventory_movements, material_price_history

## MIGRATION 4: Expansão de Suppliers
**Prioridade:** MÉDIA  
**Campos:** categoria, classificacao, avaliacao_qualidade, avaliacao_prazo, avaliacao_preco, avaliacao_geral, certificacoes, site, data_primeira_compra, data_ultima_compra, total_compras  
**Tabelas auxiliares:** supplier_contacts, supplier_evaluations

## MIGRATION 5: Expansão de Processes
**Prioridade:** ALTA  
**Campos:** tipo_processo, capacidade_unidades_hora, perda_prevista_percentual, setup_time_minutos, lote_minimo, lote_maximo, tempo_padrao_unidade_segundos, eficiencia_padrao  
**Tabelas auxiliares:** process_steps, process_documents

## MIGRATION 6: Expansão de Timing Records
**Prioridade:** ALTA  
**Campos:** maquina_id, tipo_medicao, metodo_medicao, condicao, grupo_estudo_id, fator_ajuste, ciclos, tempo_unitario_segundos, desvio_padrao_segundos, minimo_segundos, maximo_segundos, mediana_segundos  
**Tabelas auxiliares:** timing_studies, timing_factors

## MIGRATION 7: Expansão de Capacity
**Prioridade:** ALTA  
**Campos:** processo_id, location_id, turno, horas_trabalho_diarias, dias_trabalho_semana, eficiencia_percentual, disponibilidade_percentual, performance_percentual, qualidade_percentual, oee_percentual, paradas_planejadas_horas, paradas_nao_planejadas_horas  
**Tabelas auxiliares:** capacity_planning, capacity_history

## MIGRATION 8: Expansão de Tools
**Prioridade:** BAIXA  
**Campos:** codigo, tipo, fabricante, modelo, data_aquisicao, data_fim_vida_util, ultima_calibracao, proxima_calibracao, frequencia_calibracao_dias  
**Tabelas auxiliares:** tool_maintenance, tool_calibration

## MIGRATION 9: Expansão de Products Industrial
**Prioridade:** ALTA  
**Campos:** densidade, composicao, linha, colecao, peso_kg, tipo_colchao, numero_molas, espessura_cm, garantia_meses, certificacoes, observacoes_tecnicas, sku, ean  
**Tabelas auxiliares:** product_certifications, product_processes

## MIGRATION 10: Expansão de Components
**Prioridade:** MÉDIA  
**Campos:** codigo, tipo, largura_cm, comprimento_cm, altura_cm, peso_kg, cor, fornecedor_padrao_id, unidade_medida  
**Tabelas auxiliares:** component_specifications

## MIGRATION 11: Expansão de BOM
**Prioridade:** ALTA  
**Campos:** perda_prevista_percentual, revisao, versao, data_inicio_vigencia, data_fim_vigencia, status, custo_unitario, custo_total, aprovado_por, data_aprovacao  
**Tabelas auxiliares:** bom_history, bom_alternatives

---

# PRÓXIMOS PASSOS

1. **Criar migrations complementares** seguindo a ordem de prioridade
2. **Atualizar DTOs** do backend industrial para incluir novos campos
3. **Atualizar repositories** do backend industrial
4. **Atualizar services** do backend industrial
5. **Atualizar API** do backend industrial
6. **Atualizar frontend** para suportar novos campos
7. **Criar componentes** para as novas tabelas auxiliares

**Regra de ouro:** NUNCA substituir, sempre complementar.
