/**
 * Script de teste para integração com API AllIn
 * 
 * Uso:
 * 1. Configure as variáveis de ambiente no arquivo .env:
 *    - ALLIN_API_BASE_URL
 *    - ALLIN_CLIENT_ID
 *    - ALLIN_CLIENT_SECRET
 * 
 * 2. Execute o script:
 *    npx tsx src/backend/shared/allin/test-allin-integration.ts
 */

import dotenv from "dotenv";
import { allinService, AllInConfig } from "./allin.service";
import { allinDataMapper } from "./data.mapper";
import { allinSyncService } from "./sync.service";

// Carregar variáveis de ambiente do arquivo .env
dotenv.config();

// Configuração (substituir pelas credenciais reais)
const config: AllInConfig = {
  baseUrl: process.env.ALLIN_API_BASE_URL || "https://allinbrasil.com.br/api/v1",
  clientId: process.env.ALLIN_CLIENT_ID || "",
  clientSecret: process.env.ALLIN_CLIENT_SECRET || "",
};

async function testAuthentication() {
  console.log("\n=== Testando Autenticação ===");
  
  try {
    allinService.configure(config);
    console.log("✅ AllIn service configurado");
    
    // Testar ping
    const isHealthy = await allinService.ping();
    if (isHealthy) {
      console.log("✅ API AllIn está saudável");
    } else {
      console.log("❌ API AllIn não está saudável");
    }
  } catch (error) {
    console.error("❌ Erro na autenticação:", error);
    throw error;
  }
}

async function testGetClientes() {
  console.log("\n=== Testando Busca de Clientes ===");
  
  try {
    const clientes = await allinService.getClientes();
    console.log(`✅ Buscou ${clientes.length} clientes`);
    
    if (clientes.length > 0) {
      const primeiroCliente = clientes[0];
      console.log("Primeiro cliente:", {
        id: primeiroCliente.id,
        nome: primeiroCliente.nome,
        email: primeiroCliente.email,
      });
      
      // Testar mapper
      const customerDTO = allinDataMapper.mapClienteToSupabase(primeiroCliente);
      console.log("✅ Cliente mapeado para Supabase:", {
        allin_id: customerDTO.allin_id,
        nome: customerDTO.nome,
        email: customerDTO.email,
      });
    }
  } catch (error) {
    console.error("❌ Erro ao buscar clientes:", error);
    throw error;
  }
}

async function testGetDistribuidores() {
  console.log("\n=== Testando Busca de Distribuidores ===");
  
  try {
    const distribuidores = await allinService.getDistribuidores();
    console.log(`✅ Buscou ${distribuidores.length} distribuidores`);
    
    if (distribuidores.length > 0) {
      const primeiroDistribuidor = distribuidores[0];
      console.log("Primeiro distribuidor:", {
        id: primeiroDistribuidor.id,
        usuario: primeiroDistribuidor.usuario,
        nome: primeiroDistribuidor.nome,
      });
      
      // Testar mapper
      const distribuidorDTO = allinDataMapper.mapDistribuidorToSupabase(primeiroDistribuidor);
      console.log("✅ Distribuidor mapeado para Supabase:", {
        allin_id: distribuidorDTO.allin_id,
        usuario: distribuidorDTO.usuario,
        nome: distribuidorDTO.nome,
      });
    }
  } catch (error) {
    console.error("❌ Erro ao buscar distribuidores:", error);
    throw error;
  }
}

async function testGetProdutos() {
  console.log("\n=== Testando Busca de Produtos ===");
  
  try {
    const produtos = await allinService.getProdutos();
    console.log(`✅ Buscou ${produtos.length} produtos`);
    
    if (produtos.length > 0) {
      const primeiroProduto = produtos[0];
      console.log("Primeiro produto:", {
        id: primeiroProduto.id,
        nome: primeiroProduto.nome,
        preco: primeiroProduto.preco,
      });
      
      // Testar mapper
      const produtoDTO = allinDataMapper.mapProdutoToSupabase(primeiroProduto);
      console.log("✅ Produto mapeado para Supabase:", {
        allin_id: produtoDTO.allin_id,
        nome: produtoDTO.nome,
        preco: produtoDTO.preco,
      });
    }
  } catch (error) {
    console.error("❌ Erro ao buscar produtos:", error);
    throw error;
  }
}

async function testGetPedidos() {
  console.log("\n=== Testando Busca de Pedidos ===");
  
  try {
    const pedidos = await allinService.getPedidos();
    console.log(`✅ Buscou ${pedidos.length} pedidos`);
    
    if (pedidos.length > 0) {
      const primeiroPedido = pedidos[0];
      console.log("Primeiro pedido:", {
        id: primeiroPedido.id,
        cliente_id: primeiroPedido.cliente_id,
        valor_total: primeiroPedido.valor_total,
        status: primeiroPedido.status,
      });
      
      // Testar mapper
      const pedidoDTO = allinDataMapper.mapPedidoToSupabase(primeiroPedido);
      console.log("✅ Pedido mapeado para Supabase:", {
        allin_id: pedidoDTO.allin_id,
        cliente_id: pedidoDTO.cliente_id,
        valor_total: pedidoDTO.valor_total,
        status_pedido: pedidoDTO.status_pedido,
      });
    }
  } catch (error) {
    console.error("❌ Erro ao buscar pedidos:", error);
    throw error;
  }
}

async function testSync() {
  console.log("\n=== Testando Sincronização ===");
  
  try {
    // Testar sync de clientes (apenas mapeamento, sem inserção no Supabase)
    const clientesResult = await allinSyncService.syncClientes();
    console.log("✅ Sync de clientes:", clientesResult);
    
    // Testar sync de distribuidores
    const distribuidoresResult = await allinSyncService.syncDistribuidores();
    console.log("✅ Sync de distribuidores:", distribuidoresResult);
    
    // Testar sync de produtos
    const produtosResult = await allinSyncService.syncProdutos();
    console.log("✅ Sync de produtos:", produtosResult);
    
    // Testar sync de pedidos
    const pedidosResult = await allinSyncService.syncPedidos();
    console.log("✅ Sync de pedidos:", pedidosResult);
  } catch (error) {
    console.error("❌ Erro na sincronização:", error);
    throw error;
  }
}

async function main() {
  console.log("=== Iniciando Testes de Integração com API AllIn ===");
  console.log("Configuração:", {
    baseUrl: config.baseUrl,
    clientId: config.clientId ? "***" : "NÃO CONFIGURADO",
    clientSecret: config.clientSecret ? "***" : "NÃO CONFIGURADO",
  });
  
  if (!config.clientId || !config.clientSecret) {
    console.error("\n❌ ERRO: ALLIN_CLIENT_ID e ALLIN_CLIENT_SECRET devem ser configurados");
    console.log("Configure as variáveis de ambiente antes de executar este script");
    process.exit(1);
  }
  
  try {
    await testAuthentication();
    await testGetClientes();
    await testGetDistribuidores();
    await testGetProdutos();
    await testGetPedidos();
    await testSync();
    
    console.log("\n=== Todos os testes concluídos com sucesso! ===");
  } catch (error) {
    console.error("\n=== Testes falharam ===");
    console.error(error);
    process.exit(1);
  }
}

main();
