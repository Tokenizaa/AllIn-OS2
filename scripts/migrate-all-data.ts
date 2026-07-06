/**
 * Script de Migração Completa de Dados
 * 
 * Este script executa a migração completa de dados da API Allin para o banco de dados local.
 * Execute com: npx tsx scripts/migrate-all-data.ts
 */

import 'dotenv/config';
import { allinService } from '../src/backend/shared/allin/allin.service';
import { DistributorSyncService } from '../src/backend/shared/sync/distributor-sync.service';
import { ProductSyncService } from '../src/backend/shared/sync/product-sync.service';
import { PlanSyncService } from '../src/backend/shared/sync/plan-sync.service';
import { OrderSyncService } from '../src/backend/shared/sync/order-sync.service';
import { CustomerSyncService } from '../src/backend/shared/sync/customer-sync.service';
import { QualificationSyncService } from '../src/backend/shared/sync/qualification-sync.service';
import { ActivationSyncService } from '../src/backend/shared/sync/activation-sync.service';
import { WithdrawalSyncService } from '../src/backend/shared/sync/withdrawal-sync.service';
import { StoreSyncService } from '../src/backend/shared/sync/store-sync.service';

interface MigrationResult {
  entity: string;
  success: boolean;
  message: string;
  duration: number;
}

async function runMigration() {
  console.log('🚀 Iniciando migração completa de dados...');
  console.log('========================================\n');

  // Configurar AllIn service
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
    scope: process.env.ALLIN_SCOPE || 'clientes distribuidores produtos pedidos simulacao_planos_listar simulacao_bonus_faturamento',
    maxRetries: 3,
    retryDelay: 1000,
  });

  console.log('✅ AllIn service configurado');

  const results: MigrationResult[] = [];

  // 1. Sincronizar Distribuidores
  console.log('📦 Sincronizando Distribuidores...');
  const startTime1 = Date.now();
  try {
    const service = new DistributorSyncService();
    const result = await service.sync();
    const duration = Date.now() - startTime1;
    
    results.push({
      entity: 'Distribuidores',
      success: result.success,
      message: `${result.processedRecords} processados, ${result.failedRecords} falharam`,
      duration,
    });
    
    console.log(`✅ Distribuidores: ${result.processedRecords} processados (${duration}ms)`);
  } catch (error) {
    const duration = Date.now() - startTime1;
    results.push({
      entity: 'Distribuidores',
      success: false,
      message: (error as Error).message,
      duration,
    });
    console.log(`❌ Distribuidores: Erro - ${(error as Error).message}`);
  }

  // 2. Sincronizar Produtos
  console.log('\n📦 Sincronizando Produtos...');
  const startTime2 = Date.now();
  try {
    const service = new ProductSyncService();
    const result = await service.sync();
    const duration = Date.now() - startTime2;
    
    results.push({
      entity: 'Produtos',
      success: result.success,
      message: `${result.processedRecords} processados, ${result.failedRecords} falharam`,
      duration,
    });
    
    console.log(`✅ Produtos: ${result.processedRecords} processados (${duration}ms)`);
  } catch (error) {
    const duration = Date.now() - startTime2;
    results.push({
      entity: 'Produtos',
      success: false,
      message: (error as Error).message,
      duration,
    });
    console.log(`❌ Produtos: Erro - ${(error as Error).message}`);
  }

  // 3. Sincronizar Planos
  console.log('\n📦 Sincronizando Planos...');
  const startTime3 = Date.now();
  try {
    const service = new PlanSyncService();
    const result = await service.sync();
    const duration = Date.now() - startTime3;
    
    results.push({
      entity: 'Planos',
      success: result.success,
      message: `${result.processedRecords} processados, ${result.failedRecords} falharam`,
      duration,
    });
    
    console.log(`✅ Planos: ${result.processedRecords} processados (${duration}ms)`);
  } catch (error) {
    const duration = Date.now() - startTime3;
    results.push({
      entity: 'Planos',
      success: false,
      message: (error as Error).message,
      duration,
    });
    console.log(`❌ Planos: Erro - ${(error as Error).message}`);
  }

  // 4. Sincronizar Pedidos
  console.log('\n📦 Sincronizando Pedidos...');
  const startTime4 = Date.now();
  try {
    const service = new OrderSyncService();
    const result = await service.sync();
    const duration = Date.now() - startTime4;
    
    results.push({
      entity: 'Pedidos',
      success: result.success,
      message: `${result.processedRecords} processados, ${result.failedRecords} falharam`,
      duration,
    });
    
    console.log(`✅ Pedidos: ${result.processedRecords} processados (${duration}ms)`);
  } catch (error) {
    const duration = Date.now() - startTime4;
    results.push({
      entity: 'Pedidos',
      success: false,
      message: (error as Error).message,
      duration,
    });
    console.log(`❌ Pedidos: Erro - ${(error as Error).message}`);
  }

  // 5. Sincronizar Clientes
  console.log('\n📦 Sincronizando Clientes...');
  const startTime5 = Date.now();
  try {
    const service = new CustomerSyncService();
    const result = await service.sync();
    const duration = Date.now() - startTime5;
    
    results.push({
      entity: 'Clientes',
      success: result.success,
      message: `${result.processedRecords} processados, ${result.failedRecords} falharam`,
      duration,
    });
    
    console.log(`✅ Clientes: ${result.processedRecords} processados (${duration}ms)`);
  } catch (error) {
    const duration = Date.now() - startTime5;
    results.push({
      entity: 'Clientes',
      success: false,
      message: (error as Error).message,
      duration,
    });
    console.log(`❌ Clientes: Erro - ${(error as Error).message}`);
  }

  // 6. Sincronizar Qualificações
  console.log('\n📦 Sincronizando Qualificações...');
  const startTime6 = Date.now();
  try {
    const service = new QualificationSyncService();
    const result = await service.sync();
    const duration = Date.now() - startTime6;
    
    results.push({
      entity: 'Qualificações',
      success: result.success,
      message: `${result.processedRecords} processados, ${result.failedRecords} falharam`,
      duration,
    });
    
    console.log(`✅ Qualificações: ${result.processedRecords} processados (${duration}ms)`);
  } catch (error) {
    const duration = Date.now() - startTime6;
    results.push({
      entity: 'Qualificações',
      success: false,
      message: (error as Error).message,
      duration,
    });
    console.log(`❌ Qualificações: Erro - ${(error as Error).message}`);
  }

  // 7. Sincronizar Ativações
  console.log('\n📦 Sincronizando Ativações...');
  const startTime7 = Date.now();
  try {
    const service = new ActivationSyncService();
    const result = await service.sync();
    const duration = Date.now() - startTime7;
    
    results.push({
      entity: 'Ativações',
      success: result.success,
      message: `${result.processedRecords} processados, ${result.failedRecords} falharam`,
      duration,
    });
    
    console.log(`✅ Ativações: ${result.processedRecords} processados (${duration}ms)`);
  } catch (error) {
    const duration = Date.now() - startTime7;
    results.push({
      entity: 'Ativações',
      success: false,
      message: (error as Error).message,
      duration,
    });
    console.log(`❌ Ativações: Erro - ${(error as Error).message}`);
  }

  // 8. Sincronizar Saques
  console.log('\n📦 Sincronizando Saques...');
  const startTime8 = Date.now();
  try {
    const service = new WithdrawalSyncService();
    const result = await service.sync();
    const duration = Date.now() - startTime8;
    
    results.push({
      entity: 'Saques',
      success: result.success,
      message: `${result.processedRecords} processados, ${result.failedRecords} falharam`,
      duration,
    });
    
    console.log(`✅ Saques: ${result.processedRecords} processados (${duration}ms)`);
  } catch (error) {
    const duration = Date.now() - startTime8;
    results.push({
      entity: 'Saques',
      success: false,
      message: (error as Error).message,
      duration,
    });
    console.log(`❌ Saques: Erro - ${(error as Error).message}`);
  }

  // 9. Sincronizar Lojas
  console.log('\n📦 Sincronizando Lojas...');
  const startTime9 = Date.now();
  try {
    const service = new StoreSyncService();
    const result = await service.sync();
    const duration = Date.now() - startTime9;
    
    results.push({
      entity: 'Lojas',
      success: result.success,
      message: `${result.processedRecords} processados, ${result.failedRecords} falharam`,
      duration,
    });
    
    console.log(`✅ Lojas: ${result.processedRecords} processados (${duration}ms)`);
  } catch (error) {
    const duration = Date.now() - startTime9;
    results.push({
      entity: 'Lojas',
      success: false,
      message: (error as Error).message,
      duration,
    });
    console.log(`❌ Lojas: Erro - ${(error as Error).message}`);
  }

  // Resumo
  console.log('\n========================================');
  console.log('📊 Resumo da Migração');
  console.log('========================================\n');

  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
  const successCount = results.filter(r => r.success).length;
  const errorCount = results.filter(r => !r.success).length;

  results.forEach(result => {
    const status = result.success ? '✅' : '❌';
    console.log(`${status} ${result.entity}: ${result.message} (${result.duration}ms)`);
  });

  console.log('\n========================================');
  console.log(`Duração Total: ${totalDuration}ms`);
  console.log(`Sucesso: ${successCount}/${results.length}`);
  console.log(`Erros: ${errorCount}`);
  console.log('========================================\n');

  if (errorCount > 0) {
    console.log('⚠️  Migração concluída com erros. Verifique os logs acima.');
    process.exit(1);
  } else {
    console.log('✅ Migração concluída com sucesso!');
    process.exit(0);
  }
}

// Executar migração
runMigration().catch(error => {
  console.error('❌ Erro fatal durante migração:', error);
  process.exit(1);
});
