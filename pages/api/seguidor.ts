import type { NextApiRequest, NextApiResponse } from 'next'
import type { respostaPadraoMsg } from '../../types/respostaPadraoMsg'
import { validarTokenJWT } from '@/middlewares/validarTokenJWT';
import { conectarMongoDB } from '@/middlewares/conectarMongoDB';
import { SeguidorModel } from '@/models/SeguidorModel';
import { politicaCORS } from '@/middlewares/politicaCORS';

const endpointSeguidor = async (req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg | any>) => {
    try {
        if (req.method === 'GET') {
            const { userId, id } = req?.query;

            if (!userId || !id) {
                return res.status(400).json({ erro: 'Parâmetros de consulta incompletos' });
            }

            // Verificar se o usuário logado segue o usuário especificado
            const seguidor = await SeguidorModel.findOne({ 
                usuarioId: userId.toString(), 
                usuarioSeguidoId: id.toString() 
            });

            return res.status(200).json({ 
                segueEsseUsuario: seguidor !== null 
            });
        }
        
        return res.status(405).json({ erro: 'Método não permitido' });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ erro: 'Não foi possível verificar o seguidor' });
    }
}

export default politicaCORS(validarTokenJWT(conectarMongoDB(endpointSeguidor)));