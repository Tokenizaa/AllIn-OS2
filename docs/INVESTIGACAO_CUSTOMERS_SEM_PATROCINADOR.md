# Investigação: Customers sem Patrocinador

**Data:** 6 de Junho de 2026  
**Problema:** 1,155 customers (5.2%) sem `patrocinador_comprador`

## Análise

Conforme documentado em `ANALISE_TABELAS_ORIGINAIS_MIGRACAO.md`, o arquivo original `user_allin_geral.xlsx` contém **1,155 registros com `Patrocinador_Comprador` NULL**.

### Status da Migração
- **Arquivo original:** 1,155 customers sem patrocinador (5.2%)
- **Supabase:** 636 customers sem `sponsor_id` (aprox. 39% do original)

A diferença pode ser explicada por:
1. Tentativa de resolver patrocinadores via outros meios
2. Customers criados manualmente após a migração
3. Duplicatas que foram deduplicadas

## Possíveis Causas

### 1. Clientes Finais (Design)
- Alguns customers podem ser clientes finais que se cadastraram diretamente na loja virtual
- Sem patrocinador por design do sistema

### 2. Erro de Extração
- O sistema de extração da plataforma matriz pode não ter capturado o patrocinador
- Campos correlacionados podem ter sido usados para tentar resolver

### 3. Dados Faltantes
- Os dados de patrocinador podem não existir no sistema original
- Necessário obter via scrape da loja virtual

## Recomendações

### Curto Prazo
1. **Investigação Manual:** Selecionar uma amostra de 10-20 customers sem patrocinador
2. **Verificação no Sistema Original:** Checar se esses customers têm patrocinador na plataforma matriz
3. **Análise de Padrões:** Verificar se há padrões (data de cadastro, plano, etc.)

### Médio Prazo
1. **Scrape da Loja Virtual:** Conforme `loja-virtual-pedidos-mapping.md`, obter dados de patrocinador da loja virtual
2. **Correspondência por Email/CPF:** Tentar resolver patrocinadores usando email ou CPF
3. **Importação de Dados Adicionais:** Se houver outra fonte de dados com informações de rede

### Longo Prazo
1. **Sistema de Recuperação de Rede:** Implementar algoritmo para reconstruir a rede baseado em datas de cadastro e outros padrões
2. **Integração com Plataforma Matriz:** API direta para obter dados de rede em tempo real
3. **Validação de Integridade:** Verificar consistência da rede e identificar lacunas

## Conclusão

O problema de customers sem patrocinador é um **problema de qualidade de dados do arquivo original**, não um erro de migração. A migração está consistente com os dados disponíveis.

Para resolver completamente, será necessário:
- Investigação manual para entender a natureza desses customers
- Scrape da loja virtual para obter dados adicionais
- Possível integração com a plataforma matriz

**Status:** Documentado para investigação futura. Não é um bug de código, mas um problema de qualidade de dados da fonte.
