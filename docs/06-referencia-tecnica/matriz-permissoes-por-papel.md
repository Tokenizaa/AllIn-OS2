# Referência Técnica — Matriz de Permissões por Papel

> **Finalidade:** Quem pode fazer o quê nas 3 plataformas — matriz consolidada para auditoria, onboarding e configuração de grupos.

---

## Papéis (11 — Tipos de Acesso)

| Papel | Plataformas |
|-------|-------------|
| **Admin Master** | Maxnível + todas lojas/CDs |
| **Gestão Admin** | Maxnível |
| **Financeiro** | Maxnível + Loja (financeiro) |
| **Suporte** | Maxnível (leitura/diagnóstico) |
| **Logística** | Maxnível (estoque) |
| **Operador Catálogo** | Loja (catálogo) |
| **Gerente CD** | Loja (próprio CD) |
| **Atendente Balcão** | Loja (próprio CD — pedidos) |
| **Distribuidor** | Escritório virtual (público) |
| **Afiliado** | Escritório virtual (público) |
| **Cliente Final** | Loja pública |

---

## Matriz por Módulo

### Administração Maxnível

| Ação | Admin Master | Gestão | Financeiro | Suporte | Logística |
|------|:---:|:---:|:---:|:---:|:---:|
| Acessar A Rede | ✅ | ✅ | ✅ Leitura | ✅ Leitura | ❌ |
| Login no escritório virtual | ✅ | ✅ | ❌ | ✅ (diag.) | ❌ |
| Validar documentos | ✅ | ✅ | ✅ | ✅ | ❌ |
| Excluir/reverter cadastro | ✅ | ✅ | ❌ | ❌ | ❌ |
| Alterar patrocinador | ✅ | ✅ | ❌ | ❌ | ❌ |
| Criar/editar planos | ✅ | ✅ | ❌ | ❌ | ❌ |
| Configurar qualificações | ✅ | ✅ | ❌ | ❌ | ❌ |
| Configurar bônus | ✅ | ✅ Leit. | ✅ Leit. | ❌ | ❌ |
| Aprovar saque | ✅ | ✅ | ✅ | ❌ | ❌ |
| Movimentar saldo | ✅ | ✅ | ✅ | ❌ | ❌ |
| Movimentar estoque | ✅ | ✅ | ✅ | ❌ | ✅ |
| Criar pedido admin | ✅ | ✅ | ✅ | ❌ | ❌ |
| Ativação mensal | ✅ | ✅ | ✅ | ❌ | ❌ |
| Configurar módulos/sistema | ✅ | ✅ | ❌ | ❌ | ❌ |
| Relatórios executivos | ✅ | ✅ | ✅ | ✅ | ❌ |

### Loja Virtual (E-commerce)

| Ação | Admin Loja | Op. Catálogo | Financeiro Loja | Gerente CD | Atendente CD |
|------|:---:|:---:|:---:|:---:|:---:|
| Catálogo: produtos/categorias | ✅ | ✅ | ❌ | ❌ | ❌ |
| Catálogo: kits/atributos/opções | ✅ | ✅ | ❌ | ❌ | ❌ |
| Estoque (movimentação) | ✅ | ✅ | ❌ | ❌ | ❌ |
| Pedidos: ver tudo | ✅ | ❌ | ✅ | ✅ (próprios) | ✅ (próprios) |
| Pedidos: baixa/status | ✅ | ❌ | ✅ | ✅ (próprios) | ✅ (próprios) |
| Devoluções | ✅ | ❌ | ✅ | ❌ | ❌ |
| Clientes | ✅ | ❌ | ✅ | ✅ (próprios) | ❌ |
| Personalizar cadastro / IPs | ✅ | ❌ | ❌ | ❌ | ❌ |
| Financeiro: transações/caixa | ✅ | ❌ | ✅ | ✅ (próprio) | ❌ |
| Solicitar saque CD | ✅ | ❌ | ✅ | ✅ (próprio) | ❌ |
| Configurar fretes/pagamentos | ✅ | ❌ | ❌ | ❌ | ❌ |
| Usuários/grupos loja | ✅ | ❌ | ❌ | ✅ (próprio CD) | ❌ |
| Relatórios loja | ✅ | ✅ (catálogo) | ✅ | ✅ (próprio) | ❌ |

### Centro de Distribuição (CD)

| Ação | Gerente CD | Atendente CD |
|------|:---:|:---:|
| Ver produtos do CD | ✅ | ✅ |
| Comprar produtos da indústria | ✅ | ❌ |
| Ver pedidos do CD | ✅ | ✅ |
| Registrar pagamento balcão | ✅ | ✅ |
| Registrar entrega/histórico | ✅ | ✅ |
| Ver saldo/transações CD | ✅ | ❌ |
| Solicitar saque CD | ✅ | ❌ |
| Criar usuários do CD | ✅ | ❌ |
| Ver relatórios CD | ✅ | ❌ |

---

## Regras de Configuração

| Plataforma | Como configura | URL |
|-----------|----------------|-----|
| Maxnível (admin geral) | Configurações ▸ Permissão | `/Autorizacao/Grupos` |
| Loja/CD | Configurações ▸ Grupos de Usuários | `/user/user_permission` |

---

## Links Relacionados

- Permissões Loja: [`../03-plataforma-loja-virtual/05-configuracoes-loja/usuarios-grupos.md`](../03-plataforma-loja-virtual/05-configuracoes-loja/usuarios-grupos.md)
- Arquitetura/papéis: [`../01-visao-geral/arquitetura-sistema.md`](../01-visao-geral/arquitetura-sistema.md)

---

*Última atualização: 2025-08-11 | Consolidado de todas as aulas + plataforma live*