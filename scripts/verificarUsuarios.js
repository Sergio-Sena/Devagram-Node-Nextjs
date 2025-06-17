const { MongoClient } = require('mongodb');
require('dotenv').config();

async function verificarUsuarios() {
  const uri = process.env.DB_CONEXAO_STRING;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Conectado ao MongoDB');

    const db = client.db();
    const usuariosCollection = db.collection('usuarios');
    
    // Listar todos os usuários
    const usuarios = await usuariosCollection.find({}).toArray();
    
    console.log(`\nEncontrados ${usuarios.length} usuários no banco de dados:`);
    
    usuarios.forEach((usuario, index) => {
      console.log(`\nUsuário ${index + 1}:`);
      console.log(`ID: ${usuario._id}`);
      console.log(`Nome: ${usuario.nome}`);
      console.log(`Email: ${usuario.email}`);
      console.log(`Avatar: ${usuario.avatar || 'Não definido'}`);
    });

  } catch (error) {
    console.error('Erro ao verificar usuários:', error);
  } finally {
    await client.close();
    console.log('\nConexão com o MongoDB fechada');
  }
}

verificarUsuarios().catch(console.error);