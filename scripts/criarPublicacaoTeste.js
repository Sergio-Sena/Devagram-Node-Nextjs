const { MongoClient } = require('mongodb');
require('dotenv').config();

async function criarPublicacaoTeste() {
  const uri = process.env.DB_CONEXAO_STRING;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Conectado ao MongoDB');
    const db = client.db();

    // Obter um usuário para criar a publicação
    const usuario = await db.collection('usuarios').findOne({ email: 'user1@devagram.com' });
    if (!usuario) {
      console.error('Usuário de teste não encontrado');
      return;
    }
    console.log(`Usuário encontrado: ${usuario.nome} (${usuario._id})`);

    // Criar uma nova publicação
    const novaPublicacao = {
      idUsuario: usuario._id.toString(),
      descricao: 'Publicação de teste para exclusão - ' + new Date().toISOString(),
      foto: 'https://d300dg8l84vihh.cloudfront.net/publicacoes/teste.jpg',
      data: new Date(),
      comentarios: [],
      likes: []
    };
    
    const resultado = await db.collection('publicacoes').insertOne(novaPublicacao);
    console.log(`Nova publicação criada: ${resultado.insertedId}`);
    
    // Atualizar contador de publicações do usuário
    await db.collection('usuarios').updateOne(
      { _id: usuario._id },
      { $inc: { publicacoes: 1 } }
    );
    
    // Verificar o contador de publicações do usuário
    const usuarioAtualizado = await db.collection('usuarios').findOne({ _id: usuario._id });
    console.log(`Contador de publicações do usuário: ${usuarioAtualizado.publicacoes}`);

  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await client.close();
    console.log('Conexão com o MongoDB fechada');
  }
}

criarPublicacaoTeste().catch(console.error);