# Simulacao-Bonus-Faturamento

**Fonte:** https://allinbrasil.com.br/api/documentacao

## Descrição

Retorna quando pagou de bônus e qual o faturamento

## Escopo Necessário

`simulacao_bonus_faturamento`

## Endpoints

### GET Simulacao-Bonus-Faturamento

**URL:** `https://allinbrasil.com.br/api/v1/simulacao-bonus-faturamento`

## Resposta

### Atributos

| Atributo | Descrição | Tipo |
|----------|-----------|------|
| meses[].mes | Mês |  |
| meses[].valor_total_bonus | Valor total de bônus gerado |  |
| meses[].valor_total_faturamento | Valor total de faturamento |  |
| meses[].valor_total_bonus_formatado | Valor total de bônus formatado |  |
| meses[].valor_total_faturamento_formatado | Valor total faturamento no mês formatado |  |

