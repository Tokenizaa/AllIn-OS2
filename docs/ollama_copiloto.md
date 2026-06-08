**Plano de Ação: Copiloto totalmente funcional com Ollama + TinyLlama**

O estado atual do Copiloto é UI simulada. Para deixá-lo realmente integrado ao projeto, o caminho certo é criar uma camada de backend própria para IA, com contexto real do Supabase, persistência de conversa e execução segura de ações.

## 1. Objetivo técnico
Transformar o Copiloto em um sistema com estas capacidades:

- responder perguntas em linguagem natural
- usar dados reais do Supabase como contexto
- manter histórico de conversa por usuário
- sugerir ações operacionais com base no perfil e na rota
- executar consultas seguras quando necessário
- funcionar localmente via Ollama no Windows com `tinyllama`

## 2. Arquitetura proposta

### Camadas
- **Frontend**
  - chat UI
  - drawer global
  - páginas `/copilot` e `/office/copilot`
  - streaming de resposta
- **Backend**
  - endpoint dedicado para chat
  - montagem de contexto
  - chamada ao Ollama
  - validação de permissões
  - persistência de mensagens
- **Dados**
  - histórico em tabela própria
  - contexto por usuário/tenant
  - métricas e entidades do sistema para RAG leve
- **IA local**
  - Ollama rodando em `http://localhost:11434`
  - modelo `tinyllama`

## 3. Fases de execução

### Fase 1. Base de integração com Ollama
Criar um serviço backend central, por exemplo:

- `src/backend/modules/copilot/services/copilot.service.ts`
- `src/backend/modules/copilot/api/copilot.api.ts`
- `src/backend/modules/copilot/dto/copilot.dto.ts`

Responsabilidades:
- receber prompt do frontend
- detectar usuário, role e contexto de rota
- montar prompt final
- chamar `POST /api/chat` do Ollama
- retornar resposta estruturada

Ponto-chave:
- o backend não deve deixar o frontend falar direto com Ollama
- isso preserva controle, logging e segurança

### Fase 2. Contexto operacional real
O copiloto precisa responder com base em dados reais, não só texto puro.

Contexto mínimo:
- usuário autenticado
- role/permissões
- rota ativa
- dados resumidos de:
  - pedidos
  - pagamentos
  - clientes
  - produtos
  - rede/distribuidores
  - alertas e métricas

Implementação:
- criar um “context builder”
- buscar só agregados e trechos curtos
- evitar enviar tabelas inteiras ao modelo
- limitar tokens para não matar o desempenho do `tinyllama`

### Fase 3. Histórico e memória
Criar persistência para conversas.

Sugestão:
- `copilot_conversations`
- `copilot_messages`
- `copilot_context_snapshots`

Uso:
- manter sessões por usuário
- salvar pergunta, resposta e metadados
- permitir retomada de conversa
- guardar contexto usado em cada resposta para auditoria

### Fase 4. Integração com ações do sistema
O copiloto não deve ser apenas “pergunta e resposta”.
Ele precisa sugerir e, quando autorizado, executar ações.

Exemplos:
- gerar resumo semanal
- listar clientes em risco
- sugerir foco de estoque
- preparar relatório operacional
- abrir tarefa/alerta
- acionar consulta segura em analytics

Implementação recomendada:
- respostas em JSON estruturado com:
  - `answer`
  - `actions`
  - `citations`
  - `confidence`
- o frontend renderiza os botões de ação

### Fase 5. Segurança e governança
Como o modelo é local, ainda assim precisa de regras claras.

Regras:
- nunca enviar secrets ao modelo
- nunca passar tokens do Supabase
- nunca permitir SQL livre direto do modelo
- para consultas, usar somente funções seguras ou templates aprovados
- registrar todas as requisições do copiloto
- respeitar RBAC antes de consultar dados sensíveis

### Fase 6. UX real no frontend
Substituir os placeholders atuais por integração real.

Ajustes:
- páginas `/copilot` e `/office/copilot` devem chamar o endpoint backend
- drawer global deve ter chat funcional
- adicionar:
  - loading
  - streaming ou “typing”
  - botão copiar
  - retry
  - histórico
  - sugestões inteligentes baseadas no contexto

### Fase 7. Observabilidade e fallback
Adicionar:
- logs por conversa
- tempo de resposta
- erro do Ollama
- fallback quando o modelo estiver indisponível
- mensagem clara quando o servidor local não responder

## 4. Contrato de API sugerido

### `POST /api/copilot/chat`
Entrada:
```json
{
  "message": "resuma a operação da semana",
  "scope": "office",
  "conversationId": null
}
```

Saída:
```json
{
  "conversationId": "uuid",
  "answer": "Resumo ...",
  "actions": [
    { "label": "Ver pedidos", "type": "navigate", "target": "/office/orders" }
  ],
  "sources": [
    { "label": "Pedidos", "type": "supabase", "summary": "34 pedidos nos últimos 7 dias" }
  ]
}
```

## 5. Prompt base recomendado
Criar um prompt de sistema com regras fixas:
- papel do copiloto
- tom de resposta
- limites de escopo
- proibição de inventar dados
- obrigatoriedade de usar contexto fornecido
- formato de saída estruturado

Isso é crítico para TinyLlama, porque ele funciona melhor com instruções curtas, objetivas e repetíveis.

## 6. Integração com Ollama
Fluxo:
- backend recebe mensagem
- backend monta contexto
- backend chama Ollama
- backend valida a resposta
- backend salva histórico
- frontend exibe resposta

Endpoint típico do Ollama:
- `http://localhost:11434/api/chat`

Modelo:
- `tinyllama`

Recomendação prática:
- começar com geração curta
- temperatura baixa
- limitar `num_ctx`
- limitar tamanho do prompt de contexto

## 7. Ordem de implementação
Se eu fosse executar isso no projeto, faria nesta ordem:

1. criar módulo backend do copiloto
2. integrar com Ollama local
3. persistir conversas
4. montar contexto operacional real
5. trocar UI simulada por chat funcional
6. adicionar ações e respostas estruturadas
7. adicionar logs, fallback e métricas
8. testar permissões por role e por rota

## 8. Entregáveis finais esperados
Ao final, o Copiloto deve:
- responder de verdade
- usar dados do sistema
- respeitar permissões
- salvar histórico
- funcionar em admin e office
- operar com Ollama/TinyLlama localmente
- abrir caminho para automações futuras

## 9. Riscos principais
- `tinyllama` pode ser fraco para raciocínios longos
- contexto grande demais vai piorar respostas
- sem filtros, o modelo pode inventar informação
- sem persistência, o copiloto perde utilidade operacional
- sem RBAC, há risco de expor dados indevidos

## 10. Recomendação objetiva
A melhor estratégia é começar com um **MVP funcional**, não tentar “IA completa” de primeira.

MVP:
- chat funcional
- backend proxy para Ollama
- contexto resumido
- histórico salvo
- respostas em JSON
- integração no `/office/copilot` e drawer admin

Se quiser, eu posso partir para a próxima etapa e te entregar:
1. a arquitetura de pastas e arquivos exata para implementar isso no projeto, ou
2. a implementação inicial do backend + endpoint para conectar no Ollama.