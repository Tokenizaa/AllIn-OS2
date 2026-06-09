import { supabase } from "../../../shared/infrastructure/supabase/client";

export class EmbeddingService {
  private static instance: EmbeddingService;
  private ollamaBaseUrl: string;

  private constructor() {
    // Use local Ollama instance
    this.ollamaBaseUrl = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
  }

  static getInstance(): EmbeddingService {
    if (!EmbeddingService.instance) {
      EmbeddingService.instance = new EmbeddingService();
    }
    return EmbeddingService.instance;
  }

  /**
   * Generate embedding for customer data
   */
  async generateCustomerEmbedding(idComprador: string): Promise<void> {
    try {
      // Fetch customer data
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .select('*')
        .eq('id', idComprador)
        .single();

      if (customerError) throw customerError;
      if (!customer) {
        console.log(`Customer ${idComprador} not found`);
        return;
      }

      // Create content string for embedding
      const content = this.createCustomerContent(customer);

      // Generate embedding
      const embedding = await this.generateEmbedding(content);

      // Store embedding
      const { error: insertError } = await supabase
        .from('customer_embeddings')
        .upsert({
          id_comprador: idComprador,
          embedding: embedding,
          content: content,
          embedding_model: 'nomic-embed-text',
          metadata: {
            customer_name: customer.nome_completo,
            customer_email: customer.email,
            customer_type: customer.customer_type,
          },
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id_comprador'
        });

      if (insertError) throw insertError;

      console.log(`Customer embedding generated for ${idComprador}`);
    } catch (error) {
      console.error('Error generating customer embedding:', error);
      throw error;
    }
  }

  /**
   * Generate embedding for product data
   */
  async generateProductEmbedding(productId: string): Promise<void> {
    try {
      // Fetch product data
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (productError) throw productError;
      if (!product) {
        console.log(`Product ${productId} not found`);
        return;
      }

      // Create content string for embedding
      const content = this.createProductContent(product);

      // Generate embedding
      const embedding = await this.generateEmbedding(content);

      // Store embedding
      const { error: insertError } = await supabase
        .from('product_embeddings')
        .upsert({
          product_id: productId,
          embedding: embedding,
          content: content,
          embedding_model: 'nomic-embed-text',
          metadata: {
            product_name: product.nome,
            product_category: product.categoria,
            product_price: product.preco,
          },
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'product_id'
        });

      if (insertError) throw insertError;

      console.log(`Product embedding generated for ${productId}`);
    } catch (error) {
      console.error('Error generating product embedding:', error);
      throw error;
    }
  }

  /**
   * Generate embedding for document content
   */
  async generateDocumentEmbedding(
    documentId: string,
    documentType: string,
    sectionId: string | null,
    content: string
  ): Promise<void> {
    try {
      // Generate embedding
      const embedding = await this.generateEmbedding(content);

      // Store embedding
      const { error: insertError } = await supabase
        .from('document_embeddings')
        .upsert({
          document_id: documentId,
          document_type: documentType,
          section_id: sectionId,
          embedding: embedding,
          content: content,
          embedding_model: 'nomic-embed-text',
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'document_id,section_id'
        });

      if (insertError) throw insertError;

      console.log(`Document embedding generated for ${documentId}`);
    } catch (error) {
      console.error('Error generating document embedding:', error);
      throw error;
    }
  }

  /**
   * Generate embedding using Ollama API
   */
  private async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await fetch(`${this.ollamaBaseUrl}/api/embeddings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'nomic-embed-text', // Ollama embedding model
          prompt: text,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.embedding;
    } catch (error) {
      console.error('Error calling Ollama API:', error);
      throw error;
    }
  }

  /**
   * Create content string for customer embedding
   */
  private createCustomerContent(customer: any): string {
    return `
      Customer: ${customer.nome_completo || ''}
      Email: ${customer.email || ''}
      CPF: ${customer.cpf || ''}
      Phone: ${customer.telefone || ''}
      Status: ${customer.status || ''}
      Type: ${customer.customer_type || ''}
      Qualification: ${customer.qualification || ''}
      Total Purchases: ${customer.total_compras || 0}
      Number of Orders: ${customer.numero_pedidos || 0}
    `.trim();
  }

  /**
   * Create content string for product embedding
   */
  private createProductContent(product: any): string {
    return `
      Product: ${product.nome || ''}
      Description: ${product.descricao || ''}
      Category: ${product.categoria || ''}
      Price: ${product.preco || 0}
      Stock: ${product.estoque || 0}
      SKU: ${product.sku || ''}
    `.trim();
  }

  /**
   * Semantic search for customers
   */
  async searchCustomers(query: string, limit: number = 10): Promise<any[]> {
    try {
      // Generate embedding for query
      const queryEmbedding = await this.generateEmbedding(query);

      // Search using pgvector
      const { data, error } = await supabase.rpc('search_customers_semantic', {
        query_embedding: queryEmbedding,
        match_threshold: 0.5,
        match_count: limit,
      });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error searching customers:', error);
      throw error;
    }
  }

  /**
   * Semantic search for products
   */
  async searchProducts(query: string, limit: number = 10): Promise<any[]> {
    try {
      // Generate embedding for query
      const queryEmbedding = await this.generateEmbedding(query);

      // Search using pgvector
      const { data, error } = await supabase.rpc('search_products_semantic', {
        query_embedding: queryEmbedding,
        match_threshold: 0.5,
        match_count: limit,
      });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }

  /**
   * Semantic search for documents
   */
  async searchDocuments(query: string, documentType?: string, limit: number = 10): Promise<any[]> {
    try {
      // Generate embedding for query
      const queryEmbedding = await this.generateEmbedding(query);

      // Search using pgvector
      const { data, error } = await supabase.rpc('search_documents_semantic', {
        query_embedding: queryEmbedding,
        document_type_filter: documentType || null,
        match_threshold: 0.5,
        match_count: limit,
      });

      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Error searching documents:', error);
      throw error;
    }
  }

  /**
   * Batch generate customer embeddings
   */
  async batchGenerateCustomerEmbeddings(): Promise<void> {
    try {
      console.log('Starting batch customer embedding generation...');

      // Fetch all customers
      const { data: customers, error: customersError } = await supabase
        .from('customers')
        .select('id');

      if (customersError) throw customersError;

      if (!customers || customers.length === 0) {
        console.log('No customers found');
        return;
      }

      // Generate embeddings for each customer
      for (const customer of customers) {
        await this.generateCustomerEmbedding(customer.id);
      }

      console.log(`Batch customer embedding generation completed for ${customers.length} customers`);
    } catch (error) {
      console.error('Error in batch customer embedding generation:', error);
      throw error;
    }
  }

  /**
   * Batch generate product embeddings
   */
  async batchGenerateProductEmbeddings(): Promise<void> {
    try {
      console.log('Starting batch product embedding generation...');

      // Fetch all products
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('id');

      if (productsError) throw productsError;

      if (!products || products.length === 0) {
        console.log('No products found');
        return;
      }

      // Generate embeddings for each product
      for (const product of products) {
        await this.generateProductEmbedding(product.id);
      }

      console.log(`Batch product embedding generation completed for ${products.length} products`);
    } catch (error) {
      console.error('Error in batch product embedding generation:', error);
      throw error;
    }
  }
}
