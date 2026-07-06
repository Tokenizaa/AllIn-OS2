/**
 * Script de Debug para Endpoint Clientes (REFERÊNCIA - FUNCIONA)
 * 
 * Este script faz uma requisição direta ao endpoint /clientes
 * e imprime todas as informações para debug.
 * Execute com: npx tsx scripts/debug-clientes.ts
 */

import { config } from 'dotenv';
config({ path: './scripts/.env' });

const ALLIN_API_BASE_URL = process.env.ALLIN_API_BASE_URL || 'https://allinbrasil.com.br/api/v1';
const ALLIN_CLIENT_ID = process.env.ALLIN_CLIENT_ID;
const ALLIN_CLIENT_SECRET = process.env.ALLIN_CLIENT_SECRET;

async function debugClientes() {
  console.log('🔍 DEBUG - Endpoint Clientes (REFERÊNCIA - FUNCIONA)');
  console.log('========================================\n');

  console.log('Configuração:');
  console.log(`  Base URL: ${ALLIN_API_BASE_URL}`);
  console.log(`  Client ID: ${ALLIN_CLIENT_ID}`);
  console.log(`  Client Secret: ${ALLIN_CLIENT_SECRET ? '***' : 'NÃO DEFINIDO'}\n`);

  if (!ALLIN_API_BASE_URL || !ALLIN_CLIENT_ID || !ALLIN_CLIENT_SECRET) {
    console.error('❌ Erro: Variáveis de ambiente não definidas');
    process.exit(1);
  }

  try {
    // 1. Obter token
    console.log('PASSO 1: Obtendo token de acesso...');
    const tokenBody = new URLSearchParams({
      client_id: ALLIN_CLIENT_ID,
      client_secret: ALLIN_CLIENT_SECRET,
      grant_type: 'client_credentials',
      scope: 'clientes distribuidores produtos pedidos simulacao_planos_listar simulacao_bonus_faturamento',
    });

    console.log(`  URL: ${ALLIN_API_BASE_URL}/auth/token`);
    console.log(`  Method: POST`);
    console.log(`  Body: ${tokenBody.toString()}\n`);

    const tokenResponse = await fetch(`${ALLIN_API_BASE_URL}/auth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenBody.toString(),
    });

    console.log(`  Status: ${tokenResponse.status}`);
    console.log(`  Status Text: ${tokenResponse.statusText}\n`);

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('❌ Erro ao obter token:', errorText);
      process.exit(1);
    }

    const tokenData = await tokenResponse.json();
    console.log('✅ Token obtido com sucesso!');
    console.log(`  Access Token: ${tokenData.access_token ? tokenData.access_token.substring(0, 30) + '...' : 'N/A'}`);
    console.log(`  Token Type: ${tokenData.token_type || 'N/A'}`);
    console.log(`  Expires In: ${tokenData.expires_in || 'N/A'}s`);
    console.log(`  Scope: ${tokenData.scope || 'N/A'}\n`);

    // 2. Fazer requisição para /clientes
    console.log('PASSO 2: Fazendo requisição para /clientes...');
    const clientesUrl = `${ALLIN_API_BASE_URL}/clientes`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenData.access_token}`,
    };

    console.log(`  URL: ${clientesUrl}`);
    console.log(`  Method: GET`);
    console.log(`  Headers:`, headers);
    console.log(`  Body: (vazio - GET request)\n`);

    const clientesResponse = await fetch(clientesUrl, {
      method: 'GET',
      headers,
    });

    console.log(`  Status: ${clientesResponse.status}`);
    console.log(`  Status Text: ${clientesResponse.statusText}\n`);

    // 3. Imprimir resposta bruta
    console.log('PASSO 3: Resposta bruta...');
    const responseText = await clientesResponse.text();
    console.log('  Response Body:', responseText);
    console.log();

    // 4. Tentar parsear JSON
    console.log('PASSO 4: Tentando parsear JSON...');
    try {
      const responseJson = JSON.parse(responseText);
      console.log('  JSON Parseado:', JSON.stringify(responseJson, null, 2));
    } catch (e) {
      console.log('  ❌ Não foi possível parsear como JSON');
    }

    console.log('\n========================================');
    if (clientesResponse.ok) {
      console.log('✅ Requisição bem-sucedida!');
    } else {
      console.log('❌ Requisição falhou!');
    }
    console.log('========================================\n');

    process.exit(clientesResponse.ok ? 0 : 1);
  } catch (error) {
    console.error('\n❌ Erro fatal durante debug:', error);
    process.exit(1);
  }
}

debugClientes();
