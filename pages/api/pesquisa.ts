import { NextApiRequest, NextApiResponse } from 'next';
import type { respostaPadraoMsg } from '../../types/respostaPadraoMsg';
import { conectarMongoDB } from '@/middlewares/conectarMongoDB';
import { validarTokenJWT } from '@/middlewares/validarTokenJWT';
import { UsuarioModel } from '@/models/UsuarioModel';
import { SeguidorModel } from '@/models/SeguidorModel';
import usuario from './usuario';
import { politicaCORS } from '@/middlewares/politicaCORS';


const pesquisaEndpoint = async (req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg | any[]>) => {
    try {
        if (req.method === 'GET') {
            if (req?.query?.id) {
                const { userId } = req.query;
                const idPerfilVisitado = req.query.id;
                
                const usuarioEncontrado = await UsuarioModel.findById(idPerfilVisitado)
                    .select('nome email avatar _id publicacoes seguidores seguindo');
                
                if (!usuarioEncontrado) {
                    return res.status(400).json({ erro: 'Usuario nao encontrado.' })
                } else {
                    // Verificar se o usuário logado segue este usuário
                    const segueEsseUsuario = await SeguidorModel.findOne({ 
                        usuarioId: userId, 
                        usuarioSeguidoId: idPerfilVisitado 
                    });
                    
                    // Garantir que o avatar seja tratado corretamente
                    const usuarioFormatado = {
                        ...usuarioEncontrado._doc,
                        avatar: usuarioEncontrado.avatar || null,
                        segueEsseUsuario: segueEsseUsuario !== null
                    };
                    
                    console.log('Perfil retornado:', {
                        id: usuarioFormatado._id,
                        nome: usuarioFormatado.nome,
                        seguidores: usuarioFormatado.seguidores,
                        seguindo: usuarioFormatado.seguindo,
                        segueEsseUsuario: usuarioFormatado.segueEsseUsuario
                    });
                    
                    return res.status(200).json(usuarioFormatado);
                }
            } else {
                const { filtro } = req.query;
                if (!filtro || filtro.length < 2) {
                    return res.status(400).json({ erro: 'Favor informar um filtro valido!' })
                }
                const usuariosEncontrados = await UsuarioModel.find({
                    $or: [
                        { nome: { $regex: filtro, $options: 'i' } },
                        { email: { $regex: filtro, $options: 'i' } }
                    ]
                }).select('nome email avatar _id');

                const usuariosFiltrados = usuariosEncontrados.map(usuario => ({
                    _id: usuario._id,
                    nome: usuario.nome,
                    email: usuario.email,
                    avatar: usuario.avatar || null
                }));

                return res.status(200).json(usuariosFiltrados);

            }
        }

    } catch (e) {
        console.log(e)
        return res.status(500).json({ erro: 'Nao foi possivel encontrar usuarios' })

    }
};

export default politicaCORS(validarTokenJWT(conectarMongoDB(pesquisaEndpoint)));