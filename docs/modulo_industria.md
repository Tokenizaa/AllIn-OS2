Com base na auditoria concluída, iniciar a evolução do módulo Industrial existente para se tornar a fundação do ERP Industrial da fábrica de colchões.

IMPORTANTE:

NÃO criar um novo módulo.

NÃO criar uma nova arquitetura.

NÃO duplicar entidades existentes.

NÃO criar sistemas paralelos.

Todo desenvolvimento deve ocorrer SOBRE a estrutura industrial já existente.

---

# CONTEXTO

A auditoria confirmou que já existem:

* Schema industrial
* Tabelas industriais
* Services
* Repositories
* DTOs
* APIs
* Estrutura modular

Portanto a próxima etapa não é auditoria.

É evolução controlada.

---

# OBJETIVO DA FASE ATUAL

Transformar o módulo Industrial existente em uma plataforma capaz de realizar o levantamento operacional completo da fábrica de colchões.

O foco NÃO é PCP.

O foco NÃO é MRP.

O foco NÃO é Ordem de Produção.

Ainda não.

Primeiro precisamos estruturar o conhecimento operacional da fábrica.

---

# ETAPA 1 — VALIDAR O MODELO EXISTENTE

Para cada entidade existente:

* machines
* materials
* suppliers
* processes
* timing_records
* capacity
* tools
* locations
* products_industrial
* components
* bom

Responder:

1. O modelo atende a uma fábrica real de colchões?
2. Quais campos estão faltando?
3. Quais relacionamentos estão faltando?
4. Quais ajustes são necessários?

Gerar migrations apenas para complementar o modelo existente.

Nunca substituir.

---

# ETAPA 2 — EXPANDIR O CADASTRO DE MÁQUINAS

Adicionar suporte para:

* capacidade teórica
* capacidade operacional
* disponibilidade
* manutenção preventiva
* manutenção corretiva
* fabricante
* manuais
* fotos
* vida útil

Objetivo:

Permitir cálculo futuro de capacidade produtiva.

---

# ETAPA 3 — EXPANDIR PROCESSOS

O sistema deve conseguir modelar:

Recebimento
Corte
Montagem
Costura
Fechamento
Embalagem
Expedição

Cada processo deve permitir:

* entradas
* saídas
* máquinas utilizadas
* operadores
* tempo médio
* capacidade
* perdas

---

# ETAPA 4 — CRONOMETRAGEM REAL

Expandir timing_records para permitir:

* estudo de tempos
* múltiplas medições
* operador
* máquina
* processo
* observações

Objetivo:

Descobrir tempos reais da fábrica.

---

# ETAPA 5 — CAPACIDADE PRODUTIVA

Transformar a entidade capacity em um módulo funcional.

Permitir:

* capacidade por máquina
* capacidade por processo
* capacidade por setor
* capacidade diária
* capacidade mensal

Objetivo:

Descobrir quanto a fábrica realmente consegue produzir.

---

# ETAPA 6 — PRODUTOS INDUSTRIAIS

Adaptar products_industrial para colchões.

Suportar:

* categoria
* dimensões
* densidade
* composição
* linha
* coleção
* observações técnicas

---

# ETAPA 7 — BOM INDUSTRIAL

Expandir BOM para suportar:

* consumo por unidade
* perdas previstas
* revisão
* versão
* vigência

Preparar para futura implementação de PCP e MRP.

---

# ETAPA 8 — DASHBOARD INDUSTRIAL

Criar dashboard executivo com:

* máquinas cadastradas
* materiais cadastrados
* fornecedores cadastrados
* processos mapeados
* tempos registrados
* capacidade levantada

Objetivo:

Acompanhar a evolução do levantamento industrial.

---

# ETAPA 9 — INDUSTRIAL 360

Criar uma visão consolidada.

Exemplo:

Máquina 360

* informações gerais
* documentos
* processos relacionados
* capacidade
* histórico

Fornecedor 360

Material 360

Processo 360

Produto Industrial 360

Seguir padrão Customer360 já existente.

---

# REGRAS

* Reutilizar componentes existentes.
* Reutilizar padrões existentes.
* Reutilizar services existentes.
* Reutilizar repositories existentes.
* Reutilizar permissões existentes.

Não criar arquitetura paralela.

Não criar abstrações desnecessárias.

Não implementar PCP ainda.

Não implementar MRP ainda.

Não implementar Ordem de Produção ainda.

Primeiro consolidar a fundação industrial.

---

# RESULTADO ESPERADO

Ao final desta fase devemos possuir uma representação digital completa da fábrica:

✅ Máquinas

✅ Materiais

✅ Fornecedores

✅ Processos

✅ Tempos

✅ Capacidade

✅ Produtos Industriais

✅ BOM

Tudo preparado para a próxima fase:

PCP + MRP + Produção.