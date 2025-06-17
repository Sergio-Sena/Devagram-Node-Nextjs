const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

async function corrigirDadosPerfil() {
  const uri = process.env.DB_CONEXAO_STRING;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Conectado ao MongoDB');

    const db = client.db();
    
    // Buscar os usuários
    const usuarios = await db.collection('usuarios').find({}).toArray();
    console.log(`Encontrados ${usuarios.length} usuários`);
    
    // Para cada usuário, verificar e corrigir os dados de perfil
    for (const usuario of usuarios) {
      console.log(`\nVerificando usuário: ${usuario.nome}`);
      
      // Verificar se seguidores e seguindo são números
      const atualizacoes = {};
      
      if (typeof usuario.seguidores !== 'number') {
        console.log(`- Corrigindo seguidores: ${usuario.seguidores} -> 0`);
        atualizacoes.seguidores = 0;
      }
      
      if (typeof usuario.seguindo !== 'number') {
        console.log(`- Corrigindo seguindo: ${usuario.seguindo} -> 0`);
        atualizacoes.seguindo = 0;
      }
      
      if (typeof usuario.publicacoes !== 'number') {
        console.log(`- Corrigindo publicacoes: ${usuario.publicacoes} -> 0`);
        atualizacoes.publicacoes = 0;
      }
      
      // Contar quantos usuários este usuário segue
      const seguindo = await db.collection('seguidores').countDocuments({
        usuarioId: usuario._id.toString()
      });
      
      // Contar quantos usuários seguem este usuário
      const seguidores = await db.collection('seguidores').countDocuments({
        usuarioSeguidoId: usuario._id.toString()
      });
      
      // Contar publicações
      const publicacoes = await db.collection('publicacoes').countDocuments({
        idUsuario: usuario._id.toString()
      });
      
      // Verificar se os contadores estão corretos
      if (usuario.seguidores !== seguidores) {
        console.log(`- Corrigindo seguidores: ${usuario.seguidores} -> ${seguidores}`);
        atualizacoes.seguidores = seguidores;
      }
      
      if (usuario.seguindo !== seguindo) {
        console.log(`- Corrigindo seguindo: ${usuario.seguindo} -> ${seguindo}`);
        atualizacoes.seguindo = seguindo;
      }
      
      if (usuario.publicacoes !== publicacoes) {
        console.log(`- Corrigindo publicacoes: ${usuario.publicacoes} -> ${publicacoes}`);
        atualizacoes.publicacoes = publicacoes;
      }
      
      // Atualizar o usuário se necessário
      if (Object.keys(atualizacoes).length > 0) {
        await db.collection('usuarios').updateOne(
          { _id: usuario._id },
          { $set: atualizacoes }
        );
        console.log(`- Usuário ${usuario.nome} atualizado`);
      } else {
        console.log(`- Usuário ${usuario.nome} já está correto`);
      }
    }
    
    console.log('\nDados de perfil corrigidos com sucesso!');
    
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await client.close();
    console.log('Conexão com o MongoDB fechada');
  }
}

corrigirDadosPerfil().catch(console.error);