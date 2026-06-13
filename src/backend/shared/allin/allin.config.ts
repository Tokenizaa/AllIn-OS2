import { allinService } from "./allin.service";
import { env } from "../../../config/env";

/**
 * Configura o serviço de integração com a API AllIn
 * Deve ser chamado na inicialização da aplicação
 */
export function configureAllInService(): void {
  const baseUrl = env.ALLIN_API_BASE_URL || "https://allinbrasil.com.br/api/v1";
  const clientId = env.ALLIN_CLIENT_ID;
  const clientSecret = env.ALLIN_CLIENT_SECRET;
  const grantType = env.ALLIN_GRANT_TYPE || "client_credentials";

  if (!clientId || !clientSecret) {
    console.warn(
      "AllIn API credentials not configured. Set ALLIN_CLIENT_ID and ALLIN_CLIENT_SECRET environment variables."
    );
    return;
  }

  allinService.configure({
    baseUrl,
    clientId,
    clientSecret,
    grantType,
  });

  console.log("AllIn service configured successfully", {
    baseUrl,
    grantType,
  });
}

// Auto-configurar quando o módulo for importado
if (typeof window === "undefined") {
  // Apenas no servidor
  configureAllInService();
}
