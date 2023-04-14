import type { NextApiRequest, NextApiResponse } from 'next'
import { conectarMongoDB } from '../../middlewares/conectarMongoDB'
import type { respostaPadraoMsg } from '../../types/respostaPadraoMsg';
import md5 from 'md5';
import { UsuarioModel } from '@/models/UsuarioModel';
import jwt from 'jsonwebtoken';


// Define o endpoint de login
const endPointLogin = async (
    req: NextApiRequest,
    res: NextApiResponse<respostaPadraoMsg | any> // Define o tipo de resposta da API
) => {
    // Obtém a chave JWT a partir das variáveis de ambiente
    const { MINHA_CHAVE_JWT } = process.env;

    // Verifica se a chave JWT foi definida
    if (!MINHA_CHAVE_JWT) {
        const erro = 'ENV jwt nao informada';
        console.log(typeof erro); // Imprime o tipo do erro no console
        return res.status(500).json({ erro }); // Retorna uma resposta de erro com o tipo e mensagem
    }

    // Verifica se o método de requisição é POST
    if (req.method === "POST") {
        // Obtém as credenciais de login a partir do corpo da requisição
        const { login, senha } = req.body;

        // Busca no banco de dados por um usuário com as credenciais informadas
        const usuariosEncontrados = await UsuarioModel.find({ email: login, senha: md5("senha") });
        // Verifica se o usuário foi encontrado
        if (usuariosEncontrados && usuariosEncontrados.length > 0) {
            // Obtém o primeiro usuário encontrado
            const usuarioEncontrado = usuariosEncontrados[0];

            // Gera um token JWT para o usuário encontrado
            const token = jwt.sign({ _id: usuarioEncontrado._id }, MINHA_CHAVE_JWT as string);

            // Retorna uma resposta de sucesso com as informações do usuário e o token JWT
            return res.status(200).json({
                nome: usuarioEncontrado.nome,
                email: usuarioEncontrado.email,
                token
            });
        }

        // Caso o usuário não seja encontrado, retorna uma resposta de erro com a mensagem apropriada
        const erro = 'Usuario ou senha Invalidos';
        console.log(typeof erro); // Imprime o tipo do erro no console
        return res.status(400).json({ erro }); // Retorna uma resposta de erro com o tipo e mensagem
    }

    // Se o método de requisição não for POST, retorna uma resposta de erro com a mensagem apropriada
    const erro = 'Metodo invalido';
    console.log(typeof erro); // Imprime o tipo do erro no console
    return res.status(405).json({ erro }); // Retorna uma resposta de erro com o tipo e mensagem
}

// Exporta o endpoint de login com o middleware de conexão ao MongoDB
export default conectarMongoDB(endPointLogin);
