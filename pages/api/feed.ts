import type { NextApiRequest, NextApiResponse } from 'next'
import { respostaPadraoMsg } from '../../types/respostaPadraoMsg'
import { validarTokenJWT } from '../../middlewares/validarTokenJWT'
import { conectarMongoDB } from '../../middlewares/conectarMongoDB'
import { UsuarioModel } from '@/models/UsuarioModel'
import { PublicacaoModel } from '@/models/PublicacaoModel'
import publicacao from './publicacao'


const feedEndPoint = async (req: NextApiRequest, res: NextApiResponse | any) => {
    try {
        if (req.method === 'GET') {
            //Preciso receber os dados de feed do usuário
            if (req?.query?.userId) {
                //agora que tenho o usuário como válido, trago os feed dele.
                const usuario = await UsuarioModel.findById(req?.query?.userId);
                console.log(req.query, 'feed')
                if (!usuario) {
                    return res.status(400).json({ erro: 'Usuario inexistente' });
                }
                //De onde vem a informação?
                const publicacao = await PublicacaoModel
                    .find({ idUsuario: usuario._id })
                    .sort({ data: -1 });
                return res.status(200).json(publicacao);
            }
            return res.status(405).json({ erro: 'metodo informado nao é válido' });
        }
    } catch (e) {
        console.log(e)
    }
    return res.status(400).json({ erro: 'Nao foi possivel trazer os dados de feed' });
}

export default validarTokenJWT(conectarMongoDB(feedEndPoint));