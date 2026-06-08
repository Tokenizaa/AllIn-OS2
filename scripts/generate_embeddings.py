import requests
import json
import os
import time
from supabase import create_client, Client

# Supabase configuration
SUPABASE_URL = os.getenv('SUPABASE_URL', 'https://isjsydhuqurneswstlyx.supabase.co')
SUPABASE_KEY = os.getenv('SUPABASE_SERVICE_ROLE_KEY') or os.getenv('SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzanN5ZGh1cXVybmVzd3N0bHl4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4OTAwMTIsImV4cCI6MjA5NDQ2NjAxMn0.u96bKUU_L4ahDkdjtzIk1kjXUtpGcR1bjbgWTfPPfUs')

# Ollama configuration
OLLAMA_BASE_URL = 'http://localhost:11434'
OLLAMA_MODEL = 'nomic-embed-text'

def generate_embedding(text: str, max_retries: int = 3) -> list:
    """Generate embedding using Ollama with retry logic"""
    for attempt in range(max_retries):
        try:
            response = requests.post(
                f'{OLLAMA_BASE_URL}/api/embeddings',
                json={
                    'model': OLLAMA_MODEL,
                    'prompt': text
                },
                timeout=30
            )
            response.raise_for_status()
            return response.json()['embedding']
        except (requests.exceptions.RequestException, requests.exceptions.Timeout) as e:
            if attempt < max_retries - 1:
                wait_time = (attempt + 1) * 2  # Exponential backoff: 2, 4, 6 seconds
                print(f'  Retry {attempt + 1}/{max_retries} after {wait_time}s...')
                time.sleep(wait_time)
            else:
                raise e

def create_customer_content(customer: dict) -> str:
    """Create content string for customer embedding"""
    return f"""
      Customer: {customer.get('nome_completo', '')}
      Email: {customer.get('email', '')}
      CPF: {customer.get('cpf', '')}
      Phone: {customer.get('telefone', '')}
      Status: {customer.get('status', '')}
      Type: {customer.get('customer_type', '')}
      Qualification: {customer.get('qualification', '')}
      Total Purchases: {customer.get('total_compras', 0)}
      Number of Orders: {customer.get('numero_pedidos', 0)}
    """.strip()

def create_product_content(product: dict) -> str:
    """Create content string for product embedding"""
    return f"""
      Product: {product.get('nome', '')}
      Description: {product.get('descricao', '')}
      Category: {product.get('categoria', '')}
      Price: {product.get('preco', 0)}
      Stock: {product.get('estoque', 0)}
      SKU: {product.get('sku', '')}
    """.strip()

def generate_customer_embeddings(supabase: Client):
    """Generate embeddings for all customers"""
    print('Fetching customers...')
    customers = supabase.table('customers').select('*').execute()
    
    print(f'Found {len(customers.data)} customers')
    
    for customer in customers.data:
        try:
            content = create_customer_content(customer)
            embedding = generate_embedding(content)
            
            supabase.table('customer_embeddings').upsert({
                'customer_id': customer['id'],
                'embedding': embedding,
                'content': content,
                'embedding_model': OLLAMA_MODEL,
                'metadata': {
                    'customer_name': customer.get('nome_completo'),
                    'customer_email': customer.get('email'),
                    'customer_type': customer.get('customer_type'),
                }
            }).execute()
            
            print(f'Generated embedding for customer {customer.get("nome_completo", customer["id"])}')
            time.sleep(1)  # Delay between requests
        except Exception as e:
            print(f'Error generating embedding for customer {customer["id"]}: {e}')

def generate_product_embeddings(supabase: Client):
    """Generate embeddings for all products"""
    print('Fetching products...')
    products = supabase.table('products').select('*').execute()
    
    print(f'Found {len(products.data)} products')
    
    for product in products.data:
        try:
            content = create_product_content(product)
            embedding = generate_embedding(content)
            
            supabase.table('product_embeddings').upsert({
                'product_id': product['id'],
                'embedding': embedding,
                'content': content,
                'embedding_model': OLLAMA_MODEL,
                'metadata': {
                    'product_name': product.get('nome'),
                    'product_category': product.get('categoria'),
                    'product_price': product.get('preco'),
                }
            }).execute()
            
            print(f'Generated embedding for product {product.get("nome", product["id"])}')
            time.sleep(1)  # Delay between requests
        except Exception as e:
            print(f'Error generating embedding for product {product["id"]}: {e}')

def main():
    print('Starting batch embedding generation...')
    print(f'Ollama URL: {OLLAMA_BASE_URL}')
    print(f'Ollama Model: {OLLAMA_MODEL}')
    
    # Initialize Supabase client
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    try:
        # Generate customer embeddings
        print('\n=== Generating Customer Embeddings ===')
        generate_customer_embeddings(supabase)
        
        # Generate product embeddings
        print('\n=== Generating Product Embeddings ===')
        generate_product_embeddings(supabase)
        
        print('\nAll embeddings generated successfully!')
    except Exception as e:
        print(f'Error: {e}')
        exit(1)

if __name__ == '__main__':
    main()
