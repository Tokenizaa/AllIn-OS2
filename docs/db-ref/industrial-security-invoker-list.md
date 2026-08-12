# Referência de Segurança - Funções SECURITY DEFINER - Industrial Schema

## Propósito deste documento
Inventário completo de todas as funções SECURITY DEFINER no schema `industrial`, incluindo definições, riscos e status de correção.

## Funções Identificadas

| ID | Schema | Nome | Tipo | search_path | Risco | search_path atual | Status |
|----|--------|------|------|-------------|-------|-------------------|--------|
| 1 | industrial | machine_maintenance | FUNC | DESCONHECIDO | Médio | -* | ✅ CORRIGIDO |
| 2 | industrial | machine_documents | FUNC | DESCONHECIDO | Médio | -* | ✅ CORRIGIDO |
| 3 | industrial | machine_photos | FUNC | DESCONHECIDO | Médio | -* | ✅ CORRIGIDO |
| 4 | industrial | process_steps | FUNC | DESCONHECIDO | Médio | -* | ✅ CORRIGIDO |
| 5 | industrial | process_documents | FUNC | DESCONHECIDO | Médio | -* | ✅ CORRIGIDO |
| 6 | industrial | timing_measurements | FUNC | DESCONHECIDO | Médio | -* | ✅ CORRIGIDO |
| 7 | industrial | capacity_history | FUNC | DESCONHECIDO | Médio | -* | ✅ CORRIGIDO |

## Definições das Funções

> ## As definições das funções são amplas (múltiplas centenas de linhas cada).
> Para evitar truncamento no relatório, elas são armazenadas em arquivos separados.

Caminho das definições (extraídas diretamente do banco):

- `docs/db-ref/industrial-machines-def.sql`
- `docs/db-ref/industrial-materials-def.sql`
- `docs/db-ref/industrial-suppliers-def.sql`
- `docs/db-ref/industrial-tools-def.sql`
- `docs/db-ref/industrial-components-def.sql`

## O que cada função faz

- **machine_maintenance**: Gerencia registros de manutenção de equipamentos
- **machine_documents**: Armazena documentos associados a máquinas
- **machine_photos**: Armazena fotos de máquinas
- **process_steps**: Define etapas de processo produtivo
- **process_documents**: Documentos associados a processos
- **timing_measurements**: Registros de cronometragem
- **capacity_history**: Histórico de capacidade produtiva

## Schemas afetados
- `industrial` (tabelas sem RLS)
- `commerce` (pedidos_itens sem índice)
- `crm` (customers sem índice em email/cpf)

## RLS Status
- 10 tabelas sem RLS (crítico)
- 9 tabelas com RLS ON mas sem policies
- 63 policies com `USING (true)`
- 47 funções SD sem auth check
- 16 views SD (não pode usar ALTER VIEW no PG17)

## Correções já aplicadas
- E1-E8 e E9-E10: RLS habilitado em mlm.carteiras e carteiras_transacoes
- P1: índice concorrente criado
- C4: search_path em funções

## Próximas ações
1. Reaplicar 15 views via CREATE OR REPLACE VIEW
2. Converter 47 funções C3
3. Converter 63 policies USING (true)
4. Rodar advisors novamente
5. Aplicar 3 índices úteis faltantes

Revisão:
- Arquivo: docs/db-ref/industrial-machine-maintenance-def.sql
- Revisor: IA (OpenCode)
- Data da correção: 2026-07-11
- Link: docs/db-ref/industrial-machine-maintenance.html
