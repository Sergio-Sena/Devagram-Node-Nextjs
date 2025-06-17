const axios = require('axios');
const FormData = require('form-data');
const { MongoClient } = require('mongodb');
require('dotenv').config();

async function testarAtualizacaoUsuario() {
  const uri = process.env.DB_CONEXAO_STRING;
  const client = new MongoClient(uri);
  let token = null;

  try {
    // 1. Conectar ao MongoDB
    await client.connect();
    console.log('Conectado ao MongoDB');
    const db = client.db();

    // 2. Obter um usuário para login
    const usuario = await db.collection('usuarios').findOne({ email: 'user1@devagram.com' });
    if (!usuario) {
      console.error('Usuário de teste não encontrado');
      return;
    }
    console.log(`Usuário encontrado: ${usuario.nome} (${usuario._id})`);
    console.log(`Dados atuais: publicações=${usuario.publicacoes}, seguidores=${usuario.seguidores}, seguindo=${usuario.seguindo}`);

    // 3. Fazer login para obter token
    console.log('Fazendo login...');
    const loginResponse = await axios.post('http://localhost:3000/api/login', {
      login: 'user1@devagram.com',
      senha: '2700'
    });

    if (!loginResponse.data.token) {
      console.error('Falha ao fazer login:', loginResponse.data);
      return;
    }

    token = loginResponse.data.token;
    console.log('Login bem-sucedido, token obtido');

    // 4. Atualizar o nome do usuário
    console.log('Atualizando nome do usuário...');
    const novoNome = `Usuário Teste ${new Date().toISOString().substring(0, 10)}`;
    
    const formData = new FormData();
    formData.append('nome', novoNome);
    
    const updateResponse = await axios.put(
      `http://localhost:3000/api/usuario`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          ...formData.getHeaders()
        }
      }
    );
    
    console.log('Resposta da atualização:', updateResponse.data);

    // 5. Verificar se o usuário foi atualizado corretamente
    const usuarioAtualizado = await db.collection('usuarios').findOne({ _id: usuario._id });
    console.log(`Usuário após atualização: ${usuarioAtualizado.nome} (${usuarioAtualizado._id})`);
    console.log(`Dados após atualização: publicações=${usuarioAtualizado.publicacoes}, seguidores=${usuarioAtualizado.seguidores}, seguindo=${usuarioAtualizado.seguindo}`);
    
    // 6. Verificar se os contadores foram preservados
    if (usuarioAtualizado.publicacoes === usuario.publicacoes &&
        usuarioAtualizado.seguidores === usuario.seguidores &&
        usuarioAtualizado.seguindo === usuario.seguindo) {
      console.log('Teste bem-sucedido: Os contadores foram preservados!');
    } else {
      console.error('Teste falhou: Os contadores foram alterados');
      console.error(`Antes: publicações=${usuario.publicacoes}, seguidores=${usuario.seguidores}, seguindo=${usuario.seguindo}`);
      console.error(`Depois: publicações=${usuarioAtualizado.publicacoes}, seguidores=${usuarioAtualizado.seguidores}, seguindo=${usuarioAtualizado.seguindo}`);
    }

  } catch (error) {
    console.error('Erro durante o teste:', error.response?.data || error.message);
  } finally {
    await client.close();
    console.log('Conexão com o MongoDB fechada');
  }
}

testarAtualizacaoUsuario().catch(console.error);