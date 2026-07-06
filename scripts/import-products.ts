import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import { fileURLToPath } from 'url';
import 'dotenv/config';

// Configurar __dirname para ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuração do Supabase
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

console.log('🔗 Conectando ao Supabase:', supabaseUrl);

const supabase = createClient(supabaseUrl, supabaseKey);

interface CSVProduct {
  ID: string;
  SKU: string;
  Imagem: string;
  Produto: string;
  Modelo: string;
  Categorias: string;
  Pontos: string;
  Preço: string;
  Quantidade: string;
  'Produto Destacado': string;
  Situação: string;
  Etiquetas: string;
}

async function parseCSV(filePath: string): Promise<CSVProduct[]> {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });
  return records as CSVProduct[];
}

function mapCSVToProduct(csvProduct: CSVProduct) {
  // Extrair preço numérico (remover R$, espaços e converter para número)
  const priceStr = csvProduct.Preço.replace('R$', '').replace(/\s/g, '').replace(',', '.');
  const price = parseFloat(priceStr) || 0;

  // Converter quantidade para número
  const stock = parseInt(csvProduct.Quantidade) || 0;

  // Determinar status baseado em "Situação"
  const is_active = csvProduct.Situação.toLowerCase() === 'habilitado';

  // Determinar se é produto destacado
  const is_featured = csvProduct['Produto Destacado'].toLowerCase() === 'sim';

  // Extrair pontos se disponível
  const points = parseInt(csvProduct.Pontos) || 0;

  return {
    id: csvProduct.ID || crypto.randomUUID(),
    nome: csvProduct.Produto,
    sku: csvProduct.SKU || csvProduct.Modelo || null,
    category: csvProduct.Categorias || 'Geral',
    price: price,
    images: csvProduct.Imagem ? [csvProduct.Imagem] : [],
    description: csvProduct.Etiquetas || '',
    manufacturer: 'Allin',
    stock: stock,
    status: is_active ? 'active' : 'inactive',
    metadata: {
      modelo: csvProduct.Modelo,
      pontos: points,
      produto_destacado: is_featured,
      etiquetas: csvProduct.Etiquetas,
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

async function importProducts() {
  try {
    console.log('📦 Iniciando importação de produtos...');

    // Caminho do arquivo CSV
    const csvPath = path.join(__dirname, '../docs/listando_produtos2026_06_20_22_27_17.csv');
    
    // Ler e parsear o CSV
    const csvProducts = await parseCSV(csvPath);
    console.log(`📄 ${csvProducts.length} produtos encontrados no CSV`);

    // Mapear produtos
    const products = csvProducts.map(mapCSVToProduct);
    console.log(`🔄 ${products.length} produtos mapeados`);

    // Inserir produtos no Supabase em lotes
    const batchSize = 50;
    let imported = 0;
    let errors = 0;

    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      
      const { data, error } = await supabase
        .schema('commerce')
        .from('produtos')
        .upsert(batch, { onConflict: 'id' });

      if (error) {
        console.error(`❌ Erro ao importar lote ${i}-${i + batchSize}:`, error);
        errors += batch.length;
      } else {
        console.log(`✅ Lote ${i}-${i + batchSize} importado com sucesso (${batch.length} produtos)`);
        imported += batch.length;
      }
    }

    console.log('\n📊 Resumo da importação:');
    console.log(`✅ Produtos importados: ${imported}`);
    console.log(`❌ Erros: ${errors}`);
    console.log(`📦 Total processado: ${products.length}`);

  } catch (error) {
    console.error('❌ Erro durante a importação:', error);
    process.exit(1);
  }
}

// Executar importação
importProducts();
