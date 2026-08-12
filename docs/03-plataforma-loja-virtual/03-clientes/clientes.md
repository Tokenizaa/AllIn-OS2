# Clientes — Cadastros, Formulários Customizados e IPs Banidos

> **Tela principal:** Base de compradores da loja (cliente final, distribuidor, CD) + personalização do formulário de cadastro + blacklist de IPs.
>
> **URLs reais:**
> - Clientes: `https://allinbrasil.com.br/loja/admin/sale/customer`
> - Personalizar Cadastro: `https://allinbrasil.com.br/loja/admin/sale/custom_field`
> - IPs Banidos: `https://allinbrasil.com.br/loja/admin/sale/customer_ban_ip`
>
> **Acesso:** Menu lateral **Vendas ▸ Clientes** | **Clientes ▸ Personalizar Cadastro** | **IPs Banidos**
> **Fonte:** Treinamento Aula 3

---

## Visão Geral

### 1. Clientes

> **Aula 3:** *"Clientes aqui nada mais é do que um cadastro de todos os clientes que compram na loja. Pode ser cliente final, distribuidor e o CD também quando ele compra na loja. Todos os cadastros de compradores da loja são espelhados aqui."*

| Tipo de comprador | Aparece em Clientes? |
|-------------------|----------------------|
| Cliente final (B2C) | ✅ |
| Distribuidor (compra na loja) | ✅ |
| CD (compra da indústria) | ✅ |

**Colunas típicas da listagem:**

| Coluna | Descrição |
|--------|-----------|
| ID | Identificador |
| Nome | Nome do comprador |
| E-mail | Contato |
| Grupo | Cliente final / Distribuidor / CD |
| Status | Ativo / Inativo |
| Data Cadastro | Quando entrou |
| Ações | Ver | Editar | Histórico de pedidos |

**Funcionalidades:**
- Consultar pedidos de um cliente específico
- Editar dados cadastrais
- Ativar/desativar acesso
- Histórico completo de compras

---

### 2. Personalizar Cadastro (Campos Customizados)

> **Aula 3:** *"Quando o cliente final vai comprar na loja, vai preencher 'Minha Conta' cadastros... Se você quiser criar um novo campo, tem como... Quero exigir o nome da mãe dele... adicionar... nome da mãe, marco que é para cliente final, se é obrigatório... habilito e salvo. Se eu salvar, agora eu vou exigir no formulário o nome da mãe da pessoa também."*

**URL:** `/sale/custom_field`

### Estrutura do Formulário de Cadastro (padrão)

| Campo | Edição pelo cliente | Observação |
|-------|--------------------|-----------|
| Nome | ✅ | — |
| E-mail | ✅ | — |
| Data de Nascimento | ✅ | — |
| Sexo | ✅ | — |
| Dependentes | ✅ | — |
| Website | ✅ | — |
| Tipo de Pessoa (PF/PJ) | ❌ | Imutável após cadastro |
| RG | ❌ | Imutável |
| CPF | ❌ | Imutável |

### Criar Novo Campo (Exemplo: Nome da Mãe)

```
1. Clientes ▸ Personalizar Cadastro ▸ [+ Adicionar]
2. Nome do Campo: "Nome da Mãe"
3. Tipo: Texto (ou conforme necessidade)
4. Localização no formulário: posição/ordem
5. Grupo alvo: ✅ Cliente Final (ou Distribuidor / CD)
6. Obrigatório: Sim ✅
7. Habilitado: Sim ✅
8. [Salvar]
9. → Campo aparece no formulário "Minha Conta" da loja
```

> **Uso prático:** Coleta de dado extra para segurança (nome da mãe), cadastro de dependentes, segmentação, requisitos legais.

---

### 3. IPs Banidos (Blacklist)

> **Aula 3:** *"IPs banidos permite você criar uma blacklist de IPs que você quer bloquear... Por exemplo, 192.168.1.1... Vamos supor que esse é o IP da máquina de uma pessoa que tá agindo de má-fé, fazendo algum tipo de denegrir [ações maliciosas]... Se você salvar, o IP dela fica banido."*

**URL:** `/sale/customer_ban_ip`

```
1. Clientes ▸ IPs Banidos
2. [+ Adicionar]
3. Informar o IP (ex: 192.168.1.1)
4. [Salvar] → IP bloqueado
```

| Funcionalidade | Descrição |
|----------------|-----------|
| **Bloquear acesso** | IP banido não consegue comprar/acessar |
| **Uso típico** | Fraude, ataques, bots, tentativas de cadastro em massa |
| **Remoção** | Excluir IP da lista para desbloquear |

> ⚠️ **Cuidado:** IPs dinâmicos (residenciais) podem mudar — banir IP errado pode atingir clientes legítimos. Use com critério.

---

## Regras de Negócio

| Regra | Detalhe |
|-------|---------|
| **Clientes espelhados** | Compradores = clientes da loja (final, dist, CD) |
| **Campos customizados por grupo** | Pode direcionar campo para cliente final/distribuidor/CD |
| **Campo obrigatório bloqueia cadastro** | Se obrigatório e não preenchido, formulário não salva |
| **CPF/RG imutáveis** | Não editáveis pelo cliente após cadastro |
| **IP banido bloqueia acesso** | Compra e cadastro impedidos |

---

## URLs Relacionadas

| Ação | URL |
|------|-----|
| Clientes | `/sale/customer` |
| Editar cliente | `/sale/customer/edit&customer_id={id}` |
| Personalizar Cadastro | `/sale/custom_field` |
| IPs Banidos | `/sale/customer_ban_ip` |
| Relatório Clientes × Pedidos | `/report/customer_order` |

---

## Links Relacionados

- Pedidos (compras do cliente): [`../02-vendas/pedidos.md`](../02-vendas/pedidos.md)
- Formulário de cadastro do distribuidor (Maxnível): [`../../02-plataforma-maxnivel/06-configuracoes-sistema/formularios-cadastro.md`](../../02-plataforma-maxnivel/06-configuracoes-sistema/formularios-cadastro.md) ⏳

---

*Última atualização: 2025-08-11 | Baseado em Aula 3 + validação plataforma live*