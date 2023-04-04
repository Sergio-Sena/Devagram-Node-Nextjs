import type { NextApiRequest, NextApiResponse } from 'next'
import { respostaPadraoMsg } from '../../types/respostaPadraoMsg'
import { validarTokenJWT } from '../../middlewares/validarTokenJWT'
import { conectarMongoDB } from '../../middlewares/conectarMongoDB'
import { UsuarioModel } from '@/models/UsuarioModel'

const usuarioEndpoint = async (req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg> | any) => {
    //pegar os dados do usuario logado

    try {

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