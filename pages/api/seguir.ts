import type { NextApiRequest, NextApiResponse } from 'next'
import type { respostaPadraoMsg } from '../../types/respostaPadraoMsg'
import { validarTokenJWT } from '@/middlewares/validarTokenJWT';
import { conectarMongoDB } from '@/middlewares/conectarMongoDB';
import { UsuarioModel } from '@/models/UsuarioModel';
import { SeguidorModel } from '@/models/SeguidorModel';

const endpointSeguir =
    async (req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg>) => {
        try {
            //Qual método utilizar?
            if (req.method === 'PUT') {

                const { userId, id } = req?.query;


                //Usuario logado/autenticado
                const usuarioLogado = await UsuarioModel.findById(userId);
                if (!usuarioLogado) {
                    return res.status(400).json({ erro: 'Usario logado não encontrado' });
                }
                //Id do usuario a ser seguido
                const usuarioASerSeguido = await UsuarioModel.findById(id)
                if (!usuarioASerSeguido) {
                    return res.status(400).json({ erro: 'Usario  a ser seguido nao encontrado' });
                }
                //Validaçao de seguir ou deseguir
                const euJaSigoEsseUsuario = await SeguidorModel
                    .find({ usuarioId: usuarioLogado._id, usuarioSeguidoId: usuarioASerSeguido._id });
                if (euJaSigoEsseUsuario && euJaSigoEsseUsuario.length > 0) {
                    //Sinal que ja sigo
                    euJaSigoEsseUsuario.forEach(async(e:any)=>await SeguidorModel.findByIdAndDelete({_id: e._id}));
                    usuarioLogado.seguindo--;
                    await UsuarioModel.findByIdAndUpdate({_id: usuarioLogado._id},usuarioLogado);
                    usuarioASerSeguido.seguidores--;
                    await UsuarioModel.findByIdAndUpdate({_id: usuarioASerSeguido._id},usuarioASerSeguido);

                    return res.status(200).json({msg:'Deixou se seguir esse usuario'});

                } else {
                    //sinal que nao sigo
                    const seguidor = {
                        usuarioId: usuarioLogado._id,
                        usuarioSeguidoId: usuarioASerSeguido._id
                    };
                    await SeguidorModel.create(seguidor);
                    //adicionar usuario seguido no usuario logado
                    usuarioLogado.seguindo++;
                    await UsuarioModel.findByIdAndUpdate({ _id: usuarioLogado._id }, usuarioLogado);
                    //adicionado seguidor no usuario swguido
                    usuarioASerSeguido.seguidores++;
                    await UsuarioModel.findByIdAndUpdate({ _id: usuarioASerSeguido._id }, usuarioASerSeguido);

                    return res.status(200).json({ msg: 'Usuario seguido com sucesso' });

                }
            }
            return res.status(405).json({ erro: 'Metodo informado nao existe.' })
        } catch (e) {
            console.log(e);
            return res.status(500).json({ erro: 'Nao foi possivel seguir/deseguir o usuario informado.' })
        }
    }

export default validarTokenJWT(conectarMongoDB(endpointSeguir))  