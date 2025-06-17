const { MongoClient } = require('mongodb');
const md5 = require('md5');
require('dotenv').config();

async function limparECriarUsuarios() {
  const uri = process.env.DB_CONEXAO_STRING;
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Conectado ao MongoDB');

    const db = client.db();
    
    // Limpar coleções existentes
    console.log('Limpando coleções...');
    await db.collection('usuarios').deleteMany({});
    await db.collection('publicacoes').deleteMany({});
    await db.collection('seguidores').deleteMany({});
    console.log('Coleções limpas com sucesso');
    
    // Criar 3 novos usuários
    console.log('Criando novos usuários...');
    
    const senhaComum = md5('2700');
    
    const usuarios = [
      {
        nome: 'user1',
        email: 'user1@devagram.com',
        senha: senhaComum,
        avatar: null,
        seguidores: 0,
        seguindo: 0,
        publicacoes: 0
      },
      {
        nome: 'user2',
        email: 'user2@devagram.com',
        senha: senhaComum,
        avatar: null,
        seguidores: 0,
        seguindo: 0,
        publicacoes: 0
      },
      {
        nome: 'user3',
        email: 'user3@devagram.com',
        senha: senhaComum,
        avatar: null,
        seguidores: 0,
        seguindo: 0,
        publicacoes: 0
      }
    ];
    
    const resultado = await db.collection('usuarios').insertMany(usuarios);
    
    console.log(`${resultado.insertedCount} usuários criados com sucesso`);
    console.log('IDs dos usuários:');
    Object.values(resultado.insertedIds).forEach((id, index) => {
      console.log(`user${index + 1}: ${id}`);
    });
    
    console.log('\nCredenciais de acesso:');
    usuarios.forEach((user) => {
      console.log(`Email: ${user.email} | Senha: 2700`);
    });
    
  } catch (error) {
    console.error('Erro:', error);
  } finally {
    await client.close();
    console.log('Conexão com o MongoDB fechada');
  }
}

limparECriarUsuarios().catch(console.error);