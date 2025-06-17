import type { NextApiRequest, NextApiResponse } from 'next';
import type { respostaPadraoMsg } from '../../types/respostaPadraoMsg';
import nc from 'next-connect';
import { upload, uploadImagemCosmic } from '../../services/uploadImagensS3';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import { PublicacaoModel } from '../../models/PublicacaoModel';
import { UsuarioModel } from '../../models/UsuarioModel';
import { corsMiddleware } from '@/middlewares/corsMiddleware';

// Handler para requisições POST (com upload de arquivo)
const handlerPost = nc()
    .use(upload.single('file'))
    .post(async (req: any, res: NextApiResponse<respostaPadraoMsg>) => {
        try {
            const { userId } = req.query;
            const usuario = await UsuarioModel.findById(userId);
            if (!usuario) {
                return res.status(400).json({ erro: 'Usuário não encontrado' });
            }

            if (!req || !req.body) {
                return res.status(400).json({ erro: 'Parâmetros de entrada não informados' });
            }
            const { descricao } = req.body;

            if (!descricao || descricao.length < 3) {
                return res.status(400).json({ erro: 'Descrição não é válida' });
            }
            
            if (!req.file || !req.file.originalname) {
                return res.status(400).json({ erro: 'A imagem é obrigatória' });
            }

            const image = await uploadImagemCosmic(req);
            const publicacao = {
                idUsuario: usuario._id,
                descricao,
                foto: image.url,
                data: new Date()
            }

            usuario.publicacoes++;
            await UsuarioModel.findByIdAndUpdate({ _id: usuario._id }, usuario);

            await PublicacaoModel.create(publicacao);
            return res.status(200).json({ msg: 'Publicação criada com sucesso' });
        } catch (e) {
            console.log(e);
            return res.status(400).json({ erro: 'Erro ao cadastrar publicação' });
        }
    });

// Handler para requisições DELETE (sem upload de arquivo)
const handlerDelete = nc()
    .delete(async (req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg>) => {
        try {
            const { userId } = req.query;
            const { id } = req.query;

            console.log('Excluindo publicação:', { userId, publicacaoId: id });

            // Validar se o ID da publicação foi fornecido
            if (!id) {
                return res.status(400).json({ erro: 'ID da publicação não informado' });
            }

            // Buscar a publicação pelo ID
            const publicacao = await PublicacaoModel.findById(id);
            if (!publicacao) {
                return res.status(404).json({ erro: 'Publicação não encontrada' });
            }

            console.log('Publicação encontrada:', publicacao);

            // Verificar se o usuário logado é o dono da publicação
            if (publicacao.idUsuario.toString() !== userId) {
                return res.status(403).json({ erro: 'Usuário não tem permissão para excluir esta publicação' });
            }

            // Buscar o usuário para atualizar o contador de publicações
            const usuario = await UsuarioModel.findById(userId);
            if (usuario && usuario.publicacoes > 0) {
                usuario.publicacoes--;
                await UsuarioModel.findByIdAndUpdate({ _id: usuario._id }, usuario);
            }

            // Excluir a publicação
            await PublicacaoModel.findByIdAndDelete(id);
            
            return res.status(200).json({ msg: 'Publicação excluída com sucesso' });
        } catch (e) {
            console.log('Erro ao excluir publicação:', e);
            return res.status(400).json({ erro: 'Erro ao excluir publicação' });
        }
    });

// Handler principal que direciona para o handler correto com base no método HTTP
export default async function handler(req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg>) {
    // Aplicar o middleware CORS primeiro
    return corsMiddleware(async (req: NextApiRequest, res: NextApiResponse) => {
        // Depois aplicar os outros middlewares
        const middlewares = validarTokenJWT(conectarMongoDB);
        
        return middlewares(async (req: NextApiRequest, res: NextApiResponse) => {
            // Direcionar para o handler correto com base no método HTTP
            if (req.method === 'POST') {
                return handlerPost(req, res);
            } else if (req.method === 'DELETE') {
                return handlerDelete(req, res);
            } else {
                return res.status(405).json({ erro: 'Método não permitido' });
            }
        })(req, res);
    })(req, res);
}

export const config = {
    api: {
        bodyParser: false
    }
}