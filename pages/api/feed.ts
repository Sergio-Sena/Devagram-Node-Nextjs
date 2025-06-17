import type { NextApiRequest, NextApiResponse } from 'next';
import { validarTokenJWT } from '../../middlewares/validarTokenJWT'
import { conectarMongoDB } from '../../middlewares/conectarMongoDB'
import type { respostaPadraoMsg } from '../../types/respostaPadraoMsg'
import { UsuarioModel } from '../../models/UsuarioModel'
import { PublicacaoModel } from '../../models/PublicacaoModel'
import { SeguidorModel } from '@/models/SeguidorModel';
import { corsMiddleware } from '@/middlewares/corsMiddleware';

const feedEndPoint = async (req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg> | any) => {
    try {
        if (req.method === 'GET') {
            // Verificar se o ID do usuário foi fornecido para perfil específico
            if (req?.query?.id) {
                try {
                    const idUsuario = req.query.id as string;
                    
                    // Procurar o usuário com o ID fornecido
                    const usuario = await UsuarioModel.findById(idUsuario);
                    
                    if (!usuario) {
                        return res.status(400).json({ erro: 'Usuário não encontrado' });
                    }

                    // Procurar as publicações do usuário
                    const publicacoes = await PublicacaoModel
                        .find({ idUsuario: usuario._id })
                        .sort({ data: -1 });

                    // Adicionar informações do usuário a cada publicação
                    const result = publicacoes.map(publicacao => ({
                        ...publicacao._doc,
                        usuario: {
                            nome: usuario.nome,
                            avatar: usuario.avatar
                        }
                    }));

                    return res.status(200).json(result);
                } catch (error) {
                    console.log('Erro ao buscar usuário:', error);
                    return res.status(400).json({ erro: 'ID de usuário inválido' });
                }
            } else {
                // Feed principal - usuário logado
                const { userId } = req.query;
                
                console.log('Feed - userId da requisição:', userId);
                
                if (!userId) {
                    return res.status(400).json({ erro: 'Usuário não autenticado' });
                }

                try {
                    console.log('Feed - Buscando usuário com ID:', userId);
                    const usuarioLogado = await UsuarioModel.findById(userId);
                    
                    if (!usuarioLogado) {
                        console.log('Feed - Usuário não encontrado com ID:', userId);
                        return res.status(400).json({ erro: 'Usuário não encontrado' });
                    }
                    
                    console.log('Feed - Usuário encontrado:', usuarioLogado.nome);
                    
                    // Buscar seguidores
                    const seguidores = await SeguidorModel.find({ usuarioId: usuarioLogado._id });
                    const seguidoresIds = seguidores.map(s => s.usuarioSeguidoId);

                    // Buscar publicações do usuário e de quem ele segue
                    const publicacoes = await PublicacaoModel.find({
                        $or: [
                            { idUsuario: usuarioLogado._id },
                            { idUsuario: { $in: seguidoresIds } }
                        ]
                    }).sort({ data: -1 });

                    // Adicionar informações do usuário a cada publicação
                    const result = [];
                    for (const publicacao of publicacoes) {
                        const usuarioDaPublicacao = await UsuarioModel.findById(publicacao.idUsuario);
                        if (usuarioDaPublicacao) {
                            const final = {
                                ...publicacao._doc, 
                                usuario: {
                                    nome: usuarioDaPublicacao.nome,
                                    avatar: usuarioDaPublicacao.avatar
                                }
                            };
                            result.push(final);
                        }
                    }

                    return res.status(200).json(result);
                } catch (error) {
                    console.log('Erro ao buscar feed:', error);
                    return res.status(400).json({ erro: 'Erro ao carregar feed' });
                }
            }
        }
        
        return res.status(405).json({ erro: 'Método não permitido' });
    } catch (e) {
        console.log('Erro no endpoint de feed:', e);
        return res.status(500).json({ erro: 'Erro interno do servidor' });
    }
};

export default corsMiddleware(validarTokenJWT(conectarMongoDB(feedEndPoint)));