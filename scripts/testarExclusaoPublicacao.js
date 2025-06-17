const axios = require('axios');
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

async function testarExclusaoPublicacao() {
  const uri = process.env.DB_CONEXAO_STRING;
  const client = new MongoClient(uri);
  let token = null;
  let publicacaoId = null;

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

    // 4. Criar uma publicação de teste
    console.log('Criando publicação de teste...');
    
    // Primeiro, vamos verificar se o usuário já tem publicações
    const publicacoesExistentes = await db.collection('publicacoes').find({ 
      idUsuario: usuario._id.toString() 
    }).toArray();
    
    if (publicacoesExistentes.length > 0) {
      // Usar uma publicação existente
      publicacaoId = publicacoesExistentes[0]._id;
      console.log(`Usando publicação existente: ${publicacaoId}`);
    } else {
      // Criar uma nova publicação diretamente no banco
      const novaPublicacao = {
        idUsuario: usuario._id.toString(),
        descricao: 'Publicação de teste para exclusão',
        foto: 'https://d300dg8l84vihh.cloudfront.net/publicacoes/teste.jpg',
        data: new Date(),
        comentarios: [],
        likes: []
      };
      
      const resultado = await db.collection('publicacoes').insertOne(novaPublicacao);
      publicacaoId = resultado.insertedId;
      console.log(`Nova publicação criada: ${publicacaoId}`);
      
      // Atualizar contador de publicações do usuário
      await db.collection('usuarios').updateOne(
        { _id: usuario._id },
        { $inc: { publicacoes: 1 } }
      );
    }

    // 5. Testar a exclusão da publicação
    console.log('Testando exclusão da publicação...');
    const deleteResponse = await axios.delete(`http://localhost:3000/api/excluirPublicacao?id=${publicacaoId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('Resposta da exclusão:', deleteResponse.data);

    // 6. Verificar se a publicação foi realmente excluída
    const publicacaoAposExclusao = await db.collection('publicacoes').findOne({ 
      _id: new ObjectId(publicacaoId) 
    });
    
    if (!publicacaoAposExclusao) {
      console.log('Teste bem-sucedido: Publicação foi excluída com sucesso!');
    } else {
      console.error('Teste falhou: Publicação ainda existe no banco de dados');
    }

    // 7. Verificar se o contador de publicações do usuário foi atualizado
    const usuarioAtualizado = await db.collection('usuarios').findOne({ _id: usuario._id });
    console.log(`Contador de publicações do usuário: ${usuarioAtualizado.publicacoes}`);

  } catch (error) {
    console.error('Erro durante o teste:', error.response?.data || error.message);
  } finally {
    await client.close();
    console.log('Conexão com o MongoDB fechada');
  }
}

testarExclusaoPublicacao().catch(console.error);