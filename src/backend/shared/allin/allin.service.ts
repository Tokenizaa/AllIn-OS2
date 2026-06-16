import { logger } from "../observability/logger.service";
import type {
  AllInOAuthToken,
  AllInCliente,
  AllInDistribuidor,
  AllInProduto,
  AllInPedido,
} from "./dto/allin.dto";

export interface AllInConfig {
  baseUrl: string;
  clientId: string;
  clientSecret: string;
  username?: string;
  password?: string;
  scope?: string;
  maxRetries?: number;
  retryDelay?: number;
}

export class AllInService {
  private static instance: AllInService;
  private config: AllInConfig | null = null;
  private accessToken: string | null = null;
  private tokenExpiry: number | null = null;

  private constructor() {}

  static getInstance(): AllInService {
    if (!AllInService.instance) {
      AllInService.instance = new AllInService();
    }
    return AllInService.instance;
  }

  configure(config: AllInConfig): void {
    this.config = {
      maxRetries: 3,
      retryDelay: 1000,
      ...config,
    };
    logger.info("AllIn service configured", "allin", { baseUrl: config.baseUrl });
  }

  private ensureConfigured(): void {
    if (!this.config) {
      throw new Error("AllIn service not configured. Call configure() first.");
    }
  }

  private async ensureAuthenticated(): Promise<void> {
    this.ensureConfigured();

    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return;
    }

    await this.authenticate();
  }

  private async authenticate(): Promise<void> {
    this.ensureConfigured();

    const url = this.config!.baseUrl + "/auth/token";
    const body = new URLSearchParams({
      client_id: this.config!.clientId,
      client_secret: this.config!.clientSecret,
    });

    if (this.config!.username && this.config!.password) {
      body.append("grant_type", "password");
      body.append("username", this.config!.username);
      body.append("password", this.config!.password);
    } else {
      body.append("grant_type", "client_credentials");
    }
    
    if (this.config!.scope) {
      body.append("scope", this.config!.scope);
    }

    const grantType = this.config!.username ? "password" : "client_credentials";
    logger.debug("AllIn OAuth2 authentication request: POST " + url, "allin", {
      grantType: grantType,
    });

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    if (!response.ok) {
      const error = await response.text();
      logger.error("AllIn OAuth2 authentication error: " + response.status + " " + error, "allin", {
        url,
        status: response.status,
        error,
      });
      throw new Error("AllIn OAuth2 authentication error: " + response.status + " " + error);
    }

    const tokenData: AllInOAuthToken = await response.json();

    this.accessToken = tokenData.access_token;
    this.tokenExpiry = Date.now() + tokenData.expires_in * 1000;

    logger.info("AllIn OAuth2 authentication successful", "allin", {
      tokenType: tokenData.token_type,
      expiresIn: tokenData.expires_in,
      scope: tokenData.scope,
    });
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    await this.ensureAuthenticated();

    const url = this.config!.baseUrl + endpoint;
    const headers = {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + this.accessToken,
      ...options.headers,
    };

    const method = options.method || "GET";
    console.log(`[ALLIN DEBUG] ${method} ${url}`);
    console.log(`[ALLIN DEBUG] Has Token: ${!!this.accessToken}`);
    console.log(`[ALLIN DEBUG] Token Preview: ${this.accessToken ? this.accessToken.substring(0, 20) + "..." : "N/A"}`);
    console.log(`[ALLIN DEBUG] Scope: ${this.config!.scope}`);
    console.log(`[ALLIN DEBUG] Headers:`, Object.keys(headers));
    logger.info("AllIn API request: " + method + " " + url, "allin", {
      url,
      method,
      hasToken: !!this.accessToken,
      tokenPreview: this.accessToken ? this.accessToken.substring(0, 20) + "..." : "N/A",
      scope: this.config!.scope,
      headers: Object.keys(headers),
    });

    let lastError: Error | null = null;
    const maxRetries = this.config!.maxRetries || 3;
    const retryDelay = this.config!.retryDelay || 1000;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers,
        });

        if (!response.ok) {
          const error = await response.text();
          logger.error("AllIn API error: " + response.status + " " + error, "allin", {
            url,
            status: response.status,
            error,
            attempt: attempt + 1,
            maxRetries,
          });

          if (attempt < maxRetries) {
            const delay = retryDelay * Math.pow(2, attempt);
            logger.info("Retrying in " + delay + "ms...", "allin", { attempt: attempt + 1 });
            await new Promise((resolve) => setTimeout(resolve, delay));
            continue;
          }

          throw new Error("AllIn API error: " + response.status + " " + error);
        }

        return response.json();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt < maxRetries) {
          const delay = retryDelay * Math.pow(2, attempt);
          logger.warn("Request failed, retrying in " + delay + "ms...", "allin", {
            error: (error as Error).message,
            attempt: attempt + 1,
            maxRetries,
          });
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }

        logger.error("AllIn API request failed after " + maxRetries + " retries", "allin", {
          url,
          error: lastError,
        });
        throw lastError;
      }
    }

    throw lastError || new Error("AllIn API request failed");
  }

  async getClientes(): Promise<AllInCliente[]> {
    await this.ensureAuthenticated();

    try {
      const response = await this.request<{ clientes: AllInCliente[] }>("/clientes");
      logger.info("Fetched " + response.clientes.length + " clientes from AllIn", "allin");
      return response.clientes;
    } catch (error) {
      logger.error("Failed to fetch clientes from AllIn", "allin", { error });
      throw error;
    }
  }

  async getDistribuidores(): Promise<AllInDistribuidor[]> {
    await this.ensureAuthenticated();

    try {
      const response = await this.request<{ distribuidores: AllInDistribuidor[] }>("/distribuidores");
      logger.info("Fetched " + response.distribuidores.length + " distribuidores from AllIn", "allin");
      return response.distribuidores;
    } catch (error) {
      logger.error("Failed to fetch distribuidores from AllIn", "allin", { error });
      throw error;
    }
  }

  async getProdutos(): Promise<AllInProduto[]> {
    await this.ensureAuthenticated();

    try {
      const response = await this.request<{ produtos: AllInProduto[] }>("/produtos");
      logger.info("Fetched " + response.produtos.length + " produtos from AllIn", "allin");
      return response.produtos;
    } catch (error) {
      logger.error("Failed to fetch produtos from AllIn", "allin", { error });
      throw error;
    }
  }

  async getPedidos(): Promise<AllInPedido[]> {
    await this.ensureAuthenticated();

    try {
      const response = await this.request<{ pedidos: AllInPedido[] }>("/pedidos");
      logger.info("Fetched " + response.pedidos.length + " pedidos from AllIn", "allin");
      return response.pedidos;
    } catch (error) {
      logger.error("Failed to fetch pedidos from AllIn", "allin", { error });
      throw error;
    }
  }

  async getPlanosMLM(): Promise<any[]> {
    await this.ensureAuthenticated();

    try {
      const response = await this.request<{ planos: any[] }>("/simulacao-planos");
      logger.info("Fetched " + response.planos.length + " planos MLM from AllIn", "allin");
      return response.planos;
    } catch (error) {
      logger.error("Failed to fetch planos MLM from AllIn", "allin", { error });
      throw error;
    }
  }

  async getBonusComissao(): Promise<any[]> {
    await this.ensureAuthenticated();

    try {
      const response = await this.request<{ bonus: any[] }>("/simulacao-bonus-faturamento");
      logger.info("Fetched " + response.bonus.length + " bonus comissão from AllIn", "allin");
      return response.bonus;
    } catch (error) {
      logger.error("Failed to fetch bonus comissão from AllIn", "allin", { error });
      throw error;
    }
  }

  async getClienteById(id: number): Promise<AllInCliente | null> {
    await this.ensureAuthenticated();

    try {
      const response = await this.request<{ cliente: AllInCliente }>("/clientes/" + id);
      logger.info("Fetched cliente " + id + " from AllIn", "allin");
      return response.cliente;
    } catch (error) {
      logger.error("Failed to fetch cliente " + id + " from AllIn", "allin", { error });
      return null;
    }
  }

  async getDistribuidorById(id: number): Promise<AllInDistribuidor | null> {
    await this.ensureAuthenticated();

    try {
      const response = await this.request<{ distribuidor: AllInDistribuidor }>("/distribuidores/" + id);
      logger.info("Fetched distribuidor " + id + " from AllIn", "allin");
      return response.distribuidor;
    } catch (error) {
      logger.error("Failed to fetch distribuidor " + id + " from AllIn", "allin", { error });
      return null;
    }
  }

  async getProdutoById(id: number): Promise<AllInProduto | null> {
    await this.ensureAuthenticated();

    try {
      const response = await this.request<{ produto: AllInProduto }>("/produtos/" + id);
      logger.info("Fetched produto " + id + " from AllIn", "allin");
      return response.produto;
    } catch (error) {
      logger.error("Failed to fetch produto " + id + " from AllIn", "allin", { error });
      return null;
    }
  }

  async getPedidoById(id: number): Promise<AllInPedido | null> {
    await this.ensureAuthenticated();

    try {
      const response = await this.request<{ pedido: AllInPedido }>("/pedidos/" + id);
      logger.info("Fetched pedido " + id + " from AllIn", "allin");
      return response.pedido;
    } catch (error) {
      logger.error("Failed to fetch pedido " + id + " from AllIn", "allin", { error });
      return null;
    }
  }

  async getDistribuidorAtivacoesMensais(distribuidorId: number): Promise<any[]> {
    await this.ensureAuthenticated();

    try {
      const endpoint = "/distribuidores/" + distribuidorId + "/AtivacoesMensais";
      const response = await this.request<{ atividades: any[] }>(endpoint);
      logger.info("Fetched " + response.atividades.length + " atividades mensais for distribuidor " + distribuidorId + " from AllIn", "allin");
      return response.atividades;
    } catch (error) {
      logger.error("Failed to fetch atividades mensais for distribuidor " + distribuidorId + " from AllIn", "allin", { error });
      throw error;
    }
  }

  async getDistribuidorPlanoAtual(distribuidorId: number): Promise<any | null> {
    await this.ensureAuthenticated();

    try {
      const endpoint = "/distribuidores/" + distribuidorId + "/PlanoAtual";
      const response = await this.request<{ plano: any }>(endpoint);
      logger.info("Fetched plano atual for distribuidor " + distribuidorId + " from AllIn", "allin");
      return response.plano;
    } catch (error) {
      logger.error("Failed to fetch plano atual for distribuidor " + distribuidorId + " from AllIn", "allin", { error });
      return null;
    }
  }

  async getDistribuidorQualificacaoAtual(distribuidorId: number): Promise<any | null> {
    await this.ensureAuthenticated();

    try {
      const endpoint = "/distribuidores/" + distribuidorId + "/QualificacaoAtual";
      const response = await this.request<{ qualificacao: any }>(endpoint);
      logger.info("Fetched qualificação atual for distribuidor " + distribuidorId + " from AllIn", "allin");
      return response.qualificacao;
    } catch (error) {
      logger.error("Failed to fetch qualificação atual for distribuidor " + distribuidorId + " from AllIn", "allin", { error });
      return null;
    }
  }

  async getDistribuidorTelefones(distribuidorId: number): Promise<any[]> {
    await this.ensureAuthenticated();

    try {
      const endpoint = "/distribuidores/" + distribuidorId + "/Telefones";
      const response = await this.request<{ telefones: any[] }>(endpoint);
      logger.info("Fetched " + response.telefones.length + " telefones for distribuidor " + distribuidorId + " from AllIn", "allin");
      return response.telefones;
    } catch (error) {
      logger.error("Failed to fetch telefones for distribuidor " + distribuidorId + " from AllIn", "allin", { error });
      throw error;
    }
  }

  async createPedido(pedido: Partial<AllInPedido>): Promise<AllInPedido> {
    await this.ensureAuthenticated();

    try {
      const response = await this.request<{ pedido: AllInPedido }>("/pedidos", {
        method: "POST",
        body: JSON.stringify(pedido),
      });
      logger.info("Created pedido " + response.pedido.id + " in AllIn", "allin");
      return response.pedido;
    } catch (error) {
      logger.error("Failed to create pedido in AllIn", "allin", { error });
      throw error;
    }
  }

  async updatePedidoStatus(pedidoId: number, statusUpdate: any): Promise<void> {
    await this.ensureAuthenticated();

    try {
      await this.request<void>("/pedidos/AlterarStatus", {
        method: "POST",
        body: JSON.stringify({ pedido_id: pedidoId, ...statusUpdate }),
      });
      logger.info("Updated status for pedido " + pedidoId + " in AllIn", "allin");
    } catch (error) {
      logger.error("Failed to update status for pedido " + pedidoId + " in AllIn", "allin", { error });
      throw error;
    }
  }

  async cancelPedido(pedidoId: number): Promise<void> {
    await this.ensureAuthenticated();

    try {
      await this.request<void>("/pedidos/Cancelar", {
        method: "POST",
        body: JSON.stringify({ pedido_id: pedidoId }),
      });
      logger.info("Cancelled pedido " + pedidoId + " in AllIn", "allin");
    } catch (error) {
      logger.error("Failed to cancel pedido " + pedidoId + " in AllIn", "allin", { error });
      throw error;
    }
  }

  async confirmPedidoPagamento(pedidoId: number): Promise<void> {
    await this.ensureAuthenticated();

    try {
      await this.request<void>("/pedidos/ConfirmarPagamento", {
        method: "POST",
        body: JSON.stringify({ pedido_id: pedidoId }),
      });
      logger.info("Confirmed payment for pedido " + pedidoId + " in AllIn", "allin");
    } catch (error) {
      logger.error("Failed to confirm payment for pedido " + pedidoId + " in AllIn", "allin", { error });
      throw error;
    }
  }

  async getPedidoItens(pedidoId: number): Promise<any[]> {
    await this.ensureAuthenticated();

    try {
      const endpoint = "/pedidos/" + pedidoId + "/Itens";
      const response = await this.request<{ itens: any[] }>(endpoint);
      logger.info("Fetched " + response.itens.length + " itens for pedido " + pedidoId + " from AllIn", "allin");
      return response.itens;
    } catch (error) {
      logger.error("Failed to fetch itens for pedido " + pedidoId + " from AllIn", "allin", { error });
      throw error;
    }
  }

  async getPedidoPagamentos(pedidoId: number): Promise<any[]> {
    await this.ensureAuthenticated();

    try {
      const endpoint = "/pedidos/" + pedidoId + "/Pagamentos";
      const response = await this.request<{ pagamentos: any[] }>(endpoint);
      logger.info("Fetched " + response.pagamentos.length + " pagamentos for pedido " + pedidoId + " from AllIn", "allin");
      return response.pagamentos;
    } catch (error) {
      logger.error("Failed to fetch pagamentos for pedido " + pedidoId + " from AllIn", "allin", { error });
      throw error;
    }
  }

  async getProdutoEstoque(produtoId: number): Promise<any> {
    await this.ensureAuthenticated();

    try {
      const endpoint = "/produtos/" + produtoId + "/Estoque";
      const response = await this.request<{ estoque: any }>(endpoint);
      logger.info("Fetched estoque for produto " + produtoId + " from AllIn", "allin");
      return response.estoque;
    } catch (error) {
      logger.error("Failed to fetch estoque for produto " + produtoId + " from AllIn", "allin", { error });
      throw error;
    }
  }

  async updateProdutoEstoque(produtoId: number, quantidade: number, quantidadeReservada?: number): Promise<void> {
    await this.ensureAuthenticated();

    try {
      await this.request<void>("/produtos/Estoque", {
        method: "POST",
        body: JSON.stringify({
          produto_id: produtoId,
          quantidade,
          quantidade_reservada: quantidadeReservada || 0,
        }),
      });
      logger.info("Updated estoque for produto " + produtoId + " in AllIn", "allin");
    } catch (error) {
      logger.error("Failed to update estoque for produto " + produtoId + " in AllIn", "allin", { error });
      throw error;
    }
  }

  async getEstoqueTotais(): Promise<any[]> {
    await this.ensureAuthenticated();

    try {
      const response = await this.request<{ estoques: any[] }>("/produtos/EstoqueTotais");
      logger.info("Fetched " + response.estoques.length + " estoques totais from AllIn", "allin");
      return response.estoques;
    } catch (error) {
      logger.error("Failed to fetch estoques totais from AllIn", "allin", { error });
      throw error;
    }
  }

  async getPlanosAtivos(): Promise<any[]> {
    await this.ensureAuthenticated();

    try {
      const response = await this.request<{ planos: any[] }>("/simulacao-planos");
      logger.info("Fetched " + response.planos.length + " planos ativos from AllIn", "allin");
      return response.planos;
    } catch (error) {
      logger.error("Failed to fetch planos ativos from AllIn", "allin", { error });
      throw error;
    }
  }

  async getRedeLinearNos(): Promise<any[]> {
    await this.ensureAuthenticated();

    try {
      const response = await this.request<{ nos: any[] }>("/rede-linear-nos");
      logger.info("Fetched " + response.nos.length + " rede linear nos from AllIn", "allin");
      return response.nos;
    } catch (error) {
      logger.error("Failed to fetch rede linear nos from AllIn", "allin", { error });
      throw error;
    }
  }

  async getDownlines(distribuidorId: number): Promise<any[]> {
    await this.ensureAuthenticated();

    try {
      const endpoint = "/rede-linear-nos/" + distribuidorId + "/Downlines";
      const response = await this.request<{ downlines: any[] }>(endpoint);
      logger.info("Fetched " + response.downlines.length + " downlines for distribuidor " + distribuidorId + " from AllIn", "allin");
      return response.downlines;
    } catch (error) {
      logger.error("Failed to fetch downlines for distribuidor " + distribuidorId + " from AllIn", "allin", { error });
      throw error;
    }
  }

  async getUplines(distribuidorId: number): Promise<any[]> {
    await this.ensureAuthenticated();

    try {
      const endpoint = "/rede-linear-nos/" + distribuidorId + "/Uplines";
      const response = await this.request<{ uplines: any[] }>(endpoint);
      logger.info("Fetched " + response.uplines.length + " uplines for distribuidor " + distribuidorId + " from AllIn", "allin");
      return response.uplines;
    } catch (error) {
      logger.error("Failed to fetch uplines for distribuidor " + distribuidorId + " from AllIn", "allin", { error });
      throw error;
    }
  }

  async getBonusComissaoMeses(): Promise<any[]> {
    await this.ensureAuthenticated();

    try {
      const response = await this.request<{ meses: any[] }>("/simulacao-bonus-faturamento");
      logger.info("Fetched " + response.meses.length + " meses de bonus comissão from AllIn", "allin");
      return response.meses;
    } catch (error) {
      logger.error("Failed to fetch bonus comissão from AllIn", "allin", { error });
      throw error;
    }
  }

  async getPedidosSaldos(): Promise<any[]> {
    await this.ensureAuthenticated();

    try {
      const response = await this.request<{ saldos: any[] }>("/pedidos-saldos");
      logger.info("Fetched " + response.saldos.length + " pedidos saldos from AllIn", "allin");
      return response.saldos;
    } catch (error) {
      logger.error("Failed to fetch pedidos saldos from AllIn", "allin", { error });
      throw error;
    }
  }

  async ping(): Promise<boolean> {
    try {
      await this.request<{ status: string }>("/ping");
      logger.info("AllIn API health check successful", "allin");
      return true;
    } catch (error) {
      logger.error("AllIn API health check failed", "allin", { error });
      return false;
    }
  }
}

export const allinService = AllInService.getInstance();
