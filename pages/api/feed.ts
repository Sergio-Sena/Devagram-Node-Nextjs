import type { NextApiRequest, NextApiResponse } from 'next';
import { validarTokenJWT } from '../../middlewares/validarTokenJWT'
import { conectarMongoDB } from '../../middlewares/conectarMongoDB'
import type { respostaPadraoMsg } from '../../types/respostaPadraoMsg'
import { UsuarioModel } from '../../models/UsuarioModel'
import { PublicacaoModel } from '../../models/PublicacaoModel'
import publicacao from './publicacao';
import { SeguidorModel } from '@/models/SeguidorModel';

const feedEndPoint = async (req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg> | any) => {
    try {
        if (req.method === 'GET') {
            // Verificar se o ID do usuário foi fornecido
            if (req?.query?.id) {
                // Procurar o usuário com o ID fornecido
                const usuario = await UsuarioModel.findById(req?.query?.id);
                //validando usuario
                if (!usuario) {
                    return res.status(400).json({ erro: 'Usuário inexistente' });
                }

                // Procurar as publicações do usuário
                const publicacoes = await PublicacaoModel
                    .find({ idUsuario: usuario._id })
                    .sort({ data: -1 });

                return res.status(200).json(publicacoes);
            } else {
                // agr que estamos no feed principal
                const { userId } = req.query;
                const usuarioLogado = await UsuarioModel.findById(userId);
                if (!usuarioLogado) {
                    return res.status(400).json({ erro: 'Usuario nao encontrado' });
                }
                // Minhas publicacoes e de quem eu sigo
                const seguidores = await SeguidorModel.find({ usuarioId: usuarioLogado._id });
                const seguidoresIds = seguidores.map(s => s.usuarioSeguidoId);

                const publicacoes = await PublicacaoModel.find({
                    $or: [
                        { idUsuario: usuarioLogado._id },
                        { idUsuario: seguidoresIds }
                    ]

                })
                    .sort({ data: -1 });

                const result = [];
                for (const publicacao of publicacoes) {
                    const usuarioDaPublicacao = await UsuarioModel.findById(publicacao.idUsuario);
                    if (usuarioDaPublicacao) {
                        const final = {
                            ...publicacao._doc, usuario: {
                                nome: usuarioDaPublicacao.nome,
                                avatar: usuarioDaPublicacao.avatar
                            }
                        };
                        result.push(final)
                    }
                }

                return res.status(200).json(result);
            }
        }
        return res.status(405).json({ erro: 'Método informado não é válido' });
    } catch (e) {
        console.log(e);
    }

    return res.status(400).json({ erro: 'Não foi possível trazer os dados de feed' });
};

export default validarTokenJWT(conectarMongoDB(feedEndPoint));