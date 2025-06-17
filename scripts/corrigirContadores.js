const { MongoClient } = require('mongodb');
require('dotenv').config();

async function corrigirContadores() {
  const uri = process.env.DB_CONEXAO_STRING;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Conectado ao MongoDB');

    const db = client.db();
    
    // Buscar os usuários
    const usuarios = await db.collection('usuarios').find({}).toArray();
    console.log(`Encontrados ${usuarios.length} usuários`);
    
    // Para cada usuário, calcular o número correto de seguidores e seguindo
    for (const usuario of usuarios) {
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
      
      // Atualizar os contadores no usuário
      await db.collection('usuarios').updateOne(
        { _id: usuario._id },
        { $set: { 
            seguindo: seguindo,
            seguidores: seguidores,
            publicacoes: publicacoes
          } 
        }
      );
      
      console.log(`Usuário ${usuario.nome} atualizado: ${seguidores} seguidores, ${seguindo} seguindo, ${publicacoes} publicações`);
    }
    
    console.log('\nContadores corrigidos com sucesso!');
    console.log('Faça logout e login novamente para ver as mudanças.');
    
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await client.close();
    console.log('Conexão com o MongoDB fechada');
  }
}

corrigirContadores().catch(console.error);