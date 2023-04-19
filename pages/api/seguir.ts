import type { NextApiRequest, NextApiResponse } from 'next'
import type { respostaPadraoMsg } from '../../types/respostaPadraoMsg'
import { validarTokenJWT } from '@/middlewares/validarTokenJWT';
import { conectarMongoDB } from '@/middlewares/conectarMongoDB';
import { UsuarioModel } from '@/models/UsuarioModel';
import { SeguidorModel } from '@/models/SeguidorModel';

const endpointSeguir = async (req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg>) => {
    try {
        if (req.method === 'PUT') {

            const { userId, id } = req?.query;
            //usuario logado/autenticado
            const usuarioLogado = await UsuarioModel.findById(userId);

            if (!usuarioLogado) {
                return res.status(400).json({ erro: 'Usuario logado nao encontrado' })
            }
            //Id do usuario a ser seguido
            const usuarioAserSeguido = await UsuarioModel.findById(id);
            if (!usuarioAserSeguido) {
                return res.status(400).json({ erro: 'Nao foi possivel encontrar usuario a ser seguido' });
            }
            // buscar se eu logado sou ou nao seguidor
            const euJaSigoEsseUsuario = await SeguidorModel
                .find({ usuarioId: usuarioLogado._id, usuarioSeguidoId: usuarioAserSeguido._id })
            if (euJaSigoEsseUsuario && euJaSigoEsseUsuario.length > 0) {
                //Sinal que ja sigo esse usuario
                euJaSigoEsseUsuario.forEach(async (e: any) => await SeguidorModel.findByIdAndRemove({ _id: e._id }));
                usuarioLogado.seguindo--;
                await UsuarioModel.findByIdAndUpdate({ _id: usuarioLogado._id }, usuarioLogado);
                usuarioAserSeguido.seguidores--;
                await UsuarioModel.findByIdAndUpdate({ _id: usuarioAserSeguido._id }, usuarioAserSeguido._id);

                return res.status(200).json({ msg: ' atualizados com sucesso.' });

            } else {
                //Sinal que nao sigo esse usuario
                const seguidor = {
                    usuarioId: usuarioLogado._id,
                    usuarioAserSeguido: usuarioAserSeguido._id,
                };
                await SeguidorModel.create(seguidor);
                //Adicionar um seguindor no usuario logado
                usuarioLogado.seguindo++;
                await UsuarioModel.findByIdAndUpdate({ _id: usuarioLogado._id }, usuarioLogado);
                //Adicionar um seguindor no usuario seguido
                usuarioAserSeguido.seguidores++;
                await UsuarioModel.findByIdAndUpdate({ _id: usuarioAserSeguido._id }, usuarioAserSeguido);


                return res.status(200).json({ msg: 'Usuario seguido com sucesso.' })
            }
        }

        return res.status(405).json({ erro: 'Metodo informado nao existe.' })
    } catch (e) {
        console.log(e);
        return res.status(500).json({ erro: 'Nao foi possivel seguir/desseguir o usuario informado.' })
    }
}

export default validarTokenJWT(conectarMongoDB(endpointSeguir))  