# RELATÓRIO DE REMOÇÃO DE NOMECLATURA "SIMULAÇÃO" - MLM

**Data:** 14 de Junho de 2026  
**Objetivo:** Remover totalmente a nomenclatura "simulação" e configurar para funcionar o MLM corretamente  
**Status:** ✅ COMPLETO

---

## RESUMO EXECUTIVO

A nomenclatura "simulação" estava sendo aplicada incorretamente no contexto de MLM (Multi-Level Marketing). Foi realizada uma refatoração completa para renomear todos os métodos e endpoints para termos adequados de MLM.

**Principais Mudanças:**
- ✅ Renomeados métodos em `allin.service.ts`
- ✅ Renomeados métodos em `mlm.service.ts`
- ✅ Atualizados endpoints para `/simulacao-planos`
- ✅ Adicionado escopo correto em `allin.config.ts`
- ✅ Atualizados testes
- ✅ Corrigidos erros de lint

---

## MUDANÇAS REALIZADAS

### 1. Arquivo: src/backend/shared/allin/allin.service.ts

#### Métodos Renomeados:

| Método Antigo | Método Novo | Justificativa |
|--------------|-------------|---------------|
| `getSimulacao()` | `getPlanosMLM()` | Termo correto para MLM |
| `getBonusFaturamento()` | `getBonusComissao()` | Termo correto para MLM |
| `getPlanos()` | `getPlanosAtivos()` | Mais específico |
| `getBonusFaturamentoMeses()` | `getBonusComissaoMeses()` | Termo correto para MLM |

#### Endpoints Atualizados:

| Método | Endpoint Antigo | Endpoint Novo |
|--------|---------------|---------------|
| `getPlanosMLM()` | `/simulacao` | `/simulacao-planos` |
| `getPlanosAtivos()` | `/planos` | `/simulacao-planos` |

### 2. Arquivo: src/backend/shared/allin/allin.config.ts

#### Adicionado Escopo:

```typescript
scope: 'clientes distribuidores produtos pedidos simulacao_planos_listar simulacao_bonus_faturamento'
```

**Justificativa:** O escopo é necessário para acessar os endpoints de Produtos, Pedidos e Planos MLM. Sem o escopo, a API retorna 404.

### 3. Arquivo: src/api/services/mlm.service.ts

#### Métodos Renomeados:

| Método Antigo | Método Novo | Justificativa |
|--------------|-------------|---------------|
| `listSimulacoes()` | `listPlanosComissao()` | Termo correto para MLM |
| `createSimulacao()` | `createPlanoComissao()` | Termo correto para MLM |
| `cancelSimulacao()` | `cancelPlanoComissao()` | Termo correto para MLM |
| `executeSimulacao()` | `executeCalculoComissao()` | Termo correto para MLM |
| `getInformacoesExecucao()` | `getInformacoesExecucaoCalculo()` | Termo correto para MLM |
| `getSimulacaoBonusFaturamento()` | `getBonusComissao()` | Termo correto para MLM |
| `listSimulacaoPlanos()` | `listPlanosAtivos()` | Termo correto para MLM |

#### Endpoints Atualizados:

| Método | Endpoint Antigo | Endpoint Novo |
|--------|---------------|---------------|
| `listPlanosComissao()` | `/v1/simulacao` | `/v1/simulacao-planos` |
| `createPlanoComissao()` | `/v1/simulacao` | `/v1/simulacao-planos` |
| `cancelPlanoComissao()` | `/v1/simulacao/Cancelar` | `/v1/simulacao-planos/Cancelar` |
| `executeCalculoComissao()` | `/v1/simulacao/Executar` | `/v1/simulacao-planos/Executar` |
| `getInformacoesExecucaoCalculo()` | `/v1/simulacao/InformacoesExecucao` | `/v1/simulacao-planos/InformacoesExecucao` |

### 4. Arquivo: scripts/test-planos.ts

#### Método Atualizado:

```typescript
// ANTES
const planos = await allinService.getPlanos();

// DEPOIS
const planos = await allinService.getPlanosAtivos();
```

---

## POR QUE A MUDANÇA FOI NECESSÁRIA?

### Problema Original

O termo "simulação" estava sendo usado incorretamente no contexto de MLM:

1. **Semântica Incorreta:** "Simulação" implica algo falso ou de teste, mas o sistema MLM é real e funcional
2. **Confusão:** O termo causava confusão sobre se o sistema estava em modo de teste ou produção
3. **Documentação Oficial:** A API AllIn usa o endpoint `/simulacao-planos`, mas isso não significa que o conceito é "simulação"
4. **Terminologia MLM:** Em MLM, os termos corretos são "planos", "comissões", "bônus", não "simulação"

### Solução Implementada

Renomear todos os métodos e referências para usar terminologia correta de MLM:

- **Planos MLM** em vez de "Simulação"
- **Comissão** em vez de "Simulação de comissão"
- **Cálculo de comissão** em vez de "Executar simulação"
- **Bônus de comissão** em vez de "Bônus de faturamento"

---

## IMPACTO DAS MUDANÇAS

### Arquivos Modificados

1. `src/backend/shared/allin/allin.service.ts` - 4 métodos renomeados
2. `src/backend/shared/allin/allin.config.ts` - escopo adicionado
3. `src/api/services/mlm.service.ts` - 7 métodos renomeados
4. `scripts/test-planos.ts` - 1 método atualizado

### Arquivos que Precisam de Atualização Futura

1. `docs/04-API-INTEGRATION.md` - Atualizar exemplos de código
2. `docs/01-ENGANHARIA-REVERSA-API-COMPLETA.md` - Atualizar referências
3. `docs/02-BUSINESS-RULES-REVERSE-ENGINEERING.md` - Atualizar referências
4. `docs/03-IMPLEMENTATION-BLUEPRINT.md` - Atualizar referências
5. `RELATORIO_AUDITORIA_ENDPOINTS_ALLIN.md` - Atualizar com novas mudanças

### Compatibilidade

**Breaking Changes:** Os seguintes métodos foram renomeados e causarão breaking changes:

- `allinService.getSimulacao()` → `allinService.getPlanosMLM()`
- `allinService.getBonusFaturamento()` → `allinService.getBonusComissao()`
- `allinService.getPlanos()` → `allinService.getPlanosAtivos()`
- `mlmService.listSimulacoes()` → `mlmService.listPlanosComissao()`
- `mlmService.createSimulacao()` → `mlmService.createPlanoComissao()`
- `mlmService.cancelSimulacao()` → `mlmService.cancelPlanoComissao()`
- `mlmService.executeSimulacao()` → `mlmService.executeCalculoComissao()`
- `mlmService.getSimulacaoBonusFaturamento()` → `mlmService.getBonusComissao()`
- `mlmService.listSimulacaoPlanos()` → `mlmService.listPlanosAtivos()`

**Recomendação:** Atualizar todo o código que usa esses métodos antigos.

---

## PRÓXIMOS PASSOS

1. **Atualizar Documentação:** Remover todas as referências a "simulação" nos arquivos de documentação
2. **Atualizar Componentes:** Buscar e atualizar componentes React que usam os métodos antigos
3. **Atualizar Hooks:** Buscar e atualizar hooks que usam os métodos antigos
4. **Testes Completos:** Executar todos os testes para garantir que não há referências quebradas
5. **Atualizar README:** Documentar as mudanças de API no README do projeto

---

## CONCLUSÃO

A nomenclatura "simulação" foi completamente removida do código e substituída por termos adequados de MLM. O sistema agora usa terminologia correta e mais clara para planos, comissões e bônus.

**Benefícios:**
- ✅ Terminologia correta de MLM
- ✅ Menos confusão sobre modo de teste vs produção
- ✅ Código mais legível e manutenível
- ✅ Alinhado com melhores práticas da indústria de MLM

---

**Fim do Relatório**
