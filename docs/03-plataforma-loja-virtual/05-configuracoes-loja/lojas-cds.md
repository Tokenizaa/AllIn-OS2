# Configurações — Lojas/CDs (Loja Virtual)

> **Tela principal:** Cadastro e gestão das lojas/CDs — criação de CD, dados da loja, SEO, logotipo, e acesso do admin a qualquer loja/CD.
>
> **URL real:** `https://allinbrasil.com.br/loja/admin/setting/store`
> **Acesso:** Menu **Configurações ▸ Lojas/CDs**
> **Fonte:** Treinamento Aula 3 + Aula 4

---

## Visão Geral

**Lojas/CDs** gerencia cada unidade de venda:

| Tipo | O que é | Exemplo |
|------|---------|---------|
| **Loja Padrão (Matriz)** | E-commerce principal da indústria | allinbrasil.com.br |
| **CD** | Centro de Distribuição / filial | CD Cuiabá, CD Goiânia |
| **Loja Física** | Ponto de retirada | Loja Shopping X |

Cada loja/CD tem: **nome, proprietário, endereço, contato, SEO, logotipo, status** — e usuários vinculados.

---

## Criar Novo CD (Formulário Completo)

> **Aula 3:** *"Aqui, então, onde eu crio CDs... CD Goiânia... para eu criar um novo CD, clico aqui em adicionar, coloca o nome dele... nome do proprietário, tipo de pessoa se é física ou jurídica, o documento... endereço, país, estado... cidade... telefone, e-mail... se tá habilitado... a loja, que é o meta título, é o que vai aparecer quando ele for comprar na loja... Metatag descrição, metatag palavras-chave... é o logotipo do CD."*

### Campos do Formulário

| Seção | Campo | Obrig. | Observação |
|-------|-------|--------|-----------|
| **Identificação** | Nome do CD | ✅ | Ex: "CD Cuiabá" |
| | Proprietário | ✅ | Nome do dono |
| | Tipo de Pessoa | ✅ | Física / Jurídica |
| | Documento | ✅ | CPF / CNPJ do proprietário |
| **Endereço** | País / Estado / Cidade | ✅ | Região do CD |
| | Endereço / CEP | ✅ | Localização |
| **Contato** | Telefone | ✅ | Ex: +55 XX XXXXX-XXXX |
| | E-mail | ✅ | cd.cuiaba@empresa.com.br |
| **Loja (SEO)** | **Meta Título** | ✅ | ⭐ **Nome exibido no checkout** — é o que o distribuidor vê |
| | Meta Descrição | ✅ | Descrição p/ SEO |
| | Meta Palavras-chave | ❌ | Termos de busca |
| | Logotipo | ❌ | Logo do CD (upload) |
| **Status** | Habilitado | ✅ | Ativo/Inativo |

> **Aula 3:** *"O que eu colocar aqui [meta título] é o que vai aparecer lá [no checkout]... 'CD Cuiabá', OK?"* — O meta título da loja = nome visível ao comprar.

---

## Pós-Criação: Usuário do CD

> **Aula 3:** *"Quando eu crio o CD Cuiabá, eu preciso criar um usuário, né, pro dono do CD conseguir logar na plataforma... clica aqui, ó, usuários... Vou criar... o nome de usuário como CD Cuiabá... o e-mail dela, a foto, a senha... se tá habilitado... E importantíssimo, qual loja ele vai administrar... ele vai administrar o CD de Cuiabá... Agora ele consegue logar... seu domínio/loja/admin... abre a tela de login... URL de acesso ao gerenciador dos CDs."*

**Tela:** Configurações ▸ Usuário (`/user/user`)

```
1. [+ Adicionar]
2. Nome de Usuário / Nome Completo / E-mail / Foto / Senha
3. Habilitado: Sim
4. ⭐ Loja que administra: CD Cuiabá  ← OBRIGATÓRIO
5. [Salvar]
→ Gerente do CD loga em: {dominio}/loja/admin
```

---

## Acesso do Admin a Qualquer Loja/CD

> **Aula 4:** *"Na administração, se o senhor clicar aqui, ó, Loja Virtual... o senhor consegue logar em qualquer loja de qualquer CD... como gestor da empresa consegue também logar nas plataformas de gerenciamento dos CDs."*

**Caminho:** Admin Maxnível ▸ **Loja Virtual** (`/administracao/LinkExterno/LojaVirtual/administrar`)

- Gera token → abre dashboard da loja/CD selecionado
- Admin master opera qualquer unidade sem credenciais do CD

---

## Regras de Negócio

| Regra | Detalhe |
|-------|---------|
| **Meta título = nome visível** | O que o distribuidor vê no checkout é o meta título |
| **Usuário precisa loja vinculada** | Sem vínculo, não acessa o CD correto |
| **CD ≠ Distribuidor** | Cadastros independentes (CD PJ, Dist PF) |
| **Habilitado = visível** | CD inativo não aparece no checkout |
| **Admin master acessa todos** | Via Loja Virtual na Admin Maxnível |

---

## Troubleshooting

| Sintoma | Causa | Solução |
|---------|-------|---------|
| Usuário não acessa o CD | Loja não vinculada ao usuário | Editar usuário → marcar CD |
| Nome errado no checkout | Meta título errado | Editar loja → corrigir meta título |
| CD não aparece p/ comprar | CD desabilitado | Habilitar loja |
| Login CD falha | Token inválido / sessão expirada | Re-logar ou usar acesso via Admin |

---

## URLs Relacionadas

| Ação | URL |
|------|-----|
| Lojas/CDs | `/setting/store` |
| Usuários | `/user/user` |
| Grupos de Usuários | `/user/user_permission` |
| Habilitar Produtos Lojas (Maxnível) | `/administracao/Loja/HabilitarProdutosLoja/principal` |
| Loja Virtual (admin → qualquer loja) | `/administracao/LinkExterno/LojaVirtual/administrar` |

---

## Links Relacionados

- Guia rápido criar CD: [`../../05-guias-rapidos/criar-cd-passo-a-passo.md`](../../05-guias-rapidos/criar-cd-passo-a-passo.md)
- Acesso CD: [`../../04-plataforma-cd/01-acesso-configuracao-inicial.md`](../../04-plataforma-cd/01-acesso-configuracao-inicial.md)
- Usuários e permissões: [`usuarios-grupos.md`](usuarios-grupos.md)

---

*Última atualização: 2025-08-11 | Baseado em Aula 3 + Aula 4 + validação plataforma live*