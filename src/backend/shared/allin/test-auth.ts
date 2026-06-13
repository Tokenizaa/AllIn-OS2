/**
 * Script de teste para autenticação OAuth2 com API AllIn
 * Execute: npx ts-node src/backend/shared/allin/test-auth.ts
 */

import { allinService } from "./allin.service";
import { env } from "../../../config/env";

async function testAuthentication() {
  console.log("=== Teste de Autenticação OAuth2 com API AllIn ===\n");

  // Configurar serviço
  const baseUrl = env.ALLIN_API_BASE_URL || "https://allinbrasil.com.br/api/v1";
  const clientId = env.ALLIN_CLIENT_ID;
  const clientSecret = env.ALLIN_CLIENT_SECRET;
  const grantType = env.ALLIN_GRANT_TYPE || "client_credentials";

  console.log("Configuração:");
  console.log(`  Base URL: ${baseUrl}`);
  console.log(`  Client ID: ${clientId ? "***" : "NÃO CONFIGURADO"}`);
  console.log(`  Client Secret: ${clientSecret ? "***" : "NÃO CONFIGURADO"}`);
  console.log(`  Grant Type: ${grantType}\n`);

  if (!clientId || !clientSecret) {
    console.error("ERRO: Credenciais não configuradas!");
    console.error("Defina ALLIN_CLIENT_ID e ALLIN_CLIENT_SECRET no .env");
    process.exit(1);
  }

  allinService.configure({
    baseUrl,
    clientId,
    clientSecret,
    grantType,
  });

  try {
    console.log("Tentando autenticar...");
    await allinService.ping();
    console.log("✅ Autenticação bem-sucedida!\n");

    // Testar health check
    console.log("Testando health check...");
    const isHealthy = await allinService.ping();
    console.log(`Health check: ${isHealthy ? "✅ OK" : "❌ Falhou"}\n`);

    // Testar busca de distribuidores
    console.log("Testando busca de distribuidores...");
    const distribuidores = await allinService.getDistribuidores();
    console.log(`✅ Buscou ${distribuidores.length} distribuidores\n`);

    // Testar busca de produtos
    console.log("Testando busca de produtos...");
    const produtos = await allinService.getProdutos();
    console.log(`✅ Buscou ${produtos.length} produtos\n`);

    // Testar busca de clientes
    console.log("Testando busca de clientes...");
    const clientes = await allinService.getClientes();
    console.log(`✅ Buscou ${clientes.length} clientes\n`);

    // Testar busca de pedidos
    console.log("Testando busca de pedidos...");
    const pedidos = await allinService.getPedidos();
    console.log(`✅ Buscou ${pedidos.length} pedidos\n`);

    console.log("=== Todos os testes passaram! ===");
  } catch (error) {
    console.error("❌ Erro durante teste:");
    console.error(error);
    process.exit(1);
  }
}

// Executar teste
testAuthentication();
