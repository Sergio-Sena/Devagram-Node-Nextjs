import type { NextApiRequest, NextApiResponse } from 'next';
import { validarTokenJWT } from '../../middlewares/validarTokenJWT'
import { conectarMongoDB } from '../../middlewares/conectarMongoDB'
import type { respostaPadraoMsg } from '../../types/respostaPadraoMsg'
import { UsuarioModel } from '@/models/UsuarioModel';

const UsuarioEndPoint = async (req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg> | any) => {
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
}
export default validarTokenJWT(conectarMongoDB(UsuarioEndPoint))
