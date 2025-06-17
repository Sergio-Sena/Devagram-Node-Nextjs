const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

async function verificarSistema() {
  const uri = process.env.DB_CONEXAO_STRING;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Conectado ao MongoDB');

    const db = client.db();
    
    // Verificar usuários
    const usuarios = await db.collection('usuarios').find({}).toArray();
    console.log(`\nUsuários (${usuarios.length}):`);
    usuarios.forEach(u => {
      console.log(`- ${u.nome} (${u.email}): ${u.seguidores} seguidores, ${u.seguindo} seguindo, ${u.publicacoes} publicações`);
    });
    
    // Verificar publicações
    const publicacoes = await db.collection('publicacoes').find({}).toArray();
    console.log(`\nPublicações (${publicacoes.length}):`);
    for (const pub of publicacoes) {
      const usuario = await db.collection('usuarios').findOne({ _id: new ObjectId(pub.idUsuario) });
      console.log(`- Publicação de ${usuario?.nome || 'Usuário desconhecido'}: "${pub.descricao.substring(0, 30)}..."`);
      console.log(`  Likes: ${pub.likes?.length || 0}, Comentários: ${pub.comentarios?.length || 0}`);
    }
    
    // Verificar relações de seguidor
    const seguidores = await db.collection('seguidores').find({}).toArray();
    console.log(`\nRelações de seguidor (${seguidores.length}):`);
    for (const seg of seguidores) {
      const seguidor = await db.collection('usuarios').findOne({ _id: new ObjectId(seg.usuarioId) });
      const seguido = await db.collection('usuarios').findOne({ _id: new ObjectId(seg.usuarioSeguidoId) });
      console.log(`- ${seguidor?.nome || 'Desconhecido'} segue ${seguido?.nome || 'Desconhecido'}`);
    }
    
    console.log('\nVerificação do sistema concluída!');
    
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await client.close();
    console.log('Conexão com o MongoDB fechada');
  }
}

verificarSistema().catch(console.error);