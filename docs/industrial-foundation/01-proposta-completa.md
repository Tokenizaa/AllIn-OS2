# Industrial Foundation - Proposta Completa

## Visão Geral

O módulo **Industrial Foundation** é uma extensão da plataforma AllIn OS 2.0 para gestão industrial, com foco inicial em **COLCHÕES**. O objetivo é transformar conhecimento informal da fábrica em dados estruturados, preparando o terreno para futuras integrações com IA e otimização de processos produtivos.

### Objetivos V1
- Descobrir e estruturar a fábrica
- Mapear máquinas, materiais, processos e capacidades
- Registrar tempos produtivos para análise de eficiência
- Criar Bill of Materials (BOM) para produtos industriais
- Preparar estrutura de dados para integração com IA

### Princípios
- **Integração**: Não criar projeto separado, sistema externo ou monorepo novo
- **Padrões**: Utilizar exclusivamente os padrões existentes no projeto
- **Não impacto**: Não alterar fluxos produtivos já existentes (MLM, E-commerce, CRM, Analytics)
- **Design**: Utilizar componentes já existentes, não criar design paralelo
- **IA futura**: Preparar estrutura, mas não implementar IA nesta fase

---

## 1. Auditoria da Arquitetura Atual

### Backend Patterns Identificados

#### Estrutura de Módulos
```
src/backend/modules/{module}/
├── dto/              # Data Transfer Objects com Zod schemas
├── repositories/     # Repositories extendendo BaseRepository
├── services/         # Business logic layer
├── api/              # API functions com validação
└── index.ts          # Exportações centralizadas
```

#### BaseRepository
- CRUD padrão com soft delete
- Paginação automática
- Filtros dinâmicos
- Suporte a schemas Supabase
- Métodos: `create`, `findById`, `findAll`, `update`, `delete`, `paginate`

#### BaseEntity
```typescript
interface BaseEntity {
  id: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}
```

#### DTOs com Zod
- `Create{Entity}DTO` - para criação
- `Update{Entity}DTO` - para atualização
- `{Entity}ResponseDTO` - para respostas
- Validação automática via Zod schemas

#### API Functions
```typescript
export const getEntities = async (data: unknown) => {
  const parsed = schema.parse(data);
  try {
    const result = await service.findAll(parsed);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
```

### Database Patterns Identificados

#### Schemas por Bounded Context
- `identity` - Autenticação e autorização
- `location` - Localizações e endereços
- `crm` - Gestão de clientes
- `mlm` - Marketing multinível
- `commerce` - E-commerce
- `logistics` - Logística
- `finance` - Financeiro
- `system` - Sistema

#### Convenções de Tabelas
- UUID primary key com `uuid_generate_v4()`
- `created_at TIMESTAMPTZ DEFAULT NOW()`
- `updated_at TIMESTAMPTZ DEFAULT NOW()`
- `deleted_at TIMESTAMPTZ` (soft delete)
- `metadata JSONB DEFAULT '{}'` para dados flexíveis
- Índices B-tree para FKs
- Índices GIN para JSONB/text search

#### RLS (Row Level Security)
```sql
ALTER TABLE schema.table ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access"
  ON schema.table FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Public read access"
  ON schema.table FOR SELECT
  USING (status = 'active');
```

#### Triggers
```sql
CREATE TRIGGER update_updated_at
  BEFORE UPDATE ON schema.table
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Frontend Patterns Identificados

#### Router: TanStack Router
- File-based routing
- `src/routes/_app/` para rotas autenticadas
- `createFileRoute()` para definir rotas
- `routeTree.gen.ts` gerado automaticamente

#### Layout
```
_app/
├── _app.tsx           # Layout principal com SidebarNav + Topbar
├── customers/
│   ├── index.tsx      # Lista
│   └── $id.tsx        # Detalhe
└── products/
    └── index.tsx
```

#### Componentes UI (shadcn/ui)
- `Badge`, `Button`, `Input`, `Table`, `Card`
- `Dialog`, `DropdownMenu`, `Tabs`
- `Select`, `Switch`, `Textarea`
- Styling com Tailwind CSS + `cn()` utility

#### Hooks Customizados
- `useCustomers` - dados de clientes
- `usePermissions` - verificação de permissões
- `useAuth` - autenticação

#### Navegação Centralizada
```typescript
// src/modules/app-navigation.ts
export const APP_NAV_SECTIONS: AppNavSection[] = [
  { label: "Executivo", items: [...] },
  { label: "CRM", items: [...] },
  // ...
];
```

### Permission System Identificados

#### Roles
```typescript
enum UserRole {
  ADMIN_MASTER = 'admin_master',
  GESTAO_ADMIN = 'gestao_admin',
  FINANCEIRO = 'financeiro',
  SUPORTE = 'suporte',
  LOGISTICA = 'logistica',
  MARKETING = 'marketing',
  ANALYTICS = 'analytics',
  AUDITOR = 'auditor',
  OPERADOR = 'operador',
  DISTRIBUIDOR = 'distribuidor',
  AFILIADO = 'afiliado',
  CLIENTE_FINAL = 'cliente_final',
}
```

#### Permissions
```typescript
interface Permission {
  id: string;
  module: "dashboard" | "analytics" | "finance" | "support" | "network" | "orders" | "products" | "marketing" | "settings" | "system";
  action: "read" | "write" | "delete" | "manage" | "all";
  description: string;
}
```

#### Permission Matrix
```typescript
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin_master: [
    { id: "p1", module: "dashboard", action: "all", description: "..." },
    // ...
  ],
  // ...
};
```

#### Permission Check
```typescript
const { hasPermission } = usePermissions();
hasPermission(module, action); // boolean
```

---

## 2. Proposta de Estrutura do Módulo

### Backend Structure
```
src/backend/modules/industrial/
├── dto/
│   ├── machine.dto.ts
│   ├── material.dto.ts
│   ├── supplier.dto.ts
│   ├── process.dto.ts
│   ├── timing.dto.ts
│   ├── capacity.dto.ts
│   ├── location.dto.ts
│   ├── tool.dto.ts
│   ├── product-industrial.dto.ts
│   ├── component.dto.ts
│   └── bom.dto.ts
├── repositories/
│   ├── machine.repository.ts
│   ├── material.repository.ts
│   ├── supplier.repository.ts
│   ├── process.repository.ts
│   ├── timing.repository.ts
│   ├── capacity.repository.ts
│   ├── location.repository.ts
│   ├── tool.repository.ts
│   ├── product-industrial.repository.ts
│   ├── component.repository.ts
│   └── bom.repository.ts
├── services/
│   ├── machine.service.ts
│   ├── material.service.ts
│   ├── supplier.service.ts
│   ├── process.service.ts
│   ├── timing.service.ts
│   ├── capacity.service.ts
│   ├── location.service.ts
│   ├── tool.service.ts
│   ├── product-industrial.service.ts
│   ├── component.service.ts
│   └── bom.service.ts
├── api/
│   └── industrial.api.ts
└── index.ts
```

### Frontend Structure
```
src/routes/_app/industrial/
├── index.tsx              # Dashboard Industrial
├── machines/
│   ├── index.tsx          # Lista de máquinas
│   └── $id.tsx            # Detalhe da máquina
├── materials/
│   ├── index.tsx          # Lista de matérias-primas
│   └── $id.tsx            # Detalhe da matéria-prima
├── suppliers/
│   ├── index.tsx          # Lista de fornecedores
│   └── $id.tsx            # Detalhe do fornecedor
├── processes/
│   ├── index.tsx          # Lista de processos
│   └── $id.tsx            # Detalhe do processo
├── timing/
│   └── index.tsx          # Cronometragem
├── capacity/
│   └── index.tsx          # Capacidade produtiva
├── locations/
│   └── index.tsx          # Estrutura física
├── tools/
│   └── index.tsx          # Ferramentas
├── products/
│   ├── index.tsx          # Lista de produtos industriais
│   └── $id.tsx            # Detalhe do produto
├── components/
│   └── index.tsx          # Lista de componentes
└── bom/
    └── index.tsx          # Bill of Materials
```

### Components Structure
```
src/components/industrial/
├── MachineCard.tsx
├── MaterialCard.tsx
├── SupplierCard.tsx
├── ProcessCard.tsx
├── TimingCard.tsx
├── CapacityCard.tsx
├── LocationCard.tsx
├── ToolCard.tsx
├── ProductIndustrialCard.tsx
├── ComponentCard.tsx
├── BomTree.tsx
└── IndustrialDashboard.tsx
```

---

## 3. Proposta de Schema do Banco de Dados

### Novo Schema
```sql
CREATE SCHEMA IF NOT EXISTS industrial;
```

### Tabelas Propostas

#### 1. industrial.machines
```sql
CREATE TABLE industrial.machines (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identificação
    nome VARCHAR(200) NOT NULL,
    codigo VARCHAR(50) UNIQUE NOT NULL,
    fabricante VARCHAR(200),
    modelo VARCHAR(200),
    numero_serie VARCHAR(100),
    
    -- Aquisição
    data_aquisicao DATE,
    valor_aquisicao NUMERIC(12,2),
    
    -- Localização
    localizacao_id UUID REFERENCES industrial.locations(id) ON DELETE SET NULL,
    localizacao_detalhe TEXT,
    
    -- Status
    status VARCHAR(50) DEFAULT 'active', -- active, maintenance, inactive, retired
    capacidade_horaria NUMERIC(10,2),
    
    -- Metadados
    especificacoes JSONB DEFAULT '{}',
    observacoes TEXT,
    anexos JSONB DEFAULT '[]',
    
    -- Auditoria
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
```

#### 2. industrial.materials
```sql
CREATE TABLE industrial.materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identificação
    codigo VARCHAR(50) UNIQUE NOT NULL,
    descricao VARCHAR(500) NOT NULL,
    categoria VARCHAR(100),
    
    -- Estoque
    unidade_medida VARCHAR(20) NOT NULL,
    estoque_atual NUMERIC(12,3) DEFAULT 0,
    estoque_minimo NUMERIC(12,3) DEFAULT 0,
    estoque_maximo NUMERIC(12,3),
    
    -- Custo
    custo_unitario NUMERIC(12,2),
    custo_medio NUMERIC(12,2),
    
    -- Fornecedor
    fornecedor_padrao_id UUID REFERENCES industrial.suppliers(id) ON DELETE SET NULL,
    
    -- Localização
    localizacao_id UUID REFERENCES industrial.locations(id) ON DELETE SET NULL,
    
    -- Metadados
    especificacoes JSONB DEFAULT '{}',
    observacoes TEXT,
    
    -- Auditoria
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
```

#### 3. industrial.suppliers
```sql
CREATE TABLE industrial.suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identificação
    razao_social VARCHAR(200) NOT NULL,
    nome_fantasia VARCHAR(200),
    cnpj VARCHAR(20),
    
    -- Contato
    contato_nome VARCHAR(100),
    contato_email VARCHAR(200),
    contato_telefone VARCHAR(20),
    
    -- Endereço
    endereco TEXT,
    cidade VARCHAR(100),
    estado VARCHAR(2),
    cep VARCHAR(10),
    
    -- Status
    status VARCHAR(50) DEFAULT 'active',
    
    -- Metadados
    condicoes_pagamento TEXT,
    prazo_entrega_padrao INTEGER,
    observacoes TEXT,
    
    -- Auditoria
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
```

#### 4. industrial.processes
```sql
CREATE TABLE industrial.processes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identificação
    nome VARCHAR(200) NOT NULL,
    descricao TEXT,
    
    -- Sequência
    sequencia INTEGER,
    
    -- Entradas/Saídas
    entradas JSONB DEFAULT '[]',
    saidas JSONB DEFAULT '[]',
    
    -- Máquinas utilizadas
    maquinas JSONB DEFAULT '[]',
    
    -- Responsáveis
    responsaveis JSONB DEFAULT '[]',
    
    -- Tempos padrão
    tempo_padrao_minutos INTEGER,
    
    -- Status
    status VARCHAR(50) DEFAULT 'active',
    
    -- Metadados
    observacoes TEXT,
    
    -- Auditoria
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
```

#### 5. industrial.timing_records
```sql
CREATE TABLE industrial.timing_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Processo
    processo_id UUID REFERENCES industrial.processes(id) ON DELETE SET NULL,
    
    -- Operador
    operador_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Tempo
    inicio TIMESTAMPTZ NOT NULL,
    fim TIMESTAMPTZ,
    duracao_segundos INTEGER,
    
    -- Contexto
    produto_id UUID REFERENCES industrial.products_industrial(id) ON DELETE SET NULL,
    quantidade_produzida INTEGER,
    
    -- Observações
    observacoes TEXT,
    
    -- Auditoria
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
```

#### 6. industrial.capacity
```sql
CREATE TABLE industrial.capacity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Máquina
    maquina_id UUID REFERENCES industrial.machines(id) ON DELETE CASCADE,
    
    -- Capacidade
    capacidade_teorica NUMERIC(12,2),
    capacidade_observada NUMERIC(12,2),
    
    -- Unidade de medida
    unidade_medida VARCHAR(20),
    
    -- Período
    data_inicio DATE,
    data_fim DATE,
    
    -- Metadados
    observacoes TEXT,
    
    -- Auditoria
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
```

#### 7. industrial.locations
```sql
CREATE TABLE industrial.locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identificação
    nome VARCHAR(200) NOT NULL,
    tipo VARCHAR(50),
    
    -- Hierarquia
    parent_id UUID REFERENCES industrial.locations(id) ON DELETE SET NULL,
    
    -- Metadados
    descricao TEXT,
    area_m2 NUMERIC(10,2),
    
    -- Auditoria
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
```

#### 8. industrial.tools
```sql
CREATE TABLE industrial.tools (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identificação
    descricao VARCHAR(500) NOT NULL,
    categoria VARCHAR(100),
    
    -- Localização
    localizacao_id UUID REFERENCES industrial.locations(id) ON DELETE SET NULL,
    
    -- Responsável
    responsavel_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    
    -- Status
    status VARCHAR(50) DEFAULT 'available',
    
    -- Metadados
    observacoes TEXT,
    
    -- Auditoria
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
```

#### 9. industrial.products_industrial
```sql
CREATE TABLE industrial.products_industrial (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identificação
    modelo VARCHAR(200) NOT NULL,
    categoria VARCHAR(100),
    
    -- Dimensões
    largura_cm NUMERIC(6,2),
    comprimento_cm NUMERIC(6,2),
    altura_cm NUMERIC(6,2),
    
    -- Metadados
    especificacoes JSONB DEFAULT '{}',
    observacoes TEXT,
    
    -- Auditoria
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
```

#### 10. industrial.components
```sql
CREATE TABLE industrial.components (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identificação
    nome VARCHAR(200) NOT NULL,
    categoria VARCHAR(100),
    
    -- Especificações
    especificacoes JSONB DEFAULT '{}',
    
    -- Metadados
    observacoes TEXT,
    
    -- Auditoria
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
```

#### 11. industrial.bom
```sql
CREATE TABLE industrial.bom (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Produto
    produto_id UUID REFERENCES industrial.products_industrial(id) ON DELETE CASCADE,
    
    -- Componente
    componente_id UUID REFERENCES industrial.components(id) ON DELETE CASCADE,
    
    -- Quantidade
    quantidade NUMERIC(12,3) NOT NULL,
    unidade_medida VARCHAR(20),
    
    -- Sequência
    sequencia INTEGER,
    
    -- Metadados
    observacoes TEXT,
    
    -- Auditoria
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
```

### Índices Propostos
```sql
-- Machines
CREATE INDEX idx_machines_codigo ON industrial.machines(codigo);
CREATE INDEX idx_machines_status ON industrial.machines(status);
CREATE INDEX idx_machines_localizacao ON industrial.machines(localizacao_id);

-- Materials
CREATE INDEX idx_materials_codigo ON industrial.materials(codigo);
CREATE INDEX idx_materials_categoria ON industrial.materials(categoria);
CREATE INDEX idx_materials_fornecedor ON industrial.materials(fornecedor_padrao_id);

-- Suppliers
CREATE INDEX idx_suppliers_cnpj ON industrial.suppliers(cnpj);
CREATE INDEX idx_suppliers_status ON industrial.suppliers(status);

-- Processes
CREATE INDEX idx_processes_sequencia ON industrial.processes(sequencia);
CREATE INDEX idx_processes_status ON industrial.processes(status);

-- Timing Records
CREATE INDEX idx_timing_processo ON industrial.timing_records(processo_id);
CREATE INDEX idx_timing_operador ON industrial.timing_records(operador_id);
CREATE INDEX idx_timing_inicio ON industrial.timing_records(inicio);

-- Capacity
CREATE INDEX idx_capacity_maquina ON industrial.capacity(maquina_id);
CREATE INDEX idx_capacity_periodo ON industrial.capacity(data_inicio, data_fim);

-- Locations
CREATE INDEX idx_locations_parent ON industrial.locations(parent_id);
CREATE INDEX idx_locations_tipo ON industrial.locations(tipo);

-- BOM
CREATE INDEX idx_bom_produto ON industrial.bom(produto_id);
CREATE INDEX idx_bom_componente ON industrial.bom(componente_id);
```

### RLS Policies Propostas
```sql
-- Enable RLS
ALTER TABLE industrial.machines ENABLE ROW LEVEL SECURITY;
ALTER TABLE industrial.materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE industrial.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE industrial.processes ENABLE ROW LEVEL SECURITY;
ALTER TABLE industrial.timing_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE industrial.capacity ENABLE ROW LEVEL SECURITY;
ALTER TABLE industrial.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE industrial.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE industrial.products_industrial ENABLE ROW LEVEL SECURITY;
ALTER TABLE industrial.components ENABLE ROW LEVEL SECURITY;
ALTER TABLE industrial.bom ENABLE ROW LEVEL SECURITY;

-- Service role full access
CREATE POLICY "Service role full access to machines"
  ON industrial.machines FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Authenticated read access
CREATE POLICY "Authenticated read access to machines"
  ON industrial.machines FOR SELECT
  USING (auth.role() = 'authenticated');

-- Authenticated write access
CREATE POLICY "Authenticated write access to machines"
  ON industrial.machines FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated update access to machines"
  ON industrial.machines FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Similar policies for all other tables
```

---

## 4. Proposta de Navegação

### Adicionar a `APP_NAV_SECTIONS` em `src/modules/app-navigation.ts`
```typescript
export type AppNavModule =
  | "dashboard"
  | "analytics"
  | "finance"
  | "support"
  | "network"
  | "orders"
  | "products"
  | "marketing"
  | "settings"
  | "system"
  | "industrial"; // NOVO

export const APP_NAV_SECTIONS: AppNavSection[] = [
  // ... seções existentes ...
  {
    label: "Industrial",
    items: [
      { to: "/industrial", label: "Dashboard Industrial", icon: Factory, module: "industrial" },
      { to: "/industrial/machines", label: "Máquinas", icon: Wrench, module: "industrial" },
      { to: "/industrial/materials", label: "Matérias-Primas", icon: Package, module: "industrial" },
      { to: "/industrial/suppliers", label: "Fornecedores", icon: Truck, module: "industrial" },
      { to: "/industrial/processes", label: "Processos", icon: Workflow, module: "industrial" },
      { to: "/industrial/timing", label: "Cronometragem", icon: Timer, module: "industrial" },
      { to: "/industrial/capacity", label: "Capacidade", icon: Gauge, module: "industrial" },
      { to: "/industrial/products", label: "Produtos", icon: Box, module: "industrial" },
      { to: "/industrial/bom", label: "BOM", icon: FileTree, module: "industrial" },
    ],
  },
];
```

---

## 5. Proposta de Permissões

### Adicionar módulo "industrial" ao Permission type
```typescript
// src/modules/auth/context/auth.types.ts
export interface Permission {
  id: string;
  module: "dashboard" | "analytics" | "finance" | "support" | "network" | "orders" | "products" | "marketing" | "settings" | "system" | "industrial";
  action: "read" | "write" | "delete" | "manage" | "all";
  description: string;
}
```

### Adicionar permissões ao ROLE_PERMISSIONS
```typescript
// src/modules/auth/permissions/permissions.ts
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin_master: [
    // ... permissões existentes ...
    { id: "p11", module: "industrial", action: "all", description: "Acesso total ao módulo Industrial" }
  ],
  gestao_admin: [
    // ... permissões existentes ...
    { id: "ga8", module: "industrial", action: "all", description: "Gestão completa Industrial" }
  ],
  logistica: [
    // ... permissões existentes ...
    { id: "log4", module: "industrial", action: "read", description: "Visualizar dados industriais" },
    { id: "log5", module: "industrial", action: "write", description: "Atualizar estoques e capacidades" }
  ],
  operador: [
    // ... permissões existentes ...
    { id: "ope4", module: "industrial", action: "write", description: "Registrar cronometragem" }
  ],
  // ... outros roles sem acesso industrial ...
};
```

### Novo Role: OPERADOR_INDUSTRIAL (opcional)
```typescript
// src/shared/types/roles.ts
export enum UserRole {
  // ... roles existentes ...
  OPERADOR_INDUSTRIAL = 'operador_industrial',
}

// permissions.ts
operador_industrial: [
  { id: "oi1", module: "industrial", action: "read", description: "Visualizar dados industriais" },
  { id: "oi2", module: "industrial", action: "write", description: "Registrar cronometragem e tempos" },
  { id: "oi3", module: "industrial", action: "write", description: "Atualizar status de máquinas" }
]
```

---

## 6. Proposta de Dashboard Industrial

### Componente IndustrialDashboard
```typescript
// src/components/industrial/IndustrialDashboard.tsx
interface IndustrialDashboardStats {
  totalMaquinas: number;
  maquinasAtivas: number;
  materiasPrimas: number;
  fornecedores: number;
  processosMapeados: number;
  temposRegistrados: number;
  capacidadeLevantada: number;
}
```

### KPIs a Exibir
- Total de máquinas cadastradas
- Máquinas ativas vs em manutenção
- Matérias-primas cadastradas
- Fornecedores ativos
- Processos produtivos mapeados
- Registros de cronometragem
- Capacidade produtiva levantada

---

## 7. Preparação para Integração com IA

### Estrutura de Dados Preparada para IA
- **JSONB fields** em todas as tabelas para metadados flexíveis
- **Relacionamentos explícitos** entre máquinas, processos, materiais
- **Histórico de tempos** (timing_records) para análise de padrões
- **Capacidade teórica vs observada** para identificação de gargalos
- **BOM estruturado** para cálculo de necessidades de materiais
- **Localização hierárquica** para otimização de layout

### Campos Específicos para IA
```sql
-- Em machines
especificacoes JSONB -- pode conter: potencia, consumo, manutenções previstas

-- Em timing_records
observacoes TEXT -- pode conter: problemas encontrados, condições especiais

-- Em capacity
capacidade_observada -- dados reais para treinamento de modelos
```

---

## 8. Resumo da Implementação

### Backend (11 submódulos)
1. Machines
2. Materials
3. Suppliers
4. Processes
5. Timing Records
6. Capacity
7. Locations
8. Tools
9. Products Industrial
10. Components
11. BOM

### Frontend (9 telas principais + dashboard)
1. Dashboard Industrial
2. Máquinas (list + detail)
3. Matérias-Primas (list + detail)
4. Fornecedores (list + detail)
5. Processos (list + detail)
6. Cronometragem (list + form)
7. Capacidade (list + form)
8. Produtos Industriais (list + detail)
9. BOM (list + detail)
10. Ferramentas (list)
11. Estrutura Física (list)

### Permissões
- Novo módulo: `industrial`
- Actions: `read`, `write`, `delete`, `manage`, `all`
- Roles com acesso: admin_master, gestao_admin, logistica, operador, operador_industrial (novo)

---

## 9. Migration File

### Migration: `057_industrial_foundation.sql`
```sql
-- ============================================================================
-- INDUSTRIAL FOUNDATION - ALLIN OS 2.0
-- Módulo para gestão industrial: máquinas, materiais, processos, capacidade
-- ============================================================================

BEGIN;

-- Criar schema
CREATE SCHEMA IF NOT EXISTS industrial;

-- Criar todas as tabelas conforme proposto
-- Criar índices
-- Criar triggers de updated_at
-- Habilitar RLS
-- Criar policies

COMMIT;
```

---

## Conclusão

Esta proposta segue rigorosamente os padrões existentes no projeto AllIn OS 2.0, garantindo:

- **Consistência arquitetural**: Mesma estrutura de módulos, mesmos patterns
- **Integração nativa**: Não cria sistemas paralelos
- **Segurança**: RLS e RBAC integrados ao sistema existente
- **Escalabilidade**: Estrutura preparada para expansão futura
- **IA-ready**: Campos JSONB e relacionamentos preparados para análise

Aguardando aprovação para iniciar implementação.
