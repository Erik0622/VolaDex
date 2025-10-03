// Test file for Helius API integration
import { env } from './env';

export async function testHeliusAPI() {
  console.log('Testing Helius API integration...');
  
  if (!env.heliusApiKey) {
    console.error('Helius API key not found in environment variables');
    return false;
  }

  try {
    // Test token metadata endpoint
    const response = await fetch(`https://api.helius.xyz/v0/token-metadata?api-key=${env.heliusApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mintAccounts: ['So11111111111111111111111111111111111111112'], // SOL token
        includeOffChain: false,
        disableCache: false
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Helius API token metadata test successful:', data);
      return true;
    } else {
      console.error('❌ Helius API test failed:', response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.error('❌ Helius API test error:', error);
    return false;
  }
}

// Run test if this file is executed directly
if (typeof window !== 'undefined') {
  // Only run in browser environment
  testHeliusAPI().then(success => {
    if (success) {
      console.log('🎉 Helius API integration is working correctly!');
    } else {
      console.log('⚠️ Helius API integration needs attention');
    }
  });
}