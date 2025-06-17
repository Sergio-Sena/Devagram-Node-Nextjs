import type { NextApiRequest, NextApiResponse } from 'next';
import type { respostaPadraoMsg } from '../../types/respostaPadraoMsg';
import { conectarMongoDB } from '../../middlewares/conectarMongoDB';
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import { PublicacaoModel } from '../../models/PublicacaoModel';
import { UsuarioModel } from '../../models/UsuarioModel';
import { corsMiddleware } from '@/middlewares/corsMiddleware';

const handler = async (req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg>) => {
    try {
        // Verificar se o método é DELETE
        if (req.method !== 'DELETE') {
            return res.status(405).json({ erro: 'Método não permitido' });
        }

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
};

export default corsMiddleware(validarTokenJWT(conectarMongoDB(handler)));