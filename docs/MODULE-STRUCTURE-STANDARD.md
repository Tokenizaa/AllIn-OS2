# Module Structure Standard

## Padrão de Estrutura de Módulos

Todos os módulos do backend devem seguir esta estrutura padrão para consistência e manutenibilidade.

## Estrutura de Diretórios

```
src/backend/modules/{module-name}/
├── api/                    # API endpoints (rotas, controllers)
│   ├── routes.ts          # Definição de rotas
│   └── controllers.ts     # Controllers (se necessário)
├── dto/                    # Data Transfer Objects
│   └── {module}.dto.ts    # DTOs do módulo
├── domain/                 # Domain entities e value objects
│   ├── entities/          # Entidades do domínio
│   ├── value-objects/     # Value objects
│   └── events/            # Domain events
├── domain-services/        # Domain Services (lógica de negócio pura)
│   └── {service}.domain-service.ts
├── repositories/          # Repositories (acesso a dados)
│   ├── {entity}.repository.ts
│   └── index.ts
├── services/               # Application Services (orquestração)
│   └── {service}.service.ts
└── index.ts               # Exportações do módulo
```

## Convenções de Nomenclatura

### Arquivos
- **DTOs:** `{module}.dto.ts` (ex: `product.dto.ts`)
- **Repositories:** `{entity}.repository.ts` (ex: `product.repository.ts`)
- **Services:** `{feature}.service.ts` (ex: `product.service.ts`)
- **Domain Services:** `{feature}.domain-service.ts` (ex: `commission-calculation.domain-service.ts`)
- **Rotas:** `routes.ts`
- **Controllers:** `controllers.ts` (se necessário)

### Classes
- **DTOs:** `{Action}{Entity}DTO` (ex: `CreateProductDTO`, `UpdateProductDTO`)
- **Entities:** `{Entity}` (ex: `Product`)
- **Repositories:** `{Entity}Repository` (ex: `ProductRepository`)
- **Services:** `{Feature}Service` (ex: `ProductService`)
- **Domain Services:** `{Feature}DomainService` (ex: `CommissionCalculationDomainService`)

## Responsabilidades

### DTO (Data Transfer Objects)
- Definir estrutura de dados de entrada/saída
- Validação de dados
- Transformação entre camadas

### Repositories
- Abstrair acesso a dados
- Operações CRUD
- Queries específicas do módulo
- Herdar de `BaseRepository`

### Application Services
- Orquestrar casos de uso
- Coordenar repositories e domain services
- Gerenciar transações
- Não conter lógica de negócio complexa

### Domain Services
- Lógica de negócio pura
- Cálculos complexos
- Validações de domínio
- Sem dependências externas

### API (Routes/Controllers)
- Definir endpoints HTTP
- Validar requisições
- Chamar services
- Retornar respostas HTTP

## Exemplo de Index

```typescript
/**
 * {Module} Module Index
 * 
 * Exporta todos os componentes do módulo {module}.
 */

// Repositories
export { {Entity}Repository } from './repositories/{entity}.repository';
export type { {Entity} } from './repositories/{entity}.repository';

// Services
export { {Feature}Service } from './services/{feature}.service';

// Domain Services
export { {Feature}DomainService } from './domain-services/{feature}.domain-service';

// DTOs
export type {
  Create{Entity}DTO,
  Update{Entity}DTO,
  {Entity}ResponseDTO,
} from './dto/{module}.dto';
```

## Checklist de Validação

Para cada módulo, verificar:

- [ ] Estrutura de diretórios segue o padrão
- [ ] Nomenclatura segue as convenções
- [ ] Repositories herdam de `BaseRepository`
- [ ] DTOs estão na pasta `dto/`
- [ ] Domain Services estão em `domain-services/`
- [ ] Application Services estão em `services/`
- [ ] Index exporta todos os componentes públicos
- [ ] Separação de responsabilidades está clara
- [ ] Sem dependências circulares
- [ ] Documentação presente

## Módulos Existentes

### Seguem o Padrão
- ✅ customers
- ✅ commissions
- ✅ qualifications
- ✅ products
- ✅ finance
- ✅ logistics
- ✅ mlm

### Precisam de Ajustes
- [ ] Verificar cada módulo individualmente

## Próximos Passos

1. Auditar cada módulo existente
2. Ajustar estrutura conforme necessário
3. Documentar exceções (se houver)
4. Criar template para novos módulos
