import type { NextApiRequest, NextApiResponse } from 'next'
import type { respostaPadraoMsg } from '../../types/respostaPadraoMsg'
import { validarTokenJWT } from '@/middlewares/validarTokenJWT';
import { conectarMongoDB } from '@/middlewares/conectarMongoDB';
import { UsuarioModel } from '@/models/UsuarioModel';
import { SeguidorModel } from '@/models/SeguidorModel';
import { politicaCORS } from '@/middlewares/politicaCORS';

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
                    // Remover todas as relações de seguidor
                    await SeguidorModel.deleteMany({ 
                        usuarioId: usuarioLogado._id.toString(), 
                        usuarioSeguidoId: usuarioASerSeguido._id.toString() 
                    });
                    
                    // Atualizar contador de seguindo do usuário logado
                    await UsuarioModel.findByIdAndUpdate(
                        { _id: usuarioLogado._id },
                        { $inc: { seguindo: -1 } }
                    );
                    
                    // Atualizar contador de seguidores do usuário seguido
                    await UsuarioModel.findByIdAndUpdate(
                        { _id: usuarioASerSeguido._id },
                        { $inc: { seguidores: -1 } }
                    );

                    return res.status(200).json({ msg: 'Deixou se seguir esse usuario' });

                } else {
                    //sinal que nao sigo
                    const seguidor = {
                        usuarioId: usuarioLogado._id.toString(),
                        usuarioSeguidoId: usuarioASerSeguido._id.toString()
                    };
                    await SeguidorModel.create(seguidor);
                    
                    // Atualizar contador de seguindo do usuário logado
                    await UsuarioModel.findByIdAndUpdate(
                        { _id: usuarioLogado._id },
                        { $inc: { seguindo: 1 } }
                    );
                    
                    // Atualizar contador de seguidores do usuário seguido
                    await UsuarioModel.findByIdAndUpdate(
                        { _id: usuarioASerSeguido._id },
                        { $inc: { seguidores: 1 } }
                    );

                    return res.status(200).json({ msg: 'Usuario seguido com sucesso' });

                }
            }
            return res.status(405).json({ erro: 'Metodo informado nao existe.' })
        } catch (e) {
            console.log(e);
            return res.status(500).json({ erro: 'Nao foi possivel seguir/deseguir o usuario informado.' })
        }
    }

export default politicaCORS(validarTokenJWT(conectarMongoDB(endpointSeguir)));