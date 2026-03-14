// Test script per verificare il flow delle API
// Eseguire con: npx tsx test-apis.ts

const STRIPCHAT_API_KEY = '3de3002261a5e95efa8e';
const STRIPCHAT_ENDPOINT = 'https://go.mavrtracktor.com/api/models';
const CHATURBATE_ENDPOINT = 'https://it.chaturbate.com/api/public/affiliates/onlinerooms/';

async function testStripchatAPI() {
  console.log('=== TEST STRIPCHAT API ===');
  
  const url = `${STRIPCHAT_ENDPOINT}?limit=3`;
  console.log('URL:', url);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: { 
      Accept: 'application/json',
      'X-API-Key': STRIPCHAT_API_KEY
    }
  });
  
  const data = await response.json();
  console.log('Response status:', response.status);
  console.log('Total models:', data.total);
  console.log('Models returned:', data.models?.length);
  
  if (data.models && data.models.length > 0) {
    const m = data.models[0];
    console.log('\nFirst model:');
    console.log('  username:', m.username);
    console.log('  gender:', m.gender);
    console.log('  viewersCount:', m.viewersCount);
    console.log('  modelsCountry:', m.modelsCountry);
    console.log('  defaultTags:', m.defaultTags);
    console.log('  provider (from API):', m.provider);
    console.log('  All keys:', Object.keys(m).slice(0, 10));
  }
  
  return data;
}

async function testChaturbateAPI() {
  console.log('\n=== TEST CHATURBATE API ===');
  
  const url = `${CHATURBATE_ENDPOINT}?client_ip=request_ip&wm=fxmnz&limit=3`;
  console.log('URL:', url);
  
  const response = await fetch(url);
  
  const data = await response.json();
  console.log('Response status:', response.status);
  console.log('Count:', data.count);
  console.log('Results returned:', data.results?.length);
  
  if (data.results && data.results.length > 0) {
    const m = data.results[0];
    console.log('\nFirst model:');
    console.log('  username:', m.username);
    console.log('  gender:', m.gender);
    console.log('  num_users:', m.num_users);
    console.log('  country:', m.country);
    console.log('  tags:', m.tags);
    console.log('  provider (from API):', m.provider);
  }
  
  return data;
}

async function main() {
  try {
    await testStripchatAPI();
    await testChaturbateAPI();
  } catch (e) {
    console.error('Error:', e);
  }
}

main();
