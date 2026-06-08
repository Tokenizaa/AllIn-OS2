import { EmbeddingService } from '../src/backend/modules/embeddings/services/embedding.service';

async function generateAllEmbeddings() {
  console.log('Starting batch embedding generation...');
  
  const embeddingService = EmbeddingService.getInstance();
  
  try {
    // Generate customer embeddings
    console.log('Generating customer embeddings...');
    await embeddingService.batchGenerateCustomerEmbeddings();
    console.log('Customer embeddings completed.');
    
    // Generate product embeddings
    console.log('Generating product embeddings...');
    await embeddingService.batchGenerateProductEmbeddings();
    console.log('Product embeddings completed.');
    
    console.log('All embeddings generated successfully!');
  } catch (error) {
    console.error('Error generating embeddings:', error);
    process.exit(1);
  }
}

generateAllEmbeddings();
