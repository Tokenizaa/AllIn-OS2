import 'dotenv/config';
import { allinService } from '../src/backend/shared/allin/allin.service';

async function testAuth() {
  console.log('🧪 Testando autenticação e endpoints que funcionam...\n');

  const allinBaseUrl = process.env.ALLIN_API_BASE_URL || 'https://allinbrasil.com.br/api/v1';
  const allinClientId = process.env.ALLIN_CLIENT_ID;
  const allinClientSecret = process.env.ALLIN_CLIENT_SECRET;

  if (!allinClientId || !allinClientSecret) {
    console.error('❌ ALLIN_CLIENT_ID e ALLIN_CLIENT_SECRET são obrigatórios');
    process.exit(1);
  }

  allinService.configure({
    baseUrl: allinBaseUrl,
    clientId: allinClientId,
    clientSecret: allinClientSecret,
    scope: 'clientes distribuidores produtos pedidos simulacao_planos_listar simulacao_bonus_faturamento',
    maxRetries: 3,
    retryDelay: 1000,
  });

  console.log('✅ AllIn service configurado');
  console.log(`📡 Base URL: ${allinBaseUrl}\n`);

  // Testar Clientes (sabemos que funciona)
  try {
    console.log('📦 Testando Clientes...');
    const clientes = await allinService.getClientes();
    console.log(`✅ Clientes: ${clientes.length} encontrados`);
  } catch (error) {
    console.error('❌ Clientes falhou:', error);
  }

  // Testar Distribuidores (sabemos que funciona)
  try {
    console.log('\n📦 Testando Distribuidores...');
    const distribuidores = await allinService.getDistribuidores();
    console.log(`✅ Distribuidores: ${distribuidores.length} encontrados`);
  } catch (error) {
    console.error('❌ Distribuidores falhou:', error);
  }

  // Testar Produtos
  try {
    console.log('\n📦 Testando Produtos...');
    const produtos = await allinService.getProdutos();
    console.log(`✅ Produtos: ${produtos.length} encontrados`);
  } catch (error) {
    console.error('❌ Produtos falhou:', error);
  }

  // Testar Pedidos
  try {
    console.log('\n📦 Testando Pedidos...');
    const pedidos = await allinService.getPedidos();
    console.log(`✅ Pedidos: ${pedidos.length} encontrados`);
  } catch (error) {
    console.error('❌ Pedidos falhou:', error);
  }
}

testAuth();
