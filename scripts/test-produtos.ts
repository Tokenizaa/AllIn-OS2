import 'dotenv/config';
import { allinService } from '../src/backend/shared/allin/allin.service';

async function testProdutos() {
  console.log('🧪 Testando endpoint Produtos...\n');

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
  console.log(`📡 Base URL: ${allinBaseUrl}`);
  console.log(`🔑 Scope: produtos\n`);

  try {
    const produtos = await allinService.getProdutos();
    console.log(`✅ Sucesso! ${produtos.length} produtos encontrados`);
    console.log('📦 Primeiro produto:', JSON.stringify(produtos[0] || null, null, 2));
  } catch (error) {
    console.error('❌ Erro ao buscar produtos:');
    console.error(error);
  }
}

testProdutos();
