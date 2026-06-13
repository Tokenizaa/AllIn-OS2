# OPEN BUSINESS QUESTIONS - ALLIN OS 2.0

**Data:** 11 de Junho de 2026  
**Versão:** 1.0  
**Status:** Perguntas em Aberto  
**Propósito:** Documentar todas as perguntas de negócio que requerem validação com stakeholders antes da implementação

---

# ÍNDICE

1. [INTRODUÇÃO](#introdução)
2. [PERGUNTAS DE IDENTITY](#perguntas-de-identity)
3. [PERGUNTAS DE CRM](#perguntas-de-crm)
4. [PERGUNTAS DE COMMERCE](#perguntas-de-commerce)
5. [PERGUNTAS DE MLM](#perguntas-de-mlm)
6. [PERGUNTAS DE FINANCE](#perguntas-de-finance)
7. [PERGUNTAS DE LOGISTICS](#perguntas-de-logistics)
8. [PERGUNTAS DE ANALYTICS](#perguntas-de-analytics)
9. [PERGUNTAS DE IA](#perguntas-de-ia)
10. [PERGUNTAS DE MIGRAÇÃO](#perguntas-de-migração)
11. [PERGUNTAS DE OPERAÇÕES](#perguntas-de-operações)
12. [PERGUNTAS DE COMPLIANCE](#perguntas-de-compliance)
13. [PERGUNTAS DE ESTRATÉGIA](#perguntas-de-estratégia)
14. [PRIORIDADE DAS PERGUNTAS](#prioridade-das-perguntas)

---

# INTRODUÇÃO

Este documento formaliza todas as perguntas de negócio que permanecem em aberto após a engenharia reversa e análise de domínio. Estas perguntas requerem validação com stakeholders antes da implementação para garantir que a solução atenda aos requisitos de negócio reais.

**Formato de Pergunta:**
```yaml
question_id: QB-XXX
category: Categoria da pergunta
question: Pergunta em si
context: Contexto e por que é importante
impact: Impacto da resposta na implementação
priority: Prioridade (CRITICAL/HIGH/MEDIUM/LOW)
stakeholders: Stakeholders que devem responder
status: Status (open/answered/pending_validation)
```

---

# PERGUNTAS DE IDENTITY

## QB-001: Estratégia de MFA

```yaml
question_id: QB-001
category: Identity
question: MFA deve ser obrigatório para todos os usuários ou apenas para admins?
context:
  - MFA aumenta segurança mas pode impactar UX
  - Compliance com regulamentações pode exigir MFA
  - Usuários podem resistir a MFA adicional

impact:
  - Se obrigatório para todos: UX impactada, implementação mais complexa
  - Se apenas para admins: Segurança reduzida para usuários comuns
  - Se opcional: Baixa adoção esperada

priority: HIGH
stakeholders: CISO, Product Manager, UX Lead
status: open
```

## QB-002: Providers de OAuth2

```yaml
question_id: QB-002
category: Identity
question: Quais providers de OAuth2 devem ser suportados inicialmente?
context:
  - Google e Facebook são comuns
  - Apple pode ser relevante para iOS
  - LinkedIn pode ser relevante para B2B
  - Cada provider adiciona complexidade

impact:
  - Mais providers = maior complexidade de implementação
  - Menos providers = menor flexibilidade para usuários
  - Escolha afeta UX e taxas de conversão

priority: MEDIUM
stakeholders: Product Manager, Marketing, Tech Lead
status: open
```

## QB-003: Política de Senha

```yaml
question_id: QB-003
category: Identity
question: Quais devem ser os requisitos de complexidade de senha?
context:
  - Senhas simples = menor segurança
  - Senhas complexas = maior segurança mas UX impactada
  - Compliance pode exigir requisitos específicos

impact:
  - Requisitos muito rígidos = menor conversão
  - Requisitos muito frouxos = maior risco de segurança
  - Afeta implementação de validação

priority: HIGH
stakeholders: CISO, Product Manager, UX Lead
status: open
```

## QB-004: Expiração de Sessão

```yaml
question_id: QB-004
category: Identity
question: Qual deve ser o tempo de expiração de sessão?
context:
  - Sessões longas = maior conveniência mas maior risco
  - Sessões curtas = maior segurança mas UX impactada
  - Diferentes tipos de usuário podem ter requisitos diferentes

impact:
  - Sessões longas = maior risco de segurança
  - Sessões curtas = mais logins necessários
  - Diferentes tempos por tipo de usuário = complexidade adicional

priority: MEDIUM
stakeholders: CISO, Product Manager, UX Lead
status: open
```

---

# PERGUNTAS DE CRM

## QB-005: Validação de CPF/CNPJ

```yaml
question_id: QB-005
category: CRM
question: CPF/CNPJ devem ser validados apenas algoritmicamente ou também contra receita federal?
context:
  - Validação algorítmica é rápida mas não garante existência
  - Validação contra receita é mais precisa mas mais lenta e pode ter custos
  - Compliance pode exigir validação oficial

impact:
  - Validação algorítmica = implementação simples, menor precisão
  - Validação oficial = implementação complexa, maior precisão, custos adicionais
  - Afeta integridade de dados

priority: HIGH
stakeholders: Legal, Compliance, Product Manager
status: open
```

## QB-006: Dados Obrigatórios de Cadastro

```yaml
question_id: QB-006
category: CRM
question: Quais dados devem ser obrigatórios no cadastro inicial vs opcionais?
context:
  - Mais dados obrigatórios = maior fricção no cadastro
  - Menos dados obrigatórios = menor qualidade de dados iniciais
  - Dados podem ser coletados progressivamente

impact:
  - Muitos dados obrigatórios = menor conversão
  - Poucos dados obrigatórios = dados incompletos
  - Coleta progressiva = UX mais complexa

priority: HIGH
stakeholders: Product Manager, Marketing, UX Lead
status: open
```

## QB-007: Verificação de Email

```yaml
question_id: QB-007
category: CRM
question: Email verification deve ser obrigatória antes de permitir uso da plataforma?
context:
  - Verificação obrigatória = maior segurança, menor conversão
  - Verificação opcional = maior conversão, menor segurança
  - Verificação pode ser exigida apenas para ações sensíveis

impact:
  - Obrigatória = menor conversão, maior segurança
  - Opcional = maior conversão, menor segurança
  - Apenas ações sensíveis = balance entre os dois

priority: HIGH
stakeholders: Product Manager, Security, UX Lead
status: open
```

## QB-008: Segmentação de Clientes

```yaml
question_id: QB-008
category: CRM
question: Quais critérios de segmentação devem ser suportados inicialmente?
context:
  - Segmentação pode ser por comportamento, demografia, valor, etc
  - Critérios complexos = implementação mais complexa
  - Critérios simples = menos valor para negócio

impact:
  - Critérios simples = implementação fácil, menos valor
  - Critérios complexos = implementação difícil, mais valor
  - Escolha afeta value de CRM

priority: MEDIUM
stakeholders: Product Manager, Marketing, Sales
status: open
```

---

# PERGUNTAS DE COMMERCE

## QB-009: Gateways de Pagamento

```yaml
question_id: QB-009
category: Commerce
question: Quais gateways de pagamento devem ser integrados inicialmente?
context:
  - Stripe, Pagar.me, Mercado Pago, etc
  - Cada gateway tem taxas e features diferentes
  - Integração com múltiplos gateways aumenta complexidade

impact:
  - Múltiplos gateways = maior complexidade, maior flexibilidade
  - Gateway único = menor complexidade, menor flexibilidade
  - Escolha afeta taxas e UX de pagamento

priority: CRITICAL
stakeholders: Finance, Product Manager, Tech Lead
status: open
```

## QB-010: Métodos de Pagamento

```yaml
question_id: QB-010
category: Commerce
question: Quais métodos de pagamento devem ser suportados inicialmente?
context:
  - Cartão de crédito, PIX, boleto, transferência, etc
  - PIX é rápido e popular no Brasil
  - Boleto tem custo mas atinge não-bancarizados

impact:
  - Mais métodos = maior conversão, maior complexidade
  - Menos métodos = menor conversão, menor complexidade
  - Escolha afeta taxas de conversão

priority: CRITICAL
stakeholders: Finance, Product Manager, Marketing
status: open
```

## QB-011: Política de Estoque

```yaml
question_id: QB-011
category: Commerce
question: Como deve ser tratada venda de produto sem estoque?
context:
  - Bloquear venda = menor conversão, melhor UX (sem espera)
  - Permitir venda com backorder = maior conversão, pior UX (espera)
  - Pre-venda = opção intermediária

impact:
  - Bloquear = menor conversão, menor complexidade
  - Permitir = maior conversão, maior complexidade
  - Pre-venda = balance entre os dois

priority: HIGH
stakeholders: Product Manager, Operations, Marketing
status: open
```

## QB-012: Política de Preços

```yaml
question_id: QB-012
category: Commerce
question: Deve haver preços diferentes por tipo de cliente (distribuidor vs cliente)?
context:
  - Preços diferenciados = incentivo para distribuidores
  - Preços únicos = simplicidade, transparência
  - Preços diferenciados podem causar conflitos

impact:
  - Diferenciados = incentivo MLM, complexidade adicional
  - Únicos = simplicidade, menor incentivo MLM
  - Escolha afeta modelo de negócio

priority: HIGH
stakeholders: Product Manager, Sales, MLM Leadership
status: open
```

## QB-013: Política de Frete

```yaml
question_id: QB-013
category: Commerce
question: Frete deve ser grátis acima de certo valor ou sempre cobrado?
context:
  - Frete grátis acima de X = incentivo a pedidos maiores
  - Frete sempre cobrado = margem preservada
  - Frete grátis para distribuidores = incentivo adicional

impact:
  - Frete grátis condicional = incentivo a pedidos maiores
  - Frete sempre cobrado = margem preservada
  - Escolha afeta margem e conversão

priority: MEDIUM
stakeholders: Product Manager, Finance, Marketing
status: open
```

---

# PERGUNTAS DE MLM

## QB-014: Estrutura de Comissões

```yaml
question_id: QB-014
category: MLM
question: Qual deve ser a estrutura de comissões (porcentagens por geração)?
context:
  - Estrutura define incentivos e comportamento
  - Muitas gerações = maior incentivo, menor margem
  - Poucas gerações = menor incentivo, maior margem

impact:
  - Estrutura afeta comportamento de rede
  - Estrutura afeta margem do negócio
  - Estrutura afeta competitividade

priority: CRITICAL
stakeholders: MLM Leadership, Finance, Product Manager
status: open
```

## QB-015: Regras de Qualificação

```yaml
question_id: QB-015
category: MLM
question: Quais devem ser os requisitos de qualificação para cada nível?
context:
  - Requisitos definem dificuldade de progressão
  - Requisitos muito rígidos = menor progressão
  - Requisitos muito frouxos = inflação de níveis

impact:
  - Requisitos afetam motivação
  - Requisitos afetam valor de qualificação
  - Requisitos afetam competitividade

priority: CRITICAL
stakeholders: MLM Leadership, Product Manager, Sales
status: open
```

## QB-016: Bônus de Perna

```yaml
question_id: QB-016
category: MLM
question: Como deve ser calculado o bônus de perna (volume da perna menor vs outras fórmulas)?
context:
  - Volume da perna menor = incentivo a balancear
  - Outras fórmulas = incentivos diferentes
  - Escolha afeta comportamento de rede

impact:
  - Fórmula afeta comportamento de rede
  - Fórmula afeta distribuição de comissões
  - Fórmula afeta competitividade

priority: CRITICAL
stakeholders: MLM Leadership, Finance, Product Manager
status: open
```

## QB-017: Planos de Ativação

```yaml
question_id: QB-017
category: MLM
question: Quais planos de ativação devem ser oferecidos e quais requisitos?
context:
  - Planos definem barreira de entrada
  - Planos caros = barreira alta, maior comprometimento
  - Planos baratos = barreira baixa, menor comprometimento

impact:
  - Planos afetam taxa de conversão
  - Planos afetam receita inicial
  - Planos afetam qualidade de distribuidores

priority: CRITICAL
stakeholders: MLM Leadership, Finance, Product Manager
status: open
```

## QB-018: Política de Spillover

```yaml
question_id: QB-018
category: MLM
question: Como deve funcionar o spillover (alocação automática de distribuidores)?
context:
  - Spillover automático = ajuda novos distribuidores
  - Spillover manual = mais controle, mais complexidade
  - Escolha afeta crescimento de rede

impact:
  - Automático = crescimento mais rápido, menos controle
  - Manual = mais controle, crescimento mais lento
  - Escolha afeta experiência de novos distribuidores

priority: HIGH
stakeholders: MLM Leadership, Product Manager, Sales
status: open
```

---

# PERGUNTAS DE FINANCE

## QB-019: Limites de Saque

```yaml
question_id: QB-019
category: Finance
question: Quais devem ser os limites de saque (mínimo, máximo, diário, mensal)?
context:
  - Limites definem política financeira
  - Limites muito altos = maior risco
  - Limites muito baixos = menor flexibilidade

impact:
  - Limites afetam UX de distribuidores
  - Limites afetam risco financeiro
  - Limites afetam custos operacionais

priority: CRITICAL
stakeholders: Finance, MLM Leadership, Product Manager
status: open
```

## QB-020: Prazo de Pagamento de Saques

```yaml
question_id: QB-020
category: Finance
question: Qual deve ser o prazo para processamento de saques?
context:
  - Prazo curto = melhor UX, maior pressão operacional
  - Prazo longo = pior UX, menor pressão operacional
  - Diferentes prazos por valor/plano

impact:
  - Prazo afeta satisfação de distribuidores
  - Prazo afeta operações financeiras
  - Prazo afeta custos

priority: HIGH
stakeholders: Finance, Operations, Product Manager
status: open
```

## QB-021: Taxas de Saque

```yaml
question_id: QB-021
category: Finance
question: Deve haver taxas de saque e quais valores?
context:
  - Taxas cobrem custos operacionais
  - Taxas altas = menor satisfação
  - Taxas baixas = menor receita, maior satisfação

impact:
  - Taxas afetam satisfação de distribuidores
  - Taxas afetam receita
  - Taxas afetam competitividade

priority: HIGH
stakeholders: Finance, MLM Leadership, Product Manager
status: open
```

## QB-022: Retenção de Impostos

```yaml
question_id: QB-022
category: Finance
question: Como deve ser tratada a retenção de impostos sobre comissões?
context:
  - Retenção na fonte = compliance, menor receita líquida
  - Responsabilidade do distribuidor = maior receita líquida, risco de compliance
  - Escolha afeta compliance e UX

impact:
  - Retenção = compliance, menor receita líquida
  - Sem retenção = maior receita líquida, risco compliance
  - Escolha afeta responsabilidade fiscal

priority: CRITICAL
stakeholders: Finance, Legal, Compliance
status: open
```

---

# PERGUNTAS DE LOGISTICS

## QB-023: Transportadoras

```yaml
question_id: QB-023
category: Logistics
question: Quais transportadoras devem ser integradas inicialmente?
context:
  - Correios, Jadlog, TNT, etc
  - Cada transportadora tem taxas e prazos diferentes
  - Integração com múltiplas aumenta complexidade

impact:
  - Múltiplas = maior complexidade, maior flexibilidade
  - Única = menor complexidade, menor flexibilidade
  - Escolha afeta prazos e custos de frete

priority: HIGH
stakeholders: Operations, Product Manager, Finance
status: open
```

## QB-024: Cálculo de Frete

```yaml
question_id: QB-024
category: Logistics
question: Frete deve ser calculado por peso, volume, valor ou combinação?
context:
  - Por peso = simples, pode não ser preciso para itens leves grandes
  - Por volume = preciso para itens leves grandes
  - Por valor = incentivo a pedidos maiores
  - Combinação = mais preciso, mais complexo

impact:
  - Método afeta precisão de cálculo
  - Método afeta custos de frete
  - Método afeta UX

priority: MEDIUM
stakeholders: Operations, Product Manager, Finance
status: open
```

## QB-025: Política de Entrega

```yaml
question_id: QB-025
category: Logistics
question: Qual deve ser o prazo padrão de entrega e como deve ser comunicado?
context:
  - Prazo curto = melhor UX, maior pressão operacional
  - Prazo longo = pior UX, menor pressão operacional
  - Comunicação clara afeta satisfação

impact:
  - Prazo afeta satisfação de clientes
  - Prazo afeta operações
  - Comunicação afeta expectativas

priority: MEDIUM
stakeholders: Operations, Product Manager, Marketing
status: open
```

---

# PERGUNTAS DE ANALYTICS

## QB-026: KPIs Principais

```yaml
question_id: QB-026
category: Analytics
question: Quais KPIs devem ser monitorados prioritariamente?
context:
  - Revenue, growth, churn, LTV, etc
  - Muitos KPIs = overload de informação
  - Poucos KPIs = visão limitada

impact:
  - KPIs afetam foco de negócio
  - KPIs afetam decisões estratégicas
  - Escolha afeta dashboard design

priority: MEDIUM
stakeholders: Product Manager, Executive Team, Marketing
status: open
```

## QB-027: Retenção de Dados de Analytics

```yaml
question_id: QB-027
category: Analytics
question: Por quanto tempo os dados de analytics devem ser retidos?
context:
  - Retenção longa = mais histórico, maior custo
  - Retenção curta = menor custo, menos histórico
  - Compliance pode exigir retenção mínima

impact:
  - Retenção afeta custos de storage
  - Retenção afeta capacidade de análise histórica
  - Compliance pode ditar mínimo

priority: MEDIUM
stakeholders: Finance, Legal, Compliance
status: open
```

## QB-028: Acesso a Analytics

```yaml
question_id: QB-028
category: Analytics
question: Quem deve ter acesso a quais analytics?
context:
  - Acesso restrito = maior segurança, menor transparência
  - Acesso amplo = maior transparência, maior risco
  - Diferentes níveis por tipo de usuário

impact:
  - Acesso afeta transparência
  - Acesso afeta segurança
  - Acesso afeta cultura de dados

priority: MEDIUM
stakeholders: Product Manager, Executive Team, Security
status: open
```

---

# PERGUNTAS DE IA

## QB-029: Escopo Inicial de IA

```yaml
question_id: QB-029
category: AI
question: Quais capacidades de IA devem ser implementadas inicialmente?
context:
  - Customer insights, product recommendations, churn prediction, etc
  - Muitas capacidades = maior complexidade
  - Poucas capacidades = menor valor inicial

impact:
  - Escopo afeta timeline
  - Escopo afeta valor inicial
  - Escopo afeta custos

priority: HIGH
stakeholders: Product Manager, Executive Team, Tech Lead
status: open
```

## QB-030: Provedor de IA

```yaml
question_id: QB-030
category: AI
question: Qual provedor de IA deve ser usado (OpenAI, Anthropic, local)?
context:
  - OpenAI = maduro, caro, dependência externa
  - Anthropic = alternativo, caro, dependência externa
  - Local = controle total, complexo, custos de infraestrutura

impact:
  - Provedor afeta custos
  - Provedor afeta performance
  - Provedor afeta privacidade de dados

priority: HIGH
stakeholders: Tech Lead, Finance, Legal
status: open
```

## QB-031: Privacidade de Dados em IA

```yaml
question_id: QB-031
category: AI
question: Como deve ser tratada a privacidade de dados usados pela IA?
context:
  - Dados podem ser enviados para provedores externos
  - Anonimização pode reduzir valor
  - Local hosting aumenta custos

impact:
  - Privacidade afeta compliance
  - Privacidade afeta valor de IA
  - Privacidade afeta custos

priority: CRITICAL
stakeholders: Legal, Compliance, Tech Lead
status: open
```

---

# PERGUNTAS DE MIGRAÇÃO

## QB-032: Estratégia de Migração

```yaml
question_id: QB-032
category: Migration
question: Qual deve ser a estratégia de migração (big bang vs phased)?
context:
  - Big bang = mais simples, maior risco
  - Phased = mais complexo, menor risco
  - Strangler fig = balance entre os dois

impact:
  - Estratégia afeta risco
  - Estratégia afeta timeline
  - Estratégia afeta complexidade

priority: CRITICAL
stakeholders: Executive Team, Tech Lead, Operations
status: open
```

## QB-033: Janela de Migração

```yaml
question_id: QB-033
category: Migration
question: Qual deve ser a janela de migração (downtime aceitável)?
context:
  - Downtime zero = mais complexo
  - Downtime curto = complexidade moderada
  - Downtime longo = menos complexo, maior impacto

impact:
  - Janela afeta complexidade
  - Janela afeta impacto em usuários
  - Janela afeta custos

priority: CRITICAL
stakeholders: Executive Team, Operations, Tech Lead
status: open
```

## QB-034: Validação de Dados Migrados

```yaml
question_id: QB-034
category: Migration
question: Como deve ser validada a integridade dos dados migrados?
context:
  - Validação manual = mais lento, mais preciso
  - Validação automatizada = mais rápido, pode ter erros
  - Combinação = balance entre os dois

impact:
  - Validação afeta confiança na migração
  - Validação afeta timeline
  - Validação afeta custos

priority: HIGH
stakeholders: Tech Lead, Operations, QA
status: open
```

## QB-035: Rollback Strategy

```yaml
question_id: QB-035
category: Migration
question: Qual deve ser a estratégia de rollback se migração falhar?
context:
  - Rollback automático = mais rápido, mais complexo
  - Rollback manual = mais lento, mais simples
  - Sem rollback = maior risco

impact:
  - Estratégia afeta risco
  - Estratégia afeta complexidade
  - Estratégia afeta confiança

priority: CRITICAL
stakeholders: Executive Team, Tech Lead, Operations
status: open
```

---

# PERGUNTAS DE OPERAÇÕES

## QB-036: Horário de Suporte

```yaml
question_id: QB-036
category: Operations
question: Qual deve ser o horário de suporte ao cliente?
context:
  - 24/7 = melhor UX, maior custo
  - Horário comercial = menor custo, pior UX
  - Horário estendido = balance entre os dois

impact:
  - Horário afeta satisfação
  - Horário afeta custos
  - Horário afeta competitividade

priority: MEDIUM
stakeholders: Operations, Finance, Product Manager
status: open
```

## QB-037: Canais de Suporte

```yaml
question_id: QB-037
category: Operations
question: Quais canais de suporte devem ser oferecidos?
context:
  - Email, chat, telefone, WhatsApp, etc
  - Mais canais = maior complexidade
  - Menos canais = menor satisfação

impact:
  - Canais afetam satisfação
  - Canais afetam custos
  - Canais afetam complexidade

priority: MEDIUM
stakeholders: Operations, Product Manager, Finance
status: open
```

## QB-038: SLA de Sistema

```yaml
question_id: QB-038
category: Operations
question: Qual deve ser o SLA de disponibilidade do sistema?
context:
  - 99.9% = melhor UX, maior custo
  - 99.5% = bom balance
  - 99% = menor custo, pior UX

impact:
  - SLA afeta custos de infraestrutura
  - SLA afeta satisfação
  - SLA afeta competitividade

priority: HIGH
stakeholders: Executive Team, Tech Lead, Finance
status: open
```

---

# PERGUNTAS DE COMPLIANCE

## QB-039: LGPD

```yaml
question_id: QB-039
category: Compliance
question: Como deve ser implementado o compliance com LGPD?
context:
  - Consentimento explícito, direito ao esquecimento, portabilidade, etc
  - Compliance estrito = maior complexidade
  - Compliance básico = menor complexidade, maior risco

impact:
  - Compliance afeta risco legal
  - Compliance afeta complexidade
  - Compliance afeta UX

priority: CRITICAL
stakeholders: Legal, Compliance, Product Manager
status: open
```

## QB-040: PCI-DSS

```yaml
question_id: QB-040
category: Compliance
question: Qual nível de compliance PCI-DSS é necessário?
context:
  - Nível 1 = mais rigoroso, maior custo
  - Nível 4 = menos rigoroso, menor custo
  - Nível depende de volume de transações

impact:
  - Nível afeta custos
  - Nível afeta complexidade
  - Nível afeta risco

priority: CRITICAL
stakeholders: Finance, Legal, Tech Lead
status: open
```

## QB-041: Retenção de Dados

```yaml
question_id: QB-041
category: Compliance
question: Por quanto tempo os dados de clientes devem ser retidos?
context:
  - LGPD pode exigir retenção mínima
  - Retenção longa = maior risco, maior valor
  - Retenção curta = menor risco, menor valor

impact:
  - Retenção afeta compliance
  - Retenção afeta valor de dados
  - Retenção afeta custos

priority: HIGH
stakeholders: Legal, Compliance, Finance
status: open
```

---

# PERGUNTAS DE ESTRATÉGIA

## QB-042: Timeline de Lançamento

```yaml
question_id: QB-042
category: Strategy
question: Qual é a timeline ideal de lançamento (agressiva vs conservadora)?
context:
  - Timeline agressiva = maior pressão, maior risco
  - Timeline conservadora = menor pressão, menor risco
  - Timeline afeta competitividade

impact:
  - Timeline afeta qualidade
  - Timeline afeta custos
  - Timeline afeta competitividade

priority: CRITICAL
stakeholders: Executive Team, Product Manager, Tech Lead
status: open
```

## QB-043: Estratégia de Go-to-Market

```yaml
question_id: QB-043
category: Strategy
question: Qual deve ser a estratégia de go-to-market para o novo sistema?
context:
  - Lançamento para todos = maior impacto, maior risco
  - Lançamento gradual = menor impacto, menor risco
  - Beta testing = validação antes de lançamento

impact:
  - Estratégia afeta adoção
  - Estratégia afeta risco
  - Estratégia afeta timeline

priority: HIGH
stakeholders: Executive Team, Marketing, Product Manager
status: open
```

## QB-044: Estratégia de Preços

```yaml
question_id: QB-044
category: Strategy
question: Como deve ser a estratégia de preços para o novo sistema?
context:
  - Manter preços atuais = continuidade
  - Ajustar preços = otimização de receita
  - Preços diferenciados = segmentação

impact:
  - Estratégia afeta receita
  - Estratégia afeta competitividade
  - Estratégia afeta adoção

priority: CRITICAL
stakeholders: Executive Team, Finance, Marketing
status: open
```

## QB-045: Estratégia de Comunicação

```yaml
question_id: QB-045
category: Strategy
question: Como deve ser comunicada a transição para o novo sistema?
context:
  - Comunicação antecipada = preparação, menor surpresa
  - Comunicação tardia = surpresa, possível resistência
  - Comunicação contínua = engajamento

impact:
  - Comunicação afeta adoção
  - Comunicação afeta resistência
  - Comunicação afeta sucesso

priority: HIGH
stakeholders: Marketing, Product Manager, Executive Team
status: open
```

---

# PRIORIDADE DAS PERGUNTAS

## CRITICAL (Devem ser respondidas antes do início da implementação)

- QB-009: Gateways de Pagamento
- QB-010: Métodos de Pagamento
- QB-014: Estrutura de Comissões
- QB-015: Regras de Qualificação
- QB-016: Bônus de Perna
- QB-017: Planos de Ativação
- QB-019: Limites de Saque
- QB-022: Retenção de Impostos
- QB-031: Privacidade de Dados em IA
- QB-032: Estratégia de Migração
- QB-033: Janela de Migração
- QB-035: Rollback Strategy
- QB-039: LGPD
- QB-040: PCI-DSS
- QB-042: Timeline de Lançamento
- QB-044: Estratégia de Preços

## HIGH (Devem ser respondidas nas primeiras 2 semanas)

- QB-001: Estratégia de MFA
- QB-003: Política de Senha
- QB-005: Validação de CPF/CNPJ
- QB-006: Dados Obrigatórios de Cadastro
- QB-007: Verificação de Email
- QB-011: Política de Estoque
- QB-012: Política de Preços
- QB-018: Política de Spillover
- QB-020: Prazo de Pagamento de Saques
- QB-021: Taxas de Saque
- QB-023: Transportadoras
- QB-029: Escopo Inicial de IA
- QB-030: Provedor de IA
- QB-034: Validação de Dados Migrados
- QB-038: SLA de Sistema
- QB-041: Retenção de Dados
- QB-043: Estratégia de Go-to-Market
- QB-045: Estratégia de Comunicação

## MEDIUM (Podem ser respondidas durante a implementação)

- QB-002: Providers de OAuth2
- QB-004: Expiração de Sessão
- QB-008: Segmentação de Clientes
- QB-013: Política de Frete
- QB-024: Cálculo de Frete
- QB-025: Política de Entrega
- QB-026: KPIs Principais
- QB-027: Retenção de Dados de Analytics
- QB-028: Acesso a Analytics
- QB-036: Horário de Suporte
- QB-037: Canais de Suporte

## LOW (Podem ser decididos mais tarde)

- Nenhuma pergunta classificada como LOW neste momento

---

# CONCLUSÃO

Este documento formaliza 45 perguntas de negócio que requerem validação com stakeholders antes da implementação da plataforma AllIn OS 2.0.

**Distribuição por Categoria:**
- Identity: 4 perguntas
- CRM: 4 perguntas
- Commerce: 5 perguntas
- MLM: 5 perguntas
- Finance: 4 perguntas
- Logistics: 3 perguntas
- Analytics: 3 perguntas
- AI: 3 perguntas
- Migration: 4 perguntas
- Operations: 3 perguntas
- Compliance: 3 perguntas
- Strategy: 4 perguntas

**Distribuição por Prioridade:**
- CRITICAL: 17 perguntas (devem ser respondidas antes do início)
- HIGH: 19 perguntas (devem ser respondidas nas primeiras 2 semanas)
- MEDIUM: 9 perguntas (podem ser respondidas durante implementação)
- LOW: 0 perguntas

**Próximos Passos:**
1. Agendar workshop com stakeholders para responder perguntas CRITICAL
2. Priorizar perguntas HIGH para workshop subsequente
3. Documentar respostas conforme forem obtidas
4. Atualizar documentos de arquitetura e implementação baseado nas respostas
5. Revisar perguntas MEDIUM durante implementação

**Documentos Relacionados:**
- 01-ENGANHARIA-REVERSA-API-COMPLETA.md
- 02-BUSINESS-RULES-REVERSE-ENGINEERING.md
- 03-IMPLEMENTATION-BLUEPRINT.md
- 04-DOMAIN-DECISIONS.md
