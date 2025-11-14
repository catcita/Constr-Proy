// Utility to resolve API base URLs at runtime
// - Prefers REACT_APP_API_BASE_URL if present (global override)
// - Otherwise selects between REACT_APP_API_<SERVICE> (localhost) and
//   REACT_APP_API_IP_<SERVICE> (LAN) based on window.location.hostname
// - Falls back to sensible localhost defaults for known services
function stripTrailingSlash(url) {
  return url ? url.replace(/\/$/, '') : url;
}

export function getApiBase(serviceKey) {
  // Global override takes priority
  const globalBase = process.env.REACT_APP_API_BASE_URL;
  if (globalBase) return stripTrailingSlash(globalBase);

  const key = String(serviceKey || '').toUpperCase();

  // Get service-specific environment variable
  const serviceEnv = process.env[`REACT_APP_API_${key}`];
  
  if (!serviceEnv) {
    console.error(`❌ FATAL: No environment variable found for service "${serviceKey}".`);
    console.error(`   Expected: REACT_APP_API_${key} or REACT_APP_API_BASE_URL`);
    console.error(`   Available env vars:`, Object.keys(process.env).filter(k => k.startsWith('REACT_APP_')));
    throw new Error(`Missing environment variable REACT_APP_API_${key}`);
  }

  return stripTrailingSlash(serviceEnv);
}

export default getApiBase;
