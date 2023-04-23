import type { NextApiRequest, NextApiResponse } from 'next';
import type { respostaPadraoMsg } from '../../types/respostaPadraoMsg'
import { validarTokenJWT } from '../../middlewares/validarTokenJWT'
import { conectarMongoDB } from '../../middlewares/conectarMongoDB'
import { UsuarioModel } from '@/models/UsuarioModel';
import nc from 'next-connect'
import { upload, uploadImagemCosmic } from '../../services/uploadImagensCosmic'
import { error } from 'console';
import { politicaCORS } from '@/middlewares/politicaCORS';


const handler = nc()
    .use(upload.single('file'))
    .put(async (req: any, res: NextApiResponse<respostaPadraoMsg>) => {
        try {
            //Para alterar usuario primeiro preciso pegar ususario
            const { userId } = req?.query;
            const usuario = await UsuarioModel.findById(userId);
            console.log('usuario', usuario);
            //Se nao retronou nada,nao existe
            if (!usuario) {
                return res.status(400).json({ erro: 'Usuario nao encontrado' })
            }
            //Recuperando nome a ser alterados
            const { nome } = req?.body;
            if (nome && nome.length > 2) {
                usuario.nome = nome;
            }
            //recuperando file a ser alterado
            const { file } = req;
            console.log(file)
            if (file && file.originalname) {
                const image = await uploadImagemCosmic(req)
                console.log(image)
                if (image && image.media && image.media.url) {
                    usuario.avatar = image.media.url;
                    console.log(usuario.avatar)
                }
            }
            //Alterar dados no DB
            //console.log(usuario._id, 'usuario id', userId, usuario)
            await UsuarioModel.findByIdAndUpdate({ _id: userId }, usuario);
            return res.status(200).json({ msg: 'Atualizaçao feita com sucesso.' });

        } catch (e) {
            console.log(e)
        }
        return res.status(400).json({ erro: 'Não foi possivel atualizar usuario:' });

    })
    .get(async (req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg> | any) => {
        //Pegar os dados de usuario logado
        //Id do usuario
        try {

            const { userId } = req?.query
            const usuario = await UsuarioModel.findById(userId);
            usuario.senha = null;
            return res.status(200).json(usuario)

        } catch (e) {
            console.log(e)
        }
        return res.status(400).json({ erro: 'Nao foi possivel obter dados do usuario.' })
    });


// Define as configurações da API
export const config = {
    api: {
        bodyParser: false
    }
}

export default politicaCORS(validarTokenJWT(conectarMongoDB(handler)));
