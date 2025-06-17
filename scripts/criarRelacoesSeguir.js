const { MongoClient } = require('mongodb');
require('dotenv').config();

async function criarRelacoesSeguir() {
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
    console.log('IDs dos usuários:');
    usuarios.forEach((u, i) => {
      console.log(`user${i+1}: ${u._id} (${u.nome})`);
    });
    
    // Limpar relações de seguidor existentes
    await db.collection('seguidores').deleteMany({});
    console.log('Relações de seguidor existentes removidas');
    
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
      // user2 segue user3
      {
        usuarioId: usuarios[1]._id.toString(),
        usuarioSeguidoId: usuarios[2]._id.toString()
      },
      // user3 segue user1
      {
        usuarioId: usuarios[2]._id.toString(),
        usuarioSeguidoId: usuarios[0]._id.toString()
      },
      // user3 segue user2
      {
        usuarioId: usuarios[2]._id.toString(),
        usuarioSeguidoId: usuarios[1]._id.toString()
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
      { $set: { seguindo: 2, seguidores: 2 } }
    );
    
    await db.collection('usuarios').updateOne(
      { _id: usuarios[2]._id },
      { $set: { seguindo: 2, seguidores: 2 } }
    );
    
    console.log('Contadores de usuários atualizados');
    
    console.log('\nRelações de seguidor criadas com sucesso!');
    console.log('Agora você deve conseguir ver as publicações de outros usuários no feed.');
    console.log('Faça logout e login novamente para ver as mudanças.');
    
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await client.close();
    console.log('Conexão com o MongoDB fechada');
  }
}

criarRelacoesSeguir().catch(console.error);