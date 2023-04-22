import type { NextApiRequest, NextApiResponse } from 'next';
import { respostaPadraoMsg } from '../../types/respostaPadraoMsg';
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import { error } from 'console';
import { PublicacaoModel } from '@/models/PublicacaoModel';
import { UsuarioModel } from '@/models/UsuarioModel';
import { politicaCORS } from '@/middlewares/politicaCORS';

const likeEndpoint =
    async (req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg>) => {
        try {
            if (req.method === 'PUT') {
                const { id } = req?.query;
                const publicacao = await PublicacaoModel.findById(id);

                if (!publicacao) {
                    return res.status(400).json({ erro: 'Publicacao nao encontrada' });
                }
                const { userId } = req?.query;
                const usuario = await UsuarioModel.findById(userId)
                if (!usuario) {
                    return res.status(400).json({ erro: 'Usuario nao encontrado' });
                }
                const indexDoUsuarioNoLike = publicacao.likes.findIndex((e: any) => e.toString() === userId);
                console.log(userId, 'index')
                if (indexDoUsuarioNoLike != -1) {
                    publicacao.likes.splice(indexDoUsuarioNoLike, 1);
                    await PublicacaoModel.findByIdAndUpdate({ _id: publicacao._id }, publicacao);
                    return res.status(200).json({ msg: 'publicacao descutida com sucesso' })

                } else {
                    publicacao.likes.push(userId);
                    await PublicacaoModel.findByIdAndUpdate({ _id: publicacao._id }, publicacao);
                    return res.status(200).json({ msg: 'publicacao curtida com sucesso' })
                }

            }
            return res.status(405).json({ erro: 'Metodo invalido' })
        } catch (e) {
            console.log(e)
            return res.status(500).json({ erro: 'Ocorreu erro na operacao' });
        }
    }

export default politicaCORS(validarTokenJWT(conectarMongoDB(likeEndpoint)));