const { MongoClient } = require('mongodb');
require('dotenv').config();

async function migrarDados() {
  const uri = process.env.DB_CONEXAO_STRING.replace('/devagram', '');
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Conectado ao MongoDB');

    const dbTest = client.db('test');
    const dbDevagram = client.db('devagram');

    // Lista todas as coleções no banco de dados 'test'
    const collections = await dbTest.listCollections().toArray();
    
    console.log(`Encontradas ${collections.length} coleções para migrar`);

    // Para cada coleção, copiar os documentos para o banco 'devagram'
    for (const collectionInfo of collections) {
      const collectionName = collectionInfo.name;
      console.log(`Migrando coleção: ${collectionName}`);

      const sourceCollection = dbTest.collection(collectionName);
      const targetCollection = dbDevagram.collection(collectionName);

      // Verificar se a coleção já existe no banco de destino
      const documentCount = await targetCollection.countDocuments();
      if (documentCount > 0) {
        console.log(`A coleção ${collectionName} já existe no banco de dados de destino com ${documentCount} documentos. Pulando...`);
        continue;
      }

      // Obter todos os documentos da coleção de origem
      const documents = await sourceCollection.find({}).toArray();
      console.log(`Encontrados ${documents.length} documentos para migrar em ${collectionName}`);

      if (documents.length > 0) {
        // Inserir documentos na coleção de destino
        await targetCollection.insertMany(documents);
        console.log(`Migrados ${documents.length} documentos para ${collectionName}`);
      }
    }

    console.log('Migração concluída com sucesso!');
  } catch (error) {
    console.error('Erro durante a migração:', error);
  } finally {
    await client.close();
    console.log('Conexão com o MongoDB fechada');
  }
}

migrarDados().catch(console.error);