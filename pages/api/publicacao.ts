import type { NextApiResponse } from 'next';
import type { respostaPadraoMsg } from '../../types/respostaPadraoMsg';
import nc from 'next-connect';
import { upload, uploadImagemCosmic } from '../../services/uploadImagensCosmic';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import { PublicacaoModel } from '../../models/PublicacaoModel'
import { UsuarioModel } from '../../models/UsuarioModel'

const handler = nc()
    .use(upload.single('file'))
    .post(async (req: any, res: NextApiResponse<respostaPadraoMsg>) => {
        try {
            const { userId } = req.query;
            const usuario = await UsuarioModel.findById(userId);
            if (!usuario) {
                return res.status(400).json({ erro: 'Usuario nao encontrado' })
            }

            if (!req || !req.body) {
                return res.status(400).json({ erro: 'Parametros de entrada invalidos' })
            }
            const { descricao, file } = req?.body

            if (!descricao || descricao.length < 2) {
                return res.status(400).json({ erro: 'Descricao necessaria' })
            }
            if (!req.file || !req.file.originalname) {
                return res.status(400).json({ erro: 'Imagem Obrigatória' })
            }

            const image = await uploadImagemCosmic(req);
            const publicacao = {
                idUsuario: usuario._id,
                descricao,
                foto: image.media.url,
                data: new Date()
            }
            await PublicacaoModel.create(publicacao)

            return res.status(200).json({ erro: 'Publicacao criada com sucesso' })

        } catch (e) {
            console.log(e)
            return res.status(400).json({ erro: 'erro ao cadastrar publicação' })
        }
    });


export const config = {
    api: {
        bodyParser: false
    }
}

export default validarTokenJWT(conectarMongoDB(handler));   