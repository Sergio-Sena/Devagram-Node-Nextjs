import type { NextApiRequest, NextApiResponse } from 'next'
import { respostaPadraoMsg } from '../../types/respostaPadraoMsg'
import { validarTokenJWT } from '../../middlewares/validarTokenJWT'
import { conectarMongoDB } from '../../middlewares/conectarMongoDB'
import { UsuarioModel } from '@/models/UsuarioModel'
import nc from 'next-connect'
import { upload, uploadImagemCosmic } from '../../services/uploadImagensCosmic';

const handler = nc()
    .use(upload.single('avatar'))
    .put(async (req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg>) => {
        try {
            // se eu quero alterar o usuario
            //Primeiro temos que epgar o usuario no DB
            const { userId } = req?.query;
        } catch (e) {
            console.log(e);
        }
        return res.status(400).json({ erro: 'Não foi possivel atualizar o usuario' });
    });

const usuarioEndpoint = async (req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg> | any) => {
    //pegar os dados do usuario logado

    const { userId } = req?.query;
    //id do usuario
    const usuario = await UsuarioModel.findById(userId);
    return res.status(200).json(usuario);
    usuario.senha = null;

    return res.status(200).json({ msg: 'usuario autenticado com sucesso!' });

} catch (e) {
    return res.status(400).json({ erro: 'Nao possivel obter dados do usuario' });
}
}
export default validarTokenJWT(conectarMongoDB(usuarioEndpoint));