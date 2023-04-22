import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import type { respostaPadraoMsg } from '../types/respostaPadraoMsg'
import NextCors from 'nextjs-cors';


export const politicaCORS = (handler: NextApiHandler) =>
    async (
        req: NextApiRequest, res: NextApiResponse<respostaPadraoMsg>
    ) => {
        try {
            await NextCors(req, res, {
                origin: '*',
                methods: ['GET', 'POST', 'PUT'],
                optionsSuccessStatus: 200, //para previnir erros de navegadore antigos que retorna 204 
            });

            return handler(req, res);
        } catch (e) {
            console.log('erro ao tratar politica CORS.', e);
            return res.status(500).json({ erro: 'Erro ao tratar Politica de CORS.' });
        }
    };