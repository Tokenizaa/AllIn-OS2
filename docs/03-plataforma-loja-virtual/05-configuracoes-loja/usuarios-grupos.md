# Configurações — Usuários e Grupos de Permissão (Loja Virtual)

> **Tela principal:** Gestão de usuários da plataforma de loja/CD e grupos de permissão (o que cada usuário pode fazer).
>
> **URLs reais:**
> - Usuários: `https://allinbrasil.com.br/loja/admin/user/user`
> - Grupos: `https://allinbrasil.com.br/loja/admin/user/user_permission`
>
> **Acesso:** Menu **Configurações ▸ Usuário** | **Grupos de Usuários**
> **Fonte:** Treinamento Aula 3

---

## Visão Geral

O sistema de usuários da Loja Virtual é **baseado em grupos de permissão**:

```
┌────────────────────────────────────────────────────────────────┐
│ GRUPO (permissões)         USUÁRIO (vinculado a grupo)        │
│ ┌─────────────────────┐    ┌──────────────────────────────┐   │
│ │ Administrador       │    │ Nome: João (Admin Loja)      │   │
│ │ Catálogo            │    │ Grupo: Administrador Catálogo│   │
│ │ Financeiro          │    │ Loja: Loja Padrão            │   │
│ │ Suporte             │    │ Status: Ativo                │   │
│ └─────────────────────┘    └──────────────────────────────┘   │
│              ▲ 1:N           ▲                                 │
└──────────────┴───────────────┴─────────────────────────────────┘
```

---

## Grupos de Usuários (Permissões)

> **Aula 3:** *"Grupo de usuários... seria eu criar grupos de usuários exclusivos pra plataforma de gerenciamento da loja... Suponha que eu contratei um profissional e ele vai tomar conta de toda a gestão da loja sem ter acesso à parte de administração do CD... Quero criar um usuário para a equipe de marketing digital: ela consegue cadastrar produtos, categorias, mas não vai conseguir dar baixa em pedido, não vai ver o financeiro."*

### Criar Grupo (Exemplo: Administrador de Catálogo)

```
1. Configurações ▸ Grupos de Usuários ▸ [+ Adicionar]
2. Nome: "Administrador de Catálogo"
3. Permissões (checkboxes por módulo):
   ▸ Catálogo: ✅ Atributos | ✅ Categorias | ✅ Opções | ✅ Planos | ✅ Produtos
   ▸ Vendas/Pedidos: ❌ (não gerencia pedidos)
   ▸ Financeiro: ❌ (não vê financeiro)
4. [Salvar]
```

### Matriz de Permissões (por módulo)

| Módulo | Admin Loja | Admin Catálogo | Financeiro | Suporte |
|--------|-----------|----------------|------------|---------|
| Catálogo (produtos, categorias, atributos) | ✅ | ✅ | ❌ | ❌ |
| Vendas/Pedidos | ✅ | ❌ | ✅ | ✅ (leitura) |
| Clientes | ✅ | ❌ | ✅ | ✅ |
| Financeiro (transações, saques) | ✅ | ❌ | ✅ | ❌ |
| Configurações | ✅ | ❌ | ❌ | ❌ |
| Relatórios | ✅ | ❌ | ✅ | ✅ |

> **Flexibilidade:** Cada grupo pode combinar permissões módulo a módulo — não existe obrigatoriedade de seguir a matriz acima; ela é apenas um exemplo.

---

## Usuários

> **Aula 3:** *"Vou criar aqui um usuário... o nome de usuário... o nome do dono ou do usuário que vai gerenciar... o e-mail, a foto, a senha... se esse usuário tá habilitado ou não... E importantíssimo, qual loja ele vai administrar."*

### Criar Usuário

```
1. Configurações ▸ Usuário ▸ [+ Adicionar]
2. Nome de Usuário: (login)
3. Nome Completo
4. E-mail
5. Foto (opcional)
6. Senha
7. Habilitado: Sim
8. Grupo de Permissão: (ex: Administrador de Catálogo)
9. ⭐ Loja que administra: (Loja Padrão / CD Cuiabá / ...)
10. [Salvar]
```

### Campos-Chave

| Campo | Importância |
|-------|-------------|
| **Grupo de Permissão** | Define o que o usuário PODE fazer |
| **Loja** | Define QUAL unidade ele opera (padrão ou CD específico) |
| **Habilitado** | Bloqueio de acesso sem apagar |

---

## Regras de Negócio

| Regra | Detalhe |
|-------|---------|
| **Permissão por grupo, não por usuário** | Mudar grupo = mudar acesso de vários de uma vez |
| **Loja vinculada** | Usuário só opera a loja/CD configurado |
| **Financeiro protegido** | Configurar para não vazar financeiro a operadores |
| **Baixa em pedido ≠ operador** | Pedido/financeiro separados por permissão |

---

## URLs Relacionadas

| Ação | URL |
|------|-----|
| Usuários | `/user/user` |
| Grupos de Usuários | `/user/user_permission` |
| Lojas/CDs | `/setting/store` |

---

## Links Relacionados

- Lojas/CDs: [`lojas-cds.md`](lojas-cds.md)
- Criar CD (usuário do CD): [`../../05-guias-rapidos/criar-cd-passo-a-passo.md`](../../05-guias-rapidos/criar-cd-passo-a-passo.md)
- Permissões Maxnível (admin geral): [`../../02-plataforma-maxnivel/06-configuracoes-sistema/permissoes-grupos.md`](../../02-plataforma-maxnivel/06-configuracoes-sistema/permissoes-grupos.md) ⏳

---

*Última atualização: 2025-08-11 | Baseado em Aula 3 + validação plataforma live*