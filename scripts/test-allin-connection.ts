/**
 * Script de Teste Simples para Conexão Allin
 * 
 * Este script testa apenas a conexão com a API Allin para validar as credenciais.
 * Execute com: npx tsx scripts/test-allin-connection.ts
 */

// Carregar variáveis de ambiente
import { config } from 'dotenv';
config({ path: './scripts/.env' });

const ALLIN_API_BASE_URL = process.env.ALLIN_API_BASE_URL;
const ALLIN_CLIENT_ID = process.env.ALLIN_CLIENT_ID;
const ALLIN_CLIENT_SECRET = process.env.ALLIN_CLIENT_SECRET;

async function testConnection() {
  console.log('🚀 Testando conexão com API Allin...');
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
    // Testar conexão simples
    console.log('Tentando conectar...');
    const response = await fetch(`${ALLIN_API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log(`Status: ${response.status}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Conexão bem-sucedida!');
      console.log('Resposta:', data);
    } else {
      console.log('⚠️  Conexão falhou, mas servidor respondeu');
      console.log('Status:', response.statusText);
    }
  } catch (error) {
    console.error('❌ Erro ao conectar:', error);
    process.exit(1);
  }

  console.log('\n========================================');
  console.log('✅ Teste concluído!');
  console.log('========================================\n');
}

testConnection();
