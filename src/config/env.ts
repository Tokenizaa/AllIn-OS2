/**
 * Centralized Environment Configuration Validation
 * 
 * This module validates that all required environment variables are present
 * at application startup. Missing required variables will cause the application
 * to fail fast with a clear error message.
 */

interface EnvConfig {
  VITE_SUPABASE_URL: string;
  VITE_SUPABASE_ANON_KEY: string;
  VITE_SUPABASE_PROJECT_ID?: string;
  VITE_API_BASE_URL?: string;
}

/**
 * Validates and returns the environment configuration
 * @throws Error if required environment variables are missing
 */
export function validateEnv(): EnvConfig {
  const requiredVars: { key: keyof EnvConfig; name: string }[] = [
    { key: 'VITE_SUPABASE_URL', name: 'VITE_SUPABASE_URL' },
    { key: 'VITE_SUPABASE_ANON_KEY', name: 'VITE_SUPABASE_ANON_KEY' },
  ];

  const missingVars: string[] = [];

  for (const { key, name } of requiredVars) {
    const value = import.meta.env[key];
    if (!value) {
      missingVars.push(name);
    }
  }

  if (missingVars.length > 0) {
    throw new Error(
      `FATAL: Missing required environment variables:\n${missingVars.map(v => `  - ${v}`).join('\n')}\n\n` +
      `Please configure these variables in your environment or .env file to run the application.`
    );
  }

  return {
    VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL as string,
    VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
    VITE_SUPABASE_PROJECT_ID: import.meta.env.VITE_SUPABASE_PROJECT_ID,
    VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  };
}

/**
 * Get the validated environment configuration
 * This should be called at application startup
 */
export const env = validateEnv();
