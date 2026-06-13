import { logger } from "../observability/logger.service";
import type {
  AllInCliente,
  AllInDistribuidor,
  AllInProduto,
  AllInPedido,
  AllInPlano,
} from "./dto/allin.dto";

// DTOs do Supabase (serão ajustados conforme a estrutura real)
export interface CustomerDTO {
  allin_id?: number;
  nome: string;
  email: string;
  cpf?: string;
  cnpj?: string;
  data_nascimento?: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  ativo?: boolean;
  data_cadastro?: string;
  patrocinador_id?: number;
}

export interface DistribuidorDTO {
  allin_id?: number;
  usuario: string;
  nome: string;
  email: string;
  cpf?: string;
  cnpj?: string;
  data_nascimento?: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  ativo?: boolean;
  data_cadastro?: string;
  patrocinador_id?: number;
}

export interface ProdutoDTO {
  allin_id?: number;
  nome: string;
  descricao?: string;
  preco?: number;
  ativo?: boolean;
  data_cadastro?: string;
}

export interface PedidoDTO {
  allin_id?: number;
  cliente_id?: number;
  distribuidor_id?: number;
  valor_total?: number;
  status_pedido?: string;
  data_criacao?: string;
  cancelado?: boolean;
}

export interface PlanoDTO {
  allin_id?: number;
  nome: string;
  tipo?: string;
  descricao?: string;
  valor?: number;
  ativo?: boolean;
}

export class AllInDataMapper {
  /**
   * Mapeia Cliente da API AllIn para formato do Supabase
   */
  mapClienteToSupabase(cliente: AllInCliente): CustomerDTO {
    try {
      const customerDTO: CustomerDTO = {
        allin_id: cliente.id,
        nome: `${cliente.nome} ${cliente.sobrenome}`.trim(),
        email: cliente.email,
        cpf: cliente.cpf || undefined,
        cnpj: cliente.cnpj || undefined,
        data_nascimento: cliente.data_nascimento || undefined,
        cep: cliente.cep || undefined,
        logradouro: cliente.logradouro || undefined,
        numero: cliente.numero || undefined,
        bairro: cliente.bairro || undefined,
        cidade: cliente.cidade_nome || undefined,
        uf: cliente.uf_nome || undefined,
        ativo: cliente.ativo,
        data_cadastro: cliente.distribuidor_data_cadastro || cliente.data_adicionado,
        patrocinador_id: cliente.patrocinador_id || undefined,
      };

      logger.debug(`Mapped cliente ${cliente.id} to Supabase format`, "allin", {
        allinId: cliente.id,
        email: cliente.email,
      });

      return customerDTO;
    } catch (error) {
      logger.error(`Failed to map cliente ${cliente.id} to Supabase format`, "allin", { error });
      throw error;
    }
  }

  /**
   * Mapeia Distribuidor da API AllIn para formato do Supabase
   */
  mapDistribuidorToSupabase(distribuidor: AllInDistribuidor): DistribuidorDTO {
    try {
      const distribuidorDTO: DistribuidorDTO = {
        allin_id: distribuidor.id,
        usuario: distribuidor.usuario,
        nome: distribuidor.nome,
        email: distribuidor.email,
        cpf: distribuidor.cpf || undefined,
        cnpj: distribuidor.cnpj || undefined,
        data_nascimento: distribuidor.data_nascimento || undefined,
        cep: distribuidor.cep || undefined,
        logradouro: distribuidor.endereco || undefined,
        numero: distribuidor.numero || undefined,
        bairro: distribuidor.bairro || undefined,
        cidade: distribuidor.cidade || undefined,
        ativo: distribuidor.ativo,
        data_cadastro: distribuidor.data_cadastro,
        patrocinador_id: distribuidor.patrocinador_id || undefined,
      };

      logger.debug(`Mapped distribuidor ${distribuidor.id} to Supabase format`, "allin", {
        allinId: distribuidor.id,
        usuario: distribuidor.usuario,
      });

      return distribuidorDTO;
    } catch (error) {
      logger.error(`Failed to map distribuidor ${distribuidor.id} to Supabase format`, "allin", { error });
      throw error;
    }
  }

  /**
   * Mapeia Produto da API AllIn para formato do Supabase
   */
  mapProdutoToSupabase(produto: AllInProduto): ProdutoDTO {
    try {
      const produtoDTO: ProdutoDTO = {
        allin_id: produto.id,
        nome: produto.nome,
        descricao: produto.descricao || undefined,
        preco: produto.preco || undefined,
        ativo: produto.ativo,
        data_cadastro: produto.data_cadastro,
      };

      logger.debug(`Mapped produto ${produto.id} to Supabase format`, "allin", {
        allinId: produto.id,
        nome: produto.nome,
      });

      return produtoDTO;
    } catch (error) {
      logger.error(`Failed to map produto ${produto.id} to Supabase format`, "allin", { error });
      throw error;
    }
  }

  /**
   * Mapeia Pedido da API AllIn para formato do Supabase
   */
  mapPedidoToSupabase(pedido: AllInPedido): PedidoDTO {
    try {
      const pedidoDTO: PedidoDTO = {
        allin_id: pedido.id,
        cliente_id: pedido.cliente_id || undefined,
        distribuidor_id: pedido.distribuidor_indicador_id || pedido.distribuidor_comprador_id || undefined,
        valor_total: pedido.valor_total || undefined,
        status_pedido: pedido.status || undefined,
        data_criacao: pedido.data_adicionado,
        cancelado: pedido.cancelado,
      };

      logger.debug(`Mapped pedido ${pedido.id} to Supabase format`, "allin", {
        allinId: pedido.id,
        clienteId: pedido.cliente_id,
        valorTotal: pedido.valor_total,
      });

      return pedidoDTO;
    } catch (error) {
      logger.error(`Failed to map pedido ${pedido.id} to Supabase format`, "allin", { error });
      throw error;
    }
  }

  /**
   * Mapeia Plano da API AllIn para formato do Supabase
   */
  mapPlanoToSupabase(plano: AllInPlano): PlanoDTO {
    try {
      const planoDTO: PlanoDTO = {
        allin_id: plano.id,
        nome: plano.nome,
        tipo: plano.tipo || undefined,
        descricao: plano.descricao || undefined,
        valor: plano.valor || undefined,
        ativo: plano.ativo,
      };

      logger.debug(`Mapped plano ${plano.id} to Supabase format`, "allin", {
        allinId: plano.id,
        nome: plano.nome,
      });

      return planoDTO;
    } catch (error) {
      logger.error(`Failed to map plano ${plano.id} to Supabase format`, "allin", { error });
      throw error;
    }
  }

  /**
   * Mapeia lista de Clientes da API AllIn para formato do Supabase
   */
  mapClientesToSupabase(clientes: AllInCliente[]): CustomerDTO[] {
    return clientes.map((cliente) => this.mapClienteToSupabase(cliente));
  }

  /**
   * Mapeia lista de Distribuidores da API AllIn para formato do Supabase
   */
  mapDistribuidoresToSupabase(distribuidores: AllInDistribuidor[]): DistribuidorDTO[] {
    return distribuidores.map((distribuidor) => this.mapDistribuidorToSupabase(distribuidor));
  }

  /**
   * Mapeia lista de Produtos da API AllIn para formato do Supabase
   */
  mapProdutosToSupabase(produtos: AllInProduto[]): ProdutoDTO[] {
    return produtos.map((produto) => this.mapProdutoToSupabase(produto));
  }

  /**
   * Mapeia lista de Pedidos da API AllIn para formato do Supabase
   */
  mapPedidosToSupabase(pedidos: AllInPedido[]): PedidoDTO[] {
    return pedidos.map((pedido) => this.mapPedidoToSupabase(pedido));
  }

  /**
   * Mapeia lista de Planos da API AllIn para formato do Supabase
   */
  mapPlanosToSupabase(planos: AllInPlano[]): PlanoDTO[] {
    return planos.map((plano) => this.mapPlanoToSupabase(plano));
  }
}

export const allinDataMapper = new AllInDataMapper();
