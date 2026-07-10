# Produtos

**Fonte:** https://allinbrasil.com.br/api/documentacao

## Descrição

Obter lista de produtos da loja virtual

## Escopo Necessário

`produtos`

## Endpoints

### GET Produtos

**URL:** `https://allinbrasil.com.br/api/v1/produtos`

### POST Produtos

**URL:** `https://allinbrasil.com.br/api/v1/produtos`

### PUT Produtos

**URL:** `https://allinbrasil.com.br/api/v1/produtos`

### GET Estoque

**URL:** `https://allinbrasil.com.br/api/v1/produtos/Estoque`

### POST Estoque

**URL:** `https://allinbrasil.com.br/api/v1/produtos/Estoque`

### GET Estoque-Totais

**URL:** `https://allinbrasil.com.br/api/v1/produtos/EstoqueTotais`

### GET Opcoes-Valores

**URL:** `https://allinbrasil.com.br/api/v1/produtos/OpcoesValores`

### POST Opcoes-Valores

**URL:** `https://allinbrasil.com.br/api/v1/produtos/OpcoesValores`

### PUT Opcoes-Valores

**URL:** `https://allinbrasil.com.br/api/v1/produtos/OpcoesValores`

### DELETE Opcoes-Valores

**URL:** `https://allinbrasil.com.br/api/v1/produtos/OpcoesValores`

## Resposta

### Atributos

| Atributo | Descrição | Tipo |
|----------|-----------|------|
| limit | Quantidade de linhas que será retornado na sua consulta, no máximo de 100 por página | Sim |
| page | Página que deseja visualizar da consulta realizada | Sim |
| select | Trás somente os dados das colunas selecionadas, separar colunas por virgulas (ex.: nome,idade,cpf) | Sim |
| order_by | Ordena sua busca por parâmetro, utilize o tipo de ordenação com .desc (decrescente) ou .asc (ascendente) após o nome do parâmetro que deseja ordernar Ex.:id.desc (irá ordenar por id do maior para o menor) | Sim |
| id | Filtro de busca por id | Sim |
| id__maior_igual | Filtro de busca por id | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| id__menor_igual | Filtro de busca por id | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| id__em | Filtro de busca por id | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| modelo | Filtro de busca por modelo | Sim |
| modelo__contem | Filtro de busca por modelo | Valor do campo contem que o valor do parametro informado | Sim |
| modelo__em | Filtro de busca por modelo | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| ncm | Filtro de busca para ncm | Sim |
| ncm__contem | Filtro de busca para ncm | Valor do campo contem que o valor do parametro informado | Sim |
| ncm__em | Filtro de busca para ncm | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| preco | Filtro de busca por preço | Sim |
| preco__maior_igual | Filtro de busca por preço | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| preco__menor_igual | Filtro de busca por preço | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| preco__contem | Filtro de busca por preço | Valor do campo contem que o valor do parametro informado | Sim |
| preco__em | Filtro de busca por preço | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| e_plano | Filtro de busca se é plano | Sim |
| e_plano__maior_igual | Filtro de busca se é plano | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| e_plano__menor_igual | Filtro de busca se é plano | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| e_plano__em | Filtro de busca se é plano | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| e_upgrade_plano | Filtro de busca se é upgrade de plano | Sim |
| e_upgrade_plano__maior_igual | Filtro de busca se é upgrade de plano | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| e_upgrade_plano__menor_igual | Filtro de busca se é upgrade de plano | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| e_upgrade_plano__em | Filtro de busca se é upgrade de plano | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| e_recompra_plano | Filtro de busca se é upgrade de plano | Sim |
| e_recompra_plano__maior_igual | Filtro de busca se é upgrade de plano | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| e_recompra_plano__menor_igual | Filtro de busca se é upgrade de plano | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| e_recompra_plano__em | Filtro de busca se é upgrade de plano | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| e_renovacao_plano | Filtro de busca se é renovação de plano | Sim |
| e_renovacao_plano__maior_igual | Filtro de busca se é renovação de plano | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| e_renovacao_plano__menor_igual | Filtro de busca se é renovação de plano | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| e_renovacao_plano__em | Filtro de busca se é renovação de plano | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| e_ativacao | Filtro de busca se é ativação | Sim |
| e_ativacao__maior_igual | Filtro de busca se é ativação | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| e_ativacao__menor_igual | Filtro de busca se é ativação | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| e_ativacao__em | Filtro de busca se é ativação | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| e_visivel | Filtro de busca se é visivel | Sim |
| e_visivel__maior_igual | Filtro de busca se é visivel | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| e_visivel__menor_igual | Filtro de busca se é visivel | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| e_visivel__em | Filtro de busca se é visivel | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| quantidade | Filtro de busca por quantidade | Sim |
| quantidade__maior_igual | Filtro de busca por quantidade | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| quantidade__menor_igual | Filtro de busca por quantidade | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| quantidade__em | Filtro de busca por quantidade | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| status | Filtro de busca pelo status | Sim |
| status__maior_igual | Filtro de busca pelo status | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| status__menor_igual | Filtro de busca pelo status | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| status__em | Filtro de busca pelo status | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| quantidade_visualizacao | Filtro de busca por quantidade de visualização | Sim |
| quantidade_visualizacao__maior_igual | Filtro de busca por quantidade de visualização | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| quantidade_visualizacao__menor_igual | Filtro de busca por quantidade de visualização | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| quantidade_visualizacao__em | Filtro de busca por quantidade de visualização | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| quantidade_minima | Filtro de busca por quantidade mínima | Sim |
| quantidade_minima__maior_igual | Filtro de busca por quantidade mínima | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| quantidade_minima__menor_igual | Filtro de busca por quantidade mínima | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| quantidade_minima__em | Filtro de busca por quantidade mínima | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| estoque_status_id | Filtro de busca por id do status do estoque | Sim |
| estoque_status_id__maior_igual | Filtro de busca por id do status do estoque | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| estoque_status_id__menor_igual | Filtro de busca por id do status do estoque | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| estoque_status_id__em | Filtro de busca por id do status do estoque | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| necessita_frete | Filtro de busca se necessita frete | Sim |
| necessita_frete__maior_igual | Filtro de busca se necessita frete | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| necessita_frete__menor_igual | Filtro de busca se necessita frete | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| necessita_frete__em | Filtro de busca se necessita frete | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| peso | Filtro de busca por peso | Sim |
| peso__maior_igual | Filtro de busca por peso | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| peso__menor_igual | Filtro de busca por peso | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| peso__contem | Filtro de busca por peso | Valor do campo contem que o valor do parametro informado | Sim |
| peso__em | Filtro de busca por peso | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| classe_peso_id | Filtro de busca por id da classe de peso | Sim |
| classe_peso_id__maior_igual | Filtro de busca por id da classe de peso | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| classe_peso_id__menor_igual | Filtro de busca por id da classe de peso | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| classe_peso_id__em | Filtro de busca por id da classe de peso | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| comprimento | Filtro de busca por comprimento | Sim |
| comprimento__maior_igual | Filtro de busca por comprimento | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| comprimento__menor_igual | Filtro de busca por comprimento | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| comprimento__contem | Filtro de busca por comprimento | Valor do campo contem que o valor do parametro informado | Sim |
| comprimento__em | Filtro de busca por comprimento | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| largura | Filtro de busca por largura | Sim |
| largura__maior_igual | Filtro de busca por largura | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| largura__menor_igual | Filtro de busca por largura | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| largura__contem | Filtro de busca por largura | Valor do campo contem que o valor do parametro informado | Sim |
| largura__em | Filtro de busca por largura | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| altura | Filtro de busca por altura | Sim |
| altura__maior_igual | Filtro de busca por altura | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| altura__menor_igual | Filtro de busca por altura | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| altura__contem | Filtro de busca por altura | Valor do campo contem que o valor do parametro informado | Sim |
| altura__em | Filtro de busca por altura | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| classe_dimensao_id | Filtro de busca por id da dimensão | Sim |
| classe_dimensao_id__maior_igual | Filtro de busca por id da dimensão | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| classe_dimensao_id__menor_igual | Filtro de busca por id da dimensão | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| classe_dimensao_id__em | Filtro de busca por id da dimensão | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| data_adicionado | Filtro de busca por data que foi adicionado | Sim |
| data_adicionado__maior_igual | Filtro de busca por data que foi adicionado | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| data_adicionado__menor_igual | Filtro de busca por data que foi adicionado | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| data_adicionado__contem | Filtro de busca por data que foi adicionado | Valor do campo contem que o valor do parametro informado | Sim |
| data_adicionado__em | Filtro de busca por data que foi adicionado | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| data_modificado | Filtro de busca por data que foi modificado | Sim |
| data_modificado__maior_igual | Filtro de busca por data que foi modificado | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| data_modificado__menor_igual | Filtro de busca por data que foi modificado | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| data_modificado__contem | Filtro de busca por data que foi modificado | Valor do campo contem que o valor do parametro informado | Sim |
| data_modificado__em | Filtro de busca por data que foi modificado | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| data_disponivel | Filtro de busca por data em que estará disponível | Sim |
| data_disponivel__maior_igual | Filtro de busca por data em que estará disponível | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| data_disponivel__menor_igual | Filtro de busca por data em que estará disponível | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| data_disponivel__contem | Filtro de busca por data em que estará disponível | Valor do campo contem que o valor do parametro informado | Sim |
| data_disponivel__em | Filtro de busca por data em que estará disponível | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| destacado | Filtro de busca para destacado | Sim |
| destacado__maior_igual | Filtro de busca para destacado | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| destacado__menor_igual | Filtro de busca para destacado | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| destacado__em | Filtro de busca para destacado | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| upgrade_de_id | Filtro de busca por id do plano de origem para upgrade | Sim |
| upgrade_de_id__maior_igual | Filtro de busca por id do plano de origem para upgrade | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| upgrade_de_id__menor_igual | Filtro de busca por id do plano de origem para upgrade | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| upgrade_de_id__em | Filtro de busca por id do plano de origem para upgrade | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| upgrade_para_id | Filtro de busca por id de destino do plano para upgrade | Sim |
| upgrade_para_id__maior_igual | Filtro de busca por id de destino do plano para upgrade | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| upgrade_para_id__menor_igual | Filtro de busca por id de destino do plano para upgrade | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| upgrade_para_id__em | Filtro de busca por id de destino do plano para upgrade | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| renovacao_de_id | Filtro de busca para id do plano para renovar | Sim |
| renovacao_de_id__maior_igual | Filtro de busca para id do plano para renovar | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| renovacao_de_id__menor_igual | Filtro de busca para id do plano para renovar | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| renovacao_de_id__em | Filtro de busca para id do plano para renovar | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| sku | Filtro de busca por SKU | Sim |
| sku__contem | Filtro de busca por SKU | Valor do campo contem que o valor do parametro informado | Sim |
| sku__em | Filtro de busca por SKU | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| upc | Filtro de busca por UPC | Sim |
| upc__contem | Filtro de busca por UPC | Valor do campo contem que o valor do parametro informado | Sim |
| upc__em | Filtro de busca por UPC | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| ean | Filtro de busca por EAN | Sim |
| ean__contem | Filtro de busca por EAN | Valor do campo contem que o valor do parametro informado | Sim |
| ean__em | Filtro de busca por EAN | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| jan | Filtro de busca por JAN | Sim |
| jan__contem | Filtro de busca por JAN | Valor do campo contem que o valor do parametro informado | Sim |
| jan__em | Filtro de busca por JAN | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| isbn | Filtro de busca por ISBN | Sim |
| isbn__contem | Filtro de busca por ISBN | Valor do campo contem que o valor do parametro informado | Sim |
| isbn__em | Filtro de busca por ISBN | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| mpn | Filtro de busca por MPN | Sim |
| mpn__contem | Filtro de busca por MPN | Valor do campo contem que o valor do parametro informado | Sim |
| mpn__em | Filtro de busca por MPN | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| nome | Filtro de busca por nome | Sim |
| nome__contem | Filtro de busca por nome | Valor do campo contem que o valor do parametro informado | Sim |
| nome__em | Filtro de busca por nome | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| descricao | Filtro de busca por descrição | Sim |
| descricao__contem | Filtro de busca por descrição | Valor do campo contem que o valor do parametro informado | Sim |
| descricao__em | Filtro de busca por descrição | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| tag | Filtro de busca por tag | Sim |
| tag__contem | Filtro de busca por tag | Valor do campo contem que o valor do parametro informado | Sim |
| tag__em | Filtro de busca por tag | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| meta_titulo | Filtro de busca por meta titulo | Sim |
| meta_titulo__contem | Filtro de busca por meta titulo | Valor do campo contem que o valor do parametro informado | Sim |
| meta_titulo__em | Filtro de busca por meta titulo | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| meta_descricao | Filtro de busca por meta descrição | Sim |
| meta_descricao__contem | Filtro de busca por meta descrição | Valor do campo contem que o valor do parametro informado | Sim |
| meta_descricao__em | Filtro de busca por meta descrição | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| meta_palavra_chave | Filtro de busca por meta palavra chave | Sim |
| meta_palavra_chave__contem | Filtro de busca por meta palavra chave | Valor do campo contem que o valor do parametro informado | Sim |
| meta_palavra_chave__em | Filtro de busca por meta palavra chave | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| estoque_status_nome | Filtro de busca por nome do status de estoque | Sim |
| estoque_status_nome__contem | Filtro de busca por nome do status de estoque | Valor do campo contem que o valor do parametro informado | Sim |
| estoque_status_nome__em | Filtro de busca por nome do status de estoque | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| classe_peso_unidade | Filtro de busca por unidade da classe de peso | Sim |
| classe_peso_unidade__contem | Filtro de busca por unidade da classe de peso | Valor do campo contem que o valor do parametro informado | Sim |
| classe_peso_unidade__em | Filtro de busca por unidade da classe de peso | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| classe_dimensao_unidade | Filtro de busca por unidade da classe de dimensão | Sim |
| classe_dimensao_unidade__contem | Filtro de busca por unidade da classe de dimensão | Valor do campo contem que o valor do parametro informado | Sim |
| classe_dimensao_unidade__em | Filtro de busca por unidade da classe de dimensão | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| cadastrado_loja_id | Filtrar produtos cadastrados pela loja | Sim |
| cadastrado_loja_id__maior_igual | Filtrar produtos cadastrados pela loja | Valor do campo é maior ou igual que o valor do parametro informado | Sim |
| cadastrado_loja_id__menor_igual | Filtrar produtos cadastrados pela loja | Valor do campo é menor ou igual que o valor do parametro informado | Sim |
| cadastrado_loja_id__em | Filtrar produtos cadastrados pela loja | Registros que contém o valor informado. Informe um array de valores com aspas duplas ou sem aspas para numeros. Não é permitido aspas simples. Exemplo: ["valor1","valor2","valor3"] | Sim |
| gerenciado_loja_id | Filtrar produtos que são gerenciados pela loja. Os produtos gerenciados pela loja são aqueles em que a loja tem permissão de editar esse produto. Ou seja, a loja administra o produto. | Sim |
| aparece_loja_id | Filtrar produtos que aparecem na loja. Quer dizer que o administrador permitiu o produto aparecer na loja. Mesmo o produto não sendo cadastrado ou gerenciado pela loja o administrador pode permitir que a loja venda esse produto - desde que tenha estoque. | Sim |
| categoria_id | Filtrar pela categoria. Só irá trazer os produto que estão vinculado a categoria. | Sim |

