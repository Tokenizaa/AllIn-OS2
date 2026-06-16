#!/usr/bin/env tsx
/**
 * Test script to check AllIn API response format
 */

import 'dotenv/config';
import { ApiClient } from '../src/api/client';
import { apiConfig } from '../src/api/config';

async function testAPI() {
  console.log('=== Testing AllIn API ===');
  console.log('Base URL:', apiConfig.baseUrl);
  console.log('Client ID:', apiConfig.clientId);
  console.log('');

  const client = new ApiClient(apiConfig);

  try {
    // Test authentication
    console.log('1. Testing authentication...');
    await client.authenticate();
    console.log('✓ Authentication successful');
    console.log('');

    // Test distributors endpoint
    console.log('2. Testing distributors endpoint...');
    const response = await client.getWithFilters<any>('/distribuidores', {
      limit: 10,
      page: 1,
    });
    
    console.log('Response status:', response.status);
    console.log('Response data type:', typeof response.data);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    console.log('');

    // Test without filters
    console.log('3. Testing distributors endpoint without filters...');
    const response2 = await client.get<any>('/distribuidores');
    console.log('Response data:', JSON.stringify(response2.data, null, 2));
    console.log('');

  } catch (error) {
    console.error('Error:', error);
  }
}

testAPI();
