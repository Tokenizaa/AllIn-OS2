/**
 * Script de teste simples para autenticação OAuth2 com API Allin
 * Execute: node scripts/test-allin-auth.js
 */

import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Carregar variáveis de ambiente do scripts/.env
dotenv.config({ path: './scripts/.env' });

const baseUrl = process.env.ALLIN_API_BASE_URL || 'https://allinbrasil.com.br/api/v1';
const clientId = process.env.ALLIN_CLIENT_ID;
const clientSecret = process.env.ALLIN_CLIENT_SECRET;
const grantType = process.env.ALLIN_GRANT_TYPE || 'client_credentials';

console.log('=== Teste de Autenticação OAuth2 com API Allin ===\n');
console.log('Configuração:');
console.log(`  Base URL: ${baseUrl}`);
console.log(`  Client ID: ${clientId ? '***' : 'NÃO CONFIGURADO'}`);
console.log(`  Client Secret: ${clientSecret ? '***' : 'NÃO CONFIGURADO'}`);
console.log(`  Grant Type: ${grantType}\n`);

if (!clientId || !clientSecret) {
  console.error('ERRO: Credenciais não configuradas!');
  console.error('Defina ALLIN_CLIENT_ID e ALLIN_CLIENT_SECRET no scripts/.env');
  process.exit(1);
}

async function testAuthentication() {
  try {
    console.log('Tentando autenticar...');
    
    const url = `${baseUrl}/auth/token`;
    const body = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: grantType,
    });

    console.log(`POST ${url}`);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`❌ Erro na autenticação: ${response.status} ${error}`);
      process.exit(1);
    }

    const tokenData = await response.json();
    
    console.log('✅ Autenticação bem-sucedida!');
    console.log(`  Token Type: ${tokenData.token_type}`);
    console.log(`  Expires In: ${tokenData.expires_in}s`);
    console.log(`  Scope: ${tokenData.scope || 'N/A'}\n`);

    // Testar health check
    console.log('Testando health check...');
    const healthUrl = `${baseUrl}/ping`;
    const healthResponse = await fetch(healthUrl, {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    });

    if (healthResponse.ok) {
      console.log('✅ Health check OK\n');
    } else {
      console.log('⚠️  Health check falhou (endpoint pode não existir)\n');
    }

    // Testar busca de distribuidores
    console.log('Testando busca de distribuidores...');
    const distribuidoresUrl = `${baseUrl}/distribuidores`;
    const distribuidoresResponse = await fetch(distribuidoresUrl, {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    });

    if (distribuidoresResponse.ok) {
      const data = await distribuidoresResponse.json();
      console.log(`✅ Buscou ${data.distribuidores?.length || 0} distribuidores\n`);
    } else {
      const error = await distribuidoresResponse.text();
      console.log(`⚠️  Erro ao buscar distribuidores: ${distribuidoresResponse.status} ${error}\n`);
    }

    console.log('=== Teste concluído ===');
  } catch (error) {
    console.error('❌ Erro durante teste:');
    console.error(error.message);
    process.exit(1);
  }
}

testAuthentication();
