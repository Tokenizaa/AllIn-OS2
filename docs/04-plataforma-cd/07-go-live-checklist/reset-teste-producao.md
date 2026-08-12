# Reset, Modo Teste e Produção — Regras Críticas de Go-Live

> **Plataforma:** Todas (Maxnível + Loja Virtual + CD)
> **Fonte:** Treinamento Aula 4 (segmentos finais)

---

## 1. Modo Teste — Prazo de 1 Mês

> **Aula 4:** *"O sistema hoje ele tá em modo teste... O senhor tem até o prazo de no máximo um mês para testar o sistema. Se o senhor não solicitar o reset nesse prazo de um mês, ele reseta automático."*

| Item | Regra |
|------|-------|
| **Duração** | Máximo **1 mês** (30 dias) |
| **O que acontece** | Se não houver solicitação no prazo, **reset automático** |
| **Dados criados no teste** | **Apagados** no reset (cadastros, pedidos, produtos de teste...) |
| **Configurações** | **MANTIDAS** (ver regra abaixo — crítica!) |

---

## 2. O que o Reset Apaga vs O que Mantém

> **Aula 4:** *"O reset ele não apaga a configuração, né? Ele vai apagar todos os dados de teste que a gente criou... Se o senhor for lá e fizer umas alterações de configuração, depois que reseta, não volta ao padrão anterior, ele vai prevalecer."*

| ✅ **MANTÉM (Configuração)** | ❌ **APAGA (Dados de Teste)** |
|------------------------------|------------------------------|
| Percentuais e regras de bônus | Distribuidores / cadastros |
| Regras de saque | Pedidos e histórico |
| Regras de desconto | Produtos criados no teste |
| Formas de pagamento configuradas | Estoque de teste |
| Formas de frete configuradas | Comissões geradas |
| Layouts / banners / conteúdo | Clientes da loja |
| Usuários admin (depende — validar) | Contas bancárias de teste |

> ⚠️ **Implicação:** Toda configuração que você mexer durante o teste **PERMANECE em produção**. O reset NÃO devolve o sistema ao "padrão de fábrica". Use o período de teste para configurar corretamente — o que ficar, fica.

---

## 3. Como Solicitar o Reset

> **Aula 4:** *"O reset ele tem que ser solicitado exclusivamente via essa plataforma aqui, ó, que é o painel do suporte ao cliente. Ele é feito de segunda a sexta-feira em horário comercial e ele deve ser solicitado com 24 horas de antecedência da data que o senhor quer o reset."*

| Regra | Valor |
|-------|-------|
| **Canal** | **Exclusivo:** Painel de Suporte ao Cliente (chamado) |
| **Dias** | Segunda a sexta (horário comercial) |
| **Antecedência** | Mínimo **24 horas** antes da data desejada |

```
1. Acesse o Painel de Suporte (logado como cliente da plataforma)
2. Abra um chamado: "Solicitar Reset do Sistema"
3. Descreva a data desejada do reset
4. Aguarde confirmação da equipe
```

---

## 4. Pós-Reset: Reativar o Cadastro #1 (OBRIGATÓRIO!)

> **Aula 4:** *"Uma coisa importantíssima que você vai ter que fazer é comprar um plano de adesão pro cadastro número um da rede. Hoje ele tá alocado... Quando resetar, ele não vai tá alocado, ele vai tá em pendentes ou excluídos. Se ele tiver excluído, você reverte o cadastro dele, ele vai voltar a ser pendente. Aí você tem que comprar um plano de adesão... aloca ele na rede... clica aqui e compra o kit inicial para ele... Alocou ele na rede, aí depois que alocou que você vai conseguir começar os seus cadastros. **Sem fazer isso não tem como.**"

### Passo a Passo Obrigatório

```
1. Após o reset, acesse: Distribuidores ▸ Pendentes
   URL: /Distribuidor/DistribuidoresCadastroPendente/listar
2. Localize o cadastro #1 (primeiro distribuidor / dono da empresa)
   - Se estiver em "Excluídos": reverta → volta para "Pendente"
3. No cadastro pendente, aloque na rede comprando o KIT INICIAL:
   - Clique em comprar/adicionar kit de adesão
   - Forma de pagamento: "Retirar na Loja" (cadastro da própria empresa)
   - Confirme/dê baixa
4. Sistema aloca o cadastro #1 na rede
5. SÓ ENTÃO os próximos cadastros podem ser alocados
```

> ⚠️ **Consequência de pular este passo:** Nenhum novo distribuidor consegue ser alocado na rede — fila de pendentes trava.

---

## 5. Checklist Pré-Produção (Antes de Sair do Teste)

> **Aula 4:** *"O ideal é que o senhor conheça o sistema, faça testes, cadastro, ver o comportamento... Lembrando que antes de colocar o sistema em modo produção, tem que definir, configurar as formas de frete lá, conferir os dados do frete e das formas de pagamento... Tem que ter uma forma de pagamento configurada bonitinho — Pague Seguro, boleto se o senhor for liberar — porque senão as pessoas não vão conseguir pagar."*

| # | Item | Onde | Status |
|---|------|------|--------|
| 1 | Formas de pagamento configuradas e testadas | `/extension/payment` | ☐ |
| 2 | PagSeguro: token + e-mail válidos (conta PJ) | `/extension/payment` (pagseguro) | ☐ |
| 3 | Boleto BB: módulo instalado + API autorizada + dados bancários | `/extension/payment` (boleto registrado) | ☐ |
| 4 | Fretes: Correios / Transportadora / Retirada na Loja | `/extension/shipping` | ☐ |
| 5 | Regiões geográficas e prazos de entrega | `/localisation/geo_zone` | ☐ |
| 6 | Prazos do boleto (dias para vencimento, numeração inicial) | Config. boleto | ☐ |
| 7 | Regras de saque (distribuidor + CD) definidas | Módulo saque | ☐ |
| 8 | Regras de bônus/percentuais definidas | Bônus | ☐ |
| 9 | Cadastro #1 alocado (kit pago) | Pendentes | ☐ |
| 10 | Termo de implantação assinado + painel suporte liberado | Painel suporte | ☐ |

---

## 6. Termo de Implantação e Painel de Suporte

> **Aula 4:** *"Acabou o nosso treinamento, eu vou criar um termo de implantação, envio no e-mail do senhor... o senhor vai imprimir, assinar nos campos (assinatura tem que ser a mesma do contrato)... devolver... Depois que eu aprovo, eu libero o painel de suporte ao cliente pro senhor. Aí só pode criar chamadas de manutenção, suporte, etc."*

### Fluxo do Termo

| Etapa | Ação | Quem |
|-------|------|------|
| 1 | Sistema cria termo de implantação | Maxível/Suporte |
| 2 | Envia por e-mail | Suporte |
| 3 | Cliente imprime e assina (mesma assinatura do contrato) | Cliente |
| 4 | Cliente devolve o termo (upload no painel) | Cliente |
| 5 | Suporte analisa e aprova | Suporte Maxível |
| 6 | Painel de suporte é **liberado** | Suporte Maxível |

### Painel de Suporte (após liberação)
- **Acompanhamento:** Chamadas em atendimento / em teste / resolvidos
- **Faturas:** Consultar faturas da plataforma
- **Criar chamados:** Quanto mais detalhe (prints, anexos), melhor o atendimento
- **Usuários:** Criar usuários para a equipe acessar o painel
- **Domínio:** Solicitar apontamento/alteração de domínio (processo próprio)

---

## 7. Configurações Pendentes Típicas (Aula 4)

### PagSeguro (Cartão)
```
1. Ter conta PagSeguro (PJ preferencial) com token
2. Plataforma ➜ Extensões ▸ Pagamentos ▸ PagSeguro ▸ Editar
3. Campos: token + e-mail fornecidos pelo PagSeguro
4. Habilitar + salvar
```

> ⚠️ **Aula 4:** *"Sem o token não vai ter forma de pagamento pelo cartão — não tem nenhuma pré-definida."*

### Boleto Banco do Brasil (Registrado)
```
1. Plataforma ➜ Configurações ▸ Módulos ▸ "Boleto Registrado" ▸ Instalar
2. Autorizar API: abrir URL, criar conta (e-mail/senha), logar,
   marcar checkbox "permite que a Maxível emita boletos registrados" e salvar
3. Extensões ▸ Pagamentos ▸ Boleto Registrado ▸ Editar:
   ▸ Enviar boleto por e-mail (sim/não)
   ▸ Valor mínimo / máximo
   ▸ Região geográfica
   ▸ Situação inicial do pedido
   ▸ Prazo (config. do boleto)
4. Configurar Boleto: Banco do Brasil ▸ Alterar:
   ▸ Carteira, Variação, Modalidade, Agência, Dígito, Conta
   ▸ Taxa, Tipo de aceite, Dias para vencer
   ▸ Número inicial de emissão (ex: 1000)
5. Habilitar API + Salvar
```

> ⚠️ **Prazo:** Configuração do boleto NÃO aceita salvar sem API autorizada (erro "Para ativar este método de pagamento é necessário autorizar a API").

---

## ERROS COMUNS / RISCOS

| Risco | Onde Acontece | Mitigação |
|-------|---------------|-----------|
| Mexer em configuração durante teste e "viciar" produção | Configurações (todas) | Registrar tudo que mudar; revisar checklist pré-produção |
| Reset solicitado sem 24h de antecedência | Painel suporte | Agendar com folga |
| Esquecer de realocar cadastro #1 pós-reset | Pendentes | Checklist obrigatório pós-reset (Seção 4) |
| PagSeguro com conta PF | Conta PagSeguro | Abrir conta PJ (token de PJ) |
| Boleto sem API autorizada | Módulo boleto | Autorizar API antes de configurar |
| Teste com cadastros reais de clientes | — | Lembrete: reset apaga TUDO de teste |

---

## Links Relacionados

- Guia criar CD: [`../05-guias-rapidos/criar-cd-passo-a-passo.md`](../05-guias-rapidos/criar-cd-passo-a-passo.md)
- Configurações pendentes (PagSeguro/Boleto/Frete): `configuracoes-pendentes-pagseguro-boleto-frete.md` ⏳
- Painel de suporte / chamados: `painel-suporte-chamados.md` ⏳
- Termo de implantação / domínio: `go-live-checklist.md` ⏳

---

*Última atualização: 2025-08-11 | Baseado em Aula 4 (segmentos finais) — regras críticas de go-live*