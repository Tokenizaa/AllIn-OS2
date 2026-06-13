# Monitoring Avançado

## Configuração de Monitoring

Este documento descreve a configuração de monitoring avançado para a plataforma AllIn OS 2.0.

## Métricas a Monitorar

### Backend
- **Performance**
  - Tempo de resposta de endpoints
  - Throughput (requests por segundo)
  - Latência de database queries
  - Latência de chamadas externas (APIs, serviços)

- **Erros**
  - Taxa de erros HTTP (4xx, 5xx)
  - Exceções não tratadas
  - Erros de database
  - Erros de autenticação/autorização

- **Recursos**
  - Uso de CPU
  - Uso de memória
  - Uso de disco
  - Conexões de rede

- **Business**
  - Usuários ativos
  - Pedidos criados
  - Comissões calculadas
  - Saques processados

### Database
- **Performance**
  - Tempo de execução de queries
  - Queries lentas (> 1s)
  - Locks e deadlocks
  - Cache hit rate

- **Recursos**
  - Conexões ativas
  - Tamanho do banco
  - Índices não utilizados
  - Tabelas grandes

### Frontend
- **Performance**
  - Tempo de carregamento de páginas
  - Core Web Vitals (LCP, FID, CLS)
  - Tempo de interação
  - Taxa de erros JavaScript

- **Business**
  - Taxa de conversão
  - Engajamento do usuário
  - Sessões ativas
  - Funnel de conversão

## Ferramentas de Monitoring

### Supabase Dashboard
- **Métricas incluídas:**
  - Database performance
  - API usage
  - Storage usage
  - Edge Functions logs

- **Configuração:**
  - Ativar alerts de performance
  - Configurar rate limiting
  - Monitorar logs de erro

### Custom Monitoring
- **Logging:**
  - Structured logging (JSON)
  - Níveis de log (error, warn, info, debug)
  - Contexto de request (user_id, request_id)
  - Logs de business events

- **Metrics:**
  - Prometheus/Grafana
  - Custom metrics
  - Dashboards
  - Alerts

## Configuração de Alerts

### Alerts Críticos
- **Database desconectado**
  - Severidade: CRITICAL
  - Ação: Notificar equipe imediatamente

- **Taxa de erros > 5%**
  - Severidade: CRITICAL
  - Ação: Notificar equipe, investigar

- **Uso de CPU > 90%**
  - Severidade: CRITICAL
  - Ação: Escalar recursos, investigar

### Alerts de Aviso
- **Taxa de erros > 1%**
  - Severidade: WARNING
  - Ação: Monitorar, investigar se persistir

- **Queries lentas > 10**
  - Severidade: WARNING
  - Ação: Otimizar queries, adicionar índices

- **Uso de memória > 80%**
  - Severidade: WARNING
  - Ação: Monitorar, planejar escalonamento

### Alerts de Informação
- **Novo deploy**
  - Severidade: INFO
  - Ação: Registrar, monitorar

- **Backup concluído**
  - Severidade: INFO
  - Ação: Registrar, verificar integridade

## Implementação de Logging

### Estrutura de Log
```typescript
interface LogEntry {
  timestamp: string;
  level: 'error' | 'warn' | 'info' | 'debug';
  message: string;
  context?: {
    userId?: string;
    requestId?: string;
    module?: string;
    action?: string;
  };
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  metadata?: Record<string, any>;
}
```

### Exemplo de Uso
```typescript
logger.info('User logged in', {
  context: { userId: user.id, requestId: req.id },
  metadata: { ip: req.ip, userAgent: req.headers['user-agent'] }
});

logger.error('Failed to process order', {
  context: { userId: user.id, orderId: order.id },
  error: { name: error.name, message: error.message, stack: error.stack }
});
```

## Dashboards

### Dashboard de Performance
- Tempo de resposta médio
- P95, P99 de latência
- Throughput
- Taxa de erros

### Dashboard de Business
- Usuários ativos
- Pedidos por dia
- Comissões calculadas
- Saques processados

### Dashboard de Database
- Queries por segundo
- Tempo médio de queries
- Conexões ativas
- Tamanho do banco

## Health Checks

### Endpoints de Health Check
- `/health` - Health check básico
- `/health/db` - Health check de database
- `/health/cache` - Health check de cache
- `/health/external` - Health check de serviços externos

### Respostas
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z",
  "checks": {
    "database": "healthy",
    "cache": "healthy",
    "external": "healthy"
  }
}
```

## Próximos Passos

1. Implementar serviço de logging
2. Configurar dashboards no Supabase
3. Implementar health checks
4. Configurar alerts
5. Integrar com ferramenta de monitoring (Prometheus/Grafana)
6. Documentar procedimentos de incident response
