import { logger } from "../observability/logger.service";
export class AllInService {
    static instance;
    config = null;
    accessToken = null;
    tokenExpiry = null;
    constructor() { }
    static getInstance() {
        if (!AllInService.instance) {
            AllInService.instance = new AllInService();
        }
        return AllInService.instance;
    }
    configure(config) {
        this.config = {
            maxRetries: 3,
            retryDelay: 1000,
            ...config,
        };
        logger.info("AllIn service configured", "allin", { baseUrl: config.baseUrl });
    }
    ensureConfigured() {
        if (!this.config) {
            throw new Error("AllIn service not configured. Call configure() first.");
        }
    }
    async ensureAuthenticated() {
        this.ensureConfigured();
        // Check if token is still valid
        if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
            return;
        }
        // Authenticate
        await this.authenticate();
    }
    async authenticate() {
        this.ensureConfigured();
        const url = `${this.config.baseUrl}/auth/token`;
        const body = new URLSearchParams({
            client_id: this.config.clientId,
            client_secret: this.config.clientSecret,
        });
        // Usar password grant type se username e password forem fornecidos
        if (this.config.username && this.config.password) {
            body.append("grant_type", "password");
            body.append("username", this.config.username);
            body.append("password", this.config.password);
            if (this.config.scope) {
                body.append("scope", this.config.scope);
            }
        }
        else {
            body.append("grant_type", "client_credentials");
        }
        logger.debug(`AllIn OAuth2 authentication request: POST ${url}`, "allin", {
            grantType: this.config.username ? "password" : "client_credentials",
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
            logger.error(`AllIn OAuth2 authentication error: ${response.status} ${error}`, "allin", {
                url,
                status: response.status,
                error,
            });
            throw new Error(`AllIn OAuth2 authentication error: ${response.status} ${error}`);
        }
        const tokenData = await response.json();
        this.accessToken = tokenData.access_token;
        this.tokenExpiry = Date.now() + tokenData.expires_in * 1000;
        logger.info("AllIn OAuth2 authentication successful", "allin", {
            tokenType: tokenData.token_type,
            expiresIn: tokenData.expires_in,
            scope: tokenData.scope,
        });
    }
    async request(endpoint, options = {}) {
        await this.ensureAuthenticated();
        const url = `${this.config.baseUrl}${endpoint}`;
        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${this.accessToken}`,
            ...options.headers,
        };
        logger.debug(`AllIn API request: ${options.method || "GET"} ${url}`, "allin");
        let lastError = null;
        const maxRetries = this.config.maxRetries || 3;
        const retryDelay = this.config.retryDelay || 1000;
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                const response = await fetch(url, {
                    ...options,
                    headers,
                });
                if (!response.ok) {
                    const error = await response.text();
                    logger.error(`AllIn API error: ${response.status} ${error}`, "allin", {
                        url,
                        status: response.status,
                        error,
                        attempt: attempt + 1,
                        maxRetries,
                    });
                    // Se não for o último retry, aguardar e tentar novamente
                    if (attempt < maxRetries) {
                        const delay = retryDelay * Math.pow(2, attempt); // Exponential backoff
                        logger.info(`Retrying in ${delay}ms...`, "allin", { attempt: attempt + 1 });
                        await new Promise((resolve) => setTimeout(resolve, delay));
                        continue;
                    }
                    throw new Error(`AllIn API error: ${response.status} ${error}`);
                }
                return response.json();
            }
            catch (error) {
                lastError = error;
                // Se for erro de rede ou timeout, tentar novamente
                if (attempt < maxRetries) {
                    const delay = retryDelay * Math.pow(2, attempt); // Exponential backoff
                    logger.warn(`Request failed, retrying in ${delay}ms...`, "allin", {
                        error: error.message,
                        attempt: attempt + 1,
                        maxRetries,
                    });
                    await new Promise((resolve) => setTimeout(resolve, delay));
                    continue;
                }
                logger.error(`AllIn API request failed after ${maxRetries} retries`, "allin", {
                    url,
                    error: lastError,
                });
                throw lastError;
            }
        }
        throw lastError || new Error("AllIn API request failed");
    }
    // Get clientes
    async getClientes() {
        await this.ensureAuthenticated();
        try {
            const response = await this.request("/clientes");
            logger.info(`Fetched ${response.clientes.length} clientes from AllIn`, "allin");
            return response.clientes;
        }
        catch (error) {
            logger.error("Failed to fetch clientes from AllIn", "allin", { error });
            throw error;
        }
    }
    // Get distribuidores
    async getDistribuidores() {
        await this.ensureAuthenticated();
        try {
            const response = await this.request("/distribuidores");
            logger.info(`Fetched ${response.distribuidores.length} distribuidores from AllIn`, "allin");
            return response.distribuidores;
        }
        catch (error) {
            logger.error("Failed to fetch distribuidores from AllIn", "allin", { error });
            throw error;
        }
    }
    // Get produtos
    async getProdutos() {
        await this.ensureAuthenticated();
        try {
            const response = await this.request("/produtos");
            logger.info(`Fetched ${response.produtos.length} produtos from AllIn`, "allin");
            return response.produtos;
        }
        catch (error) {
            logger.error("Failed to fetch produtos from AllIn", "allin", { error });
            throw error;
        }
    }
    // Get pedidos
    async getPedidos() {
        await this.ensureAuthenticated();
        try {
            const response = await this.request("/pedidos");
            logger.info(`Fetched ${response.pedidos.length} pedidos from AllIn", "allin");
      return response.pedidos;
    } catch (error) {
      logger.error("Failed to fetch pedidos from AllIn", "allin", { error });
      throw error;
    }
  }

  // Get simulação de comissão
  async getSimulacao(): Promise<any[]> {
    await this.ensureAuthenticated();

    try {
      const response = await this.request<{ simulacao: any[] }>("/simulacao");
      logger.info(`, Fetched, $, { response, : .simulacao.length }, simulacoes, from, AllIn `, "allin");
      return response.simulacao;
    } catch (error) {
      logger.error("Failed to fetch simulacao from AllIn", "allin", { error });
      throw error;
    }
  }

  // Get bonus de faturamento
  async getBonusFaturamento(): Promise<any[]> {
    await this.ensureAuthenticated();

    try {
      const response = await this.request<{ bonus: any[] }>("/simulacao-bonus-faturamento");
      logger.info(`, Fetched, $, { response, : .bonus.length }, bonus, from, AllIn `, "allin");
      return response.bonus;
    } catch (error) {
      logger.error("Failed to fetch bonus from AllIn", "allin", { error });
      throw error;
    }
  }

  // Get cliente by ID
  async getClienteById(id: number): Promise<AllInCliente | null> {
    await this.ensureAuthenticated();

    try {
      const response = await this.request<{ cliente: AllInCliente }>(` / clientes / $, { id } `);
      logger.info(`, Fetched, cliente, $, { id }, from, AllIn `, "allin");
      return response.cliente;
    } catch (error) {
      logger.error(`, Failed, to, fetch, cliente, $, { id }, from, AllIn `, "allin", { error });
      return null;
    }
  }

  // Get distribuidor by ID
  async getDistribuidorById(id: number): Promise<AllInDistribuidor | null> {
    await this.ensureAuthenticated();

    try {
      const response = await this.request<{ distribuidor: AllInDistribuidor }>(` / distribuidores / $, { id } `);
      logger.info(`, Fetched, distribuidor, $, { id }, from, AllIn `, "allin");
      return response.distribuidor;
    } catch (error) {
      logger.error(`, Failed, to, fetch, distribuidor, $, { id }, from, AllIn `, "allin", { error });
      return null;
    }
  }

  // Get produto by ID
  async getProdutoById(id: number): Promise<AllInProduto | null> {
    await this.ensureAuthenticated();

    try {
      const response = await this.request<{ produto: AllInProduto }>(` / produtos / $, { id } `);
      logger.info(`, Fetched, produto, $, { id }, from, AllIn `, "allin");
      return response.produto;
    } catch (error) {
      logger.error(`, Failed, to, fetch, produto, $, { id }, from, AllIn `, "allin", { error });
      return null;
    }
  }

  // Get pedido by ID
  async getPedidoById(id: number): Promise<AllInPedido | null> {
    await this.ensureAuthenticated();

    try {
      const response = await this.request<{ pedido: AllInPedido }>(` / pedidos / $, { id } `);
      logger.info(`, Fetched, pedido, $, { id }, from, AllIn `, "allin");
      return response.pedido;
    } catch (error) {
      logger.error(`, Failed, to, fetch, pedido, $, { id }, from, AllIn `, "allin", { error });
      return null;
    }
  }

  // Get distribuidor atividades mensais
  async getDistribuidorAtivacoesMensais(distribuidorId: number): Promise<AllInDistribuidorAtivacoesMensais[]> {
    await this.ensureAuthenticated();

    try {
      const response = await this.request<{ atividades: AllInDistribuidorAtivacoesMensais[] }>(` / distribuidores / $, { distribuidorId } / AtivacoesMensais `);
      logger.info(`, Fetched, $, { response, : .atividades.length }, atividades, mensais);
            for (distribuidor; $; { distribuidorId })
                from;
            AllIn `, "allin");
      return response.atividades;
    } catch (error) {
      logger.error(`;
            Failed;
            to;
            fetch;
            atividades;
            mensais;
            for (distribuidor; $; { distribuidorId })
                from;
            AllIn `, "allin", { error });
      throw error;
    }
  }

  // Get distribuidor plano atual
  async getDistribuidorPlanoAtual(distribuidorId: number): Promise<AllInDistribuidorPlanoAtual | null> {
    await this.ensureAuthenticated();

    try {
      const response = await this.request<{ plano: AllInDistribuidorPlanoAtual }>(` / distribuidores / $;
            {
                distribuidorId;
            }
            /PlanoAtual`;
            ;
            logger.info(`Fetched plano atual for distribuidor ${distribuidorId} from AllIn`, "allin");
            return response.plano;
        }
        catch (error) {
            logger.error(`Failed to fetch plano atual for distribuidor ${distribuidorId} from AllIn`, "allin", { error });
            return null;
        }
    }
    // Get distribuidor qualificação atual
    async getDistribuidorQualificacaoAtual(distribuidorId) {
        await this.ensureAuthenticated();
        try {
            const response = await this.request(`/distribuidores/${distribuidorId}/QualificacaoAtual`);
            logger.info(`Fetched qualificação atual for distribuidor ${distribuidorId} from AllIn`, "allin");
            return response.qualificacao;
        }
        catch (error) {
            logger.error(`Failed to fetch qualificação atual for distribuidor ${distribuidorId} from AllIn`, "allin", { error });
            return null;
        }
    }
    // Get distribuidor telefones
    async getDistribuidorTelefones(distribuidorId) {
        await this.ensureAuthenticated();
        try {
            const response = await this.request(`/distribuidores/${distribuidorId}/Telefones`);
            logger.info(`Fetched ${response.telefones.length} telefones for distribuidor ${distribuidorId} from AllIn`, "allin");
            return response.telefones;
        }
        catch (error) {
            logger.error(`Failed to fetch telefones for distribuidor ${distribuidorId} from AllIn`, "allin", { error });
            throw error;
        }
    }
    // Create pedido
    async createPedido(pedido) {
        await this.ensureAuthenticated();
        try {
            const response = await this.request("/pedidos", {
                method: "POST",
                body: JSON.stringify(pedido),
            });
            logger.info(`Created pedido ${response.pedido.id} in AllIn`, "allin");
            return response.pedido;
        }
        catch (error) {
            logger.error("Failed to create pedido in AllIn", "allin", { error });
            throw error;
        }
    }
    // Update pedido status
    async updatePedidoStatus(pedidoId, statusUpdate) {
        await this.ensureAuthenticated();
        try {
            await this.request("/pedidos/AlterarStatus", {
                method: "POST",
                body: JSON.stringify({ pedido_id: pedidoId, ...statusUpdate }),
            });
            logger.info(`Updated status for pedido ${pedidoId} in AllIn`, "allin");
        }
        catch (error) {
            logger.error(`Failed to update status for pedido ${pedidoId} in AllIn`, "allin", { error });
            throw error;
        }
    }
    // Cancel pedido
    async cancelPedido(pedidoId) {
        await this.ensureAuthenticated();
        try {
            await this.request("/pedidos/Cancelar", {
                method: "POST",
                body: JSON.stringify({ pedido_id: pedidoId }),
            });
            logger.info(`Cancelled pedido ${pedidoId} in AllIn`, "allin");
        }
        catch (error) {
            logger.error(`Failed to cancel pedido ${pedidoId} in AllIn`, "allin", { error });
            throw error;
        }
    }
    // Confirm pedido payment
    async confirmPedidoPagamento(pedidoId) {
        await this.ensureAuthenticated();
        try {
            await this.request("/pedidos/ConfirmarPagamento", {
                method: "POST",
                body: JSON.stringify({ pedido_id: pedidoId }),
            });
            logger.info(`Confirmed payment for pedido ${pedidoId} in AllIn`, "allin");
        }
        catch (error) {
            logger.error(`Failed to confirm payment for pedido ${pedidoId} in AllIn`, "allin", { error });
            throw error;
        }
    }
    // Get pedido itens
    async getPedidoItens(pedidoId) {
        await this.ensureAuthenticated();
        try {
            const response = await this.request(`/pedidos/${pedidoId}/Itens`);
            logger.info(`Fetched ${response.itens.length} itens for pedido ${pedidoId} from AllIn`, "allin");
            return response.itens;
        }
        catch (error) {
            logger.error(`Failed to fetch itens for pedido ${pedidoId} from AllIn`, "allin", { error });
            throw error;
        }
    }
    // Get pedido pagamentos
    async getPedidoPagamentos(pedidoId) {
        await this.ensureAuthenticated();
        try {
            const response = await this.request(`/pedidos/${pedidoId}/Pagamentos`);
            logger.info(`Fetched ${response.pagamentos.length} pagamentos for pedido ${pedidoId} from AllIn`, "allin");
            return response.pagamentos;
        }
        catch (error) {
            logger.error(`Failed to fetch pagamentos for pedido ${pedidoId} from AllIn`, "allin", { error });
            throw error;
        }
    }
    // Get produto estoque
    async getProdutoEstoque(produtoId) {
        await this.ensureAuthenticated();
        try {
            const response = await this.request(`/produtos/${produtoId}/Estoque`);
            logger.info(`Fetched estoque for produto ${produtoId} from AllIn`, "allin");
            return response.estoque;
        }
        catch (error) {
            logger.error(`Failed to fetch estoque for produto ${produtoId} from AllIn`, "allin", { error });
            throw error;
        }
    }
    // Update produto estoque
    async updateProdutoEstoque(produtoId, quantidade, quantidadeReservada) {
        await this.ensureAuthenticated();
        try {
            await this.request("/produtos/Estoque", {
                method: "POST",
                body: JSON.stringify({
                    produto_id: produtoId,
                    quantidade,
                    quantidade_reservada: quantidadeReservada || 0,
                }),
            });
            logger.info(`Updated estoque for produto ${produtoId} in AllIn`, "allin");
        }
        catch (error) {
            logger.error(`Failed to update estoque for produto ${produtoId} in AllIn`, "allin", { error });
            throw error;
        }
    }
    // Get estoque totais
    async getEstoqueTotais() {
        await this.ensureAuthenticated();
        try {
            const response = await this.request("/produtos/EstoqueTotais");
            logger.info(`Fetched ${response.estoques.length} estoques totais from AllIn`, "allin");
            return response.estoques;
        }
        catch (error) {
            logger.error("Failed to fetch estoques totais from AllIn", "allin", { error });
            throw error;
        }
    }
    // Get planos
    async getPlanos() {
        await this.ensureAuthenticated();
        try {
            const response = await this.request("/simulacao-planos");
            logger.info(`Fetched ${response.planos.length} planos from AllIn`, "allin");
            return response.planos;
        }
        catch (error) {
            logger.error("Failed to fetch planos from AllIn", "allin", { error });
            throw error;
        }
    }
    // Get rede linear nos
    async getRedeLinearNos() {
        await this.ensureAuthenticated();
        try {
            const response = await this.request("/rede-linear-nos");
            logger.info(`Fetched ${response.nos.length} rede linear nos from AllIn`, "allin");
            return response.nos;
        }
        catch (error) {
            logger.error("Failed to fetch rede linear nos from AllIn", "allin", { error });
            throw error;
        }
    }
    // Get downlines
    async getDownlines(distribuidorId) {
        await this.ensureAuthenticated();
        try {
            const response = await this.request(`/rede-linear-nos/${distribuidorId}/Downlines`);
            logger.info(`Fetched ${response.downlines.length} downlines for distribuidor ${distribuidorId} from AllIn`, "allin");
            return response.downlines;
        }
        catch (error) {
            logger.error(`Failed to fetch downlines for distribuidor ${distribuidorId} from AllIn`, "allin", { error });
            throw error;
        }
    }
    // Get uplines
    async getUplines(distribuidorId) {
        await this.ensureAuthenticated();
        try {
            const response = await this.request(`/rede-linear-nos/${distribuidorId}/Uplines`);
            logger.info(`Fetched ${response.uplines.length} uplines for distribuidor ${distribuidorId} from AllIn`, "allin");
            return response.uplines;
        }
        catch (error) {
            logger.error(`Failed to fetch uplines for distribuidor ${distribuidorId} from AllIn`, "allin", { error });
            throw error;
        }
    }
    // Get bonus faturamento
    async getBonusFaturamento() {
        await this.ensureAuthenticated();
        try {
            const response = await this.request("/simulacao-bonus-faturamento");
            logger.info(`Fetched ${response.meses.length} meses de bonus faturamento from AllIn`, "allin");
            return response.meses;
        }
        catch (error) {
            logger.error("Failed to fetch bonus faturamento from AllIn", "allin", { error });
            throw error;
        }
    }
    // Get pedidos saldos
    async getPedidosSaldos() {
        await this.ensureAuthenticated();
        try {
            const response = await this.request("/pedidos-saldos");
            logger.info(`Fetched ${response.saldos.length} pedidos saldos from AllIn`, "allin");
            return response.saldos;
        }
        catch (error) {
            logger.error("Failed to fetch pedidos saldos from AllIn", "allin", { error });
            throw error;
        }
    }
    // Health check
    async ping() {
        try {
            await this.request("/ping");
            logger.info("AllIn API health check successful", "allin");
            return true;
        }
        catch (error) {
            logger.error("AllIn API health check failed", "allin", { error });
            return false;
        }
    }
}
export const allinService = AllInService.getInstance();
