import type { NextApiRequest, NextApiResponse } from 'next';
import { validarTokenJWT } from '../../middlewares/validarTokenJWT'
import { conectarMongoDB } from '../../middlewares/conectarMongoDB'
import type { respostaPadraoMsg } from '../../types/respostaPadraoMsg'
import { UsuarioModel } from '../../models/UsuarioModel'
import { PublicacaoModel } from '../../models/PublicacaoModel'
import publicacao from './publicacao';

const feedEndPoint = async (req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg> | any) => {
    try {
        if (req.method === 'GET') {
            // Verificar se o ID do usuário foi fornecido
            if (!req.query.id) {
                return res.status(400).json({ erro: 'ID do usuário não fornecido' });
            }

            // Procurar o usuário com o ID fornecido
            const usuario = await UsuarioModel.findById(req.query.id);

            if (!usuario) {
                return res.status(400).json({ erro: 'Usuário inexistente' });
            }

            // Procurar as publicações do usuário
            const publicacoes = await PublicacaoModel.find({ idUsuario: usuario._id }).sort({ data: -1 });

            return res.status(200).json(publicacoes);
        }

        return res.status(405).json({ erro: 'Método informado não é válido' });
    } catch (e) {
        console.log(e);
    }

    return res.status(400).json({ erro: 'Não foi possível trazer os dados de feed' });
};

export default validarTokenJWT(conectarMongoDB(feedEndPoint));