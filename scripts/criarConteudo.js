const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

async function criarConteudo() {
  const uri = process.env.DB_CONEXAO_STRING;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Conectado ao MongoDB');

    const db = client.db();
    
    // Buscar os usuários
    const usuarios = await db.collection('usuarios').find({}).toArray();
    
    if (usuarios.length < 3) {
      console.error('Não há usuários suficientes no banco de dados');
      return;
    }
    
    console.log('Usuários encontrados:', usuarios.length);
    
    // Criar publicações para cada usuário
    console.log('Criando publicações...');
    
    const publicacoes = [
      {
        idUsuario: usuarios[0]._id.toString(),
        descricao: 'Minha primeira publicação no Devagram! #user1',
        foto: 'https://d300dg8l84vihh.cloudfront.net/publicacoes/sample1.jpg',
        data: new Date(),
        comentarios: [],
        likes: []
      },
      {
        idUsuario: usuarios[1]._id.toString(),
        descricao: 'Olá mundo! Esta é minha publicação #user2',
        foto: 'https://d300dg8l84vihh.cloudfront.net/publicacoes/sample2.jpg',
        data: new Date(),
        comentarios: [],
        likes: []
      },
      {
        idUsuario: usuarios[2]._id.toString(),
        descricao: 'Compartilhando momentos especiais #user3',
        foto: 'https://d300dg8l84vihh.cloudfront.net/publicacoes/sample3.jpg',
        data: new Date(),
        comentarios: [],
        likes: []
      }
    ];
    
    const resultadoPublicacoes = await db.collection('publicacoes').insertMany(publicacoes);
    console.log(`${resultadoPublicacoes.insertedCount} publicações criadas`);
    
    // Atualizar contador de publicações
    for (let i = 0; i < usuarios.length; i++) {
      await db.collection('usuarios').updateOne(
        { _id: usuarios[i]._id },
        { $set: { publicacoes: 1 } }
      );
    }
    
    // Criar relações de seguidor
    console.log('Criando relações de seguidor...');
    
    const seguidores = [
      // user1 segue user2
      {
        usuarioId: usuarios[0]._id.toString(),
        usuarioSeguidoId: usuarios[1]._id.toString()
      },
      // user1 segue user3
      {
        usuarioId: usuarios[0]._id.toString(),
        usuarioSeguidoId: usuarios[2]._id.toString()
      },
      // user2 segue user1
      {
        usuarioId: usuarios[1]._id.toString(),
        usuarioSeguidoId: usuarios[0]._id.toString()
      },
      // user3 segue user1
      {
        usuarioId: usuarios[2]._id.toString(),
        usuarioSeguidoId: usuarios[0]._id.toString()
      }
    ];
    
    const resultadoSeguidores = await db.collection('seguidores').insertMany(seguidores);
    console.log(`${resultadoSeguidores.insertedCount} relações de seguidor criadas`);
    
    // Atualizar contadores de seguidores e seguindo
    await db.collection('usuarios').updateOne(
      { _id: usuarios[0]._id },
      { $set: { seguindo: 2, seguidores: 2 } }
    );
    
    await db.collection('usuarios').updateOne(
      { _id: usuarios[1]._id },
      { $set: { seguindo: 1, seguidores: 1 } }
    );
    
    await db.collection('usuarios').updateOne(
      { _id: usuarios[2]._id },
      { $set: { seguindo: 1, seguidores: 1 } }
    );
    
    console.log('Contadores de usuários atualizados');
    
    console.log('\nConteúdo criado com sucesso!');
    
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await client.close();
    console.log('Conexão com o MongoDB fechada');
  }
}

criarConteudo().catch(console.error);