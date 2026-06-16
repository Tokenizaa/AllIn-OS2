/**
 * Script de Teste Simples para DistributorSyncService
 * 
 * Este script testa apenas o sync de distribuidores para validar a integração com a API Allin.
 * Execute com: npx tsx scripts/test-distributor-sync.ts
 */

import { DistributorSyncService } from '../src/backend/shared/sync/distributor-sync.service';

async function testDistributorSync() {
  console.log('🚀 Iniciando teste de sync de distribuidores...');
  console.log('========================================\n');

  try {
    const distributorSync = new DistributorSyncService();
    const result = await distributorSync.sync();
    
    console.log('\n========================================');
    console.log('📊 Resultado do Sync');
    console.log('========================================\n');
    console.log(`Sucesso: ${result.success}`);
    console.log(`Processados: ${result.processedRecords}`);
    console.log(`Falhados: ${result.failedRecords}`);
    console.log(`Erros: ${result.errors.length}`);
    
    if (result.errors.length > 0) {
      console.log('\nErros:');
      result.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error.message}`);
      });
    }
    
    console.log('\n========================================');
    if (result.success) {
      console.log('✅ Teste concluído com sucesso!');
    } else {
      console.log('❌ Teste concluído com erros.');
    }
    console.log('========================================\n');
    
    process.exit(result.success ? 0 : 1);
  } catch (error) {
    console.error('\n❌ Erro fatal durante teste:', error);
    process.exit(1);
  }
}

testDistributorSync();
