# FASE 0 - Bundle Analysis Report

## Data: 2026-06-18

## Resultado do Build

```
dist/index.html                             1.39 kB │ gzip:   0.60 kB
dist/assets/success-team-C-dkeUXV.jpg      39.51 kB
dist/assets/index-DPbgbwvH.css            175.29 kB │ gzip:  24.44 kB
dist/assets/ui-utils-DZiiT1zZ.js           28.17 kB │ gzip:   9.00 kB
dist/assets/ui-vendor-v_j4ADxY.js          77.51 kB │ gzip:  22.97 kB
dist/assets/tanstack-query-li_h5_--.js     98.82 kB │ gzip:  30.82 kB
dist/assets/vendor-DwciboGq.js            145.45 kB │ gzip:  45.75 kB
dist/assets/supabase-BY7vTDRq.js          208.14 kB │ gzip:  54.42 kB
dist/assets/react-vendor-_A4YvTm4.js      307.94 kB │ gzip:  99.74 kB
dist/assets/index-DojivbP8.js           1,031.17 kB │ gzip: 254.66 kB
```

## Análise

### 🚨 Problema Crítico: Chunk Principal Enorme

**Chunk principal (index-DojivbP8.js)**: 1,031.17 kB (gzip: 254.66 kB)

Este é o **maior problema identificado**. O chunk principal contém praticamente toda a aplicação, o que significa:

- **Tempo de carregamento inicial muito alto** (254 kB gzip)
- **Sem code splitting efetivo** - tudo carrega de uma vez
- **Navegação lenta** - mesmo para rotas que o usuário nunca visita
- **Experiência ruim em conexões lentas**

### Distribuição do Bundle

| Chunk | Tamanho (bruto) | Tamanho (gzip) | % do total |
|-------|----------------|----------------|------------|
| index (app) | 1,031.17 kB | 254.66 kB | 49.5% |
| react-vendor | 307.94 kB | 99.74 kB | 19.4% |
| supabase | 208.14 kB | 54.42 kB | 10.6% |
| vendor | 145.45 kB | 45.75 kB | 8.9% |
| tanstack-query | 98.82 kB | 30.82 kB | 6.0% |
| ui-vendor | 77.51 kB | 22.97 kB | 4.4% |
| ui-utils | 28.17 kB | 9.00 kB | 1.7% |
| CSS | 175.29 kB | 24.44 kB | - |
| **TOTAL** | **2,072.49 kB** | **541.80 kB** | **100%** |

### Problemas Identificados

1. **Chunk principal muito grande** (49.5% do bundle)
   - Indica falta de code splitting por rota
   - Todas as páginas carregam juntas
   - Inclui código de rotas que o usuário pode nunca visitar

2. **CSS grande** (175.29 kB)
   - Possivelmente Tailwind sem purging adequado
   - Estilos não utilizados sendo incluídos

3. **React vendor separado** (bom)
   - Mas ainda é 307 kB, pode ser otimizado

4. **Supabase chunk** (208 kB)
   - Biblioteca grande, mas necessária
   - Pode ser lazy loaded se não for usado imediatamente

### Oportunidades de Otimização

#### 1. Code Splitting por Rota (IMPACTO: ALTO)

**Estado atual**: Todo o app em um chunk

**Solução**: Implementar lazy loading por rota
```tsx
// Em vez de import direto
import { Route as CustomersRoute } from './routes/_app/customers/index.tsx';

// Usar lazy loading
const CustomersRoute = lazy(() => import('./routes/_app/customers/index.tsx'));
```

**Benefício estimado**: Redução de 60-70% no chunk inicial

#### 2. Lazy Loading de Componentes Pesados (IMPACTO: MÉDIO)

Identificar componentes grandes e lazy load:
- Gráficos (recharts)
- Tabelas complexas
- Editores de formulário
- Modais pesados

#### 3. Otimização de CSS (IMPACTO: MÉDIO)

- Verificar se Tailwind está fazendo purging corretamente
- Remover estilos não utilizados
- Considerar CSS modules para componentes específicos

#### 4. Tree Shaking (IMPACTO: BAIXO)

- Verificar se todas as dependências estão sendo usadas
- Remover imports não utilizados
- Usar imports específicos em vez de imports de biblioteca inteira

### Comparação com Auditoria

A auditoria estimou:
- Bundle inicial: ~2MB
- Redução potencial: 30-40% com code splitting

**Realidade atual**:
- Bundle inicial: ~2.07 MB (bruto), ~542 kB (gzip)
- Chunk principal: 1.03 MB (49.5% do total)

**Conclusão**: A auditoria estava correta. O bundle é muito grande e o chunk principal é o principal culpado.

### Próximos Passos

1. **Implementar code splitting por rota** (prioridade máxima)
2. **Lazy loading de componentes pesados**
3. **Otimizar CSS**
4. **Re-analisar após cada mudança**

### Métricas de Sucesso

**Meta após otimização**:
- Chunk inicial: < 300 kB (gzip)
- Tempo de carregamento: < 2s em 3G
- First Contentful Paint: < 1.5s
