const { MongoClient } = require('mongodb');
require('dotenv').config();

async function verificarMigracao() {
  const uri = process.env.DB_CONEXAO_STRING;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Conectado ao MongoDB');

    const dbDevagram = client.db('devagram');

    // Lista todas as coleções no banco de dados 'devagram'
    const collections = await dbDevagram.listCollections().toArray();
    
    console.log(`\nBanco de dados 'devagram' contém ${collections.length} coleções:`);
    
    // Para cada coleção, mostrar o número de documentos
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      const collection = dbDevagram.collection(collectionName);
      const count = await collection.countDocuments();
      
      console.log(`- ${collectionName}: ${count} documentos`);
    }

    console.log('\nVerificação concluída!');
    console.log('A aplicação está configurada para usar o banco de dados "devagram".');
    
  } catch (error) {
    console.error('Erro durante a verificação:', error);
  } finally {
    await client.close();
    console.log('Conexão com o MongoDB fechada');
  }
}

verificarMigracao().catch(console.error);