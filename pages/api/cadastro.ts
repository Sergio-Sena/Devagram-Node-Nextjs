import type { NextApiRequest, NextApiResponse } from 'next';
import type { respostaPadraoMsg } from '../../types/respostaPadraoMsg';
import type { CadastroRequisicao } from '../../types/cadastroRequisicao';
import { UsuarioModel } from '../../models/UsuarioModel'
import { conectarMongoDB } from '@/middlewares/conectarMongoDB';
import md5 from 'md5';
import { upload, uploadImagemCosmic } from '../../services/uploadImagensCosmic';
import nc from 'next-connect';

// Cria um objeto "handler" que é responsável por processar as requisições para a rota atual.
// Ele utiliza o pacote "next-connect" para criar uma cadeia de middlewares.
const handler = nc()
    // Adiciona um middleware para fazer upload da imagem de avatar.
    .use(upload.single('file'))
    // Define a função que será executada quando a requisição for do tipo "POST".
    // Ela recebe um objeto "req" com informações sobre a requisição e um objeto "res" que será utilizado para enviar a resposta.
    .post(async (req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg>) => {
        // Obtém as informações do usuário a partir do corpo da requisição.
        const usuario = req.body as CadastroRequisicao;

        // Valida o nome do usuário.
        if (!usuario.nome || usuario.nome.length < 2) {
            return res.status(400).json({ erro: 'Nome invalido' });
        }

        // Valida o e-mail do usuário.
        if (!usuario.email || usuario.email.length < 5
            || !usuario.email.includes('@')
            || !usuario.email.includes('.'))
            return res.status(400).json({ erro: 'Email invalido' });

        // Valida a senha do usuário sem utilizar expressões regulares.
        if (!usuario.senha || usuario.senha.length < 4) {
            return res.status(400).json({ erro: 'Senha invalida' });
        }

        // Verifica se já existe um usuário com o mesmo e-mail.
        const usuariosComOMesmoEmail = await UsuarioModel.find({ email: usuario.email });
        if (usuariosComOMesmoEmail && usuariosComOMesmoEmail.length > 0) {
            return res.status(400).json({ erro: 'Esse email já está vinculado a uma conta!' });
        }

        // Envia a imagem do multer para o Cosmic.
        const image = await uploadImagemCosmic(req);
        console.log(image)

        // Cria um objeto com as informações do usuário a serem salvas no banco de dados.
        const usuarioASerSalvo = {
            nome: usuario.nome,
            email: usuario.email,
            senha: md5(usuario.senha),
            avatar: image?.media?.url // Adiciona a URL da imagem do avatar no objeto a ser salvo.
        }

        // Salva o usuário no banco de dados utilizando o modelo de usuário definido no arquivo "UsuarioModel".
        await UsuarioModel.create(usuarioASerSalvo);

        // Retorna uma resposta indicando que o usuário foi cadastrado com sucesso.
        return res.status(200).json({ msg: 'Usuario cadastrado com sucesso!' })
    });

// Define as configurações da API.
export const config = {
    api: {
        bodyParser: false
    }
}

// Exporta o middleware "conectarMongoDB" juntamente com o objeto "
export default conectarMongoDB(handler);