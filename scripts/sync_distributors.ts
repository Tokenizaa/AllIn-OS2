#!/usr/bin/env tsx
/**
 * Script to synchronize all distributors from AllIn API
 * Usage: npx tsx scripts/sync_distributors.ts
 */

import 'dotenv/config';
import { DistributorSyncService } from '../src/backend/modules/distributors/services/distributor-sync.service';

async function main() {
  console.log('=== Distributor Synchronization Script ===');
  console.log('Starting synchronization...');
  console.log('');

  const syncService = new DistributorSyncService();

  try {
    // Get sync status before
    console.log('Checking current sync status...');
    const statusBefore = await syncService.getSyncStatus();
    console.log('Status before sync:', JSON.stringify(statusBefore, null, 2));
    console.log('');

    // Perform synchronization
    console.log('Starting full synchronization...');
    const result = await syncService.syncAllDistributors();
    
    console.log('');
    console.log('=== Synchronization Results ===');
    console.log(`Total distributors processed: ${result.total}`);
    console.log(`Created: ${result.created}`);
    console.log(`Updated: ${result.updated}`);
    console.log(`Errors: ${result.errors}`);
    
    if (result.errorDetails.length > 0) {
      console.log('');
      console.log('Error Details:');
      result.errorDetails.forEach((error, index) => {
        console.log(`  ${index + 1}. ID ${error.id}: ${error.error}`);
      });
    }

    // Get sync status after
    console.log('');
    console.log('Checking sync status after...');
    const statusAfter = await syncService.getSyncStatus();
    console.log('Status after sync:', JSON.stringify(statusAfter, null, 2));

    console.log('');
    console.log('=== Synchronization Complete ===');
    process.exit(0);
  } catch (error) {
    console.error('Error during synchronization:', error);
    process.exit(1);
  }
}

main();
