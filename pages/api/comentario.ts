import type { NextApiRequest, NextApiResponse } from 'next'
import type { respostaPadraoMsg } from '../../types/respostaPadraoMsg'
import { validarTokenJWT } from '@/middlewares/validarTokenJWT'
import { conectarMongoDB } from '@/middlewares/conectarMongoDB'
import { UsuarioModel } from '@/models/UsuarioModel'
import { PublicacaoModel } from '@/models/PublicacaoModel'

const comentarioEndpoint = async (req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg>) => {
    try {
        //qual metido?
        if (req.method === 'PUT') {
            const { userId, id } = req.query;
            const usuarioLogado = await UsuarioModel.findById(userId);
            if (!usuarioLogado) {
                return res.status(400).json({ erro: ' Usuario nao encontrado.' });
            }

            const publicacao = await PublicacaoModel.findById(id);
            if (!publicacao) {
                return res.status(400).json({ erro: 'Nao foi possivel localizar publicaçao' })
            }
            
            if (!req.body || 
                !req.body.comentario || 
                req.body.comentario.length < 2) {
                return res.status(400).json({ erro: 'comentario invalido' })
            }

            const comentario = {
                usuarioId: usuarioLogado._id,
                nome: usuarioLogado.nome,
                comentario: req.body.comentario
            }
            publicacao.comentarios.push(comentario)
            await PublicacaoModel.findByIdAndUpdate({ _id: publicacao._id }, publicacao);

            return res.status(200).json({ msg: 'Comentario adicionado com sucesso.' })

        }

        return res.status(405).json({ erro: 'Metodo invalido' })

    } catch (e) {
        console.log(e)
        return res.status(500).json({ erro: 'Erro ao adicionar comentario' })
    }
}


export default validarTokenJWT(conectarMongoDB(comentarioEndpoint))