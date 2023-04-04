import type { NextApiRequest, NextApiResponse } from 'next'
import { respostaPadraoMsg } from '../../types/respostaPadraoMsg'
import { validarTokenJWT } from '../../middlewares/validarTokenJWT'
import { conectarMongoDB } from '../../middlewares/conectarMongoDB'
import { UsuarioModel } from '@/models/UsuarioModel'
import { PublicacaoModel } from '@/models/PublicacaoModel'

const feedEndPoint = async (req: NextApiRequest, res: NextApiResponse | any) => {
    try {
        if (req.method === 'GET') {
            //Preciso receber os dados de feed do usario

            if (!req?.query?.id) {
                //agora que tenho o usuario como valido e trago os feed dele.
                const usuario = await UsuarioModel.findById(req?.query?.id);
                if (!usuario) {
                    return res.status(400).json({ erro: 'Usuario inexistente' });
                }
                //De onde vem a informaçao?
                const publicacao = await PublicacaoModel
                    .find({ idUsuario: usuario._id })
                    .sort({ data: -1 });
            }
            return res.status(200).json(publicacao);

        }
        return res.status(405).json({ erro: 'metodo informado nao é válido' });
    } catch (e) {
        console.log(e)
    }
    return res.status(400).json({ erro: 'Nao foi possivel trazer os dados de fedd' });

}

export default validarTokenJWT(conectarMongoDB(feedEndPoint));