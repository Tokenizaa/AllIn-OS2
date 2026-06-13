import postgres from 'postgres'
import dotenv from 'dotenv'

dotenv.config()

const connectionString = process.env.DATABASE_URL

async function testConnection() {
  const sql = postgres(connectionString)
  
  try {
    console.log('Testando conexão com o banco de dados...')
    console.log('DATABASE_URL:', connectionString.replace(/:[^:]+@/, ':****@'))
    
    // Testar conexão simples
    const result = await sql`SELECT version()`
    console.log('✅ Conexão estabelecida com sucesso!')
    console.log('Versão do PostgreSQL:', result[0].version)
    
    // Listar schemas
    const schemas = await sql`
      SELECT schema_name 
      FROM information_schema.schemata 
      WHERE schema_name NOT IN ('pg_catalog', 'information_schema')
      ORDER BY schema_name
    `
    console.log('\nSchemas existentes:', schemas.map(s => s.schema_name))
    
    // Listar tabelas
    const tables = await sql`
      SELECT schemaname, tablename 
      FROM pg_tables 
      WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
      ORDER BY schemaname, tablename
    `
    console.log('\nTabelas existentes:', tables.length)
    if (tables.length > 0) {
      console.log(tables.map(t => `${t.schemaname}.${t.tablename}`).join('\n'))
    }
    
  } catch (error) {
    console.error('❌ Erro na conexão:', error.message)
    process.exit(1)
  } finally {
    await sql.end()
  }
}

testConnection()
