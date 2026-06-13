# Rede-Linear-Nos

**Fonte:** https://allinbrasil.com.br/api/documentacao

## Descrição

Posições do distribuidor na rede linear

## Escopo Necessário

`rede_linear_nos`

## Endpoints

### GET Rede-Linear-Nos

**URL:** `https://allinbrasil.com.br/api/v1/rede-linear-nos`

### GET Downlines

**URL:** `https://allinbrasil.com.br/api/v1/rede-linear-nos/Downlines`

### GET Uplines

**URL:** `https://allinbrasil.com.br/api/v1/rede-linear-nos/Uplines`

## Resposta

### Atributos

| Atributo | Descrição | Tipo |
|----------|-----------|------|
| limit | Quantidade de linhas que será retornado na sua consulta, no máximo de 100 por página | Sim |
| page | Página que deseja visualizar da consulta realizada | Sim |
| select | Trás somente os dados das colunas selecionadas, separar colunas por virgulas (ex.: nome,idade,cpf) | Sim |
| order_by | Ordena sua busca por parâmetro, utilize o tipo de ordenação com .desc (decrescente) ou .asc (ascendente) após o nome do parâmetro que deseja ordernar Ex.:id.desc (irá ordenar por id do maior para o menor) | Sim |
| linha | Busca todos os distribuidores que estão em uma determinada linha | Sim |
| posicao_relativa | Busca todos os distribuidores que estão em um determinada possição em relação ao primeiro da rede. | Sim |
| id_distribuidor | Verifica se o distribuidor esta locada no rede | Sim |
| id_patrocinador | Busca todos os distribuidores onde o ele e o patrocinador, pesquisa via código do patrocinador | Sim |
| usuario_distribuidor | Verifica se o distribuidor esta locada no rede, pesquisa por nome de usuário. | Sim |
| usuario_patrocinador | Busca todos os distribuidores onde o ele e o patrocinador, pesquisa via usuario do patrocinador | Sim |

