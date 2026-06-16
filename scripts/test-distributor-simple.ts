/**
 * Script de Teste Simples para DistributorSyncService
 * 
 * Este script testa apenas o sync de distribuidores para validar a integração com a API Allin.
 * Execute com: node scripts/test-distributor-simple.js
 */

// Carregar variáveis de ambiente
import { config } from 'dotenv';
config({ path: './scripts/.env' });

// Teste simples de conexão com a API Allin
async function testDistributorSync() {
  console.log('🚀 Testando sync de distribuidores com API Allin...');
  console.log('========================================\n');

  const ALLIN_API_BASE_URL = process.env.ALLIN_API_BASE_URL;
  const ALLIN_CLIENT_ID = process.env.ALLIN_CLIENT_ID;
  const ALLIN_CLIENT_SECRET = process.env.ALLIN_CLIENT_SECRET;

  console.log('Configuração:');
  console.log(`  Base URL: ${ALLIN_API_BASE_URL}`);
  console.log(`  Client ID: ${ALLIN_CLIENT_ID}`);
  console.log(`  Client Secret: ${ALLIN_CLIENT_SECRET ? '***' : 'NÃO DEFINIDO'}\n`);

  if (!ALLIN_API_BASE_URL || !ALLIN_CLIENT_ID || !ALLIN_CLIENT_SECRET) {
    console.error('❌ Erro: Variáveis de ambiente não definidas');
    process.exit(1);
  }

  try {
    // Tentar obter token de acesso
    console.log('Tentando obter token de acesso...');
    const body = new URLSearchParams({
      client_id: ALLIN_CLIENT_ID,
      client_secret: ALLIN_CLIENT_SECRET,
      grant_type: 'client_credentials',
    });

    const tokenResponse = await fetch(`${ALLIN_API_BASE_URL}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    console.log(`Status: ${tokenResponse.status}`);

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('❌ Erro ao obter token:', errorText);
      process.exit(1);
    }

    const tokenData = await tokenResponse.json();
    console.log('✅ Token obtido com sucesso!');
    console.log(`  Access Token: ${tokenData.access_token ? tokenData.access_token.substring(0, 20) + '...' : 'N/A'}`);

    // Tentar obter distribuidores
    console.log('\nTentando obter distribuidores...');
    const distribuidoresResponse = await fetch(`${ALLIN_API_BASE_URL}/distribuidores`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    });

    console.log(`Status: ${distribuidoresResponse.status}`);

    if (!distribuidoresResponse.ok) {
      const errorText = await distribuidoresResponse.text();
      console.error('❌ Erro ao obter distribuidores:', errorText);
      process.exit(1);
    }

    const distribuidoresData = await distribuidoresResponse.json();
    console.log('✅ Distribuidores obtidos com sucesso!');
    console.log(`  Quantidade: ${distribuidoresData.distribuidores ? distribuidoresData.distribuidores.length : 0}`);

    if (distribuidoresData.distribuidores && distribuidoresData.distribuidores.length > 0) {
      console.log('\nExemplo de distribuidor:');
      console.log(JSON.stringify(distribuidoresData.distribuidores[0], null, 2));
    }

    console.log('\n========================================');
    console.log('✅ Teste concluído com sucesso!');
    console.log('========================================\n');
  } catch (error) {
    console.error('❌ Erro durante teste:', error);
    process.exit(1);
  }
}

testDistributorSync();
