// Umgebungsvariablen mit verbesserter Validierung
export const env = {
  birdeyeApiKey: import.meta.env.VITE_BIRDEYE_API_KEY ?? '',
  heliusApiKey: import.meta.env.VITE_HELIUS_API_KEY ?? '',
  pumpfunApiKey: import.meta.env.VITE_PUMPFUN_API_KEY ?? '',
};

// Validierung der API-Keys
export function validateApiKeys() {
  const warnings: string[] = [];
  
  if (!env.birdeyeApiKey) {
    warnings.push('VITE_BIRDEYE_API_KEY ist nicht gesetzt - Fallback zu Sample-Daten');
  }
  
  if (!env.heliusApiKey) {
    warnings.push('VITE_HELIUS_API_KEY ist nicht gesetzt - Wallet-Features deaktiviert');
  }
  
  if (!env.pumpfunApiKey) {
    warnings.push('VITE_PUMPFUN_API_KEY ist nicht gesetzt - Memecoin-Features deaktiviert');
  }
  
  if (warnings.length > 0) {
    console.warn('API-Key Warnungen:', warnings);
  }
  
  return {
    hasBirdeye: !!env.birdeyeApiKey,
    hasHelius: !!env.heliusApiKey,
    hasPumpfun: !!env.pumpfunApiKey,
    warnings
  };
}

// Sicherheitshinweis für Produktion
export function getSecurityWarning() {
  if (typeof window !== 'undefined') {
    console.warn(
      '⚠️ SICHERHEITSHINWEIS: API-Keys sind im Browser sichtbar! ' +
      'Verwende nur Test-Keys oder implementiere einen Backend-Proxy für Produktion.'
    );
  }
}
