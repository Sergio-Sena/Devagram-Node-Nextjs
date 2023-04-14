import type { NextApiRequest, NextApiResponse } from 'next'
import { respostaPadraoMsg } from '../../types/respostaPadraoMsg'
import { validarTokenJWT } from '../../middlewares/validarTokenJWT'
import { conectarMongoDB } from '../../middlewares/conectarMongoDB'
import { UsuarioModel } from '@/models/UsuarioModel'
import nc from 'next-connect'
import { upload, uploadImagemCosmic } from '../../services/uploadImagensCosmic';
import { PublicacaoModel } from '@/models/PublicacaoModel'


// Define um handler para as requisições POST
const handler = nc()
    .use(upload.single('file')) // Usa o middleware de upload de arquivo
    .post(async (req: any, res: NextApiResponse<respostaPadraoMsg>) => { // Função assíncrona para lidar com a requisição POST
        try {
            const { userId } = req.query; // Obtém o id do usuário da requisição
            const usuario = await UsuarioModel.findById(userId); // Busca o usuário pelo id no banco de dados
            if (!usuario) { // Se o usuário não foi encontrado, retorna um erro 400
                return res.status(400).json({ erro: 'Usuario nao encontrado' })
            }

            if (!req || !req.body) { // Se não houver corpo na requisição, retorna um erro 400
                return res.status(400).json({ erro: 'Parametros de entrada invalidos' })
            }
            const { descricao, file } = req?.body // Obtém a descrição e o arquivo do corpo da requisição

            if (!descricao || descricao.length < 2) { // Se não houver descrição ou a descrição for menor que 2 caracteres, retorna um erro 400
                return res.status(400).json({ erro: 'Descricao necessaria' })
            }
            if (!req.file || !req.file.originalname) { // Se não houver arquivo ou nome de arquivo na requisição, retorna um erro 400
                return res.status(400).json({ erro: 'Imagem Obrigatória' })
            }

            const image = await uploadImagemCosmic(req); // Realiza o upload da imagem
            const publicacao = { // Cria um objeto com os dados da publicação
                idUsuario: usuario._id,
                descricao,
                foto: image.media.url,
                data: new Date()
            }
            await PublicacaoModel.create(publicacao) // Cria a publicação no banco de dados

            return res.status(200).json({ erro: 'Publicacao criada com sucesso' }) // Retorna uma resposta de sucesso

        } catch (e) { // Se houver algum erro, retorna um erro 400
            console.log(e)
            return res.status(400).json({ erro: 'erro ao cadastrar publicação' })
        }
    });

// Configurações do endpoint
export const config = {
    api: {
        bodyParser: false
    }
}

// Exporta o handler como um endpoint validado com JWT e conectado ao MongoDB
export default validarTokenJWT(conectarMongoDB(handler));