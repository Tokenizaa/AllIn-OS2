#!/usr/bin/env tsx
/**
 * Test script to create a single distributor
 */

import 'dotenv/config';
import { DistributorSyncService } from '../src/backend/modules/distributors/services/distributor-sync.service';

async function test() {
  console.log('=== Testing Single Distributor Creation ===');
  
  const syncService = new DistributorSyncService();

  try {
    // Try to sync distributor ID 101 (one that failed)
    console.log('Attempting to sync distributor ID 101...');
    const result = await syncService.syncDistributorById(101);
    console.log('Success:', result);
  } catch (error) {
    console.error('Error:', error);
    console.error('Error type:', typeof error);
    console.error('Error keys:', Object.keys(error));
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
  }
}

test();
