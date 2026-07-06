# Industrial Foundation - Plano de Ação

## Visão Geral

Este documento detalha o plano de implementação do módulo Industrial Foundation, dividido em fases sequenciais com tarefas específicas, dependências e critérios de aceitação.

---

## Fase 1: Preparação e Setup

### Objetivo
Configurar o ambiente e criar a estrutura base para o desenvolvimento.

### Tarefas

#### 1.1 Criar Feature Branch
- **Comando**: `git checkout -b feature/industrial-foundation-v1`
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Branch criado e sincronizado com remoto

#### 1.2 Criar Migration File
- **Arquivo**: `supabase/migrations/057_industrial_foundation.sql`
- **Conteúdo**:
  - Criar schema `industrial`
  - Criar todas as 11 tabelas
  - Criar índices
  - Criar triggers de `updated_at`
  - Habilitar RLS
  - Criar policies
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Migration file criado e validado sintaticamente

#### 1.3 Aplicar Migration Localmente
- **Comando**: `supabase db push`
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Schema e tabelas criados no Supabase local

---

## Fase 2: Backend - Repositories

### Objetivo
Implementar todas as repositories seguindo o padrão BaseRepository.

### Tarefas

#### 2.1 Criar Machine Repository
- **Arquivo**: `src/backend/modules/industrial/repositories/machine.repository.ts`
- **Interface**: `Machine extends BaseEntity`
- **Campos**: nome, codigo, fabricante, modelo, numero_serie, data_aquisicao, valor_aquisicao, localizacao_id, localizacao_detalhe, status, capacidade_horaria, especificacoes, observacoes, anexos
- **Métodos customizados**:
  - `findByStatus(status)`
  - `findByLocation(locationId)`
  - `findActive()`
  - `findInMaintenance()`
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Repository criada, testes básicos passando

#### 2.2 Criar Material Repository
- **Arquivo**: `src/backend/modules/industrial/repositories/material.repository.ts`
- **Interface**: `Material extends BaseEntity`
- **Campos**: codigo, descricao, categoria, unidade_medida, estoque_atual, estoque_minimo, estoque_maximo, custo_unitario, custo_medio, fornecedor_padrao_id, localizacao_id, especificacoes, observacoes
- **Métodos customizados**:
  - `findByCategory(categoria)`
  - `findBySupplier(supplierId)`
  - `findLowStock()`
  - `updateStock(id, quantidade)`
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Repository criada, testes básicos passando

#### 2.3 Criar Supplier Repository
- **Arquivo**: `src/backend/modules/industrial/repositories/supplier.repository.ts`
- **Interface**: `Supplier extends BaseEntity`
- **Campos**: razao_social, nome_fantasia, cnpj, contato_nome, contato_email, contato_telefone, endereco, cidade, estado, cep, status, condicoes_pagamento, prazo_entrega_padrao, observacoes
- **Métodos customizados**:
  - `findByCNPJ(cnpj)`
  - `findByStatus(status)`
  - `findActive()`
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Repository criada, testes básicos passando

#### 2.4 Criar Process Repository
- **Arquivo**: `src/backend/modules/industrial/repositories/process.repository.ts`
- **Interface**: `Process extends BaseEntity`
- **Campos**: nome, descricao, sequencia, entradas, saidas, maquinas, responsaveis, tempo_padrao_minutos, status, observacoes
- **Métodos customizados**:
  - `findBySequence(sequencia)`
  - `findByStatus(status)`
  - `findActive()`
  - `findByMachine(machineId)`
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Repository criada, testes básicos passando

#### 2.5 Criar Timing Record Repository
- **Arquivo**: `src/backend/modules/industrial/repositories/timing.repository.ts`
- **Interface**: `TimingRecord extends BaseEntity`
- **Campos**: processo_id, operador_id, inicio, fim, duracao_segundos, produto_id, quantidade_produzida, observacoes
- **Métodos customizados**:
  - `findByProcess(processId)`
  - `findByOperator(operatorId)`
  - `findByDateRange(inicio, fim)`
  - `calculateAverageTime(processId)`
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Repository criada, testes básicos passando

#### 2.6 Criar Capacity Repository
- **Arquivo**: `src/backend/modules/industrial/repositories/capacity.repository.ts`
- **Interface**: `Capacity extends BaseEntity`
- **Campos**: maquina_id, capacidade_teorica, capacidade_observada, unidade_medida, data_inicio, data_fim, observacoes
- **Métodos customizados**:
  - `findByMachine(machineId)`
  - `findByDateRange(dataInicio, dataFim)`
  - `findCurrentCapacity(machineId)`
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Repository criada, testes básicos passando

#### 2.7 Criar Location Repository
- **Arquivo**: `src/backend/modules/industrial/repositories/location.repository.ts`
- **Interface**: `Location extends BaseEntity`
- **Campos**: nome, tipo, parent_id, descricao, area_m2
- **Métodos customizados**:
  - `findByType(tipo)`
  - `findByParent(parentId)`
  - `findRootLocations()`
  - `findTree()`
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Repository criada, testes básicos passando

#### 2.8 Criar Tool Repository
- **Arquivo**: `src/backend/modules/industrial/repositories/tool.repository.ts`
- **Interface**: `Tool extends BaseEntity`
- **Campos**: descricao, categoria, localizacao_id, responsavel_id, status, observacoes
- **Métodos customizados**:
  - `findByCategory(categoria)`
  - `findByLocation(locationId)`
  - `findByResponsavel(responsavelId)`
  - `findAvailable()`
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Repository criada, testes básicos passando

#### 2.9 Criar Product Industrial Repository
- **Arquivo**: `src/backend/modules/industrial/repositories/product-industrial.repository.ts`
- **Interface**: `ProductIndustrial extends BaseEntity`
- **Campos**: modelo, categoria, largura_cm, comprimento_cm, altura_cm, especificacoes, observacoes
- **Métodos customizados**:
  - `findByCategory(categoria)`
  - `findByDimensions(largura, comprimento)`
  - `findActive()`
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Repository criada, testes básicos passando

#### 2.10 Criar Component Repository
- **Arquivo**: `src/backend/modules/industrial/repositories/component.repository.ts`
- **Interface**: `Component extends BaseEntity`
- **Campos**: nome, categoria, especificacoes, observacoes
- **Métodos customizados**:
  - `findByCategory(categoria)`
  - `findActive()`
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Repository criada, testes básicos passando

#### 2.11 Criar BOM Repository
- **Arquivo**: `src/backend/modules/industrial/repositories/bom.repository.ts`
- **Interface**: `BOM extends BaseEntity`
- **Campos**: produto_id, componente_id, quantidade, unidade_medida, sequencia, observacoes
- **Métodos customizados**:
  - `findByProduct(produtoId)`
  - `findByComponent(componenteId)`
  - `findBOMTree(produtoId)`
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Repository criada, testes básicos passando

---

## Fase 3: Backend - DTOs

### Objetivo
Criar DTOs com Zod schemas para validação de dados.

### Tarefas

#### 3.1 Criar Machine DTOs
- **Arquivo**: `src/backend/modules/industrial/dto/machine.dto.ts`
- **Schemas**:
  - `CreateMachineDTO`
  - `UpdateMachineDTO`
  - `MachineResponseDTO`
  - `MachineListResponseDTO`
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: DTOs criadas com validação Zod

#### 3.2 Criar Material DTOs
- **Arquivo**: `src/backend/modules/industrial/dto/material.dto.ts`
- **Schemas**:
  - `CreateMaterialDTO`
  - `UpdateMaterialDTO`
  - `MaterialResponseDTO`
  - `MaterialListResponseDTO`
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: DTOs criadas com validação Zod

#### 3.3 Criar Supplier DTOs
- **Arquivo**: `src/backend/modules/industrial/dto/supplier.dto.ts`
- **Schemas**:
  - `CreateSupplierDTO`
  - `UpdateSupplierDTO`
  - `SupplierResponseDTO`
  - `SupplierListResponseDTO`
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: DTOs criadas com validação Zod

#### 3.4 Criar Process DTOs
- **Arquivo**: `src/backend/modules/industrial/dto/process.dto.ts`
- **Schemas**:
  - `CreateProcessDTO`
  - `UpdateProcessDTO`
  - `ProcessResponseDTO`
  - `ProcessListResponseDTO`
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: DTOs criadas com validação Zod

#### 3.5 Criar Timing DTOs
- **Arquivo**: `src/backend/modules/industrial/dto/timing.dto.ts`
- **Schemas**:
  - `CreateTimingDTO`
  - `UpdateTimingDTO`
  - `TimingResponseDTO`
  - `TimingListResponseDTO`
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: DTOs criadas com validação Zod

#### 3.6 Criar Capacity DTOs
- **Arquivo**: `src/backend/modules/industrial/dto/capacity.dto.ts`
- **Schemas**:
  - `CreateCapacityDTO`
  - `UpdateCapacityDTO`
  - `CapacityResponseDTO`
  - `CapacityListResponseDTO`
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: DTOs criadas com validação Zod

#### 3.7 Criar Location DTOs
- **Arquivo**: `src/backend/modules/industrial/dto/location.dto.ts`
- **Schemas**:
  - `CreateLocationDTO`
  - `UpdateLocationDTO`
  - `LocationResponseDTO`
  - `LocationListResponseDTO`
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: DTOs criadas com validação Zod

#### 3.8 Criar Tool DTOs
- **Arquivo**: `src/backend/modules/industrial/dto/tool.dto.ts`
- **Schemas**:
  - `CreateToolDTO`
  - `UpdateToolDTO`
  - `ToolResponseDTO`
  - `ToolListResponseDTO`
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: DTOs criadas com validação Zod

#### 3.9 Criar Product Industrial DTOs
- **Arquivo**: `src/backend/modules/industrial/dto/product-industrial.dto.ts`
- **Schemas**:
  - `CreateProductIndustrialDTO`
  - `UpdateProductIndustrialDTO`
  - `ProductIndustrialResponseDTO`
  - `ProductIndustrialListResponseDTO`
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: DTOs criadas com validação Zod

#### 3.10 Criar Component DTOs
- **Arquivo**: `src/backend/modules/industrial/dto/component.dto.ts`
- **Schemas**:
  - `CreateComponentDTO`
  - `UpdateComponentDTO`
  - `ComponentResponseDTO`
  - `ComponentListResponseDTO`
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: DTOs criadas com validação Zod

#### 3.11 Criar BOM DTOs
- **Arquivo**: `src/backend/modules/industrial/dto/bom.dto.ts`
- **Schemas**:
  - `CreateBOMDTO`
  - `UpdateBOMDTO`
  - `BOMResponseDTO`
  - `BOMListResponseDTO`
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: DTOs criadas com validação Zod

---

## Fase 4: Backend - Services

### Objetivo
Implementar services com business logic para cada entidade.

### Tarefas

#### 4.1 Criar Machine Service
- **Arquivo**: `src/backend/modules/industrial/services/machine.service.ts`
- **Métodos**: create, findById, findAll, update, delete, activate, deactivate, setMaintenance
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Service criada com lógica de negócio

#### 4.2 Criar Material Service
- **Arquivo**: `src/backend/modules/industrial/services/material.service.ts`
- **Métodos**: create, findById, findAll, update, delete, adjustStock, calculateCost
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Service criada com lógica de negócio

#### 4.3 Criar Supplier Service
- **Arquivo**: `src/backend/modules/industrial/services/supplier.service.ts`
- **Métodos**: create, findById, findAll, update, delete, activate, deactivate
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Service criada com lógica de negócio

#### 4.4 Criar Process Service
- **Arquivo**: `src/backend/modules/industrial/services/process.service.ts`
- **Métodos**: create, findById, findAll, update, delete, activate, deactivate
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Service criada com lógica de negócio

#### 4.5 Criar Timing Service
- **Arquivo**: `src/backend/modules/industrial/services/timing.service.ts`
- **Métodos**: create, findById, findAll, update, delete, startTiming, stopTiming, calculateAverage
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Service criada com lógica de negócio

#### 4.6 Criar Capacity Service
- **Arquivo**: `src/backend/modules/industrial/services/capacity.service.ts`
- **Métodos**: create, findById, findAll, update, delete
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Service criada com lógica de negócio

#### 4.7 Criar Location Service
- **Arquivo**: `src/backend/modules/industrial/services/location.service.ts`
- **Métodos**: create, findById, findAll, update, delete, getTree
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Service criada com lógica de negócio

#### 4.8 Criar Tool Service
- **Arquivo**: `src/backend/modules/industrial/services/tool.service.ts`
- **Métodos**: create, findById, findAll, update, delete, assign, release
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Service criada com lógica de negócio

#### 4.9 Criar Product Industrial Service
- **Arquivo**: `src/backend/modules/industrial/services/product-industrial.service.ts`
- **Métodos**: create, findById, findAll, update, delete
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Service criada com lógica de negócio

#### 4.10 Criar Component Service
- **Arquivo**: `src/backend/modules/industrial/services/component.service.ts`
- **Métodos**: create, findById, findAll, update, delete
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Service criada com lógica de negócio

#### 4.11 Criar BOM Service
- **Arquivo**: `src/backend/modules/industrial/services/bom.service.ts`
- **Métodos**: create, findById, findAll, update, delete, getBOMTree, calculateMaterialNeeds
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Service criada com lógica de negócio

---

## Fase 5: Backend - API

### Objetivo
Criar API functions com validação Zod para expor endpoints.

### Tarefas

#### 5.1 Criar Industrial API
- **Arquivo**: `src/backend/modules/industrial/api/industrial.api.ts`
- **Funções**:
  - `getMachines`
  - `getMachineById`
  - `createMachine`
  - `updateMachine`
  - `deleteMachine`
  - `getMaterials`
  - `getMaterialById`
  - `createMaterial`
  - `updateMaterial`
  - `deleteMaterial`
  - `getSuppliers`
  - `getSupplierById`
  - `createSupplier`
  - `updateSupplier`
  - `deleteSupplier`
  - `getProcesses`
  - `getProcessById`
  - `createProcess`
  - `updateProcess`
  - `deleteProcess`
  - `getTimingRecords`
  - `getTimingRecordById`
  - `createTimingRecord`
  - `updateTimingRecord`
  - `deleteTimingRecord`
  - `getCapacities`
  - `getCapacityById`
  - `createCapacity`
  - `updateCapacity`
  - `deleteCapacity`
  - `getLocations`
  - `getLocationById`
  - `createLocation`
  - `updateLocation`
  - `deleteLocation`
  - `getTools`
  - `getToolById`
  - `createTool`
  - `updateTool`
  - `deleteTool`
  - `getProductsIndustrial`
  - `getProductIndustrialById`
  - `createProductIndustrial`
  - `updateProductIndustrial`
  - `deleteProductIndustrial`
  - `getComponents`
  - `getComponentById`
  - `createComponent`
  - `updateComponent`
  - `deleteComponent`
  - `getBOMs`
  - `getBOMById`
  - `createBOM`
  - `updateBOM`
  - `deleteBOM`
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: API functions criadas com validação Zod

#### 5.2 Criar Module Index
- **Arquivo**: `src/backend/modules/industrial/index.ts`
- **Conteúdo**: Exportar todas as repositories, services, DTOs e API functions
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Index criado com todas as exportações

---

## Fase 6: Frontend - Navegação e Permissões

### Objetivo
Integrar o módulo Industrial ao sistema de navegação e permissões.

### Tarefas

#### 6.1 Adicionar Módulo Industrial ao Permission Type
- **Arquivo**: `src/modules/auth/context/auth.types.ts`
- **Alteração**: Adicionar `"industrial"` ao tipo `Permission["module"]`
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Tipo atualizado

#### 6.2 Adicionar Permissões ao ROLE_PERMISSIONS
- **Arquivo**: `src/modules/auth/permissions/permissions.ts`
- **Alteração**: Adicionar permissões industrial para roles apropriados
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Permissões adicionadas

#### 6.3 Adicionar Role OPERADOR_INDUSTRIAL (opcional)
- **Arquivo**: `src/shared/types/roles.ts`
- **Alteração**: Adicionar novo role ao enum
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Role adicionado

#### 6.4 Adicionar Seção Industrial à Navegação
- **Arquivo**: `src/modules/app-navigation.ts`
- **Alteração**: Adicionar seção "Industrial" com itens de navegação
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Navegação atualizada

---

## Fase 7: Frontend - Components

### Objetivo
Criar componentes reutilizáveis para o módulo Industrial.

### Tarefas

#### 7.1 Criar MachineCard Component
- **Arquivo**: `src/components/industrial/MachineCard.tsx`
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Componente criado seguindo padrões existentes

#### 7.2 Criar MaterialCard Component
- **Arquivo**: `src/components/industrial/MaterialCard.tsx`
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Componente criado seguindo padrões existentes

#### 7.3 Criar SupplierCard Component
- **Arquivo**: `src/components/industrial/SupplierCard.tsx`
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Componente criado seguindo padrões existentes

#### 7.4 Criar ProcessCard Component
- **Arquivo**: `src/components/industrial/ProcessCard.tsx`
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Componente criado seguindo padrões existentes

#### 7.5 Criar TimingCard Component
- **Arquivo**: `src/components/industrial/TimingCard.tsx`
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Componente criado seguindo padrões existentes

#### 7.6 Criar CapacityCard Component
- **Arquivo**: `src/components/industrial/CapacityCard.tsx`
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Componente criado seguindo padrões existentes

#### 7.7 Criar LocationCard Component
- **Arquivo**: `src/components/industrial/LocationCard.tsx`
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Componente criado seguindo padrões existentes

#### 7.8 Criar ToolCard Component
- **Arquivo**: `src/components/industrial/ToolCard.tsx`
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Componente criado seguindo padrões existentes

#### 7.9 Criar ProductIndustrialCard Component
- **Arquivo**: `src/components/industrial/ProductIndustrialCard.tsx`
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Componente criado seguindo padrões existentes

#### 7.10 Criar ComponentCard Component
- **Arquivo**: `src/components/industrial/ComponentCard.tsx`
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Componente criado seguindo padrões existentes

#### 7.11 Criar BomTree Component
- **Arquivo**: `src/components/industrial/BomTree.tsx`
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Componente criado seguindo padrões existentes

#### 7.12 Criar IndustrialDashboard Component
- **Arquivo**: `src/components/industrial/IndustrialDashboard.tsx`
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Componente criado com KPIs e cards

---

## Fase 8: Frontend - Rotas e Telas

### Objetivo
Criar rotas e telas para o módulo Industrial.

### Tarefas

#### 8.1 Criar Dashboard Industrial
- **Arquivo**: `src/routes/_app/industrial/index.tsx`
- **Conteúdo**: Dashboard com KPIs e cards
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Rota criada e funcional

#### 8.2 Criar Lista de Máquinas
- **Arquivo**: `src/routes/_app/industrial/machines/index.tsx`
- **Conteúdo**: Tabela com filtros e paginação
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Rota criada e funcional

#### 8.3 Criar Detalhe de Máquina
- **Arquivo**: `src/routes/_app/industrial/machines/$id.tsx`
- **Conteúdo**: Formulário de edição e detalhes
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Rota criada e funcional

#### 8.4 Criar Lista de Matérias-Primas
- **Arquivo**: `src/routes/_app/industrial/materials/index.tsx`
- **Conteúdo**: Tabela com filtros e paginação
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Rota criada e funcional

#### 8.5 Criar Detalhe de Matéria-Prima
- **Arquivo**: `src/routes/_app/industrial/materials/$id.tsx`
- **Conteúdo**: Formulário de edição e detalhes
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Rota criada e funcional

#### 8.6 Criar Lista de Fornecedores
- **Arquivo**: `src/routes/_app/industrial/suppliers/index.tsx`
- **Conteúdo**: Tabela com filtros e paginação
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Rota criada e funcional

#### 8.7 Criar Detalhe de Fornecedor
- **Arquivo**: `src/routes/_app/industrial/suppliers/$id.tsx`
- **Conteúdo**: Formulário de edição e detalhes
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Rota criada e funcional

#### 8.8 Criar Lista de Processos
- **Arquivo**: `src/routes/_app/industrial/processes/index.tsx`
- **Conteúdo**: Tabela com filtros e paginação
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Rota criada e funcional

#### 8.9 Criar Detalhe de Processo
- **Arquivo**: `src/routes/_app/industrial/processes/$id.tsx`
- **Conteúdo**: Formulário de edição e detalhes
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Rota criada e funcional

#### 8.10 Criar Cronometragem
- **Arquivo**: `src/routes/_app/industrial/timing/index.tsx`
- **Conteúdo**: Tabela com filtros e formulário de registro
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Rota criada e funcional

#### 8.11 Criar Capacidade
- **Arquivo**: `src/routes/_app/industrial/capacity/index.tsx`
- **Conteúdo**: Tabela com filtros e formulário de registro
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Rota criada e funcional

#### 8.12 Criar Estrutura Física
- **Arquivo**: `src/routes/_app/industrial/locations/index.tsx`
- **Conteúdo**: Tabela com filtros e visualização hierárquica
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Rota criada e funcional

#### 8.13 Criar Ferramentas
- **Arquivo**: `src/routes/_app/industrial/tools/index.tsx`
- **Conteúdo**: Tabela com filtros e paginação
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Rota criada e funcional

#### 8.14 Criar Lista de Produtos Industriais
- **Arquivo**: `src/routes/_app/industrial/products/index.tsx`
- **Conteúdo**: Tabela com filtros e paginação
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Rota criada e funcional

#### 8.15 Criar Detalhe de Produto Industrial
- **Arquivo**: `src/routes/_app/industrial/products/$id.tsx`
- **Conteúdo**: Formulário de edição e detalhes
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Rota criada e funcional

#### 8.16 Criar Lista de Componentes
- **Arquivo**: `src/routes/_app/industrial/components/index.tsx`
- **Conteúdo**: Tabela com filtros e paginação
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Rota criada e funcional

#### 8.17 Criar BOM
- **Arquivo**: `src/routes/_app/industrial/bom/index.tsx`
- **Conteúdo**: Tabela com filtros e visualização de árvore
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Rota criada e funcional

---

## Fase 9: Hooks Customizados

### Objetivo
Criar hooks customizados para facilitar o consumo de dados.

### Tarefas

#### 9.1 Criar useMachines Hook
- **Arquivo**: `src/hooks/industrial/useMachines.ts`
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Hook criado seguindo padrões existentes

#### 9.2 Criar useMaterials Hook
- **Arquivo**: `src/hooks/industrial/useMaterials.ts`
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Hook criado seguindo padrões existentes

#### 9.3 Criar useSuppliers Hook
- **Arquivo**: `src/hooks/industrial/useSuppliers.ts`
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Hook criado seguindo padrões existentes

#### 9.4 Criar useProcesses Hook
- **Arquivo**: `src/hooks/industrial/useProcesses.ts`
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Hook criado seguindo padrões existentes

#### 9.5 Criar useTiming Hook
- **Arquivo**: `src/hooks/industrial/useTiming.ts`
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Hook criado seguindo padrões existentes

#### 9.6 Criar useCapacity Hook
- **Arquivo**: `src/hooks/industrial/useCapacity.ts`
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Hook criado seguindo padrões existentes

#### 9.7 Criar useLocations Hook
- **Arquivo**: `src/hooks/industrial/useLocations.ts`
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Hook criado seguindo padrões existentes

#### 9.8 Criar useTools Hook
- **Arquivo**: `src/hooks/industrial/useTools.ts`
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Hook criado seguindo padrões existentes

#### 9.9 Criar useProductsIndustrial Hook
- **Arquivo**: `src/hooks/industrial/useProductsIndustrial.ts`
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Hook criado seguindo padrões existentes

#### 9.10 Criar useComponents Hook
- **Arquivo**: `src/hooks/industrial/useComponents.ts`
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Hook criado seguindo padrões existentes

#### 9.11 Criar useBOM Hook
- **Arquivo**: `src/hooks/industrial/useBOM.ts`
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Hook criado seguindo padrões existentes

---

## Fase 10: Testes e Validação

### Objetivo
Testar o módulo completo e validar integração.

### Tarefas

#### 10.1 Testar Backend API
- **Ação**: Testar todas as API functions
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Todas as APIs funcionando corretamente

#### 10.2 Testar Frontend Rotas
- **Ação**: Testar todas as rotas e navegação
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Todas as rotas acessíveis e funcionando

#### 10.3 Testar Permissões
- **Ação**: Testar controle de acesso por role
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Permissões aplicadas corretamente

#### 10.4 Testar RLS Policies
- **Ação**: Testar políticas de segurança no banco
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: RLS funcionando corretamente

#### 10.5 Testar Integração
- **Ação**: Testar integração com módulos existentes
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Sem conflitos com módulos existentes

---

## Fase 11: Documentação

### Objetivo
Documentar o módulo para uso futuro.

### Tarefas

#### 11.1 Criar README do Módulo
- **Arquivo**: `src/backend/modules/industrial/README.md`
- **Conteúdo**: Descrição, uso, exemplos
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: README criado

#### 11.2 Atualizar Documentação Principal
- **Arquivo**: `docs/industrial-foundation/03-implementacao.md`
- **Conteúdo**: Guia de implementação e uso
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Documentação atualizada

---

## Fase 12: Deploy

### Objetivo
Deploy do módulo para produção.

### Tarefas

#### 12.1 Merge para Main
- **Comando**: `git checkout main && git merge feature/industrial-foundation-v1`
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Merge realizado sem conflitos

#### 12.2 Aplicar Migration em Produção
- **Comando**: `supabase db push --remote`
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Migration aplicada em produção

#### 12.3 Deploy Frontend
- **Comando**: `npm run build && deploy`
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Frontend deployado

#### 12.4 Verificação Pós-Deploy
- **Ação**: Verificar funcionamento em produção
- **Responsável**: Desenvolvedor
- **Critério de Aceitação**: Módulo funcionando em produção

---

## Estimativa de Tempo

| Fase | Tarefas | Estimativa |
|------|---------|------------|
| Fase 1: Preparação | 3 tarefas | 2 horas |
| Fase 2: Repositories | 11 tarefas | 8 horas |
| Fase 3: DTOs | 11 tarefas | 6 horas |
| Fase 4: Services | 11 tarefas | 10 horas |
| Fase 5: API | 2 tarefas | 4 horas |
| Fase 6: Navegação/Permissões | 4 tarefas | 2 horas |
| Fase 7: Components | 12 tarefas | 12 horas |
| Fase 8: Rotas | 17 tarefas | 16 horas |
| Fase 9: Hooks | 11 tarefas | 6 horas |
| Fase 10: Testes | 5 tarefas | 4 horas |
| Fase 11: Documentação | 2 tarefas | 2 horas |
| Fase 12: Deploy | 4 tarefas | 2 horas |
| **Total** | **93 tarefas** | **76 horas** |

---

## Riscos e Mitigações

### Risco 1: Conflito com Módulos Existentes
- **Probabilidade**: Baixa
- **Impacto**: Médio
- **Mitigação**: Testar integração em ambiente de staging antes de produção

### Risco 2: Performance do Banco de Dados
- **Probabilidade**: Média
- **Impacto**: Médio
- **Mitigação**: Criar índices apropriados, monitorar queries

### Risco 3: Complexidade do BOM
- **Probabilidade**: Média
- **Impacto**: Alto
- **Mitigação**: Implementar BOM com recursão limitada, testar com dados reais

### Risco 4: Permissões Incorretas
- **Probabilidade**: Baixa
- **Impacto**: Alto
- **Mitigação**: Testar permissões com diferentes roles antes de deploy

---

## Critérios de Sucesso

- [ ] Migration aplicada sem erros
- [ ] Todas as repositories criadas e testadas
- [ ] Todas as DTOs criadas com validação Zod
- [ ] Todas as services criadas com business logic
- [ ] API functions criadas e testadas
- [ ] Permissões configuradas corretamente
- [ ] Navegação integrada ao menu
- [ ] Componentes criados seguindo padrões
- [ ] Rotas criadas e funcionando
- [ ] Hooks customizados criados
- [ ] Testes passando
- [ ] Documentação completa
- [ ] Deploy realizado com sucesso
- [ ] Módulo funcionando em produção

---

## Próximos Passos

Após aprovação desta proposta e plano de ação:

1. Iniciar Fase 1: Preparação e Setup
2. Criar feature branch
3. Implementar seguindo as fases sequencialmente
4. Testar em cada fase
5. Documentar progresso
6. Deploy para produção
