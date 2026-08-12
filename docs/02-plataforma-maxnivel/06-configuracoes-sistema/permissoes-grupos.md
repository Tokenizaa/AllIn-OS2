# Configurações — Permissões e Grupos (Maxnível)

> **Tela principal:** Grupos de permissão da Administração — o que cada perfil admin pode acessar.
>
> **URL real:** `https://allinbrasil.com.br/administracao/Autorizacao/Grupos`
> **Acesso:** Menu **Configurações ▸ Permissão**
> **Fonte:** Validação plataforma live + Aulas 2-4

---

## Visão Geral

A **Permissão** da Maxnível controla acesso dos usuários admin aos módulos do sistema (diferente dos grupos da Loja — ver `usuarios-grupos.md`).

```
┌────────────────────────────────────────────────────────────────┐
│ GRUPO DE PERMISSÃO (Maxnível)        USUÁRIO ADMIN            │
│ ┌──────────────────────────┐         ┌──────────────────────┐  │
│ │ Financeiro               │         │ Maria (Financeiro)   │  │
│ │ → Relatórios: ✅         │────────▶│ Grupo: Financeiro    │  │
│ │ → Configurações: ❌      │         │ Email: maria@...     │  │
│ └──────────────────────────┘         └──────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

---

## Grupos Típicos

| Grupo | Acessos típicos |
|-------|-----------------|
| **Administrador Geral** | Total (todos os módulos) |
| **Financeiro** | Relatórios financeiros, saques, contas — sem configuração |
| **Suporte** | Distribuidores (leitura), verificação docs, sem financeiro |
| **Logística** | Estoque, relatórios de estoque |
| **Operador de Catálogo** | Planos, produtos, catálogo |

> **Configuração granular:** Marcar/desmarcar módulos por grupo (`/Autorizacao/Grupos` → editar).

---

## Grupos de Consumo

**URL:** `/Autorizacao/GruposConsumo`

- Classificação de consumidores (cliente final, distribuidor, CD)
- Usado em: regras de desconto, promoções, liberação de produto

---

## Regras de Negócio

| Regra | Detalhe |
|-------|---------|
| **Menor privilégio** | Conceder apenas o necessário por grupo |
| **Financeiro isolado** | Operadores não devem ver financeiro |
| **Auditoria** | Ações de admin logadas (quem/IP) |
| **Revisão periódica** | Auditar grupos quando mudar time |

---

## URLs Relacionadas

| Ação | URL |
|------|-----|
| Permissões (grupos) | `/Autorizacao/Grupos` |
| Grupos de Consumo | `/Autorizacao/GruposConsumo` |
| Administradores | `/Administrador/AdministradoresCadastros/listar` |
| Meus Dados (admin) | `/Administrador/AdministradoresEditarDados/formulario` |
| Menus | `/Menu/Arvore` |

---

## Links Relacionados

- Permissões da Loja: [`../../03-plataforma-loja-virtual/05-configuracoes-loja/usuarios-grupos.md`](../../03-plataforma-loja-virtual/05-configuracoes-loja/usuarios-grupos.md)
- Matriz completa: [`../../06-referencia-tecnica/matriz-permissoes-por-papel.md`](../../06-referencia-tecnica/matriz-permissoes-por-papel.md)

---

*Última atualização: 2025-08-11 | Validação plataforma live*