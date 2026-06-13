# Dead Code Removal

## Processo de Remoção de Código Morto

Este documento descreve o processo para identificar e remover código não utilizado do codebase.

## Tipos de Código Morto

### 1. Funções e Métodos Não Utilizados
- Funções exportadas mas não importadas
- Métodos de classe nunca chamados
- Funções privadas não utilizadas

### 2. Variáveis Não Utilizadas
- Variáveis declaradas mas não usadas
- Parâmetros de função não utilizados
- Imports não utilizados

### 3. Arquivos Não Utilizados
- Arquivos não importados em nenhum lugar
- Módulos não referenciados

### 4. Código Comentado
- Blocos de código comentados
- Funções comentadas

### 5. Configurações Obsoletas
- Variáveis de ambiente não utilizadas
- Configurações antigas

## Ferramentas de Análise

### ESLint
```bash
npx eslint --ext .ts,.tsx src/ --no-error-on-unmatched-pattern
```

### TypeScript Compiler
```bash
npx tsc --noUnusedLocals --noUnusedParameters
```

### Custom Scripts
- Script para buscar imports não utilizados
- Script para buscar exports não importados

## Checklist de Validação

### Por Arquivo
- [ ] Verificar imports não utilizados
- [ ] Verificar exports não importados
- [ ] Verificar variáveis não utilizadas
- [ ] Verificar funções não utilizadas
- [ ] Remover código comentado

### Por Módulo
- [ ] Verificar arquivos não utilizados
- [ ] Verificar dependências não utilizadas
- [ ] Verificar configurações obsoletas

## Processo de Remoção

### 1. Análise Automática
```bash
# Executar ESLint para encontrar código morto
npm run lint

# Executar TypeScript para encontrar código morto
npx tsc --noUnusedLocals --noUnusedParameters
```

### 2. Análise Manual
- Revisar cada arquivo manualmente
- Verificar uso de cada função/método
- Verificar uso de cada variável

### 3. Testes
- Executar testes antes da remoção
- Executar testes após a remoção
- Garantir que nada quebrou

### 4. Documentação
- Documentar código removido
- Atualizar documentação se necessário

## Áreas Prioritárias

### Backend
- [ ] `src/backend/modules/` - Verificar cada módulo
- [ ] `src/backend/shared/` - Verificar código compartilhado
- [ ] `src/backend/infrastructure/` - Verificar infraestrutura

### Frontend
- [ ] `src/frontend/components/` - Verificar componentes
- [ ] `src/frontend/pages/` - Verificar páginas
- [ ] `src/frontend/services/` - Verificar serviços

### Database
- [ ] `supabase/migrations/` - Verificar migrations antigas
- [ ] `supabase/functions/` - Verificar edge functions não utilizadas

## Precauções

### Antes de Remover
1. Fazer backup do código
2. Criar branch para remoção
3. Executar todos os testes
4. Verificar se código é usado em produção

### Durante a Remoção
1. Remover um arquivo por vez
2. Testar após cada remoção
3. Commitar mudanças pequenas
4. Documentar cada remoção

### Após a Remoção
1. Executar todos os testes
2. Verificar build
3. Deploy em staging para testar
4. Monitorar logs por erros

## Exemplos de Código Morto

### Import Não Utilizado
```typescript
// ❌ Código morto
import { unusedFunction } from './utils';

// ✅ Remover
```

### Variável Não Utilizada
```typescript
// ❌ Código morto
const unused = calculateSomething();

// ✅ Remover
```

### Função Não Utilizada
```typescript
// ❌ Código morto
function unusedFunction() {
  return 'never called';
}

// ✅ Remover
```

### Código Comentado
```typescript
// ❌ Código morto
// function oldFunction() {
//   return 'deprecated';
// }

// ✅ Remover
```

## Métricas

### Antes da Remoção
- Total de arquivos
- Total de linhas de código
- Total de funções
- Total de imports

### Após a Remoção
- Total de arquivos removidos
- Total de linhas removidas
- Total de funções removidas
- Total de imports removidos

## Próximos Passos

1. Executar análise automática
2. Criar lista de código morto encontrado
3. Priorizar remoção por impacto
4. Executar remoção incremental
5. Testar após cada remoção
6. Documentar mudanças
